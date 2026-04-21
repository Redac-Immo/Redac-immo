import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import AdminClient from './AdminClient'

// ✅ Pagination : 20 clients par page
const CLIENTS_PER_PAGE = 20

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  // ✅ Récupérer la page depuis l'URL (ex: /admin?page=2)
  const params = await searchParams
  const currentPage = Math.max(1, parseInt(params.page ?? '1'))
  const start = (currentPage - 1) * CLIENTS_PER_PAGE
  const end = start + CLIENTS_PER_PAGE - 1

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
    .range(start, end)

  // Récupérer les auth users correspondants
  const userIds = (profiles ?? []).map(p => p.id)
  const { data: { users: authUsers } } = await service.auth.admin.listUsers({
    perPage: CLIENTS_PER_PAGE,
  })

  // Récupération des annonces pour compter par client
  const { data: annonces } = await service
    .from('annonces')
    .select('user_id')
    .in('user_id', userIds)

  // Fusion profils + auth
  const clients = (profiles ?? []).map(profile => {
    const authUser = authUsers.find(u => u.id === profile.id)
    const nbAnnonces = (annonces ?? []).filter(a => a.user_id === profile.id).length
    return {
      ...profile,
      email: authUser?.email ?? '',
      last_sign_in_at: authUser?.last_sign_in_at ?? null,
      nb_annonces: nbAnnonces,
    }
  })

  // Récupération de TOUTES les annonces pour les KPIs globaux
  const { data: allAnnonces } = await service
    .from('annonces')
    .select('*')
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

  // Calcul des KPIs
  const totalPages = Math.ceil((totalClients ?? 0) / CLIENTS_PER_PAGE)

  const kpis = {
    totalClients: totalClients ?? 0,
    clientsActifs: totalActifs ?? 0,
    clientsBloqués: totalBloques ?? 0,
    annoncesTotal: (allAnnonces ?? []).length,
    announcesThisMonth: (allAnnonces ?? []).filter(a => a.created_at >= startOfMonth).length,
    newClientsThisWeek: 0, // Sera calculé côté client ou via une autre requête si nécessaire
    mrr: 0, // Sera calculé dans AdminClient
  }

  return (
    <AdminClient
      adminProfile={adminProfile}
      clients={clients}
      annonces={allAnnonces ?? []}
      kpis={kpis}
      pagination={{
        currentPage,
        totalPages,
        totalClients: totalClients ?? 0,
      }}
    />
  )
}