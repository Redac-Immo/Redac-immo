'use client'

import { useState } from 'react'
import { useCheckout } from '@/hooks/useCheckout'
import type { Profile } from '@/types'
import { T } from '@/lib/design-tokens'

2interface Props {
  profile: Profile | null
}

const PLANS = [
  {
    key: 'basique' as const,
    name: 'Basique',
    price: '5€',
    unit: '/ annonce',
    features: ['Version française complète', 'Version réseaux sociaux', 'Liens publication directe', 'Livraison sous 24h'],
  },
  {
    key: 'essentiel' as const,
    name: 'Essentiel',
    price: '12€',
    unit: '3 annonces',
    recommended: true,
    features: ['Version française complète', 'Version anglaise incluse', 'Version réseaux sociaux', 'Export PDF', 'Livraison sous 24h'],
  },
  {
    key: 'agence' as const,
    name: 'Agence',
    price: '65€',
    unit: '/ mois · sans engagement',
    features: ['Annonces illimitées', 'Versions FR + EN + réseaux sociaux', 'Dashboard agence dédié', "3 annonces offertes à l'activation", 'Résiliable à tout moment'],
  },
  {
    key: 'fondateur' as const,
    name: 'Agence Fondateur',
    price: '50€',
    unit: '/ mois · à vie · 10 places',
    founder: true,
    features: ['Toutes les fonctionnalités Agence', 'Prix garanti à vie', 'Accès prioritaire aux nouvelles fonctionnalités', '10 places uniquement'],
  },
]

export default function SectionCommande({ profile }: Props) {
  const { startCheckout, openPortal, loading, error } = useCheckout()
  const [cgvAccepted, setCgvAccepted] = useState(false)

  const hasActiveSubscription =
    profile?.subscription_status === 'active' &&
    (profile?.plan === 'agence' || profile?.plan === 'fondateur')

  const canCheckout = cgvAccepted && loading === null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: 300, color: T.dark }}>
          Nouvelle <em style={{ fontStyle: 'italic', color: T.gold }}>commande</em>
        </h1>
        <p style={{ fontSize: '12px', color: T.mid, marginTop: '6px' }}>
          Choisissez votre formule et procédez au paiement sécurisé via Stripe.
        </p>
      </div>

      {/* Erreur globale */}
      {error && (
        <div style={{ padding: '12px 16px', background: T.errBg, borderLeft: `3px solid ${T.err}`, color: T.err, fontSize: '13px' }}>
          {error}
        </div>
      )}

      {/* Abonnement actif → portail */}
      {hasActiveSubscription && (
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: T.dark, marginBottom: '4px' }}>
              Abonnement actif — Formule <span style={{ color: T.gold }}>{profile?.plan}</span>
            </div>
            <div style={{ fontSize: '12px', color: T.mid }}>
              Gérez votre abonnement, vos factures et vos informations de paiement depuis le portail Stripe.
            </div>
          </div>
          <button
            onClick={openPortal}
            disabled={loading !== null}
            style={{
              padding: '11px 24px',
              background: T.gold, color: T.bg,
              border: 'none', fontFamily: "'DM Sans', sans-serif",
              fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase',
              cursor: loading !== null ? 'not-allowed' : 'pointer', fontWeight: 500,
              opacity: loading !== null ? 0.6 : 1,
              flexShrink: 0,
            }}
          >
            {loading ? 'Chargement…' : 'Gérer mon abonnement →'}
          </button>
        </div>
      )}

      {/* Grille des plans */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: T.border }}>
        {PLANS.map(plan => (
          <div
            key={plan.key}
            style={{
              background: plan.founder ? '#0E0E10' : T.surface,
              padding: '32px 28px',
              display: 'flex', flexDirection: 'column', gap: '12px',
              position: 'relative',
            }}
          >
            {plan.recommended && (
              <div style={{ position: 'absolute', top: '0', right: '0', background: T.gold, color: T.bg, fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '4px 12px', fontWeight: 500 }}>
                Populaire
              </div>
            )}
            {plan.founder && (
              <div style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: T.gold, border: '1px solid rgba(201,169,110,0.3)', padding: '3px 8px', display: 'inline-block', width: 'fit-content' }}>
                Offre fondateur · 10 places
              </div>
            )}

            <div style={{ fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', color: plan.recommended ? T.gold : T.mid }}>
              {plan.name}
            </div>

            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '48px', fontWeight: 300, color: plan.founder ? '#FAFAF7' : T.dark, lineHeight: 1 }}>
              {plan.price}
            </div>
            <div style={{ fontSize: '12px', color: T.mid }}>{plan.unit}</div>

            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, margin: '8px 0 16px' }}>
              {plan.features.map(f => (
                <li key={f} style={{ fontSize: '13px', color: plan.founder ? '#888' : T.mid, display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: T.gold, flexShrink: 0 }}>—</span>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => startCheckout(plan.key)}
              disabled={!canCheckout}
              title={!cgvAccepted ? 'Veuillez accepter les CGV et CGU avant de continuer' : undefined}
              style={{
                padding: '12px 20px',
                background: plan.recommended ? (canCheckout ? T.gold : T.goldDim) : 'transparent',
                border: `1px solid ${plan.recommended ? (canCheckout ? T.gold : T.goldDim) : plan.founder ? 'rgba(201,169,110,0.4)' : T.border}`,
                color: plan.recommended ? T.bg : plan.founder ? T.gold : T.mid,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase',
                cursor: !canCheckout ? 'not-allowed' : 'pointer',
                fontWeight: plan.recommended ? 500 : 400,
                opacity: !canCheckout ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
            >
              {loading === plan.key ? 'Redirection…' : plan.key === 'agence' || plan.key === 'fondateur' ? "S'abonner" : 'Commander'}
            </button>
          </div>
        ))}
      </div>

      {/* Case à cocher CGV — obligatoire */}
      <div style={{ background: T.surface, border: `1px solid ${cgvAccepted ? T.gold : T.border}`, padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '12px', transition: 'border-color 0.2s' }}>
        <input
          id="cgv-checkbox"
          type="checkbox"
          checked={cgvAccepted}
          onChange={e => setCgvAccepted(e.target.checked)}
          style={{ width: '16px', height: '16px', marginTop: '2px', accentColor: T.gold, cursor: 'pointer', flexShrink: 0 }}
        />
        <label htmlFor="cgv-checkbox" style={{ fontSize: '12px', color: T.mid, lineHeight: 1.6, cursor: 'pointer' }}>
          J'ai lu et j'accepte les{' '}
          <a href="/cgv" target="_blank" rel="noopener noreferrer" style={{ color: T.gold, textDecoration: 'underline' }}>
            Conditions Générales de Vente
          </a>
          {' '}et les{' '}
          <a href="/cgu" target="_blank" rel="noopener noreferrer" style={{ color: T.gold, textDecoration: 'underline' }}>
            Conditions Générales d'Utilisation
          </a>
          {' '}de Redac-Immo.
        </label>
      </div>

      {!cgvAccepted && (
        <p style={{ fontSize: '11px', color: T.mid, textAlign: 'center', marginTop: '-12px' }}>
          Veuillez accepter les CGV et CGU pour activer les boutons de paiement.
        </p>
      )}

      <div style={{ fontSize: '11px', color: T.mid, textAlign: 'center' }}>
        Paiement sécurisé par Stripe · Aucune donnée bancaire stockée sur nos serveurs
      </div>
    </div>
  )
}