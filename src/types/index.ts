export type Formule = 'basique' | 'essentiel' | 'agence'
export type StatutAnnonce = 'encours' | 'vendu' | 'archive'
export type Role = 'client' | 'admin'

export interface Profile {
  id: string
  prenom: string | null
  nom: string | null
  agence: string | null
  plan: Formule
  role: Role
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
}

export interface GenerateResponse {
  fr: string
  en: string
  short: string
}