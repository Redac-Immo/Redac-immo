import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminClient from './AdminClient'

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  const { data: annonces } = await supabase
    .from('annonces')
    .select('*, profiles(prenom, nom, agence)')
    .order('created_at', { ascending: false })
    .limit(100)

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <AdminClient
      adminProfile={profile}
      annonces={annonces ?? []}
      users={profiles ?? []}
    />
  )
}
