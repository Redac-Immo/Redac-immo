import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY manquante dans les variables d\'environnement')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

export const FROM = 'Redac-Immo <contact@redac-immo.fr>'
