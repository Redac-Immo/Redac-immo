import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { NextResponse } from 'next/server'

/**
 * Vérifie que la requête vient d'un admin authentifié.
 * Retourne { user, error } — si error, retourner la response directement.
 */
export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      user: null,
      response: NextResponse.json({ error: 'Non autorisé' }, { status: 401 }),
    }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return {
      user: null,
      response: NextResponse.json({ error: 'Accès refusé' }, { status: 403 }),
    }
  }

  return { user, response: null }
}

/**
 * Enregistre une action admin dans admin_logs.
 * Utilise le service role pour bypasser le RLS.
 */
export async function logAdminAction({
  adminId,
  action,
  targetId,
  details,
}: {
  adminId: string
  action: string
  targetId?: string
  details?: Record<string, unknown>
}) {
  const service = createServiceClient()
  await service.from('admin_logs').insert({
    admin_id: adminId,
    action,
    target_id: targetId ?? null,
    details: details ?? null,
  })
}
