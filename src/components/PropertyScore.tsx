'use client'

import type { PropertyScore } from '@/types'
import { T } from '@/lib/design-tokens'

interface Props {
  score: PropertyScore
  compact?: boolean
}

const PERSONA_LABELS: Record<string, string> = {
  'Primo-accédant': 'Primo-accédant',
  'Investisseur': 'Investisseur',
  'Famille': 'Famille',
  'Senior': 'Senior',
  'Résidence secondaire': 'Résidence secondaire',
}

const PERSONA_ICONS: Record<string, string> = {
  'Primo-accédant': '🔑',
  'Investisseur': '📈',
  'Famille': '👨‍👩‍👧‍👦',
  'Senior': '🌿',
  'Résidence secondaire': '🏖️',
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '11px', color: T.mid }}>{label}</span>
        <span style={{ fontSize: '12px', fontWeight: 600, color }}>{value}/10</span>
      </div>
      <div style={{ height: '4px', background: T.border, borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${(value / 10) * 100}%`,
          background: color,
          borderRadius: '2px',
          transition: 'width 0.3s ease',
        }} />
      </div>
    </div>
  )
}

export default function PropertyScore({ score, compact = false }: Props) {
  if (compact) {
    return (
      <div style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        padding: '16px',
        borderRadius: '4px',
      }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.gold, marginBottom: '12px' }}>
          Score du bien
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: `3px solid ${score.note_globale >= 7 ? T.ok : score.note_globale >= 5 ? T.gold : T.err}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '20px',
            fontWeight: 600,
            color: T.dark,
          }}>
            {score.note_globale}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: T.dark }}>
              {PERSONA_ICONS[score.persona_cible]} {PERSONA_LABELS[score.persona_cible]}
            </div>
            <div style={{ fontSize: '11px', color: T.mid }}>
              Profil acheteur idéal
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      padding: '24px',
      borderRadius: '4px',
    }}>
      <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.gold, marginBottom: '20px' }}>
        Score du bien
      </div>

      {/* Note globale */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px',
        padding: '16px',
        background: T.bg2,
        borderRadius: '4px',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          border: `4px solid ${score.note_globale >= 7 ? T.ok : score.note_globale >= 5 ? T.gold : T.err}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '28px',
          fontWeight: 600,
          color: T.dark,
          flexShrink: 0,
        }}>
          {score.note_globale}
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 500, color: T.dark, marginBottom: '4px' }}>
            {PERSONA_ICONS[score.persona_cible]} Profil {PERSONA_LABELS[score.persona_cible]}
          </div>
          <div style={{ fontSize: '12px', color: T.mid }}>
            Acheteur idéal pour ce bien
          </div>
        </div>
      </div>

      {/* Barres de score */}
      <ScoreBar label="Potentiel investisseur" value={score.potentiel_investisseur} color={T.gold} />
      <ScoreBar label="Potentiel famille" value={score.potentiel_famille} color={T.ok} />
      <ScoreBar label="Qualité des prestations" value={score.qualite_prestation} color="#60a5fa" />
      <ScoreBar label="Luminosité" value={score.luminosite} color="#fbbf24" />

      {/* Arguments de vente */}
      <div style={{ marginTop: '20px', marginBottom: '16px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: T.mid, marginBottom: '10px' }}>
          Arguments de vente
        </div>
        {score.arguments_vente.map((arg, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px', fontSize: '13px', color: T.dark }}>
            <span style={{ color: T.ok, flexShrink: 0 }}>+</span>
            {arg}
          </div>
        ))}
      </div>

      {/* Points de vigilance */}
      <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: '16px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: T.mid, marginBottom: '10px' }}>
          Points de vigilance
        </div>
        {score.points_vigilance.map((point, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px', fontSize: '13px', color: T.mid }}>
            <span style={{ color: T.err, flexShrink: 0 }}>!</span>
            {point}
          </div>
        ))}
      </div>
    </div>
  )
}