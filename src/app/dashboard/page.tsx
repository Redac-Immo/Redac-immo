import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: annonces } = await supabase
    .from('annonces')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  // ✅ Log APRÈS la définition de profile
  console.log('🔍 [DashboardPage] profile:', profile)

  return (
    <DashboardClient
      user={user}
      profile={profile}
      annonces={annonces ?? []}
    />
  )
}