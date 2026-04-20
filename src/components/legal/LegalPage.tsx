import Link from 'next/link'
import type { ReactNode } from 'react'

interface Props {
  title: string
  version: string
  effectiveDate: string
  children: ReactNode
}

export default function LegalPage({ title, version, effectiveDate, children }: Props) {
  return (
    <div style={{ background: '#FAFAF7', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: '#18181A' }}>

      {/* Nav simple */}
      <nav style={{ padding: '20px 60px', borderBottom: '1px solid #E8E8E4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: '2px' }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 500, color: '#18181A' }}>Redac</span>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 300, fontStyle: 'italic', color: '#C9A96E' }}>-Immo</span>
        </Link>
        <Link href="/" style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B6B65', textDecoration: 'none' }}>
          ← Retour au site
        </Link>
      </nav>

      {/* Contenu */}
      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 32px 120px' }}>

        {/* En-tête */}
        <div style={{ marginBottom: '48px', paddingBottom: '32px', borderBottom: '1px solid #E8E8E4' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C9A96E', marginBottom: '16px' }}>
            Document juridique
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '40px', fontWeight: 300, lineHeight: 1.1, marginBottom: '16px' }}>
            {title}
          </h1>
          <div style={{ fontSize: '12px', color: '#6B6B65', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <span>{version}</span>
            <span>·</span>
            <span>En vigueur le {effectiveDate}</span>
            <span>·</span>
            <span>SIRET 10377554000018</span>
          </div>
        </div>

        {/* Corps */}
        <div style={{ fontSize: '14px', lineHeight: 1.8, color: '#18181A' }}>
          {children}
        </div>

        {/* Footer de page */}
        <div style={{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid #E8E8E4', fontSize: '12px', color: '#6B6B65' }}>
          Redac-Immo · Xavier Deplante, auto-entrepreneur · SIRET 10377554000018 · 80 rue des Bonnes, 01360 Loyettes ·{' '}
          <a href="mailto:contact@redac-immo.fr" style={{ color: '#C9A96E', textDecoration: 'none' }}>contact@redac-immo.fr</a>
        </div>
      </main>
    </div>
  )
}

/* ─── Primitives de mise en forme ─────────────────────────────── */

export function Article({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: '40px' }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 500, color: '#18181A', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #E8E8E4' }}>
        Article {number} — {title}
      </h2>
      <div>{children}</div>
    </div>
  )
}

export function SubSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#18181A', marginBottom: '8px' }}>{title}</h3>
      <div>{children}</div>
    </div>
  )
}

export function P({ children }: { children: ReactNode }) {
  return <p style={{ marginBottom: '12px', color: '#18181A' }}>{children}</p>
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul style={{ paddingLeft: '0', listStyle: 'none', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {children}
    </ul>
  )
}

export function LI({ children }: { children: ReactNode }) {
  return (
    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#18181A' }}>
      <span style={{ color: '#C9A96E', flexShrink: 0, marginTop: '1px' }}>—</span>
      <span>{children}</span>
    </li>
  )
}

export function TableLegal({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ background: '#F2F2EE' }}>
            {headers.map(h => (
              <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B6B65', fontWeight: 500, border: '1px solid #E8E8E4' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '10px 14px', border: '1px solid #E8E8E4', verticalAlign: 'top', lineHeight: 1.6 }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
