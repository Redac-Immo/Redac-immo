import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import AdminClient from './AdminClient'

/**
 * /admin — Server Component
 * Vérifie le rôle admin, charge toutes les données, passe au Client Component.
 */
export default async function AdminPage() {
  const supabase = await createClient()

  // Auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Vérification rôle admin
  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!adminProfile || adminProfile.role !== 'admin') redirect('/dashboard')

  // Service role pour lire auth.users (email, last_sign_in_at)
  const service = createServiceClient()

  // Tous les profils clients
  const { data: profiles } = await service
    .from('profiles')
    .select('*')
    .eq('role', 'client')
    .order('created_at', { ascending: false })

  // Tous les utilisateurs auth (pour email + last_sign_in_at)
  const { data: { users: authUsers } } = await service.auth.admin.listUsers({
    perPage: 1000,
  })

  // Toutes les annonces
  const { data: annonces } = await service
    .from('annonces')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500)

  // Consolider profils + auth users
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

  // KPIs
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const kpis = {
    totalClients: clients.length,
    clientsActifs: clients.filter(c => !c.blocked).length,
    clientsBloqués: clients.filter(c => c.blocked).length,
    annoncesTotal: (annonces ?? []).length,
    announcesThisMonth: (annonces ?? []).filter(a => a.created_at >= startOfMonth).length,
    newClientsThisWeek: clients.filter(c => c.created_at >= startOfWeek).length,
    mrr: clients.reduce((acc, c) => {
      if (c.plan === 'agence') return acc + 65
      if (c.plan === 'essentiel') return acc + 9.99
      return acc + 5
    }, 0),
  }

  return (
    <AdminClient
      adminProfile={adminProfile}
      clients={clients}
      annonces={annonces ?? []}
      kpis={kpis}
    />
  )
}
