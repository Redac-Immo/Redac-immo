import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { STRIPE_PRICES, RECURRING_PLANS, FONDATEUR_MAX_PLACES, type PlanKey } from '@/lib/stripe/config'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://redac-immo.fr'

export async function POST(request: NextRequest) {
  try {
    // Auth
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { plan } = await request.json() as { plan: PlanKey }

    if (!plan || !STRIPE_PRICES[plan]) {
      return NextResponse.json({ error: 'Plan invalide' }, { status: 400 })
    }

    const service = createServiceClient()

    // Récupérer le profil
    const { data: profile } = await service
      .from('profiles')
      .select('stripe_customer_id, plan, prenom, nom')
      .eq('id', user.id)
      .single()

    // Vérifier les places Fondateur
    if (plan === 'fondateur') {
      const { count } = await service
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('plan', 'fondateur')
        .eq('subscription_status', 'active')

      if ((count ?? 0) >= FONDATEUR_MAX_PLACES) {
        return NextResponse.json(
          { error: 'Les 10 places Fondateur sont toutes réservées.' },
          { status: 400 }
        )
      }
    }

    // Récupérer ou créer le customer Stripe
    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        name: [profile?.prenom, profile?.nom].filter(Boolean).join(' ') || undefined,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id

      await service
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    const isRecurring = RECURRING_PLANS.includes(plan)

    // Créer la Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: isRecurring ? 'subscription' : 'payment',
      line_items: [{ price: STRIPE_PRICES[plan], quantity: 1 }],
      success_url: `${APP_URL}/dashboard?payment=success&plan=${plan}`,
      cancel_url: `${APP_URL}/dashboard?payment=cancelled`,
      metadata: {
        supabase_user_id: user.id,
        plan,
      },
      ...(isRecurring && {
        subscription_data: {
          metadata: { supabase_user_id: user.id, plan },
        },
      }),
      allow_promotion_codes: true,
      locale: 'fr',
    })

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error('[stripe/checkout]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
