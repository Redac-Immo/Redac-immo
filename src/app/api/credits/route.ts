import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json({ error: 'userId requis' }, { status: 400 })
    }

    const service = createServiceClient()

    const { data: creditsData } = await service
      .from('annonce_credits')
      .select('credits_remaining, plan')
      .eq('user_id', userId)
      .gt('credits_remaining', 0)
      .order('created_at', { ascending: false })

    const totalCredits = creditsData?.reduce((sum, c) => sum + c.credits_remaining, 0) || 0

    return NextResponse.json({ credits_remaining: totalCredits })

  } catch (error) {
    console.error('[credits] Erreur:', error)
    return NextResponse.json({ credits_remaining: 0 }, { status: 500 })
  }
}