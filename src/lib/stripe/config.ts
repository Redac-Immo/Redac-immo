// ─── PRICE IDs STRIPE (Live) ──────────────────────────────────
export const STRIPE_PRICES = {
  basique:    'price_1TNGbRRblZSSuLBbuhiqdZLq',
  essentiel:  'price_1TNGfSRblZSSuLBbRtCSZn4N',
  agence:     'price_1TNGrkRblZSSuLBby8KxhUVN',
  fondateur:  'price_1TNGp5RblZSSuLBbO12YnUV9',
} as const

export type PlanKey = keyof typeof STRIPE_PRICES

// Abonnements récurrents (vs paiement unique)
export const RECURRING_PLANS: PlanKey[] = ['agence', 'fondateur']

// Limite places Fondateur
export const FONDATEUR_MAX_PLACES = 10

// Mapping price_id → plan name (pour webhook)
export const PRICE_TO_PLAN: Record<string, string> = {
  [STRIPE_PRICES.basique]:   'basique',
  [STRIPE_PRICES.essentiel]: 'essentiel',
  [STRIPE_PRICES.agence]:    'agence',
  [STRIPE_PRICES.fondateur]: 'fondateur',
}
