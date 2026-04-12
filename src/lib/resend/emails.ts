import { resend, FROM } from './client'
import { templateConfirmationInscription } from './templates/confirmation-inscription'
import { templateConfirmationAnnonce } from './templates/confirmation-annonce'
import { templateConfirmationCommande } from './templates/confirmation-commande'

// ─── CONFIRMATION INSCRIPTION ────────────────────────────────

export async function sendConfirmationInscription({
  to,
  prenom,
  confirmationUrl,
}: {
  to: string
  prenom: string
  confirmationUrl: string
}) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Confirmez votre compte Redac-Immo',
    html: templateConfirmationInscription({ prenom, confirmationUrl }),
  })
}

// ─── CONFIRMATION ANNONCE GÉNÉRÉE ────────────────────────────

export async function sendConfirmationAnnonce({
  to,
  prenom,
  bien,
  localisation,
  prix,
  formule,
  extrait,
}: {
  to: string
  prenom: string
  bien: string
  localisation: string
  prix: string
  formule: string
  extrait: string
}) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Votre annonce est prête — ${bien}`,
    html: templateConfirmationAnnonce({
      prenom,
      bien,
      localisation,
      prix,
      formule,
      dashboardUrl: 'https://redac-immo.fr/dashboard',
      extrait: extrait.substring(0, 200),
    }),
  })
}

// ─── CONFIRMATION COMMANDE + FACTURE ─────────────────────────

export async function sendConfirmationCommande({
  to,
  prenom,
  numeroFacture,
  bien,
  formule,
  montant,
}: {
  to: string
  prenom: string
  numeroFacture: string
  bien: string
  formule: string
  montant: string
}) {
  const date = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return resend.emails.send({
    from: FROM,
    to,
    subject: `Confirmation de commande — ${numeroFacture}`,
    html: templateConfirmationCommande({
      prenom,
      numeroFacture,
      bien,
      formule,
      montant,
      date,
      dashboardUrl: 'https://redac-immo.fr/dashboard',
    }),
  })
}
