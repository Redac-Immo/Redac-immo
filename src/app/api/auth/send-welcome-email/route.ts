import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { resend } from '@/lib/resend/client'
import { templateConfirmationInscription } from '@/lib/resend/templates/confirmation-inscription'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, email } = body

    if (!userId || !email) {
      return NextResponse.json({ error: 'userId et email requis' }, { status: 400 })
    }

    const service = createServiceClient()

    // Récupérer le prénom de l'utilisateur
    const { data: profile } = await service
      .from('profiles')
      .select('prenom')
      .eq('id', userId)
      .single()

    const prenom = profile?.prenom || 'Client'

    // Envoyer l'email de bienvenue
    const { error: emailError } = await resend.emails.send({
      from: 'Redac-Immo <contact@redac-immo.fr>',
      to: email,
      subject: 'Bienvenue sur Redac-Immo',
      html: templateConfirmationInscription({
        prenom,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      }),
    })

    if (emailError) {
      console.error('[send-welcome-email] Erreur envoi email:', emailError)
      return NextResponse.json({ error: 'Erreur envoi email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('[send-welcome-email] Exception:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}