import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { sendConfirmationAnnonce } from '@/lib/resend/emails'
import type { GenerateRequest, GenerateResponse } from '@/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body: GenerateRequest = await request.json()

    if (!body.type || !body.surface || !body.localisation || !body.prix || !body.formule) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const prompt = buildPrompt(body)

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    })

    const rawText = message.content[0].type === 'text' ? message.content[0].text : ''
    const generated = parseResponse(rawText)

    // Sauvegarde Supabase
    const { data: annonce } = await supabase
      .from('annonces')
      .insert({
        user_id: user.id,
        bien: `${body.type} — ${body.localisation}`,
        prix: body.prix,
        localisation: body.localisation,
        surface: body.surface,
        formule: body.formule,
        fr: generated.fr,
        en: generated.en,
        short: generated.short,
        statut: 'encours',
      })
      .select()
      .single()

    // Récupérer le profil pour le prénom
    const { data: profile } = await supabase
      .from('profiles')
      .select('prenom')
      .eq('id', user.id)
      .single()

    // Envoi email confirmation — non bloquant
    if (user.email) {
      sendConfirmationAnnonce({
        to: user.email,
        prenom: profile?.prenom ?? 'Cher client',
        bien: `${body.type} — ${body.localisation}`,
        localisation: body.localisation,
        prix: body.prix,
        formule: body.formule,
        extrait: generated.fr,
      }).catch(err => console.error('[resend] Erreur envoi email annonce:', err))
    }

    return NextResponse.json({ ...generated, annonceId: annonce?.id ?? null })

  } catch (error) {
    console.error('[generate] Error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

function buildPrompt(d: GenerateRequest): string {
  const extras = d.formule === 'basique'
    ? 'Generate only the French long version. Leave en and short as empty strings.'
    : 'Generate all three: French long version, English long version, and a short French version for social media (max 280 characters).'

  return `You are a professional real estate copywriter. Write property listings that are warm, clear and grounded.
Tone: conversational but professional. No hollow superlatives. Every sentence must carry real information.

Property details:
- Type: ${d.type}
- Living area: ${d.surface} m²${d.terrain ? `\n- Land: ${d.terrain} m²` : ''}
- Rooms: ${d.pieces || 'n/a'} / Bedrooms: ${d.chambres || 'n/a'}
- Location: ${d.localisation}
- Price: ${d.prix}
- Features: ${d.pointsForts || 'n/a'}
- Additional info: ${d.infoCompl || 'none'}

Writing rules:
- Open with location and the defining character of the property (one sentence max)
- Flow: entrance → living areas → kitchen → bedrooms → outdoor space
- Use specific details: dimensions, materials, orientation, proximity
- Target length: 180-240 words per long version

${extras}

Reply ONLY with valid JSON, no markdown, no backticks:
{
  "fr": "french listing text",
  "en": "english listing text (empty string if Basique)",
  "short": "short social version (empty string if Basique)"
}`
}

function parseResponse(text: string): GenerateResponse {
  try {
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    return { fr: parsed.fr ?? '', en: parsed.en ?? '', short: parsed.short ?? '' }
  } catch {
    return { fr: text, en: '', short: '' }
  }
}
