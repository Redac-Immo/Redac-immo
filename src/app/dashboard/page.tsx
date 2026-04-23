import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Log pour debug
  console.log('🔍 [DashboardPage] user.id:', user.id)

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Log pour debug
  console.log('🔍 [DashboardPage] profile trouvé:', profile)
  if (profileError) {
    console.error('🔍 [DashboardPage] erreur profil:', profileError)
  }

  const { data: annonces } = await supabase
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