import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { requireAdmin, logAdminAction } from '@/lib/admin/helpers'

const VALID_PLANS = ['basique', 'essentiel', 'agence'] as const
type Plan = typeof VALID_PLANS[number]

export async function POST(request: NextRequest) {
  const { user, response } = await requireAdmin()
  if (response) return response

  const { userId, plan } = await request.json()

  if (!userId) return NextResponse.json({ error: 'userId requis' }, { status: 400 })
  if (!VALID_PLANS.includes(plan as Plan)) {
    return NextResponse.json({ error: 'Plan invalide' }, { status: 400 })
  }

  const service = createServiceClient()
  const { error } = await service
    .from('profiles')
    .update({ plan })
    .eq('id', userId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await logAdminAction({
    adminId: user!.id,
    action: 'change_plan',
    targetId: userId,
    details: { new_plan: plan },
  })

  return NextResponse.json({ success: true })
}
