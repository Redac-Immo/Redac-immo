'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { Profile, Annonce } from '@/types'

interface Props {
  user: User
  profile: Profile | null
  annonces: Annonce[]
}

type Section = 'compte' | 'annonces' | 'abonnement' | 'commande' | 'factures' | 'support'

const SECTION_TITLES: Record<Section, string> = {
  compte:     'Mon compte',
  annonces:   'Mes annonces',
  abonnement: 'Mon abonnement',
  commande:   'Nouvelle commande',
  factures:   'Mes factures',
  support:    'Support & aide',
}

export default function DashboardClient({ user, profile, annonces }: Props) {
  const [activeSection, setActiveSection] = useState<Section>('compte')
  const [toast, setToast] = useState<{ msg: string; type?: string } | null>(null)
  const [localAnnonces, setLocalAnnonces] = useState<Annonce[]>(annonces)

  function showToast(msg: string, type?: string) {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3200)
  }

  function initials() {
    const p = profile?.prenom?.[0] ?? ''
    const n = profile?.nom?.[0] ?? ''
    return ((p + n).toUpperCase() || user.email?.[0].toUpperCase()) ?? '?'
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F2F2EE' }}>

      <aside style={{
        width: '260px', background: '#18181A',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 200,
      }}>
        <div style={{ padding: '32px 28px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', color: '#FAFAF7', display: 'flex', alignItems: 'baseline', gap: '2px' }}>
            Redac<span style={{ fontStyle: 'italic', color: '#C9A96E', fontWeight: 300 }}>-Immo</span>
          </div>
          <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6B6B65', marginTop: '4px' }}>
            Espace client
          </div>
        </div>

        <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: '#2A2A2C', border: '1.5px solid rgba(201,169,110,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', color: '#C9A96E', marginBottom: '10px',
          }}>
            {initials()}
          </div>
          <div style={{ fontSize: '13px', fontWeight: 500, color: '#FAFAF7', marginBottom: '4px' }}>
            {profile?.prenom} {profile?.nom}
          </div>
          <div style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A96E', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#C9A96E', display: 'inline-block' }} />
            Formule {profile?.plan ?? 'basique'}
          </div>
        </div>

        <nav style={{ flex: 1, padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
          {(Object.keys(SECTION_TITLES) as Section[]).map(section => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 28px',
                fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase',
                color: activeSection === section ? '#C9A96E' : '#6B6B65',
                background: activeSection === section ? 'rgba(201,169,110,0.06)' : 'none',
                border: 'none',
                borderLeft: `2px solid ${activeSection === section ? '#C9A96E' : 'transparent'}`,
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                textAlign: 'left', width: '100%',
              }}
            >
              {SECTION_TITLES[section]}
              {section === 'annonces' && localAnnonces.length > 0 && (
                <span style={{
                  marginLeft: 'auto', background: '#C9A96E', color: '#18181A',
                  fontSize: '9px', fontWeight: 500, padding: '2px 6px', borderRadius: '10px',
                }}>
                  {localAnnonces.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: '20px 28px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={handleSignOut} style={{
            fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#444', cursor: 'pointer', background: 'none', border: 'none',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Se déconnecter
          </button>
        </div>
      </aside>

      <main style={{ marginLeft: '260px', flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'rgba(242,242,238,0.92)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E8E8E4', padding: '0 48px',
          height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 400 }}>
            {SECTION_TITLES[activeSection]}
          </div>
          <button onClick={() => setActiveSection('commande')} style={{
            padding: '9px 22px', background: '#C9A96E', color: '#18181A',
            border: 'none', fontFamily: "'DM Sans', sans-serif",
            fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase',
            cursor: 'pointer', fontWeight: 500,
          }}>
            + Nouvelle annonce
          </button>
        </header>

        <div style={{ padding: '48px 48px 80px', maxWidth: '1100px', width: '100%' }}>
          {activeSection === 'compte'     && <SectionCompte profile={profile} user={user} showToast={showToast} />}
          {activeSection === 'annonces'   && <SectionAnnonces annonces={localAnnonces} setAnnonces={setLocalAnnonces} showToast={showToast} />}
          {activeSection === 'abonnement' && <SectionAbonnement profile={profile} showToast={showToast} />}
          {activeSection === 'commande'   && <SectionCommande profile={profile} />}
          {activeSection === 'factures'   && <SectionFactures />}
          {activeSection === 'support'    && <SectionSupport showToast={showToast} />}
        </div>
      </main>

      {toast && (
        <div style={{
          position: 'fixed', bottom: '32px', right: '32px', zIndex: 9999,
          background: '#18181A', color: '#FAFAF7', padding: '14px 24px', fontSize: '13px',
          borderLeft: `3px solid ${toast.type === 'ok' ? '#2D6A4F' : toast.type === 'err' ? '#C1121F' : '#C9A96E'}`,
          maxWidth: '340px', animation: 'slideUp 0.3s ease',
        }}>
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  )
}

function SectionCompte({ profile, user, showToast }: { profile: Profile | null; user: User; showToast: (m: string, t?: string) => void }) {
  const [prenom, setPrenom] = useState(profile?.prenom ?? '')
  const [nom, setNom] = useState(profile?.nom ?? '')
  const [agence, setAgence] = useState(profile?.agence ?? '')
  const [saving, setSaving] = useState(false)

  async function saveProfile() {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('profiles').update({ prenom, nom, agence: agence || null }).eq('id', user.id)
    setSaving(false)
    showToast(error ? 'Erreur lors de la sauvegarde' : 'Profil mis à jour', error ? 'err' : 'ok')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: 300 }}>
          Mon <em style={{ fontStyle: 'italic', color: '#C9A96E' }}>compte</em>
        </h1>
        <p style={{ fontSize: '12px', color: '#6B6B65', marginTop: '6px' }}>Informations personnelles</p>
      </div>
      <Card title="Profil">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <Field label="Prénom"><input type="text" value={prenom} onChange={e => setPrenom(e.target.value)} style={inputStyle} /></Field>
          <Field label="Nom"><input type="text" value={nom} onChange={e => setNom(e.target.value)} style={inputStyle} /></Field>
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="E-mail"><input type="email" value={user.email ?? ''} disabled style={{ ...inputStyle, opacity: 0.5 }} /></Field>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Agence"><input type="text" value={agence} onChange={e => setAgence(e.target.value)} style={inputStyle} /></Field>
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <Btn onClick={saveProfile} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Btn>
        </div>
      </Card>
    </div>
  )
}

function SectionAnnonces({ annonces, setAnnonces, showToast }: { annonces: Annonce[]; setAnnonces: (a: Annonce[]) => void; showToast: (m: string, t?: string) => void }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'fr' | 'en' | 'short'>('fr')
  const [filter, setFilter] = useState<'all' | 'encours' | 'vendu' | 'archive'>('all')

  async function updateStatut(id: string, statut: string) {
    const supabase = createClient()
    await supabase.from('annonces').update({ statut }).eq('id', id)
    setAnnonces(annonces.map(a => a.id === id ? { ...a, statut: statut as Annonce['statut'] } : a))
    showToast('Statut mis à jour', 'ok')
  }

  const filtered = filter === 'all' ? annonces : annonces.filter(a => a.statut === filter)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: 300 }}>
          Mes <em style={{ fontStyle: 'italic', color: '#C9A96E' }}>annonces</em>
        </h1>
        <p style={{ fontSize: '12px', color: '#6B6B65', marginTop: '6px' }}>{annonces.length} annonce{annonces.length > 1 ? 's' : ''}</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {(['all', 'encours', 'vendu', 'archive'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '7px 16px', fontFamily: "'DM Sans', sans-serif",
            fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
            background: filter === f ? 'rgba(201,169,110,0.08)' : '#FAFAF7',
            border: `1px solid ${filter === f ? '#C9A96E' : '#E8E8E4'}`,
            color: filter === f ? '#9A7A48' : '#6B6B65',
          }}>
            {f === 'all' ? `Toutes (${annonces.length})` : f === 'encours' ? `En cours (${annonces.filter(a => a.statut === 'encours').length})` : f === 'vendu' ? `Vendues (${annonces.filter(a => a.statut === 'vendu').length})` : `Archivées (${annonces.filter(a => a.statut === 'archive').length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: '#FAFAF7', border: '1px solid #E8E8E4', padding: '48px', textAlign: 'center', color: '#6B6B65' }}>
          <div style={{ fontSize: '24px', marginBottom: '12px' }}>✦</div>
          <div>Aucune annonce pour ce filtre</div>
        </div>
      ) : (
        <div style={{ background: '#FAFAF7', border: '1px solid #E8E8E4' }}>
          {filtered.map((annonce, index) => (
            <div key={annonce.id}>
              {index > 0 && <div style={{ height: '1px', background: '#E8E8E4' }} />}
              <div onClick={() => { setOpenId(openId === annonce.id ? null : annonce.id); setActiveTab('fr') }}
                style={{ display: 'flex', alignItems: 'stretch', cursor: 'pointer' }}>
                <div style={{ width: '3px', flexShrink: 0, background: annonce.statut === 'encours' ? '#C9A96E' : annonce.statut === 'vendu' ? '#2D6A4F' : '#E8E8E4' }} />
                <div style={{ flex: 1, padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{annonce.bien}</div>
                    <div style={{ fontSize: '11px', color: '#6B6B65', marginTop: '3px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <span>{new Date(annonce.created_at).toLocaleDateString('fr-FR')}</span>
                      <span>· {annonce.prix}</span>
                      <span>· Formule {annonce.formule}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <StatusBadge statut={annonce.statut} />
                    <button onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(annonce.fr); showToast('Texte copié', 'ok') }} style={outlineBtnStyle}>
                      Copier FR
                    </button>
                  </div>
                </div>
              </div>

              {openId === annonce.id && (
                <div style={{ borderTop: '1px solid #E8E8E4', padding: '0 22px 22px' }}>
                  <div style={{ display: 'flex', borderBottom: '1px solid #E8E8E4', marginBottom: '20px' }}>
                    {(['fr', 'en', 'short'] as const).map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab)} style={{
                        padding: '10px 20px', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase',
                        cursor: 'pointer', color: activeTab === tab ? '#C9A96E' : '#6B6B65',
                        borderBottom: `2px solid ${activeTab === tab ? '#C9A96E' : 'transparent'}`,
                        background: 'none', border: 'none',
                        fontFamily: "'DM Sans', sans-serif", marginBottom: '-1px',
                      } as React.CSSProperties}>
                        {tab === 'fr' ? 'Version FR' : tab === 'en' ? 'Version EN' : 'Réseaux'}
                      </button>
                    ))}
                  </div>
                  <div style={{ background: '#F2F2EE', border: '1px solid #E8E8E4', padding: '20px', fontSize: '13px', lineHeight: 1.8, whiteSpace: 'pre-wrap', maxHeight: '280px', overflowY: 'auto' }}>
                    {activeTab === 'fr' ? annonce.fr : activeTab === 'en' ? (annonce.en || '— Non disponible') : (annonce.short || '— Non disponible')}
                  </div>
                  <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                    <button onClick={() => { const t = activeTab === 'fr' ? annonce.fr : activeTab === 'en' ? annonce.en : annonce.short; navigator.clipboard.writeText(t); showToast('Copié', 'ok') }} style={outlineBtnStyle}>Copier</button>
                    <select onChange={e => e.target.value && updateStatut(annonce.id, e.target.value)} defaultValue="" style={{ ...inputStyle, width: 'auto', fontSize: '11px', padding: '7px 12px' }}>
                      <option value="" disabled>Changer le statut</option>
                      <option value="encours">En cours</option>
                      <option value="vendu">Vendue</option>
                      <option value="archive">Archiver</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SectionAbonnement({ profile, showToast }: { profile: Profile | null; showToast: (m: string, t?: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: 300 }}>
        Mon <em style={{ fontStyle: 'italic', color: '#C9A96E' }}>abonnement</em>
      </h1>
      <div style={{ background: '#18181A', border: '1px solid rgba(201,169,110,0.2)', padding: '32px', display: 'flex', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#6B6B65', marginBottom: '10px' }}>Formule active</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontWeight: 300, color: '#FAFAF7' }}>
            Formule <em style={{ fontStyle: 'italic', color: '#C9A96E' }}>{profile?.plan ?? 'basique'}</em>
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '48px', fontWeight: 300, color: '#C9A96E', lineHeight: 1 }}>
            {profile?.plan === 'agence' ? '65€' : profile?.plan === 'essentiel' ? '9,99€' : '5€'}
          </div>
          <div style={{ fontSize: '12px', color: '#6B6B65', marginTop: '4px' }}>
            {profile?.plan === 'agence' ? '/ mois · sans engagement' : '/ annonce'}
          </div>
        </div>
      </div>
      <div style={{ background: '#FAFAF7', border: '1px solid #E8E8E4', padding: '24px' }}>
        <button onClick={() => showToast('Paiement Stripe — bientôt disponible')} style={{ ...outlineBtnStyle, color: '#C9A96E', borderColor: '#C9A96E' }}>
          {profile?.plan === 'agence' ? 'Résilier l\'abonnement' : 'Passer à la formule Agence — 65€/mois'}
        </button>
      </div>
    </div>
  )
}

function SectionCommande({ profile }: { profile: Profile | null }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: 300 }}>
        Nouvelle <em style={{ fontStyle: 'italic', color: '#C9A96E' }}>commande</em>
      </h1>
      <div style={{ background: '#FAFAF7', border: '1px solid #E8E8E4', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
            Formule active : <strong style={{ color: '#9A7A48' }}>{profile?.plan ?? 'basique'}</strong>
          </div>
          <div style={{ fontSize: '12px', color: '#6B6B65' }}>Accédez à l'interface de génération.</div>
        </div>
        <a href="/app" style={{ padding: '11px 24px', background: '#C9A96E', color: '#18181A', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 500 }}>
          Générer une annonce →
        </a>
      </div>
    </div>
  )
}

function SectionFactures() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: 300 }}>
        Mes <em style={{ fontStyle: 'italic', color: '#C9A96E' }}>factures</em>
      </h1>
      <div style={{ background: '#FAFAF7', border: '1px solid #E8E8E4', padding: '48px', textAlign: 'center', color: '#6B6B65' }}>
        <div style={{ fontSize: '24px', marginBottom: '12px' }}>🧾</div>
        <div>Disponible après intégration Stripe.</div>
      </div>
    </div>
  )
}

function SectionSupport({ showToast }: { showToast: (m: string, t?: string) => void }) {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  async function handleSend() {
    if (!message.trim()) return
    setSending(true)
    await new Promise(r => setTimeout(r, 800))
    setSending(false)
    setMessage('')
    showToast('Message envoyé — réponse sous 24h', 'ok')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: 300 }}>
        <em style={{ fontStyle: 'italic', color: '#C9A96E' }}>Support</em> & aide
      </h1>
      <Card title="Formulaire de contact">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Field label="Message">
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Décrivez votre question…" />
          </Field>
          <Btn onClick={handleSend} disabled={sending || !message.trim()}>
            {sending ? 'Envoi…' : 'Envoyer le message'}
          </Btn>
        </div>
      </Card>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#FAFAF7', border: '1px solid #E8E8E4' }}>
      <div style={{ padding: '20px 28px', borderBottom: '1px solid #E8E8E4' }}>
        <span style={{ fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#6B6B65' }}>{title}</span>
      </div>
      <div style={{ padding: '28px' }}>{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
      <label style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6B6B65' }}>{label}</label>
      {children}
    </div>
  )
}

function Btn({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '11px 24px', background: disabled ? '#9A7A48' : '#C9A96E',
      color: '#18181A', border: 'none', fontFamily: "'DM Sans', sans-serif",
      fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase',
      cursor: disabled ? 'not-allowed' : 'pointer', fontWeight: 500,
    }}>
      {children}
    </button>
  )
}

function StatusBadge({ statut }: { statut: string }) {
  const config = {
    encours: { bg: 'rgba(201,169,110,0.12)', color: '#9A7A48', dot: '#C9A96E', label: 'En cours' },
    vendu:   { bg: '#E8F4EE', color: '#2D6A4F', dot: '#2D6A4F', label: 'Vendu' },
    archive: { bg: '#F0F0EC', color: '#6B6B65', dot: '#6B6B65', label: 'Archivé' },
  }[statut] ?? { bg: '#F0F0EC', color: '#6B6B65', dot: '#6B6B65', label: statut }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 10px', background: config.bg, color: config.color }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: config.dot, display: 'inline-block' }} />
      {config.label}
    </span>
  )
}

const inputStyle: React.CSSProperties = {
  background: '#F2F2EE', border: '1px solid #E8E8E4', color: '#18181A',
  fontFamily: "'DM Sans', sans-serif", fontSize: '13px', padding: '11px 14px', outline: 'none', width: '100%',
}

const outlineBtnStyle: React.CSSProperties = {
  padding: '7px 16px', background: 'transparent', border: '1px solid #E8E8E4',
  color: '#6B6B65', fontFamily: "'DM Sans', sans-serif",
  fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
}