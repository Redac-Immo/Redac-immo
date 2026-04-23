'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCheckout } from '@/hooks/useCheckout'

// ✅ ISR : Revalidation toutes les heures (3600 secondes)

const PLANS = [
  {
    id: 'basique',
    name: 'Basique',
    price: '5',
    unit: 'par annonce',
    features: [
      'Version française complète',
      'Version réseaux sociaux',
      'Liens publication directe',
      'Livraison sous 24h',
    ],
  },
  {
    id: 'essentiel',
    name: 'Essentiel',
    price: '12',
    unit: '3 annonces',
    badge: 'Le plus demandé',
    featured: true,
    features: [
      'Version française complète',
      'Version anglaise incluse',
      'Version réseaux sociaux',
      'Liens publication directe',
      'Livraison sous 24h',
    ],
  },
  {
    id: 'agence',
    name: 'Agence',
    price: '65',
    unit: '/ mois · sans engagement',
    features: [
      'Annonces illimitées',
      'Versions française & anglaise',
      'Version réseaux sociaux',
      'Liens publication directe',
      'Dashboard agence dédié',
      '3 annonces offertes à l\'activation',
      'Résiliable à tout moment',
    ],
  },
  {
    id: 'fondateur',
    name: 'Agence · Fondateur',
    price: '50',
    unit: '/ mois · à vie · 10 places',
    badge: 'Offre fondateur',
    founder: true,
    features: [
      'Toutes les fonctionnalités Agence',
      'Prix garanti à vie sur votre compte',
      'Accès prioritaire aux nouvelles fonctionnalités',
      'Réservé aux 10 premiers abonnés',
    ],
  },
]

export default function TarifsPage() {
  const { startCheckout, loading } = useCheckout()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #18181A !important; }
      `}</style>

      {/* Navigation */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '20px 60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(24,24,26,0.98)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(201,169,110,0.25)',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: '2px', textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '26px', fontWeight: 500, color: '#FAFAF7' }}>
            Redac
          </span>
          <span style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '26px', fontWeight: 300, fontStyle: 'italic', color: '#C9A96E' }}>
            -Immo
          </span>
        </Link>
        <Link
          href="/"
          style={{
            fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase',
            color: '#9A9A94', textDecoration: 'none',
          }}
        >
          ← Retour au site
        </Link>
      </nav>

      {/* Contenu principal */}
      <main style={{
        minHeight: '100vh',
        background: '#18181A',
        padding: '120px 60px 80px',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* En-tête */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '12px',
              fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase',
              color: '#C9A96E', marginBottom: '20px',
            }}>
              Tarifs
            </div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(36px, 4vw, 54px)',
              fontWeight: 300,
              lineHeight: 1.1,
              color: '#FAFAF7',
              marginBottom: '16px',
            }}>
              Des tarifs <em style={{ fontStyle: 'italic', color: '#C9A96E' }}>transparents</em>
            </h1>
            <p style={{
              fontSize: '15px',
              color: '#9A9A94',
              maxWidth: '500px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}>
              Une tarification à la carte, selon vos besoins. Sans engagement.
            </p>
          </div>

          {/* Grille des tarifs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px',
            background: '#333336',
            marginBottom: '48px',
          }}>
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                style={{
                  background: plan.founder ? '#0E0E10' : plan.featured ? '#222224' : '#1E1E20',
                  padding: '40px 32px',
                  position: 'relative',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: `2px solid ${selectedPlan === plan.id ? '#C9A96E' : 'transparent'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {plan.badge && (
                  <div style={{
                    fontSize: '9px',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: plan.founder ? '#C9A96E' : '#9A9A94',
                    border: `1px solid ${plan.founder ? 'rgba(201,169,110,0.3)' : '#333336'}`,
                    padding: '4px 10px',
                    display: 'inline-block',
                    marginBottom: '16px',
                    width: 'fit-content',
                  }}>
                    {plan.badge}
                  </div>
                )}
                <div style={{
                  fontSize: '12px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: plan.featured ? '#C9A96E' : '#9A9A94',
                  marginBottom: '16px',
                }}>
                  {plan.name}
                </div>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '56px',
                  fontWeight: 300,
                  lineHeight: 1,
                  color: plan.founder ? '#FAFAF7' : '#FAFAF7',
                  marginBottom: '4px',
                }}>
                  <sup style={{ fontSize: '20px', verticalAlign: 'super' }}>€</sup>
                  {plan.price}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#9A9A94',
                  marginBottom: '28px',
                }}>
                  {plan.unit}
                </div>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  flex: 1,
                  marginBottom: '28px',
                }}>
                  {plan.features.map((f) => {
                    const isHighlighted = f.includes('offertes') || f.includes('garanti') || f.includes('Réservé')
                    return (
                      <li
                        key={f}
                        style={{
                          fontSize: '13px',
                          lineHeight: 1.5,
                          color: plan.founder ? '#888' : '#9A9A94',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                        }}
                      >
                        <span style={{ color: '#C9A96E', flexShrink: 0, marginTop: '1px' }}>—</span>
                        {isHighlighted ? (
                          <strong style={{ color: '#C9A96E' }}>{f}</strong>
                        ) : f}
                      </li>
                    )
                  })}
                </ul>
                <button
                  onClick={(e) => { 
                    e.stopPropagation()
                    startCheckout(plan.id as 'basique' | 'essentiel' | 'agence' | 'fondateur') 
                  }}
                  disabled={loading === plan.id}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '12px 20px',
                    background: loading === plan.id ? '#9A7A48' : '#C9A96E',
                    color: '#18181A',
                    border: 'none',
                    fontSize: '11px',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    cursor: loading === plan.id ? 'not-allowed' : 'pointer',
                    fontWeight: 500,
                    width: '100%',
                  }}
                >
                  {loading === plan.id ? 'Redirection…' : 'Commander'}
                </button>
              </div>
            ))}
          </div>

          {/* Footer info */}
          <p style={{
            fontSize: '12px',
            color: '#6B6B65',
            textAlign: 'center',
            marginTop: '32px',
          }}>
            Tous les prix sont TTC (TVA non applicable, art. 293 B du CGI).<br />
            Paiement sécurisé par Stripe.
          </p>
        </div>
      </main>

      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) {
          nav { padding: 16px 24px !important; }
          main { padding: 100px 24px 60px !important; }
          main > div > div:last-child { grid-template-columns: 1fr !important; max-width: 420px; margin: 0 auto; }
        }
        @media (min-width: 600px) and (max-width: 900px) {
          main > div > div:last-child { grid-template-columns: repeat(2, 1fr) !important; max-width: 660px; }
        }
      `}</style>
    </>
  )
}