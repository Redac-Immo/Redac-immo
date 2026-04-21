// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS — Redac-Immo
// Version : 1.0
// Usage : Importer { T } depuis '@/lib/design-tokens'
// ═══════════════════════════════════════════════════════════════════════════════

export const T = {
  // ─── FONDS ──────────────────────────────────────────────────────────────────
  bg:       '#18181A',      // Fond principal (dark mode)
  bg2:      '#111112',      // Fond secondaire (sidebar admin)
  surface:  '#222224',      // Surface des cartes
  surface2: '#2A2A2C',      // Surface alternative (inputs, hover)

  // ─── TEXTES ─────────────────────────────────────────────────────────────────
  dark:     '#FAFAF7',      // Texte principal sur fond sombre
  cream:    '#FAFAF7',      // Alias pour cohérence landing
  mid:      '#9A9A94',      // Texte secondaire
  light:    '#E8E8E4',      // Bordures claires / séparateurs

  // ─── ACCENT (GOLD) ──────────────────────────────────────────────────────────
  gold:     '#C9A96E',      // Accent principal
  goldLight:'#E8D0A0',      // Hover / états actifs
  goldDim:  '#9A7A48',      // Désactivé / secondaire
  goldBg:   'rgba(201,169,110,0.08)', // Fond d'accent léger

  // ─── BORDERS ────────────────────────────────────────────────────────────────
  border:   '#333336',      // Bordures standard
  borderLt: '#2E2E30',      // Bordures légères

  // ─── ÉTATS ──────────────────────────────────────────────────────────────────
  ok:       '#4ade80',      // Succès
  okBg:     'rgba(45,106,79,0.2)',
  err:      '#f87171',      // Erreur
  errBg:    'rgba(193,18,31,0.15)',
  warn:     '#fbbf24',      // Attention
  warnBg:   'rgba(251,191,36,0.15)',
} as const

// ─── TYPES ────────────────────────────────────────────────────────────────────
export type DesignTokens = typeof T
export type ColorKey = keyof typeof T

// ─── HELPERS ──────────────────────────────────────────────────────────────────
/**
 * Applique une opacité à une couleur hexadécimale
 * @example alpha(T.gold, 0.5) → rgba(201,169,110,0.5)
 */
export function alpha(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${opacity})`
}

// ─── CSS VARIABLES (pour usage dans globals.css) ──────────────────────────────
export const cssVariables = `
  :root {
    --bg:        ${T.bg};
    --bg2:       ${T.bg2};
    --surface:   ${T.surface};
    --surface2:  ${T.surface2};
    --dark:      ${T.dark};
    --cream:     ${T.cream};
    --mid:       ${T.mid};
    --light:     ${T.light};
    --gold:      ${T.gold};
    --gold-light:${T.goldLight};
    --gold-dim:  ${T.goldDim};
    --border:    ${T.border};
    --border-lt: ${T.borderLt};
    --ok:        ${T.ok};
    --ok-bg:     ${T.okBg};
    --err:       ${T.err};
    --err-bg:    ${T.errBg};
    --warn:      ${T.warn};
    --warn-bg:   ${T.warnBg};
  }

  .dark {
    --bg:        ${T.bg};
    --bg2:       ${T.bg2};
    --surface:   ${T.surface};
    --surface2:  ${T.surface2};
    --dark:      ${T.dark};
    --cream:     ${T.cream};
    --mid:       ${T.mid};
    --light:     ${T.light};
    --gold:      ${T.gold};
    --gold-light:${T.goldLight};
    --gold-dim:  ${T.goldDim};
    --border:    ${T.border};
    --border-lt: ${T.borderLt};
  }
`