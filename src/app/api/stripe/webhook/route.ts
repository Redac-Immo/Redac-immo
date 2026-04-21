import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { PRICE_TO_PLAN } from '@/lib/stripe/config'
import { createServiceClient } from '@/lib/supabase/service'
import Stripe from 'stripe'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Signature manquante' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('[webhook] Signature invalide:', err)
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 })
  }

  const service = createServiceClient()

  // ✅ IDEMPOTENCE : Vérifier si l'événement a déjà été traité
  const { data: existingLog } = await service
    .from('admin_logs')
    .select('id')
    .eq('action', `stripe_${event.type}`)
    .eq('details->>stripe_event_id', event.id)
    .maybeSingle()

  if (existingLog) {
    console.log(`[webhook] Événement ${event.id} déjà traité, ignoré.`)
    return NextResponse.json({ received: true, cached: true })
  }

  try {
    switch (event.type) {

      // ─── Paiement unique réussi (Basique, Essentiel) ──────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // ✅ Éviter les doubles traitements via metadata
        if (session.metadata?.processed === 'true') {
          console.log(`[webhook] Session ${session.id} déjà traitée`)
          break
        }

        const userId = session.metadata?.supabase_user_id
        const plan = session.metadata?.plan

        if (!userId || !plan) {
          console.warn('[webhook] Métadonnées manquantes dans la session')
          break
        }

        if (session.mode === 'payment') {
          // Mettre à jour le plan du profil
          await service
            .from('profiles')
            .update({ plan })
            .eq('id', userId)

          // ✅ Créer une entrée de crédit annonces (avec await)
          const credits = plan === 'essentiel' ? 3 : 1
          const { error: creditsError } = await service
            .from('annonce_credits')
            .insert({
              user_id: userId,
              plan,
              credits_remaining: credits,
              stripe_session_id: session.id,
            })

          if (creditsError) {
            console.error('[webhook] Erreur insertion crédits:', creditsError)
          }

          // Marquer la session comme traitée
          await stripe.checkout.sessions.update(session.id, {
            metadata: { ...session.metadata, processed: 'true' },
          })
        }

        break
      }

      // ─── Abonnement activé / mis à jour (Agence, Fondateur) ───────────────────
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.supabase_user_id

        if (!userId) {
          console.warn('[webhook] userId manquant dans subscription')
          break
        }

        const priceId = subscription.items.data[0]?.price.id
        const plan = PRICE_TO_PLAN[priceId] ?? 'agence'
        const status = subscription.status

        const { error: updateError } = await service
          .from('profiles')
          .update({
            plan: status === 'active' ? plan : 'basique',
            stripe_subscription_id: subscription.id,
            subscription_status: status,
          })
          .eq('id', userId)

        if (updateError) {
          console.error('[webhook] Erreur mise à jour profil:', updateError)
        }

        break
      }

      // ─── Abonnement résilié / expiré ───────────────────────────────────────────
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.supabase_user_id

        if (!userId) break

        await service
          .from('profiles')
          .update({
            plan: 'basique',
            subscription_status: 'inactive',
          })
          .eq('id', userId)

        break
      }

      // ─── Paiement échoué ──────────────────────────────────────────────────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = typeof invoice.customer === 'string'
          ? invoice.customer
          : invoice.customer?.id

        if (!customerId) break

        const { data: profile } = await service
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile) {
          await service
            .from('profiles')
            .update({ subscription_status: 'past_due' })
            .eq('id', profile.id)
        }

        break
      }

      default:
        console.log(`[webhook] Événement non géré: ${event.type}`)
    }

    // ✅ Logger l'événement pour idempotence
    await service.from('admin_logs').insert({
      admin_id: null, // Système
      action: `stripe_${event.type}`,
      target_id: null,
      details: {
        stripe_event_id: event.id,
        stripe_event_type: event.type,
        processed_at: new Date().toISOString(),
      },
    })

  } catch (error) {
    console.error('[webhook] Erreur traitement:', error)
    // On ne retourne pas d'erreur 500 pour éviter que Stripe renvoie l'événement en boucle
    // Le log est suffisant pour déboguer
  }

  return NextResponse.json({ received: true })
}