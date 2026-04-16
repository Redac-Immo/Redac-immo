'use client'
import Link from 'next/link'
import ScrollReveal from './ScrollReveal'

export function CtaFinal() {
  return (
    <section style={{
      background: 'var(--dark)',
      padding: '120px 60px',
      textAlign: 'center',
      position: 'relative', overflow: 'hidden', zIndex: 1,
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(201,169,110,0.08) 0%, transparent 70%)',
      }} />
      <ScrollReveal>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontSize: 'clamp(40px, 5vw, 68px)',
            fontWeight: 300, lineHeight: 1.1,
            color: 'var(--cream)', marginBottom: '20px',
          }}>
            Votre prochaine annonce,<br />
            en <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>moins de 24h</em>
          </h2>
          <p style={{ fontSize: '15px', color: '#999', marginBottom: '48px', lineHeight: 1.7 }}>
            Sans abonnement. Sans engagement. Juste une annonce professionnelle.
          </p>
          <Link
            href="#tarifs"
            style={{
              padding: '16px 40px',
              background: 'var(--gold)', color: 'var(--dark)',
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500,
              textDecoration: 'none', display: 'inline-block', transition: 'all 0.25s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--gold-light)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--gold)'
              e.currentTarget.style.transform = 'none'
            }}
          >
            Commencer maintenant
          </Link>
          <div style={{ marginTop: '24px', fontSize: '12px', color: '#888', letterSpacing: '0.06em' }}>
            À partir de 5€ · Livraison garantie sous 24h
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}

export function Footer() {
  return (
    <footer style={{
      background: '#111112',
      padding: '48px 60px',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: '24px',
      position: 'relative', zIndex: 1,
    }}>
      <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '22px' }}>
        <span style={{ color: 'var(--cream)', fontWeight: 500 }}>Redac</span>
        <span style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 300 }}>Immo</span>
      </div>

      <ul style={{ display: 'flex', gap: '28px', listStyle: 'none', flexWrap: 'wrap' }}>
        {[
          { label: 'Mentions légales', href: '#' },
          { label: 'Politique de confidentialité', href: '#' },
          { label: 'CGV', href: '#' },
          { label: 'Contact', href: 'mailto:contact@redac-immo.fr' },
        ].map(l => (
          <li key={l.label}>
            <a href={l.href} style={{
              fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#555', textDecoration: 'none', transition: 'color 0.2s',
            }}
               onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
               onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <div style={{ fontSize: '11px', color: '#444' }}>
        © 2026 Redac-Immo, Tous droits réservés
      </div>
    </footer>
  )
}
