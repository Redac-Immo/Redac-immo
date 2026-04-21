import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import AdminClient from './AdminClient'

export default async function AdminPage() {
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

  // Récupération des clients (profils + auth)
  const { data: profiles } = await service
    .from('profiles')
    .select('*')
    .eq('role', 'client')
    .order('created_at', { ascending: false })

  const { data: { users: authUsers } } = await service.auth.admin.listUsers({
    perPage: 1000,
  })

  // Récupération des annonces
  const { data: annonces } = await service
    .from('annonces')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500)

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

  // Dates pour les KPIs
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

  // ✅ MRR CORRIGÉ : uniquement Agence et Fondateur avec statut 'active'
  const mrr = clients.reduce((acc, c) => {
    if (c.plan === 'agence' && c.subscription_status === 'active') {
      return acc + 65
    }
    if (c.plan === 'fondateur' && c.subscription_status === 'active') {
      return acc + 50
    }
    // Essentiel et Basique sont des paiements uniques → pas de MRR
    return acc
  }, 0)

  const kpis = {
    totalClients: clients.length,
    clientsActifs: clients.filter(c => !c.blocked).length,
    clientsBloqués: clients.filter(c => c.blocked).length,
    annoncesTotal: (annonces ?? []).length,
    announcesThisMonth: (annonces ?? []).filter(a => a.created_at >= startOfMonth).length,
    newClientsThisWeek: clients.filter(c => c.created_at >= startOfWeek).length,
    mrr, // ✅ Corrigé
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