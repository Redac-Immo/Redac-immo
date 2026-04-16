import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { requireAdmin, logAdminAction } from '@/lib/admin/helpers'

export async function POST(request: NextRequest) {
  const { user, response } = await requireAdmin()
  if (response) return response

  const { userId } = await request.json()
  if (!userId) return NextResponse.json({ error: 'userId requis' }, { status: 400 })

  const service = createServiceClient()
  const { error } = await service
    .from('profiles')
    .update({ blocked: true })
    .eq('id', userId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await logAdminAction({ adminId: user!.id, action: 'block_user', targetId: userId })
  return NextResponse.json({ success: true })
}
