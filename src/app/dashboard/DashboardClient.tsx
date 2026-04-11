'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { Profile, Annonce } from '@/types'

// ─── TOKENS DARK MODE (Frieren v2.4) ──────────────────────────
const T = {
  bg:      '#18181A',
  bg2:     '#1E1E20',
  surface: '#222224',
  surface2:'#2A2A2C',
  dark:    '#FAFAF7',
  gold:    '#C9A96E',
  goldL:   '#E8D0A0',
  goldD:   '#C9A96E',
  goldDim: '#9A7A48',
  mid:     '#9A9A94',
  border:  '#333336',
  ok:      '#4ade80',
  okBg:    'rgba(45,106,79,0.2)',
  err:     '#f87171',
  errBg:   'rgba(193,18,31,0.15)',
} as const

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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function showToast(msg: string, type?: string) {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3200)
  }

  function initials() {
    const p = profile?.prenom?.[0] ?? ''
    const n = profile?.nom?.[0] ?? ''
    return (p + n).toUpperCase() || user.email?.[0].toUpperCase() ?? '?'
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  function navigate(section: Section) {
    setActiveSection(section)
    setSidebarOpen(false)
    window.scrollTo(0, 0)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: T.bg, color: T.dark, fontFamily: "'DM Sans', sans-serif", colorScheme: 'dark' }}>

      {/* OVERLAY MOBILE */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 190 }}
        />
      )}

      {/* SIDEBAR */}
      <aside style={{
        width: '260px',
        background: T.surface,
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 200,
        transform: sidebarOpen ? 'translateX(0)' : undefined,
        transition: 'transform 0.3s cubic-bezier(.4,0,.2,1)',
      }}>
        {/* Logo */}
        <div style={{ padding: '32px 28px 24px', borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 500, color: T.surface, display: 'flex', alignItems: 'baseline', gap: '2px' }}>
            Redac<span style={{ fontWeight: 300, fontStyle: 'italic', color: T.gold }}>-Immo</span>
          </div>
          <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.mid, marginTop: '4px' }}>
            Espace client
          </div>
        </div>

        {/* User */}
        <div style={{ padding: '20px 28px', borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: T.surface2, border: `1.5px solid rgba(201,169,110,0.3)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', color: T.gold, marginBottom: '10px',
          }}>
            {initials()}
          </div>
          <div style={{ fontSize: '13px', fontWeight: 500, color: T.surface, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {profile?.prenom} {profile?.nom}
          </div>
          <div style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: T.gold, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: T.gold, display: 'inline-block' }} />
            Formule {profile?.plan ?? 'basique'}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
          {(Object.keys(SECTION_TITLES) as Section[]).map(section => (
            <button
              key={section}
              onClick={() => navigate(section)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 28px',
                fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase',
                color: activeSection === section ? T.gold : '#6B6B65',
                background: activeSection === section ? 'rgba(201,169,110,0.06)' : 'none',
                border: 'none',
                borderLeft: `2px solid ${activeSection === section ? T.gold : 'transparent'}`,
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                textAlign: 'left', width: '100%', transition: 'all 0.15s',
              }}
            >
              {SECTION_TITLES[section]}
              {section === 'annonces' && localAnnonces.length > 0 && (
                <span style={{ marginLeft: 'auto', background: T.gold, color: T.bg, fontSize: '9px', fontWeight: 500, padding: '2px 6px', borderRadius: '10px' }}>
                  {localAnnonces.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '20px 28px', borderTop: `1px solid rgba(255,255,255,0.06)` }}>
          <button
            onClick={handleSignOut}
            style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666', cursor: 'pointer', background: 'none', border: 'none', fontFamily: "'DM Sans', sans-serif", width: '100%', textAlign: 'left' }}
          >
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: '260px', flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Topbar */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'rgba(24,24,26,0.96)', backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${T.border}`,
          padding: '0 48px', height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ display: 'none', width: '40px', height: '40px', background: T.surface, border: 'none', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '5px' }}
              className="menu-toggle"
            >
              <span style={{ display: 'block', width: '18px', height: '1.5px', background: T.dark }} />
              <span style={{ display: 'block', width: '18px', height: '1.5px', background: T.dark }} />
              <span style={{ display: 'block', width: '18px', height: '1.5px', background: T.dark }} />
            </button>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 400, color: T.dark }}>
              {SECTION_TITLES[activeSection]}
            </div>
          </div>
          <button
            onClick={() => navigate('commande')}
            style={{ padding: '9px 22px', background: T.gold, color: T.bg, border: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 500 }}
          >
            + Nouvelle annonce
          </button>
        </header>

        {/* Content */}
        <div style={{ padding: '48px 48px 80px', maxWidth: '1100px', width: '100%' }}>
          {activeSection === 'compte'     && <SectionCompte profile={profile} user={user} showToast={showToast} />}
          {activeSection === 'annonces'   && <SectionAnnonces annonces={localAnnonces} setAnnonces={setLocalAnnonces} showToast={showToast} />}
          {activeSection === 'abonnement' && <SectionAbonnement profile={profile} showToast={showToast} />}
          {activeSection === 'commande'   && <SectionCommande profile={profile} />}
          {activeSection === 'factures'   && <SectionFactures />}
          {activeSection === 'support'    && <SectionSupport showToast={showToast} />}
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '32px', right: '32px', zIndex: 9999,
          background: T.surface, color: T.dark,
          padding: '14px 24px', fontSize: '13px',
          borderLeft: `3px solid ${toast.type === 'ok' ? T.ok : toast.type === 'err' ? T.err : T.gold}`,
          maxWidth: '340px', animation: 'slideUp 0.3s ease',
        }}>
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @media (max-width: 900px) {
          main { margin-left: 0 !important; }
          aside { transform: translateX(-100%); }
          .menu-toggle { display: flex !important; }
          header { padding: 0 20px !important; }
        }
      `}</style>
    </div>
  )
}

// ═══════════════════════════════════════════════════
// SECTION COMPTE
// ═══════════════════════════════════════════════════
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

  const initials = () => {
    const p = profile?.prenom?.[0] ?? ''
    const n = profile?.nom?.[0] ?? ''
    return (p + n).toUpperCase() || user.email?.[0].toUpperCase() ?? '?'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <SectionHeader title="Mon" accent="compte" sub="Informations personnelles et sécurité" />

      <Card title="Profil" badge={<Badge type="ok">Vérifié</Badge>}>
        {/* Avatar block */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '4px 0 24px', borderBottom: `1px solid ${T.border}`, marginBottom: '24px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: T.surface2, border: `2px solid rgba(201,169,110,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', color: T.gold, flexShrink: 0 }}>
            {initials()}
          </div>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px' }}>{profile?.prenom} {profile?.nom}</div>
            <div style={{ fontSize: '13px', color: T.mid }}>{user.email}</div>
            <div style={{ fontSize: '11px', color: T.border, marginTop: '2px' }}>Membre depuis {new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <Field label="Prénom"><Input value={prenom} onChange={setPrenom} /></Field>
          <Field label="Nom"><Input value={nom} onChange={setNom} /></Field>
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="E-mail"><Input value={user.email ?? ''} disabled /></Field>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Agence"><Input value={agence} onChange={setAgence} placeholder="Nom de votre agence" /></Field>
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <Btn onClick={saveProfile} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer les modifications'}</Btn>
        </div>
      </Card>

      {/* Danger zone */}
      <div style={{ border: '1px solid rgba(193,18,31,0.25)', background: 'rgba(193,18,31,0.06)' }}>
        <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(193,18,31,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: T.err }}>Zone de danger</span>
        </div>
        <div style={{ padding: '28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Supprimer mon compte</div>
            <div style={{ fontSize: '12px', color: T.mid, maxWidth: '420px', lineHeight: 1.6 }}>
              Action irréversible. Toutes vos annonces et données seront supprimées. Votre abonnement sera résilié immédiatement.
            </div>
          </div>
          <button
            onClick={() => { if (confirm('Êtes-vous certain ? Cette action est irréversible.')) showToast('Demande envoyée', 'ok') }}
            style={{ padding: '7px 16px', background: 'transparent', border: '1px solid rgba(193,18,31,0.3)', color: T.err, fontFamily: "'DM Sans', sans-serif", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            Supprimer le compte
          </button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════
// SECTION ANNONCES
// ═══════════════════════════════════════════════════
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
      <SectionHeader
        title="Mes"
        accent="annonces"
        sub={`${annonces.length} annonce${annonces.length > 1 ? 's' : ''} générée${annonces.length > 1 ? 's' : ''}`}
      />

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {(['all', 'encours', 'vendu', 'archive'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '7px 16px', fontFamily: "'DM Sans', sans-serif",
            fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
            background: filter === f ? 'rgba(201,169,110,0.08)' : 'transparent',
            border: `1px solid ${filter === f ? T.gold : T.border}`,
            color: filter === f ? T.goldD : T.mid,
            transition: 'all 0.15s',
          }}>
            {f === 'all' ? `Toutes (${annonces.length})` : f === 'encours' ? `En cours (${annonces.filter(a => a.statut === 'encours').length})` : f === 'vendu' ? `Vendues (${annonces.filter(a => a.statut === 'vendu').length})` : `Archivées (${annonces.filter(a => a.statut === 'archive').length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, padding: '48px', textAlign: 'center', color: T.mid }}>
          <div style={{ fontSize: '24px', marginBottom: '12px' }}>✦</div>
          <div>Aucune annonce pour ce filtre</div>
        </div>
      ) : (
        <div style={{ background: T.surface, border: `1px solid ${T.border}` }}>
          {filtered.map((annonce, index) => (
            <div key={annonce.id}>
              {index > 0 && <div style={{ height: '1px', background: T.border }} />}

              {/* Row */}
              <div
                onClick={() => { setOpenId(openId === annonce.id ? null : annonce.id); setActiveTab('fr') }}
                style={{ display: 'flex', alignItems: 'stretch', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,169,110,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ width: '3px', flexShrink: 0, background: annonce.statut === 'encours' ? T.gold : annonce.statut === 'vendu' ? T.ok : T.border }} />
                <div style={{ flex: 1, padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: T.dark }}>{annonce.bien}</div>
                    <div style={{ fontSize: '11px', color: T.mid, marginTop: '3px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <span>{new Date(annonce.created_at).toLocaleDateString('fr-FR')}</span>
                      <span>· {annonce.prix}</span>
                      <span>· Formule {annonce.formule}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <StatusBadge statut={annonce.statut} />
                    <button
                      onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(annonce.fr); showToast('Texte copié', 'ok') }}
                      style={outlineBtnStyle}
                    >
                      Copier FR
                    </button>
                  </div>
                </div>
              </div>

              {/* Détail expandé */}
              {openId === annonce.id && (
                <div style={{ borderTop: `1px solid ${T.border}`, padding: '0 22px 22px', background: T.bg2 }}>
                  <div style={{ display: 'flex', borderBottom: `1px solid ${T.border}`, marginBottom: '20px' }}>
                    {(['fr', 'en', 'short'] as const).map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab)} style={{
                        padding: '10px 20px', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase',
                        cursor: 'pointer', color: activeTab === tab ? T.gold : T.mid,
                        borderBottom: `2px solid ${activeTab === tab ? T.gold : 'transparent'}`,
                        background: 'none', border: 'none',
                        fontFamily: "'DM Sans', sans-serif", marginBottom: '-1px', transition: 'all 0.15s',
                      } as React.CSSProperties}>
                        {tab === 'fr' ? 'Version FR' : tab === 'en' ? 'Version EN' : 'Réseaux sociaux'}
                      </button>
                    ))}
                  </div>
                  <div style={{ background: T.bg, border: `1px solid ${T.border}`, padding: '20px', fontSize: '13px', lineHeight: 1.8, whiteSpace: 'pre-wrap', maxHeight: '280px', overflowY: 'auto', color: T.dark }}>
                    {activeTab === 'fr' ? annonce.fr : activeTab === 'en' ? (annonce.en || '— Non disponible pour cette formule') : (annonce.short || '— Non disponible pour cette formule')}
                  </div>
                  <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button onClick={() => { const t = activeTab === 'fr' ? annonce.fr : activeTab === 'en' ? annonce.en : annonce.short; navigator.clipboard.writeText(t); showToast('Copié', 'ok') }} style={outlineBtnStyle}>
                      Copier
                    </button>
                    <select
                      onChange={e => e.target.value && updateStatut(annonce.id, e.target.value)}
                      defaultValue=""
                      style={{ ...inputStyle, width: 'auto', fontSize: '11px', padding: '7px 12px' }}
                    >
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

// ═══════════════════════════════════════════════════
// SECTION ABONNEMENT
// ═══════════════════════════════════════════════════
function SectionAbonnement({ profile, showToast }: { profile: Profile | null; showToast: (m: string, t?: string) => void }) {
  const prix = profile?.plan === 'agence' ? '65€' : profile?.plan === 'essentiel' ? '9,99€' : '5€'
  const unite = profile?.plan === 'agence' ? '/ mois · sans engagement' : '/ annonce'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <SectionHeader title="Mon" accent="abonnement" sub="Gestion de votre formule et renouvellement" />

      {/* Plan card dark */}
      <div style={{ background: T.bg, border: `1px solid rgba(201,169,110,0.2)`, padding: '32px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: T.mid, marginBottom: '10px' }}>Formule active</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontWeight: 300, color: T.dark }}>
            Formule <em style={{ fontStyle: 'italic', color: T.gold }}>{profile?.plan ?? 'basique'}</em>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px' }}>
            {['Annonces illimitées', 'Versions FR + EN + réseaux sociaux', 'Export PDF', 'Support prioritaire'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: T.mid }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(201,169,110,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke={T.gold} strokeWidth="1.5"><path d="M2 5l2.5 2.5L8 3"/></svg>
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '48px', fontWeight: 300, color: T.gold, lineHeight: 1 }}>{prix}</div>
          <div style={{ fontSize: '12px', color: T.mid, marginTop: '4px' }}>{unite}</div>
          <div style={{ marginTop: '16px' }}><Badge type="ok">Actif</Badge></div>
        </div>
      </div>

      {/* Infos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: T.border }}>
        {[
          { label: 'Date de début', value: '15 janvier 2026', sub: 'Activation initiale' },
          { label: 'Prochain renouvellement', value: '15 avril 2026', sub: 'Reconduction automatique' },
          { label: 'Statut paiement', value: 'À jour', sub: 'Carte •••• 4242', ok: true },
        ].map(cell => (
          <div key={cell.label} style={{ background: T.surface, padding: '22px 24px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: T.mid, marginBottom: '8px' }}>{cell.label}</div>
            <div style={{ fontSize: '15px', fontWeight: 500 }}>{cell.ok ? <Badge type="ok">{cell.value}</Badge> : cell.value}</div>
            <div style={{ fontSize: '11px', color: T.mid, marginTop: '3px' }}>{cell.sub}</div>
          </div>
        ))}
      </div>

      {/* Résiliation */}
      <div style={{ border: '1px solid rgba(193,18,31,0.25)', background: 'rgba(193,18,31,0.06)', padding: '24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
            {profile?.plan === 'agence' ? 'Résilier la formule Agence' : 'Passer à la formule Agence'}
          </div>
          <div style={{ fontSize: '12px', color: T.mid, maxWidth: '460px', lineHeight: 1.6 }}>
            {profile?.plan === 'agence'
              ? 'L\'abonnement restera actif jusqu\'à la prochaine date de renouvellement. Aucun remboursement prorata.'
              : 'Annonces illimitées + FR/EN + réseaux sociaux pour 65€/mois sans engagement.'}
          </div>
        </div>
        <button
          onClick={() => showToast(profile?.plan === 'agence' ? 'Résiliation — bientôt disponible' : 'Paiement Stripe — bientôt disponible')}
          style={{ padding: '7px 16px', background: 'transparent', border: `1px solid rgba(193,18,31,0.3)`, color: T.err, fontFamily: "'DM Sans', sans-serif", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}
        >
          {profile?.plan === 'agence' ? 'Résilier l\'abonnement' : 'Passer à Agence — 65€/mois'}
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════
// SECTION COMMANDE
// ═══════════════════════════════════════════════════
function SectionCommande({ profile }: { profile: Profile | null }) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const plans = [
    { id: 'basique', name: 'Basique', price: '5€', unit: '/ annonce', features: ['Version française', 'Version réseaux sociaux', 'Liens de partage'] },
    { id: 'essentiel', name: 'Essentiel', price: '9,99€', unit: '/ annonce', features: ['Version FR + EN', 'Version réseaux sociaux', 'Export PDF', 'Liens de partage'], recommended: true },
    { id: 'agence', name: 'Agence', price: '65€', unit: '/ mois', features: ['Illimité — abonnement actif'], disabled: profile?.plan !== 'agence' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <SectionHeader title="Nouvelle" accent="commande" sub="Générez une annonce professionnelle en quelques secondes" />

      {/* Formule active */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}` }}>
        <div style={{ padding: '16px 24px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.mid }}>Votre formule active</span>
          <Badge type="gold">Agence · 65€/mois</Badge>
        </div>
        <div style={{ padding: '20px 24px', fontSize: '13px', color: T.mid, lineHeight: 1.7 }}>
          Vous êtes sur la <strong style={{ color: T.dark }}>Formule {profile?.plan ?? 'Basique'}</strong> — vos annonces sont incluses dans votre abonnement.
          Versions <strong style={{ color: T.dark }}>FR + EN + réseaux sociaux</strong> disponibles.
        </div>
      </div>

      {/* Plans */}
      <div>
        <div style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: T.mid, marginBottom: '16px' }}>
          Ou commander à l'unité
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: T.border }}>
          {plans.map(plan => (
            <div
              key={plan.id}
              onClick={() => !plan.disabled && setSelectedPlan(plan.id)}
              style={{
                background: selectedPlan === plan.id ? 'rgba(201,169,110,0.1)' : T.surface,
                padding: '28px 24px', cursor: plan.disabled ? 'not-allowed' : 'pointer',
                display: 'flex', flexDirection: 'column', gap: '10px',
                border: `2px solid ${selectedPlan === plan.id ? T.gold : 'transparent'}`,
                opacity: plan.disabled ? 0.5 : 1,
                position: 'relative', transition: 'background 0.15s',
              }}
            >
              {plan.recommended && (
                <div style={{ position: 'absolute', top: '-1px', right: '-1px', background: T.gold, color: T.bg, fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '4px 10px', fontWeight: 500 }}>
                  Populaire
                </div>
              )}
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 400 }}>{plan.name}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 300, color: T.gold }}>
                {plan.price} <span style={{ fontSize: '12px', fontFamily: "'DM Sans', sans-serif", color: T.mid }}>{plan.unit}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '4px' }}>
                {plan.features.map(f => (
                  <div key={f} style={{ fontSize: '12px', color: T.mid, display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <span style={{ color: T.gold, fontSize: '10px' }}>—</span>{f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <a href="/app" style={{ padding: '11px 24px', background: T.gold, color: T.bg, textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          ✦ Générer une annonce
        </a>
        <span style={{ fontSize: '11px', color: T.mid }}>Délai moyen : moins de 30 secondes</span>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════
// SECTION FACTURES
// ═══════════════════════════════════════════════════
function SectionFactures() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <SectionHeader title="Mes" accent="factures" sub="Historique complet de vos paiements" />

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: T.border }}>
        {[
          { label: 'Total facturé 2026', value: '—', sub: 'Stripe bientôt disponible' },
          { label: 'Abonnements réglés', value: '—', sub: 'En attente' },
          { label: 'Annonces à l\'unité', value: '—', sub: 'En attente' },
        ].map(kpi => (
          <div key={kpi.label} style={{ background: T.surface, padding: '24px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: T.mid, marginBottom: '8px' }}>{kpi.label}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: 300, lineHeight: 1 }}>{kpi.value}</div>
            <div style={{ fontSize: '11px', color: T.mid, marginTop: '4px' }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background: T.surface, border: `1px solid ${T.border}`, padding: '48px', textAlign: 'center', color: T.mid }}>
        <div style={{ fontSize: '24px', marginBottom: '12px' }}>🧾</div>
        <div style={{ fontSize: '14px' }}>Historique de facturation disponible après intégration Stripe.</div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════
// SECTION SUPPORT
// ═══════════════════════════════════════════════════
function SectionSupport({ showToast }: { showToast: (m: string, t?: string) => void }) {
  const [subject, setSubject] = useState('Problème technique')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  async function handleSend() {
    if (!message.trim()) return
    setSending(true)
    await new Promise(r => setTimeout(r, 800))
    setSending(false)
    setMessage('')
    showToast('Message envoyé — réponse sous 24h', 'ok')
  }

  const faqs = [
    { q: 'Comment fonctionne la génération d\'annonces ?', a: 'Vous renseignez les caractéristiques du bien et notre IA génère une annonce professionnelle en moins de 30 secondes, en français et en anglais, avec une version réseaux sociaux.' },
    { q: 'Puis-je modifier l\'annonce générée ?', a: 'Oui. L\'annonce est entièrement modifiable depuis votre espace client. Vous pouvez copier et télécharger la version souhaitée.' },
    { q: 'Comment résilier la formule Agence ?', a: 'Depuis la section "Mon abonnement". La résiliation prend effet à la prochaine date d\'anniversaire. Aucun remboursement prorata.' },
    { q: 'Mes annonces sont-elles confidentielles ?', a: 'Oui. Vos annonces ne sont jamais partagées ou revendues. Redac-Immo est conforme RGPD.' },
    { q: 'Puis-je obtenir une facture au nom de ma société ?', a: 'Oui. Renseignez votre SIRET dans la section "Mon compte" — toutes vos factures seront émises au nom de votre société.' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <SectionHeader title="" accent="Support" sub="Notre équipe vous répond sous 24h." />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Formulaire */}
          <Card title="Formulaire de contact">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Field label="Sujet">
                <select value={subject} onChange={e => setSubject(e.target.value)} style={inputStyle}>
                  <option>Problème technique</option>
                  <option>Question sur ma facture</option>
                  <option>Question sur mon abonnement</option>
                  <option>Suggestion d'amélioration</option>
                  <option>Autre</option>
                </select>
              </Field>
              <Field label="Message">
                <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} style={{ ...inputStyle, resize: 'vertical' as const }} placeholder="Décrivez votre question…" />
              </Field>
              <Btn onClick={handleSend} disabled={sending || !message.trim()}>
                {sending ? 'Envoi…' : 'Envoyer le message'}
              </Btn>
            </div>
          </Card>

          {/* FAQ */}
          <Card title="Questions fréquentes">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ borderBottom: i < faqs.length - 1 ? `1px solid ${T.border}` : 'none' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ padding: '16px 0', fontSize: '13px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', width: '100%', textAlign: 'left', fontFamily: "'DM Sans', sans-serif", color: T.dark, transition: 'color 0.15s' }}
                  >
                    {faq.q}
                    <svg style={{ width: '16px', height: '16px', flexShrink: 0, transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(180deg)' : 'none' }} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 6l4 4 4-4"/>
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div style={{ paddingBottom: '16px', fontSize: '13px', color: T.mid, lineHeight: 1.7 }}>{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </Card>

        </div>

        {/* Contact card */}
        <div style={{ background: T.bg, padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '80px' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 300 }}>
            Besoin d'une <em style={{ fontStyle: 'italic', color: T.gold }}>réponse rapide</em> ?
          </div>
          <div style={{ fontSize: '12px', color: '#888', lineHeight: 1.6 }}>
            Notre équipe est disponible pour vous accompagner sur toute question technique, commerciale ou relative à votre compte.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={() => showToast('Redirection vers la messagerie…')} style={{ padding: '11px 24px', background: T.gold, color: T.bg, border: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 500, width: '100%' }}>
              Envoyer un e-mail
            </button>
            <button onClick={() => showToast('FAQ complète — bientôt disponible')} style={{ padding: '11px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#AAA', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer', width: '100%' }}>
              Voir la FAQ complète →
            </button>
          </div>
          <div style={{ fontSize: '11px', color: T.mid, padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ marginBottom: '4px', color: '#666', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Horaires</div>
            Lun — Ven · 9h → 18h (CET)<br />
            <span style={{ color: '#555' }}>Réponse garantie sous 24h ouvrées</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════
// PRIMITIVES
// ═══════════════════════════════════════════════════
function SectionHeader({ title, accent, sub }: { title: string; accent: string; sub: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: 300, lineHeight: 1 }}>
        {title} <em style={{ fontStyle: 'italic', color: T.gold }}>{accent}</em>
      </h1>
      <p style={{ fontSize: '12px', color: T.mid }}>{sub}</p>
    </div>
  )
}

function Card({ title, children, badge }: { title: string; children: React.ReactNode; badge?: React.ReactNode }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}` }}>
      <div style={{ padding: '20px 28px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: T.mid }}>{title}</span>
        {badge}
      </div>
      <div style={{ padding: '28px' }}>{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
      <label style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: T.mid }}>{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, disabled, placeholder }: { value: string; onChange?: (v: string) => void; disabled?: boolean; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange?.(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      style={{ ...inputStyle, opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'auto' }}
    />
  )
}

function Btn({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '11px 24px', background: disabled ? T.goldDim : T.gold,
      color: T.bg, border: 'none', fontFamily: "'DM Sans', sans-serif",
      fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase',
      cursor: disabled ? 'not-allowed' : 'pointer', fontWeight: 500,
    }}>
      {children}
    </button>
  )
}

function Badge({ type, children }: { type: 'ok' | 'err' | 'gold' | 'mid'; children: React.ReactNode }) {
  const styles = {
    ok:   { bg: T.okBg,                       color: T.ok,  dot: T.ok   },
    err:  { bg: T.errBg,                       color: T.err, dot: T.err  },
    gold: { bg: 'rgba(201,169,110,0.12)',       color: T.goldD, dot: T.gold },
    mid:  { bg: 'rgba(107,107,101,0.2)',        color: T.mid, dot: T.mid  },
  }[type]

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 10px', background: styles.bg, color: styles.color, fontWeight: 500 }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: styles.dot, display: 'inline-block' }} />
      {children}
    </span>
  )
}

function StatusBadge({ statut }: { statut: string }) {
  const config = {
    encours: { type: 'gold' as const, label: 'En cours' },
    vendu:   { type: 'ok'   as const, label: 'Vendu'    },
    archive: { type: 'mid'  as const, label: 'Archivé'  },
  }[statut] ?? { type: 'mid' as const, label: statut }

  return <Badge type={config.type}>{config.label}</Badge>
}

const inputStyle: React.CSSProperties = {
  background: T.bg2, border: `1px solid ${T.border}`,
  color: T.dark, fontFamily: "'DM Sans', sans-serif",
  fontSize: '13px', padding: '11px 14px', outline: 'none', width: '100%',
}

const outlineBtnStyle: React.CSSProperties = {
  padding: '7px 16px', background: 'transparent',
  border: `1px solid ${T.border}`, color: T.mid,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
}
