import Anthropic from '@anthropic-ai/sdk'
import type { ScoringResult } from '@/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SCORING_TOOL = {
  name: 'score_annonce',
  description: 'Attribue une note sur 10 selon plusieurs critères à une annonce immobilière générée',
  input_schema: {
    type: 'object' as const,
    properties: {
      note_globale: {
        type: 'integer' as const,
        description: 'Note globale de la qualité de l\'annonce sur 10',
      },
      potentiel_investisseur: {
        type: 'integer' as const,
        description: 'Potentiel pour un investisseur locatif sur 10',
      },
      potentiel_famille: {
        type: 'integer' as const,
        description: 'Potentiel pour une famille sur 10',
      },
      qualite_prestation: {
        type: 'integer' as const,
        description: 'Qualité des prestations et finitions sur 10',
      },
      luminosite: {
        type: 'integer' as const,
        description: 'Luminosité perçue du bien sur 10',
      },
      arguments_vente: {
        type: 'array' as const,
        description: '3 arguments de vente clés pour ce bien',
        items: { type: 'string' as const },
      },
      points_vigilance: {
        type: 'array' as const,
        description: '2 points de vigilance à signaler à l\'acheteur',
        items: { type: 'string' as const },
      },
      persona_cible: {
        type: 'string' as const,
        description: 'Profil d\'acheteur idéal',
        enum: ['Primo-accédant', 'Investisseur', 'Famille', 'Senior', 'Résidence secondaire'],
      },
    },
    required: [
      'note_globale',
      'potentiel_investisseur',
      'potentiel_famille',
      'qualite_prestation',
      'luminosite',
      'arguments_vente',
      'points_vigilance',
      'persona_cible',
    ],
  },
}

/**
 * Analyse une annonce générée et lui attribue un score sur 10 selon plusieurs critères.
 * Utilise le Tool Use de Claude pour forcer une réponse structurée.
 */
export async function scoreAnnonce(params: {
  annonceFR: string
  type: string
  localisation: string
  prix: string
  surface: string
  pieces?: string
  chambres?: string
}): Promise<ScoringResult | null> {
  const { annonceFR, type, localisation, prix, surface, pieces, chambres } = params

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: `Tu es un expert en évaluation immobilière. Analyse l'annonce ci-dessous et attribue-lui des notes sur 10 selon plusieurs critères.

Critères d'évaluation :
- Note globale : qualité générale de l'annonce, structure, précision des informations
- Potentiel investisseur : rendement locatif estimé, attractivité du marché local, rapport qualité/prix
- Potentiel famille : adaptabilité pour une famille (proximité écoles, espaces, sécurité)
- Qualité des prestations : finitions, matériaux, équipements mentionnés
- Luminosité : exposition, ouvertures, orientation

Fournis également :
- 3 arguments de vente clés
- 2 points de vigilance pour l'acheteur
- Le profil d'acheteur idéal (Primo-accédant, Investisseur, Famille, Senior, Résidence secondaire)

Sois objectif et factuel. N'invente pas d'informations qui ne sont pas dans l'annonce.`,
      messages: [
        {
          role: 'user',
          content: `Analyse cette annonce immobilière :
          
Type : ${type}
Localisation : ${localisation}
Prix : ${prix}
Surface : ${surface} m²${pieces ? `\nPièces : ${pieces}` : ''}${chambres ? `\nChambres : ${chambres}` : ''}

Annonce :
${annonceFR}`,
        },
      ],
      tools: [SCORING_TOOL],
      tool_choice: { type: 'tool', name: 'score_annonce' },
    })

    // Extraire le résultat du tool use
    for (const content of response.content) {
      if (content.type === 'tool_use' && content.name === 'score_annonce') {
        const input = content.input as unknown as ScoringResult
        return {
          note_globale: input.note_globale,
          potentiel_investisseur: input.potentiel_investisseur,
          potentiel_famille: input.potentiel_famille,
          qualite_prestation: input.qualite_prestation,
          luminosite: input.luminosite,
          arguments_vente: input.arguments_vente,
          points_vigilance: input.points_vigilance,
          persona_cible: input.persona_cible,
        }
      }
    }

    console.error('[scoring] Aucun résultat tool use trouvé')
    return null
  } catch (error) {
    console.error('[scoring] Erreur:', error)
    return null
  }
}