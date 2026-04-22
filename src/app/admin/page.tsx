import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import AdminClient from './AdminClient'

// ✅ Pagination : 20 éléments par page
const ITEMS_PER_PAGE = 20

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; annoncesPage?: string }>
}) {
  // ✅ Récupérer les pages depuis l'URL
  const params = await searchParams
  const currentClientsPage = Math.max(1, parseInt(params.page ?? '1'))
  const currentAnnoncesPage = Math.max(1, parseInt(params.annoncesPage ?? '1'))
  
  const clientsStart = (currentClientsPage - 1) * ITEMS_PER_PAGE
  const clientsEnd = clientsStart + ITEMS_PER_PAGE - 1
  
  const annoncesStart = (currentAnnoncesPage - 1) * ITEMS_PER_PAGE
  const annoncesEnd = annoncesStart + ITEMS_PER_PAGE - 1

  // ✅ UNE SEULE instanciation du service client
  const service = createServiceClient()
  
  // Auth classique (client standard)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  // Vérification admin
  const { data: adminProfile } = await service
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!adminProfile || adminProfile.role !== 'admin') {
    redirect('/dashboard')
  }

  // ✅ Récupération PAGINÉE des clients
  const { data: profiles, count: totalClients } = await service
    .from('profiles')
    .select('*', { count: 'exact' })
    .eq('role', 'client')
    .order('created_at', { ascending: false })
    .range(clientsStart, clientsEnd)

  // Récupérer les auth users correspondants
  const userIds = (profiles ?? []).map(p => p.id)
  const { data: { users: authUsers } } = await service.auth.admin.listUsers({
    perPage: ITEMS_PER_PAGE,
  })

  // Récupération des annonces pour compter par client
  const { data: clientAnnonces } = await service
    .from('annonces')
    .select('user_id')
    .in('user_id', userIds)

  // Fusion profils + auth
  const clients = (profiles ?? []).map(profile => {
    const authUser = authUsers.find(u => u.id === profile.id)
    const nbAnnonces = (clientAnnonces ?? []).filter(a => a.user_id === profile.id).length
    return {
      ...profile,
      email: authUser?.email ?? '',
      last_sign_in_at: authUser?.last_sign_in_at ?? null,
      nb_annonces: nbAnnonces,
    }
  })

  // ✅ Récupération PAGINÉE des annonces
  const { data: paginatedAnnonces, count: totalAnnonces } = await service
    .from('annonces')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(annoncesStart, annoncesEnd)

  // Récupération de TOUTES les annonces pour les KPIs globaux (limité à 500)
  const { data: allAnnoncesForKpi } = await service
    .from('annonces')
    .select('created_at, user_id')
    .order('created_at', { ascending: false })
    .limit(500)

  // Dates pour les KPIs
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

  // Récupérer le nombre total de clients actifs/bloqués (pour KPIs)
  const { count: totalActifs } = await service
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'client')
    .eq('blocked', false)

  const { count: totalBloques } = await service
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'client')
    .eq('blocked', true)

  // ✅ Récupérer le MRR (Monthly Recurring Revenue)
  const { data: activeSubscriptions } = await service
    .from('profiles')
    .select('plan')
    .eq('role', 'client')
    .eq('subscription_status', 'active')
    .in('plan', ['agence', 'fondateur'])

  const mrr = (activeSubscriptions ?? []).reduce((acc, p) => {
    if (p.plan === 'agence') return acc + 65
    if (p.plan === 'fondateur') return acc + 50
    return acc
  }, 0)

  // Calcul des KPIs
  const totalClientsPages = Math.ceil((totalClients ?? 0) / ITEMS_PER_PAGE)
  const totalAnnoncesPages = Math.ceil((totalAnnonces ?? 0) / ITEMS_PER_PAGE)

  const kpis = {
    totalClients: totalClients ?? 0,
    clientsActifs: totalActifs ?? 0,
    clientsBloqués: totalBloques ?? 0,
    annoncesTotal: totalAnnonces ?? 0,
    announcesThisMonth: (allAnnoncesForKpi ?? []).filter(a => a.created_at >= startOfMonth).length,
    newClientsThisWeek: 0,
    mrr,
  }

  return (
    <AdminClient
      adminProfile={adminProfile}
      clients={clients}
      annonces={paginatedAnnonces ?? []}
      kpis={kpis}
      pagination={{
        currentPage: currentClientsPage,
        totalPages: totalClientsPages,
        totalClients: totalClients ?? 0,
      }}
      annoncesPagination={{
        currentPage: currentAnnoncesPage,
        totalPages: totalAnnoncesPages,
        totalAnnonces: totalAnnonces ?? 0,
      }}
    />
  )
}