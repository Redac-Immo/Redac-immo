import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { requireAdmin, logAdminAction } from '@/lib/admin/helpers'

export async function POST(request: NextRequest) {
  const { user, response } = await requireAdmin()
  if (response) return response

  const { userId } = await request.json()
  if (!userId) return NextResponse.json({ error: 'userId requis' }, { status: 400 })

  // Empêcher l'admin de se supprimer lui-même
  if (userId === user!.id) {
    return NextResponse.json({ error: 'Impossible de supprimer son propre compte' }, { status: 400 })
  }

  const service = createServiceClient()

  // Supprimer l'utilisateur auth (cascade sur profiles + annonces via FK)
  const { error } = await service.auth.admin.deleteUser(userId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await logAdminAction({
    adminId: user!.id,
    action: 'delete_user',
    targetId: userId,
  })

  return NextResponse.json({ success: true })
}
