export type Formule = 'basique' | 'essentiel' | 'agence' | 'fondateur'
export type StatutAnnonce = 'encours' | 'vendu' | 'archive'
export type Role = 'client' | 'admin'
export type PersonaName = 'Élise' | 'Thomas' | 'Marc' | 'Sofia' | 'Lucas' | 'Claire'

export interface Profile {
  id: string
  prenom: string | null
  nom: string | null
  agence: string | null
  plan: Formule
  role: Role
  blocked: boolean
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_status: string | null
  created_at: string
}

export interface Annonce {
  id: string
  user_id: string
  bien: string
  prix: string
  localisation: string
  surface: string
  formule: Formule
  fr: string
  en: string
  short: string
  statut: StatutAnnonce
  created_at: string
}

export interface GenerateRequest {
  type: string
  surface: string
  terrain?: string
  pieces?: string
  chambres?: string
  localisation: string
  prix: string
  pointsForts?: string
  infoCompl?: string
  formule: Formule
  persona?: PersonaName
  images?: string[] // ✅ Ajouté : images en base64 pour l'analyse par Claude
}

export interface GenerateResponse {
  fr: string
  en: string
  short: string
}

// ✅ Nouveau : Type pour les crédits utilisateur
export interface UserCredits {
  credits_remaining: number
  plan: Formule
  isUnlimited: boolean
}

// ✅ Nouveau : Type pour la réponse de vérification des crédits
export interface CreditCheckResponse {
  hasCredits: boolean
  creditsRemaining: number
  isUnlimited: boolean
  plan: Formule
  error?: string
}