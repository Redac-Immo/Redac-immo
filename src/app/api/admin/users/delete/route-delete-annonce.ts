import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { requireAdmin, logAdminAction } from '@/lib/admin/helpers'

export async function POST(request: NextRequest) {
  const { user, response } = await requireAdmin()
  if (response) return response

  const { annonceId } = await request.json()
  if (!annonceId) return NextResponse.json({ error: 'annonceId requis' }, { status: 400 })

  const service = createServiceClient()
  const { error } = await service
    .from('annonces')
    .delete()
    .eq('id', annonceId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await logAdminAction({
    adminId: user!.id,
    action: 'delete_annonce',
    targetId: annonceId,
  })

  return NextResponse.json({ success: true })
}
