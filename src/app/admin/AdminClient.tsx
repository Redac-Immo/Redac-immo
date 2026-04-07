'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Annonce } from '@/types'

interface Props {
  adminProfile: Profile
  annonces: (Annonce & { profiles?: { prenom: string; nom: string; agence: string } | null })[]
  users: Profile[]
}

type Section = 'overview' | 'annonces' | 'users'

const S: React.CSSProperties = {
  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
}

export default function AdminClient({ adminProfile, annonces, users }: Props) {
  const [section, setSection] = useState<Section>('overview')
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const statEncours = annonces.filter(a => a.statut === 'encours').length
  const statVendu = annonces.filter(a => a.statut === 'vendu').length

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#18181A', ...S }}>

      {/* SIDEBAR */}
      <aside style={{ width: 220, background: '#111112', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', padding: '32px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 24px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif", fontSize: 22, color: '#FAFAF7' }}>
            Redac<span style={{ fontStyle: 'italic', color: '#C9A96E', fontWeight: 300 }}>Immo</span>
          </div>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A96E', marginTop: 4 }}>Admin</div>
        </div>
        <nav style={{ flex: 1, padding: '20px 0' }}>
          {([
            { key: 'overview', label: "Vue d\u2019ensemble", icon: '◈' },
            { key: 'annonces', label: 'Annonces', icon: '≡' },
            { key: 'users', label: 'Utilisateurs', icon: '◎' },
          ] as { key: Section; label: string; icon: string }[]).map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setSection(key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%', padding: '12px 24px', border: 'none',
                background: section === key ? 'rgba(201,169,110,0.08)' : 'transparent',
                borderLeft: section === key ? '2px solid #C9A96E' : '2px solid transparent',
                color: section === key ? '#C9A96E' : '#555',
                fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 14 }}>{icon}</span>
              {label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 11, color: '#555', marginBottom: 12 }}>
            {adminProfile.prenom} {adminProfile.nom}
          </div>
          <button
            onClick={handleSignOut}
            style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        <header style={{ padding: '28px 48px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: '#FAFAF7' }}>
              {section === 'overview' && "Vue d\u2019ensemble"}
              {section === 'annonces' && 'Toutes les annonces'}
              {section === 'users' && 'Utilisateurs'}
            </div>
            <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>Administration Redac-Immo</div>
          </div>
          <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A96E', border: '1px solid rgba(201,169,110,0.3)', padding: '6px 14px' }}>
            Admin
          </div>
        </header>

        <div style={{ padding: '40px 48px' }}>

          {/* OVERVIEW */}
          {section === 'overview' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, marginBottom: 48 }}>
                {[
                  { label: 'Total annonces', value: annonces.length, color: '#FAFAF7' },
                  { label: 'En cours', value: statEncours, color: '#C9A96E' },
                  { label: 'Vendus', value: statVendu, color: '#6fcf97' },
                  { label: 'Utilisateurs', value: users.length, color: '#FAFAF7' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: '#222224', padding: '28px 24px' }}>
                    <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#555', marginBottom: 12 }}>{label}</div>
                    <div style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, color, lineHeight: 1 }}>{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 20, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555' }}>
                Dernières annonces
              </div>
              <AnnonceTable annonces={annonces.slice(0, 10)} showToast={showToast} />
            </div>
          )}

          {/* ANNONCES */}
          {section === 'annonces' && (
            <AnnonceTable annonces={annonces} showToast={showToast} />
          )}

          {/* USERS */}
          {section === 'users' && (
            <div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['Nom', 'Agence', 'Plan', 'Rôle', 'Inscription'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555', fontWeight: 400 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#FAFAF7' }}>{u.prenom} {u.nom}</td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: '#777' }}>{u.agence || '—'}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A96E', border: '1px solid rgba(201,169,110,0.3)', padding: '3px 8px' }}>
                          {u.plan}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 11, color: u.role === 'admin' ? '#C9A96E' : '#555' }}>{u.role}</td>
                      <td style={{ padding: '14px 16px', fontSize: 11, color: '#555' }}>
                        {u.created_at ? new Date(u.created_at).toLocaleDateString('fr-FR') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>

      {toast && (
        <div style={{ position: 'fixed', bottom: 32, right: 32, background: '#222224', border: '1px solid rgba(201,169,110,0.3)', color: '#FAFAF7', padding: '14px 20px', fontSize: 13, zIndex: 999 }}>
          {toast}
        </div>
      )}
    </div>
  )
}

function AnnonceTable({
  annonces,
  showToast,
}: {
  annonces: Props['annonces']
  showToast: (m: string) => void
}) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {['Bien', 'Localisation', 'Formule', 'Statut', 'Client', 'Date'].map(h => (
            <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555', fontWeight: 400 }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {annonces.map(a => (
          <tr key={a.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <td style={{ padding: '14px 16px', fontSize: 13, color: '#FAFAF7', maxWidth: 200 }}>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.bien}</div>
            </td>
            <td style={{ padding: '14px 16px', fontSize: 12, color: '#777' }}>{a.localisation}</td>
            <td style={{ padding: '14px 16px' }}>
              <span style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C9A96E', border: '1px solid rgba(201,169,110,0.2)', padding: '2px 7px' }}>
                {a.formule}
              </span>
            </td>
            <td style={{ padding: '14px 16px' }}>
              <span style={{
                fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '2px 7px',
                color: a.statut === 'vendu' ? '#6fcf97' : a.statut === 'archive' ? '#555' : '#C9A96E',
                border: `1px solid ${a.statut === 'vendu' ? 'rgba(111,207,151,0.3)' : a.statut === 'archive' ? 'rgba(85,85,85,0.3)' : 'rgba(201,169,110,0.3)'}`,
              }}>
                {a.statut}
              </span>
            </td>
            <td style={{ padding: '14px 16px', fontSize: 11, color: '#555' }}>
              {a.profiles ? `${a.profiles.prenom} ${a.profiles.nom}` : '—'}
            </td>
            <td style={{ padding: '14px 16px', fontSize: 11, color: '#555' }}>
              {a.created_at ? new Date(a.created_at).toLocaleDateString('fr-FR') : '—'}
            </td>
          </tr>
        ))}
        {annonces.length === 0 && (
          <tr>
            <td colSpan={6} style={{ padding: '40px 16px', textAlign: 'center', fontSize: 13, color: '#555' }}>Aucune annonce</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
