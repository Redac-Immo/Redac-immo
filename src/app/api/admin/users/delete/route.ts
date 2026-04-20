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

  try {
    // 1. Supprimer les annonces de l'utilisateur
    const { error: annoncesError } = await service
      .from('annonces')
      .delete()
      .eq('user_id', userId)

    if (annoncesError) {
      console.error('[delete-user] Erreur suppression annonces:', annoncesError)
      return NextResponse.json({ error: 'Erreur lors de la suppression des annonces' }, { status: 500 })
    }

    // 2. Supprimer les crédits d'annonces de l'utilisateur
    const { error: creditsError } = await service
      .from('annonce_credits')
      .delete()
      .eq('user_id', userId)

    if (creditsError) {
      console.error('[delete-user] Erreur suppression crédits:', creditsError)
      // On continue, ce n'est pas bloquant
    }

    // 3. Supprimer le profil de l'utilisateur
    const { error: profileError } = await service
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) {
      console.error('[delete-user] Erreur suppression profil:', profileError)
      return NextResponse.json({ error: 'Erreur lors de la suppression du profil' }, { status: 500 })
    }

    // 4. Supprimer l'utilisateur de auth.users
    const { error: authError } = await service.auth.admin.deleteUser(userId)

    if (authError) {
      console.error('[delete-user] Erreur suppression auth:', authError)
      return NextResponse.json({ error: 'Erreur lors de la suppression du compte' }, { status: 500 })
    }

    // 5. Logger l'action
    await logAdminAction({
      adminId: user!.id,
      action: 'delete_user',
      targetId: userId,
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('[delete-user] Exception:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}