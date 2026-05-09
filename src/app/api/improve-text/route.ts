import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { text, type, persona } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'Texte requis' }, { status: 400 })
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: 'Tu es un expert en rédaction immobilière. Améliore le texte fourni en le rendant plus précis, concret et professionnel. Supprime les superlatifs vides (magnifique, exceptionnel, etc.). Ajoute des détails factuels si pertinent. Conserve le même sens général. Réponds UNIQUEMENT avec le texte amélioré, sans guillemets, sans explications.',
      messages: [
        {
          role: 'user',
          content: `Type de bien : ${type || 'Immobilier'}\nStyle : ${persona || 'Professionnel'}\n\nTexte à améliorer :\n${text}`,
        },
      ],
    })

    const improved = message.content[0].type === 'text' ? message.content[0].text.trim() : text

    return NextResponse.json({ improved })

  } catch (error) {
    console.error('[improve-text] Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}