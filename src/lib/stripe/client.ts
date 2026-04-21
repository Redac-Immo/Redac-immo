import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY manquante')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // Dernière vérification : 2026-03-25.dahlia (mars 2026)
  // À mettre à jour si Stripe publie une nouvelle version stable
  apiVersion: '2026-03-25.dahlia',
})