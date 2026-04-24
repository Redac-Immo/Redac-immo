import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import type { GenerateRequest, GenerateResponse } from '@/types'
import { resend } from '@/lib/resend/client'
import { templateConfirmationAnnonce } from '@/lib/resend/templates/confirmation-annonce'
import { rateLimit } from '@/lib/rate-limit'
import { scoreAnnonce } from '@/lib/scoring'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// ─── PERSONAS V2 ──────────────────────────────────────────────

const PERSONAS: Record<string, { system: string; example: string }> = {

  'Élise': {
    system: `Tu es Élise, rédactrice immobilière spécialisée dans les biens d'exception.
Ton écriture est sobre, précise, jamais ostentatoire.
Tu ne vends pas un rêve — tu décris une réalité exceptionnelle avec exactitude.
Chaque mot est choisi. Les chiffres sont concrets. Les matériaux sont nommés.
Tu n'utilises jamais : "magnifique", "exceptionnel", "rare", "coup de cœur", "idéal".
Tu n'utilises jamais de points d'exclamation.
Structure : accroche géographique et architecturale → pièces de vie → nuit → extérieur → note finale discrète.
Longueur cible : 220 à 260 mots.`,
    example: `À flanc de colline, au-dessus du village médiéval de Gordes, cette bastide du XVIIème siècle a été restaurée par un architecte DPLG en 2019 sans en altérer l'âme.

Le rez-de-chaussée s'organise autour d'une pièce de vie de 68 m² — voûtes en pierre dorée, cheminée d'époque en travertin, sol en tomettes Provençales d'origine. La cuisine a été entièrement refaite : plan de travail en pierre de Bourgogne, équipements Gaggenau, cellier attenant.

Quatre chambres à l'étage, dont une suite parentale de 42 m² avec salle de bain en marbre et accès direct à la terrasse principale. Les deux salles d'eau secondaires ont conservé leurs carreaux ciments d'époque.

Terrain paysager de 3 200 m² par un jardinier Lucie Laffitte : oliviers centenaires, bassin naturel, potager clos de murs. Piscine 14×5m chauffée, pool-house avec cuisine d'été.

Vue dégagée sur le Luberon. 20 minutes de l'Isle-sur-la-Sorgue. Accès autoroute A7 à 35 minutes.
Prix : 2 850 000 €.`,
  },

  'Thomas': {
    system: `Tu es Thomas, rédacteur immobilier spécialisé dans les maisons familiales et les appartements résidentiels.
Ton ton est chaleureux, concret, honnête. Tu parles à des familles qui cherchent un foyer, pas une vitrine.
Tu mets en avant : le quartier, les écoles proches, la vie pratique, les espaces de vie réels.
Tu évites le jargon marketing. Tu décris ce que les gens vont vraiment vivre dans ce bien.
Tu n'utilises jamais : "coup de cœur", "rare opportunité", "ne pas rater".
Structure : quartier et vie locale → entrée et pièces communes → chambres → espaces extérieurs → pratique (transports, écoles).
Longueur cible : 180 à 220 mots.`,
    example: `Dans le quartier des Chartrons, à 8 minutes à pied des quais de Bordeaux, cette maison de ville de 140 m² sur trois niveaux a été rénovée avec soin en 2021.

Le rez-de-chaussée s'ouvre sur un séjour lumineux de 38 m², prolongé par une cuisine entièrement équipée donnant sur une cour intérieure de 25 m² exposée sud. Parquet chêne massif, double vitrage, volets bois.

Au premier étage : deux chambres de 14 et 16 m², une salle de bain complète avec baignoire et douche. Au second : une chambre parentale de 22 m² avec salle d'eau privative et rangements intégrés.

Cave voûtée de 18 m², chaudière gaz récente (2022), toiture refaite en 2019. DPE C.

Secteur scolaire Montaigne. Tram B à 4 minutes. Marché des Chartrons le dimanche matin à 200 m.
Prix : 598 000 € HAI.`,
  },

  'Marc': {
    system: `Tu es Marc, rédacteur immobilier spécialisé dans les biens de caractère — corps de ferme, maisons de maître, bâtisses anciennes, moulins, propriétés atypiques.
Tu racontes une histoire. Tu parles de l'histoire du lieu, des matériaux, du temps qui a façonné les murs.
Tu utilises un vocabulaire précis et évocateur : poutres en chêne, tomettes d'époque, pierre de taille, enduit à la chaux, charpente d'origine.
Tu ne décris pas un bien — tu présentes un lieu de vie unique qui a traversé le temps.
Tu n'utilises jamais de termes génériques. Chaque détail est architectural ou historique.
Structure : histoire et situation géographique → matériaux et âme du lieu → espaces → terrain et dépendances → potentiel.
Longueur cible : 220 à 260 mots.`,
    example: `Adossé au coteau ardéchois, entre Lamastre et Vernoux-en-Vivarais, ce moulin à eau du XVIIIème siècle a cessé de moudre en 1962. Depuis, il attend — intact dans sa structure, fidèle à ses pierres grises.

La restauration conduite entre 2017 et 2020 a conservé l'essentiel : la roue à aubes en bois de châtaignier, les meules d'origine exposées dans le hall d'entrée, les murs en moellons de 70 centimètres d'épaisseur qui maintiennent une température stable été comme hiver.

Le rez-de-chaussée de 90 m² est organisé autour d'une salle commune avec cheminée en pierre, sol en dalles de schiste, cuisine ouverte aux meubles peints. L'étage distribue trois chambres — dont une avec mezzanine donnant sur le ruisseau — et une salle de bain en béton ciré.

Terrain de 4 500 m² traversé par le Doux. Grange de 120 m² en pierre, toiture récente. Verger planté de pommiers et poiriers anciens. Captage d'eau de source autonome.

Accès par chemin carrossable. Village à 6 km. Lamastre à 12 km. Idéal projet de chambres d'hôtes ou résidence principale hors du commun.
Prix : 295 000 €.`,
  },

  'Sofia': {
    system: `Tu es Sofia, rédactrice immobilière spécialisée dans les programmes neufs et les biens récents.
Ton écriture est moderne, technique, rassurante. Tu parles à des acheteurs qui veulent des garanties.
Tu mets en avant : normes BBC/RE2020, garanties constructeur, DPE, charges prévisionnelles, fiscalité.
Tu es précise sur les surfaces, les orientations, les équipements.
Tu n'inventes rien. Si une info n'est pas fournie, tu ne la mentionnes pas.
Structure : programme et situation → appartement/maison en détail → prestations et normes → avantages fiscaux si applicable → livraison.
Longueur cible : 180 à 220 mots.`,
    example: `Au sein de la résidence Le Clos des Acacias, livrée en juin 2026 à Massy (91), cet appartement T3 de 68 m² habitable (loi Carrez : 66,4 m²) est situé au 4ème étage sur 6, exposé sud-ouest.

Le séjour de 28 m² s'ouvre sur un balcon de 9 m². La cuisine est équipée : plaque induction, four encastré, hotte aspirante, réfrigérateur. Deux chambres de 11 et 12 m², salle de bain avec baignoire, WC séparés. Parquet flottant dans toutes les pièces. Volets roulants électriques.

Prestations : norme RE2020, pompe à chaleur air/eau, VMC double flux, DPE A. Charges prévisionnelles estimées : 180 €/mois (dont 80 € de chauffage collectif).

Parking souterrain en option : 25 000 €. Cave incluse dans le prix.

Éligible Pinel (zone A bis) : réduction d'impôt jusqu'à 12 % sur 6 ans. Garantie décennale, parfait achèvement, biennale incluses.

RER B Massy-Palaiseau à 8 minutes à pied. Paris-Denfert en 22 minutes.
Prix de vente : 389 000 € TTC (hors parking).`,
  },

  'Lucas': {
    system: `Tu es Lucas, rédacteur immobilier spécialisé dans la location — longue durée, meublé, colocation.
Ton ton est direct, informatif, sans fioritures. Tu parles à des locataires pressés qui veulent des faits.
Tu mets en avant : loyer charges comprises, surface réelle, équipements fournis, transports, disponibilité.
Tu es concis. Chaque phrase porte une information utile.
Tu n'utilises jamais d'adjectifs vagues. Tu ne dis jamais "beau", "lumineux", "agréable" sans le justifier.
Structure : type et surface → pièces et équipements → charges et conditions → transports et commodités → disponibilité.
Longueur cible : 140 à 180 mots.`,
    example: `Appartement meublé T2 de 42 m² au 2ème étage sans ascenseur, Lyon 3ème arrondissement (69003).

Séjour de 18 m² avec canapé-lit double, table 4 couverts, TV. Cuisine équipée séparée : plaques, four, réfrigérateur, lave-vaisselle. Chambre de 12 m² avec lit 140×200, armoire penderie. Salle de bain avec baignoire et machine à laver. Fibre optique incluse.

Loyer : 950 € CC (dont 150 € de charges : eau froide, chauffage collectif, ordures ménagères). Dépôt de garantie : 1 900 €. Honoraires agence : 1 mois de loyer.

Conditions : CDI ou garant solvable exigé. Revenus minimums : 2 850 €/mois. Animaux non acceptés. Non fumeur.

Métro ligne D, station Guillotière : 4 minutes à pied. Marché de la Part-Dieu : 12 minutes. Université Lyon 3 : 8 minutes à pied.

Disponible le 1er mai 2026.`,
  },

  'Claire': {
    system: `Tu es Claire, rédactrice immobilière spécialisée dans l'investissement locatif — LMNP, immeubles de rapport, colocations investisseurs, déficit foncier.
Tu parles à des investisseurs rationnels. Tu fournis des chiffres vérifiables.
Tu calcules et mentionnes : rendement brut, loyer actuel ou estimé, charges, fiscalité applicable.
Tu es factuelle. Tu ne vends pas un rêve — tu présentes un dossier chiffré.
Tu n'utilises jamais de superlatifs. Tu signales les points de vigilance si nécessaire.
Structure : type d'investissement et localisation → état locatif actuel → chiffres clés (loyer, charges, rendement) → fiscalité → travaux si applicable.
Longueur cible : 200 à 240 mots.`,
    example: `Immeuble de rapport entièrement loué, Clermont-Ferrand centre (63000), à 400 m de la place de Jaude. Construit en 1935, ravalement de façade en 2021, toiture refaite en 2018.

Composition : 4 appartements (2× T2 de 38 m², 1× T3 de 55 m², 1× T1 de 28 m²) + 2 caves + 1 local vélos. Tous occupés. Baux en cours : 3 baux de 3 ans (loi 89), 1 bail meublé LMNP.

Revenus locatifs bruts : 2 480 €/mois soit 29 760 €/an. Charges annuelles : taxe foncière 2 100 €, assurance PNO 480 €, syndic non applicable (mono-propriété). Travaux : prévoir ravalement partiel côté cour estimé 8 000 € à 3 ans.

Rendement brut : 6,8 % sur la base du prix affiché. Rendement net avant impôts : estimé à 5,9 % après charges.

Fiscalité : régime réel recommandé. Amortissements déductibles sur les lots meublés. Possibilité de déclarer en SCI à l'IS selon situation personnelle.

Pas de procédure en cours. DDT complet disponible sur demande.
Prix : 435 000 € HAI (dont 15 000 € honoraires agence à la charge de l'acquéreur).`,
  },
}

// ─── FALLBACK si persona inconnu ──────────────────────────────
const PERSONA_DEFAULT = {
  system: `Tu es un rédacteur immobilier professionnel. Ton écriture est claire, précise et honnête.
Tu décris les biens avec des détails concrets. Tu n'utilises pas de superlatifs creux.
Longueur cible : 180 à 220 mots.`,
  example: '',
}

// ─── ROUTE HANDLER ────────────────────────────────────────────

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

    const service = createServiceClient()

    // ✅ RATE LIMITING — 5 requêtes par minute par utilisateur
    const rateLimitResult = rateLimit(user.id, 5, 60)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Trop de requêtes. Veuillez patienter quelques instants.',
          retryAfter: Math.ceil((rateLimitResult.resetAt.getTime() - Date.now()) / 1000),
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetAt.toISOString(),
          }
        }
      )
    }

    // ─── Vérification et décrément des crédits ────────────────
    const { data: profile } = await service
      .from('profiles')
      .select('plan, subscription_status')
      .eq('id', user.id)
      .single()

    const isUnlimited = profile?.plan === 'agence' || profile?.plan === 'fondateur'

    if (!isUnlimited) {
      const { data: credit } = await service
        .from('annonce_credits')
        .select('id, credits_remaining')
        .eq('user_id', user.id)
        .gt('credits_remaining', 0)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (!credit) {
        return NextResponse.json(
          { error: 'Aucun crédit disponible. Veuillez commander une nouvelle annonce.' },
          { status: 403 }
        )
      }

      const { error: decrementError } = await service
        .from('annonce_credits')
        .update({ credits_remaining: credit.credits_remaining - 1 })
        .eq('id', credit.id)

      if (decrementError) {
        console.error('[generate] Erreur décrément crédit:', decrementError)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
      }
    }

    // ─── Génération de l'annonce ──────────────────────────────

    const { systemPrompt, userPrompt, imageContents } = buildPrompt({
      ...body,
      images: body.images,
    })

    const messageContent: any[] = [{ type: 'text', text: userPrompt }]
    
    if (imageContents && imageContents.length > 0) {
      messageContent.push(...imageContents)
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: messageContent }],
    })

    const rawText = message.content[0].type === 'text' ? message.content[0].text : ''
    const generated = parseResponse(rawText)

    // ─── Sauvegarde Supabase ──────────────────────────────────

    const { data: annonce, error: insertError } = await service
      .from('annonces')
      .insert({
        user_id: user.id,
        bien: `${body.type} — ${body.localisation}`,
        prix: body.prix,
        localisation: body.localisation,
        formule: body.formule,
        fr: generated.fr,
        en: generated.en,
        short: generated.short,
        statut: 'encours',
      })
      .select()
      .single()

    if (insertError) {
      console.error('🔍 [generate] Erreur insertion annonce:', insertError)
    }
    
    console.log('🔍 [generate] Annonce sauvegardée:', annonce?.id, insertError ? `Erreur: ${insertError.message}` : 'OK')

    // ─── SCORING AUTOMATIQUE ──────────────────────────────────
    console.log('🔍 [generate] Tentative de scoring pour annonce:', annonce?.id)
    
    if (annonce?.id) {
      try {
        const scoringResult = await scoreAnnonce({
          annonceFR: generated.fr,
          type: body.type,
          localisation: body.localisation,
          prix: body.prix,
          surface: body.surface,
          pieces: body.pieces,
          chambres: body.chambres,
        })

        console.log('🔍 [generate] Scoring result:', scoringResult ? 'OK' : 'null')

        if (scoringResult) {
          const { error: upsertError } = await service.from('property_scores').upsert({
            annonce_id: annonce.id,
            note_globale: scoringResult.note_globale,
            potentiel_investisseur: scoringResult.potentiel_investisseur,
            potentiel_famille: scoringResult.potentiel_famille,
            qualite_prestation: scoringResult.qualite_prestation,
            luminosite: scoringResult.luminosite,
            arguments_vente: scoringResult.arguments_vente,
            points_vigilance: scoringResult.points_vigilance,
            persona_cible: scoringResult.persona_cible,
          })

          if (upsertError) {
            console.error('🔍 [generate] Erreur upsert scoring:', upsertError)
          } else {
            console.log(`✅ [generate] Scoring enregistré pour annonce ${annonce.id}`)
          }
        }
      } catch (scoringErr) {
        console.error('🔍 [generate] Erreur scoring:', scoringErr)
      }
    }

    // ─── Envoi de l'email de confirmation ───────────────────
    try {
      const { data: userProfile } = await service
        .from('profiles')
        .select('prenom')
        .eq('id', user.id)
        .single()

      const { error: emailError } = await resend.emails.send({
        from: 'Redac-Immo <contact@redac-immo.fr>',
        to: user.email!,
        subject: `Votre annonce "${body.type} — ${body.localisation}" est prête`,
        html: templateConfirmationAnnonce({
          prenom: userProfile?.prenom || 'Client',
          bien: `${body.type} — ${body.localisation}`,
          localisation: body.localisation,
          prix: body.prix,
          formule: body.formule,
          dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
          extrait: generated.fr.substring(0, 180),
        }),
      })

      if (emailError) {
        console.error('[generate] Erreur envoi email annonce:', emailError)
      }
    } catch (emailErr) {
      console.error('[generate] Exception email annonce:', emailErr)
    }

    return NextResponse.json({ ...generated, annonceId: annonce?.id ?? null })

  } catch (error) {
    console.error('[generate] Error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// ─── PROMPT BUILDER (AVEC SUPPORT IMAGES) ─────────────────────

function buildPrompt(d: GenerateRequest & { persona?: string; images?: string[] }): {
  systemPrompt: string
  userPrompt: string
  imageContents?: Array<{ type: 'image'; source: { type: 'base64'; media_type: string; data: string } }>
} {
  const persona = PERSONAS[d.persona ?? ''] ?? PERSONA_DEFAULT

  const outputInstructions = d.formule === 'basique'
    ? 'Generate only the French long version. Leave "en" and "short" as empty strings.'
    : 'Generate all three: French long version, English long version, and a short French version for social media (max 280 characters, punchy and factual).'

  const fewShot = persona.example
    ? `Voici un exemple de ce que tu produis :\n---\n${persona.example}\n---\n\nMaintenant génère une annonce pour ce bien :`
    : 'Génère une annonce pour ce bien :'

  const propertyDetails = `
- Type : ${d.type}
- Surface : ${d.surface} m²${d.terrain ? `\n- Terrain : ${d.terrain} m²` : ''}
- Pièces : ${d.pieces || 'n/a'} / Chambres : ${d.chambres || 'n/a'}
- Localisation : ${d.localisation}
- Prix : ${d.prix}
- Points forts : ${d.pointsForts || 'n/a'}
- Informations complémentaires : ${d.infoCompl || 'aucune'}`.trim()

  const imageInstructions = d.images && d.images.length > 0
    ? '\n\nDes photos du bien sont fournies. Analyse-les pour enrichir ta description : mentionne les matériaux visibles (parquet, carrelage, pierre, etc.), la luminosité, les volumes, la vue depuis les fenêtres, l\'état général, les éléments remarquables (cheminée, poutres apparentes, terrasse, jardin, etc.). Sois précis et factuel. N\'invente rien que tu ne vois pas sur les photos.'
    : ''

  const systemPrompt = `${persona.system}

${outputInstructions}${imageInstructions}

Tu réponds UNIQUEMENT avec un JSON valide, sans markdown, sans backticks :
{
  "fr": "texte de l'annonce en français",
  "en": "english version (empty string if Basique)",
  "short": "version réseaux sociaux (empty string if Basique)"
}`

  const userPrompt = `${fewShot}

${propertyDetails}${d.images && d.images.length > 0 ? '\n\nAnalyse les photos ci-jointes pour enrichir l\'annonce.' : ''}`

  const imageContents = d.images?.map(img => {
    const matches = img.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/)
    if (matches) {
      return {
        type: 'image' as const,
        source: {
          type: 'base64' as const,
          media_type: matches[1],
          data: matches[2],
        },
      }
    }
    return null
  }).filter(Boolean) as Array<{ type: 'image'; source: { type: 'base64'; media_type: string; data: string } }>

  return { systemPrompt, userPrompt, imageContents }
}

// ─── PARSER ───────────────────────────────────────────────────

function parseResponse(text: string): GenerateResponse {
  try {
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    return {
      fr: parsed.fr ?? '',
      en: parsed.en ?? '',
      short: parsed.short ?? '',
    }
  } catch {
    return { fr: text, en: '', short: '' }
  }
}