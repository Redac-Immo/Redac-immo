import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { PRICE_TO_PLAN } from '@/lib/stripe/config'
import { createServiceClient } from '@/lib/supabase/service'
import Stripe from 'stripe'

// Désactiver le body parsing Next.js — Stripe a besoin du raw body
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

  try {
    switch (event.type) {

      // ─── Paiement unique réussi (Basique, Essentiel) ──────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.CheckoutSession
        const userId = session.metadata?.supabase_user_id
        const plan = session.metadata?.plan

        if (!userId || !plan) break

        if (session.mode === 'payment') {
          // Paiement unique → créditer les annonces
          await service
            .from('profiles')
            .update({ plan })
            .eq('id', userId)

          // Créer une entrée de crédit annonces
          const credits = plan === 'essentiel' ? 3 : 1
          await service.from('annonce_credits').insert({
            user_id: userId,
            plan,
            credits_remaining: credits,
            stripe_session_id: session.id,
          }).select()
          // Si la table n'existe pas encore, on ignore silencieusement
        }

        break
      }

      // ─── Abonnement activé (Agence, Fondateur) ────────────────
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.supabase_user_id
        const priceId = subscription.items.data[0]?.price.id
        const plan = PRICE_TO_PLAN[priceId] ?? 'agence'
        const status = subscription.status // active | past_due | canceled...

        if (!userId) break

        await service
          .from('profiles')
          .update({
            plan: status === 'active' ? plan : 'basique',
            stripe_subscription_id: subscription.id,
            subscription_status: status,
          })
          .eq('id', userId)

        break
      }

      // ─── Abonnement résilié ───────────────────────────────────
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.supabase_user_id

        if (!userId) break

        await service
          .from('profiles')
          .update({
            plan: 'basique',
            stripe_subscription_id: null,
            subscription_status: 'canceled',
          })
          .eq('id', userId)

        break
      }

      // ─── Paiement échoué ──────────────────────────────────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

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

  } catch (error) {
    console.error('[webhook] Erreur traitement:', error)
    return NextResponse.json({ error: 'Erreur traitement' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
