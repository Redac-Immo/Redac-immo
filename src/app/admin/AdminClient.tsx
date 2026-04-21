'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { T } from '@/lib/design-tokens'

// ─── TYPES ──────────────────────────────────────────────────────────────────────

interface Client {
  id: string
  prenom: string | null
  nom: string | null
  agence: string | null
  plan: string
  role: string
  blocked: boolean
  created_at: string
  email: string
  last_sign_in_at: string | null
  nb_annonces: number
}

interface Annonce {
  id: string
  user_id: string
  bien: string
  prix: string
  localisation: string
  formule: string
  fr: string
  en: string
  short: string
  statut: string
  created_at: string
}

interface KPIs {
  totalClients: number
  clientsActifs: number
  clientsBloqués: number
  annoncesTotal: number
  announcesThisMonth: number
  newClientsThisWeek: number
  mrr: number
}

interface Props {
  adminProfile: { prenom: string | null; nom: string | null }
  clients: Client[]
  annonces: Annonce[]
  kpis: KPIs
}

type Section = 'overview' | 'clients' | 'annonces' | 'logs'

// ✅ Email admin depuis variable d'environnement (fallback sécurisé)
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'contact@redac-immo.fr'

// ─── HELPERS ────────────────────────────────────────────────────────────────────

function callApi(endpoint: string, body: Record<string, unknown>) {
  return fetch(`/api/admin/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function clientName(c: Client) {
  return [c.prenom, c.nom].filter(Boolean).join(' ') || '—'
}

function exportCSV(data: Record<string, unknown>[], filename: string) {
  if (!data.length) return
  const headers = Object.keys(data[0])
  const rows = data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────────

export default function AdminClient({ adminProfile, clients, annonces, kpis }: Props) {
  const [section, setSection] = useState<Section>('overview')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [localClients, setLocalClients] = useState<Client[]>(clients)
  const [localAnnonces, setLocalAnnonces] = useState<Annonce[]>(annonces)
  const [toast, setToast] = useState<{ msg: string; type?: 'ok' | 'err' } | null>(null)
  const [modal, setModal] = useState<{ type: string; client?: Client; annonce?: Annonce } | null>(null)

  function showToast(msg: string, type: 'ok' | 'err' = 'ok') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  // ─── ACTIONS ──────────────────────────────────────────────────────────────────

  async function blockUser(client: Client) {
    const res = await callApi('users/block', { userId: client.id })
    if (!res.ok) { showToast('Erreur lors du blocage', 'err'); return }
    setLocalClients(prev => prev.map(c => c.id === client.id ? { ...c, blocked: true } : c))
    if (selectedClient?.id === client.id) setSelectedClient(prev => prev ? { ...prev, blocked: true } : null)
    showToast(`${clientName(client)} bloqué`)
    setModal(null)
  }

  async function unblockUser(client: Client) {
    const res = await callApi('users/unblock', { userId: client.id })
    if (!res.ok) { showToast('Erreur lors du déblocage', 'err'); return }
    setLocalClients(prev => prev.map(c => c.id === client.id ? { ...c, blocked: false } : c))
    if (selectedClient?.id === client.id) setSelectedClient(prev => prev ? { ...prev, blocked: false } : null)
    showToast(`${clientName(client)} débloqué`)
    setModal(null)
  }

  async function deleteUser(client: Client) {
    const res = await callApi('users/delete', { userId: client.id })
    if (!res.ok) { showToast('Erreur lors de la suppression', 'err'); return }
    setLocalClients(prev => prev.filter(c => c.id !== client.id))
    setLocalAnnonces(prev => prev.filter(a => a.user_id !== client.id))
    setSelectedClient(null)
    showToast(`Compte supprimé`)
    setModal(null)
  }

  async function changePlan(client: Client, plan: string) {
    const res = await callApi('users/change-plan', { userId: client.id, plan })
    if (!res.ok) { showToast('Erreur changement de formule', 'err'); return }
    setLocalClients(prev => prev.map(c => c.id === client.id ? { ...c, plan } : c))
    if (selectedClient?.id === client.id) setSelectedClient(prev => prev ? { ...prev, plan } : null)
    showToast(`Formule mise à jour → ${plan}`)
    setModal(null)
  }

  async function deleteAnnonce(annonce: Annonce) {
    const res = await callApi('annonces/delete', { annonceId: annonce.id })
    if (!res.ok) { showToast('Erreur suppression annonce', 'err'); return }
    setLocalAnnonces(prev => prev.filter(a => a.id !== annonce.id))
    setLocalClients(prev => prev.map(c =>
      c.id === annonce.user_id ? { ...c, nb_annonces: c.nb_annonces - 1 } : c
    ))
    showToast('Annonce supprimée')
    setModal(null)
  }

  // ─── RENDER ───────────────────────────────────────────────────────────────────

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: T.bg, color: T.dark, fontFamily: "'DM Sans', sans-serif" }}>

      {/* SIDEBAR */}
      <aside style={{ width: '220px', background: T.bg2, borderRight: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'fixed', top: 0, bottom: 0 }}>
        <div style={{ padding: '28px 24px', borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: T.dark }}>
            Redac<span style={{ fontStyle: 'italic', color: T.gold, fontWeight: 300 }}>Immo</span>
          </div>
          <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.gold, marginTop: '4px' }}>Admin</div>
        </div>

        <nav style={{ flex: 1, padding: '16px 0' }}>
          {([
            { key: 'overview', label: 'Vue d\'ensemble', icon: '◈' },
            { key: 'clients',  label: 'Clients',         icon: '◎' },
            { key: 'annonces', label: 'Annonces',        icon: '≡' },
          ] as { key: Section; label: string; icon: string }[]).map(({ key, label, icon }) => (
            <button key={key} onClick={() => { setSection(key); setSelectedClient(null) }} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              width: '100%', padding: '12px 24px', border: 'none',
              background: section === key ? T.goldBg : 'transparent',
              borderLeft: `2px solid ${section === key ? T.gold : 'transparent'}`,
              color: section === key ? T.gold : '#555',
              fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase',
              cursor: 'pointer', textAlign: 'left', fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.15s',
            }}>
              <span>{icon}</span>{label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '16px 24px', borderTop: `1px solid ${T.border}` }}>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '10px' }}>
            {adminProfile.prenom} {adminProfile.nom}
          </div>
          <button onClick={handleSignOut} style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: "'DM Sans', sans-serif" }}>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, marginLeft: '220px', overflow: 'auto' }}>

        {/* OVERVIEW */}
        {section === 'overview' && (
          <SectionOverview kpis={kpis} clients={localClients} annonces={localAnnonces} onExportClients={() => exportCSV(localClients.map(c => ({ nom: clientName(c), email: c.email, plan: c.plan, blocked: c.blocked, inscrit: formatDate(c.created_at), annonces: c.nb_annonces })), 'clients.csv')} />
        )}

        {/* CLIENTS */}
        {section === 'clients' && !selectedClient && (
          <SectionClients
            clients={localClients}
            onSelect={setSelectedClient}
            onExport={() => exportCSV(localClients.map(c => ({ nom: clientName(c), email: c.email, plan: c.plan, blocked: c.blocked, inscrit: formatDate(c.created_at), annonces: c.nb_annonces })), 'clients.csv')}
          />
        )}

        {/* FICHE CLIENT */}
        {section === 'clients' && selectedClient && (
          <FicheClient
            client={selectedClient}
            annonces={localAnnonces.filter(a => a.user_id === selectedClient.id)}
            onBack={() => setSelectedClient(null)}
            onBlock={() => setModal({ type: 'block', client: selectedClient })}
            onUnblock={() => unblockUser(selectedClient)}
            onDelete={() => setModal({ type: 'delete', client: selectedClient })}
            onChangePlan={(plan) => changePlan(selectedClient, plan)}
            onReadAnnonce={(a) => setModal({ type: 'read-annonce', annonce: a })}
            showToast={showToast}
          />
        )}

        {/* ANNONCES */}
        {section === 'annonces' && (
          <SectionAnnonces
            annonces={localAnnonces}
            clients={localClients}
            onDelete={(a) => setModal({ type: 'delete-annonce', annonce: a })}
            onRead={(a) => setModal({ type: 'read-annonce', annonce: a })}
            onExport={() => exportCSV(localAnnonces.map(a => ({ bien: a.bien, localisation: a.localisation, formule: a.formule, statut: a.statut, date: formatDate(a.created_at) })), 'annonces.csv')}
          />
        )}

      </main>

      {/* MODALES */}
      {modal && (
        <Modal onClose={() => setModal(null)}>
          {modal.type === 'block' && modal.client && (
            <ConfirmModal
              title="Bloquer le compte"
              message={`Bloquer le compte de ${clientName(modal.client)} ? L'utilisateur ne pourra plus se connecter.`}
              danger
              onConfirm={() => blockUser(modal.client!)}
              onCancel={() => setModal(null)}
            />
          )}
          {modal.type === 'delete' && modal.client && (
            <ConfirmModal
              title="Supprimer le compte"
              message={`Supprimer définitivement le compte de ${clientName(modal.client)} et toutes ses annonces ? Cette action est irréversible.`}
              danger
              confirmLabel="Supprimer définitivement"
              onConfirm={() => deleteUser(modal.client!)}
              onCancel={() => setModal(null)}
            />
          )}
          {modal.type === 'delete-annonce' && modal.annonce && (
            <ConfirmModal
              title="Supprimer l'annonce"
              message={`Supprimer l'annonce "${modal.annonce.bien}" ? Cette action est irréversible.`}
              danger
              onConfirm={() => deleteAnnonce(modal.annonce!)}
              onCancel={() => setModal(null)}
            />
          )}
          {modal.type === 'read-annonce' && modal.annonce && (
            <AnnonceModal annonce={modal.annonce} onClose={() => setModal(null)} />
          )}
        </Modal>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '32px', right: '32px', zIndex: 9999,
          background: T.surface, color: T.dark, padding: '14px 24px', fontSize: '13px',
          borderLeft: `3px solid ${toast.type === 'err' ? T.err : T.ok}`,
          maxWidth: '340px', animation: 'slideUp 0.3s ease',
        }}>
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════════

function SectionOverview({ kpis, clients, annonces, onExportClients }: {
  kpis: KPIs
  clients: Client[]
  annonces: Annonce[]
  onExportClients: () => void
}) {
  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontWeight: 300 }}>Vue d'ensemble</h1>
          <p style={{ fontSize: '12px', color: T.mid, marginTop: '4px' }}>Tableau de bord en temps réel</p>
        </div>
        <button onClick={onExportClients} style={outlineBtn}>Exporter clients CSV</button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px', background: T.border, marginBottom: '48px' }}>
        {[
          { label: 'Total clients', value: kpis.totalClients, color: T.dark },
          { label: 'Clients actifs', value: kpis.clientsActifs, color: T.ok },
          { label: 'Annonces ce mois', value: kpis.announcesThisMonth, color: T.gold },
          { label: 'MRR estimé', value: `${kpis.mrr.toFixed(0)}€`, color: T.gold },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: T.surface, padding: '28px 24px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: T.mid, marginBottom: '12px' }}>{label}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '48px', fontWeight: 300, color, lineHeight: 1 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Stats secondaires */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', background: T.border, marginBottom: '48px' }}>
        {[
          { label: 'Clients bloqués', value: kpis.clientsBloqués, color: T.err },
          { label: 'Nouveaux cette semaine', value: kpis.newClientsThisWeek, color: T.dark },
          { label: 'Annonces total', value: kpis.annoncesTotal, color: T.dark },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: T.surface, padding: '22px 24px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: T.mid, marginBottom: '8px' }}>{label}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: 300, color, lineHeight: 1 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Derniers clients */}
      <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.mid, marginBottom: '16px' }}>
        Derniers inscrits
      </div>
      <ClientTable clients={clients.slice(0, 8)} onSelect={() => {}} mini />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION CLIENTS
// ═══════════════════════════════════════════════════════════════════════════════

function SectionClients({ clients, onSelect, onExport }: {
  clients: Client[]
  onSelect: (c: Client) => void
  onExport: () => void
}) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'actif' | 'bloqué' | 'basique' | 'essentiel' | 'agence'>('all')
  const [sortBy, setSortBy] = useState<'created_at' | 'nom' | 'nb_annonces'>('created_at')

  const filtered = useMemo(() => {
    let list = [...clients]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        clientName(c).toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.agence ?? '').toLowerCase().includes(q)
      )
    }
    if (filter === 'actif') list = list.filter(c => !c.blocked)
    if (filter === 'bloqué') list = list.filter(c => c.blocked)
    if (['basique', 'essentiel', 'agence'].includes(filter)) list = list.filter(c => c.plan === filter)
    list.sort((a, b) => {
      if (sortBy === 'nom') return clientName(a).localeCompare(clientName(b))
      if (sortBy === 'nb_annonces') return b.nb_annonces - a.nb_annonces
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
    return list
  }, [clients, search, filter, sortBy])

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontWeight: 300 }}>Clients</h1>
          <p style={{ fontSize: '12px', color: T.mid, marginTop: '4px' }}>{filtered.length} client{filtered.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={onExport} style={outlineBtn}>Exporter CSV</button>
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Rechercher nom, email, agence…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, maxWidth: '280px' }}
        />
        <select value={filter} onChange={e => setFilter(e.target.value as typeof filter)} style={inputStyle}>
          <option value="all">Tous</option>
          <option value="actif">Actifs</option>
          <option value="bloqué">Bloqués</option>
          <option value="basique">Basique</option>
          <option value="essentiel">Essentiel</option>
          <option value="agence">Agence</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} style={inputStyle}>
          <option value="created_at">Tri : Date inscription</option>
          <option value="nom">Tri : Nom</option>
          <option value="nb_annonces">Tri : Nb annonces</option>
        </select>
      </div>

      <ClientTable clients={filtered} onSelect={onSelect} />
    </div>
  )
}

// ─── TABLE CLIENTS ──────────────────────────────────────────────────────────────

function ClientTable({ clients, onSelect, mini = false }: { clients: Client[]; onSelect: (c: Client) => void; mini?: boolean }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: `1px solid ${T.border}` }}>
          {['Nom', 'Email', !mini && 'Agence', 'Formule', 'Annonces', 'Inscrit', 'Statut'].filter(Boolean).map(h => (
            <th key={h as string} style={thStyle}>{h}</th>
          ))}
          {!mini && <th style={thStyle}></th>}
        </tr>
      </thead>
      <tbody>
        {clients.map(c => (
          <tr
            key={c.id}
            onClick={() => onSelect(c)}
            style={{ borderBottom: `1px solid rgba(255,255,255,0.04)`, cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = T.goldBg)}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <td style={tdStyle}>{clientName(c)}</td>
            <td style={{ ...tdStyle, color: T.mid, fontSize: '12px' }}>{c.email}</td>
            {!mini && <td style={{ ...tdStyle, color: T.mid }}>{c.agence || '—'}</td>}
            <td style={tdStyle}><PlanBadge plan={c.plan} /></td>
            <td style={{ ...tdStyle, color: T.mid }}>{c.nb_annonces}</td>
            <td style={{ ...tdStyle, color: T.mid, fontSize: '12px' }}>{formatDate(c.created_at)}</td>
            <td style={tdStyle}><StatusBadge blocked={c.blocked} /></td>
            {!mini && <td style={tdStyle}><span style={{ fontSize: '11px', color: T.gold }}>Voir →</span></td>}
          </tr>
        ))}
        {clients.length === 0 && (
          <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: T.mid }}>Aucun client</td></tr>
        )}
      </tbody>
    </table>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// FICHE CLIENT
// ═══════════════════════════════════════════════════════════════════════════════

function FicheClient({ client, annonces, onBack, onBlock, onUnblock, onDelete, onChangePlan, onReadAnnonce, showToast }: {
  client: Client
  annonces: Annonce[]
  onBack: () => void
  onBlock: () => void
  onUnblock: () => void
  onDelete: () => void
  onChangePlan: (plan: string) => void
  onReadAnnonce: (a: Annonce) => void
  showToast: (msg: string, type?: 'ok' | 'err') => void
}) {
  return (
    <div style={{ padding: '40px 48px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={onBack} style={{ ...outlineBtn, padding: '6px 14px', fontSize: '11px' }}>← Retour</button>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 300 }}>{clientName(client)}</h1>
          <p style={{ fontSize: '12px', color: T.mid, marginTop: '2px' }}>{client.email}</p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <StatusBadge blocked={client.blocked} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* Panel infos + actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Infos */}
          <div style={{ background: T.surface, border: `1px solid ${T.border}` }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.border}` }}>
              <span style={labelStyle}>Informations</span>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Agence', value: client.agence || '—' },
                { label: 'Formule', value: <PlanBadge plan={client.plan} /> },
                { label: 'Inscription', value: formatDate(client.created_at) },
                { label: 'Dernière connexion', value: formatDate(client.last_sign_in_at) },
                { label: 'Annonces générées', value: String(annonces.length) },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: T.mid }}>{label}</span>
                  <span style={{ fontSize: '13px' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Changer formule */}
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, padding: '20px' }}>
            <div style={{ ...labelStyle, marginBottom: '12px', display: 'block' }}>Changer la formule</div>
            <select
              defaultValue={client.plan}
              onChange={e => onChangePlan(e.target.value)}
              style={{ ...inputStyle, width: '100%' }}
            >
              <option value="basique">Basique — 5€</option>
              <option value="essentiel">Essentiel — 9,99€</option>
              <option value="agence">Agence — 65€/mois</option>
            </select>
          </div>

          {/* Actions */}
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ ...labelStyle, marginBottom: '4px', display: 'block' }}>Actions</div>
            <a
              href={`mailto:${ADMIN_EMAIL}?subject=Votre compte Redac-Immo&to=${client.email}`}
              style={{ ...outlineBtn, textAlign: 'center', textDecoration: 'none', display: 'block' }}
            >
              ✉ Envoyer un email
            </a>
            {client.blocked ? (
              <button onClick={onUnblock} style={{ ...outlineBtn, color: T.ok, borderColor: 'rgba(74,222,128,0.3)' }}>
                ✅ Débloquer le compte
              </button>
            ) : (
              <button onClick={onBlock} style={{ ...outlineBtn, color: T.err, borderColor: 'rgba(248,113,113,0.3)' }}>
                ⛔ Bloquer le compte
              </button>
            )}
            <button onClick={onDelete} style={{ ...outlineBtn, color: T.err, borderColor: 'rgba(248,113,113,0.3)' }}>
              🗑 Supprimer le compte
            </button>
          </div>

        </div>

        {/* Annonces du client */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}` }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.border}` }}>
            <span style={labelStyle}>Annonces ({annonces.length})</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                {['Bien', 'Localisation', 'Formule', 'Date', 'Statut', ''].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {annonces.map(a => (
                <tr key={a.id} style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                  <td style={{ ...tdStyle, maxWidth: '180px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.bien}</div>
                  </td>
                  <td style={{ ...tdStyle, color: T.mid, fontSize: '12px' }}>{a.localisation}</td>
                  <td style={tdStyle}><PlanBadge plan={a.formule} /></td>
                  <td style={{ ...tdStyle, color: T.mid, fontSize: '12px' }}>{formatDate(a.created_at)}</td>
                  <td style={tdStyle}><StatutBadge statut={a.statut} /></td>
                  <td style={tdStyle}>
                    <button onClick={() => onReadAnnonce(a)} style={{ ...outlineBtn, padding: '4px 10px', fontSize: '10px' }}>Lire</button>
                  </td>
                </tr>
              ))}
              {annonces.length === 0 && (
                <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: T.mid }}>Aucune annonce</td></tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION ANNONCES GLOBALES
// ═══════════════════════════════════════════════════════════════════════════════

function SectionAnnonces({ annonces, clients, onDelete, onRead, onExport }: {
  annonces: Annonce[]
  clients: Client[]
  onDelete: (a: Annonce) => void
  onRead: (a: Annonce) => void
  onExport: () => void
}) {
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState('all')
  const [filterFormule, setFilterFormule] = useState('all')

  const filtered = useMemo(() => {
    return annonces.filter(a => {
      if (filterStatut !== 'all' && a.statut !== filterStatut) return false
      if (filterFormule !== 'all' && a.formule !== filterFormule) return false
      if (search) {
        const q = search.toLowerCase()
        return a.bien.toLowerCase().includes(q) || a.localisation.toLowerCase().includes(q)
      }
      return true
    })
  }, [annonces, search, filterStatut, filterFormule])

  function getClientName(userId: string) {
    const c = clients.find(c => c.id === userId)
    return c ? clientName(c) : '—'
  }

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontWeight: 300 }}>Annonces</h1>
          <p style={{ fontSize: '12px', color: T.mid, marginTop: '4px' }}>{filtered.length} annonce{filtered.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={onExport} style={outlineBtn}>Exporter CSV</button>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <input type="text" placeholder="Rechercher bien ou localisation…" value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: '280px' }} />
        <select value={filterStatut} onChange={e => setFilterStatut(e.target.value)} style={inputStyle}>
          <option value="all">Tous statuts</option>
          <option value="encours">En cours</option>
          <option value="vendu">Vendues</option>
          <option value="archive">Archivées</option>
        </select>
        <select value={filterFormule} onChange={e => setFilterFormule(e.target.value)} style={inputStyle}>
          <option value="all">Toutes formules</option>
          <option value="basique">Basique</option>
          <option value="essentiel">Essentiel</option>
          <option value="agence">Agence</option>
        </select>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${T.border}` }}>
            {['Bien', 'Client', 'Localisation', 'Formule', 'Date', 'Statut', ''].map(h => (
              <th key={h} style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map(a => (
            <tr key={a.id} style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
              <td style={{ ...tdStyle, maxWidth: '200px' }}>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.bien}</div>
              </td>
              <td style={{ ...tdStyle, color: T.mid, fontSize: '12px' }}>{getClientName(a.user_id)}</td>
              <td style={{ ...tdStyle, color: T.mid, fontSize: '12px' }}>{a.localisation}</td>
              <td style={tdStyle}><PlanBadge plan={a.formule} /></td>
              <td style={{ ...tdStyle, color: T.mid, fontSize: '12px' }}>{formatDate(a.created_at)}</td>
              <td style={tdStyle}><StatutBadge statut={a.statut} /></td>
              <td style={{ ...tdStyle, display: 'flex', gap: '6px' }}>
                <button onClick={() => onRead(a)} style={{ ...outlineBtn, padding: '4px 10px', fontSize: '10px' }}>Lire</button>
                <button onClick={() => onDelete(a)} style={{ ...outlineBtn, padding: '4px 10px', fontSize: '10px', color: T.err, borderColor: 'rgba(248,113,113,0.3)' }}>Suppr.</button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: T.mid }}>Aucune annonce</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODALES
// ═══════════════════════════════════════════════════════════════════════════════

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
    >
      {children}
    </div>
  )
}

function ConfirmModal({ title, message, danger = false, confirmLabel = 'Confirmer', onConfirm, onCancel }: {
  title: string
  message: string
  danger?: boolean
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, padding: '32px', maxWidth: '440px', width: '100%' }}>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 400, marginBottom: '12px', color: danger ? T.err : T.dark }}>
        {title}
      </h3>
      <p style={{ fontSize: '14px', color: T.mid, lineHeight: 1.7, marginBottom: '28px' }}>{message}</p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={outlineBtn}>Annuler</button>
        <button onClick={onConfirm} style={{ ...outlineBtn, color: danger ? T.err : T.ok, borderColor: danger ? 'rgba(248,113,113,0.4)' : 'rgba(74,222,128,0.4)' }}>
          {confirmLabel}
        </button>
      </div>
    </div>
  )
}

function AnnonceModal({ annonce, onClose }: { annonce: Annonce; onClose: () => void }) {
  const [tab, setTab] = useState<'fr' | 'en' | 'short'>('fr')

  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, maxWidth: '720px', width: '100%', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px' }}>{annonce.bien}</div>
          <div style={{ fontSize: '11px', color: T.mid, marginTop: '2px' }}>{annonce.localisation} · {annonce.prix}</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.mid, fontSize: '18px' }}>✕</button>
      </div>
      <div style={{ display: 'flex', borderBottom: `1px solid ${T.border}` }}>
        {(['fr', 'en', 'short'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '10px 20px', background: 'none', border: 'none',
            borderBottom: `2px solid ${tab === t ? T.gold : 'transparent'}`,
            color: tab === t ? T.gold : T.mid,
            fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase',
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", marginBottom: '-1px',
          } as React.CSSProperties}>
            {t === 'fr' ? 'Français' : t === 'en' ? 'English' : 'Réseaux'}
          </button>
        ))}
      </div>
      <div style={{ padding: '24px', overflowY: 'auto', flex: 1, fontSize: '14px', lineHeight: 1.8, color: T.dark, whiteSpace: 'pre-wrap' }}>
        {tab === 'fr' ? annonce.fr : tab === 'en' ? (annonce.en || '— Non disponible') : (annonce.short || '— Non disponible')}
      </div>
      <div style={{ padding: '16px 24px', borderTop: `1px solid ${T.border}` }}>
        <button onClick={() => { const text = tab === 'fr' ? annonce.fr : tab === 'en' ? annonce.en : annonce.short; navigator.clipboard.writeText(text) }} style={outlineBtn}>
          Copier le texte
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// BADGES & PRIMITIVES
// ═══════════════════════════════════════════════════════════════════════════════

function StatusBadge({ blocked }: { blocked: boolean }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase',
      padding: '3px 8px',
      background: blocked ? T.errBg : T.okBg,
      color: blocked ? T.err : T.ok,
    }}>
      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: blocked ? T.err : T.ok, display: 'inline-block' }} />
      {blocked ? 'Bloqué' : 'Actif'}
    </span>
  )
}

function PlanBadge({ plan }: { plan: string }) {
  const color = plan === 'agence' ? T.gold : plan === 'essentiel' ? '#9A9A94' : '#555'
  return (
    <span style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color, border: `1px solid ${color}30`, padding: '2px 7px' }}>
      {plan}
    </span>
  )
}

function StatutBadge({ statut }: { statut: string }) {
  const map: Record<string, { color: string; bg: string }> = {
    encours: { color: T.gold, bg: 'rgba(201,169,110,0.12)' },
    vendu:   { color: T.ok,   bg: T.okBg },
    archive: { color: T.mid,  bg: 'rgba(154,154,148,0.12)' },
  }
  const s = map[statut] ?? map.archive
  return (
    <span style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: s.color, background: s.bg, padding: '2px 7px' }}>
      {statut}
    </span>
  )
}

// ─── STYLES PARTAGÉS ────────────────────────────────────────────────────────────

const thStyle: React.CSSProperties = {
  padding: '10px 16px', textAlign: 'left',
  fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
  color: T.mid, fontWeight: 400,
}

const tdStyle: React.CSSProperties = {
  padding: '14px 16px', fontSize: '13px', color: T.dark,
}

const labelStyle: React.CSSProperties = {
  fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: T.mid,
}

const inputStyle: React.CSSProperties = {
  background: T.surface, border: `1px solid ${T.border}`,
  color: T.dark, fontFamily: "'DM Sans', sans-serif",
  fontSize: '12px', padding: '9px 12px', outline: 'none',
}

const outlineBtn: React.CSSProperties = {
  padding: '8px 16px',
  background: 'transparent',
  border: `1px solid ${T.border}`,
  color: T.mid,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase',
  cursor: 'pointer',
}