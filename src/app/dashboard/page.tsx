import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const service = createServiceClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // ✅ Utiliser le service role pour bypasser le RLS
  const { data: profile } = await service
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // ✅ Utiliser le service role pour bypasser le RLS sur les annonces aussi
  const { data: annonces } = await service
    .from('annonces')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <DashboardClient
      user={user}
      profile={profile}
      annonces={annonces ?? []}
    />
  )
}