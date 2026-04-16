'use client'
import Link from 'next/link'
const PROOF_ITEMS = [
  { number: '< 30s', label: 'Temps de génération' },
  { number: 'FR + EN', label: 'Bilingue natif' },
  { number: '24h', label: 'Livraison garantie' },
]

export default function Hero() {
  return (
    <>
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '120px 60px 80px',
        position: 'relative', overflow: 'hidden',
        textAlign: 'center',
      }}>
        {/* Background gradient */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: `
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,169,110,0.10) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 80% 80%, rgba(201,169,110,0.06) 0%, transparent 60%)
          `,
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '860px' }}>

          {/* Eyebrow */}
          <div className="hero-eyebrow" style={{
            display: 'inline-flex', alignItems: 'center', gap: '12px',
            fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase',
            color: 'var(--gold)', marginBottom: '36px',
          }}>
            <span style={{ width: '32px', height: '1px', background: 'var(--gold-dim)', display: 'block' }} />
            Rédaction immobilière professionnelle
            <span style={{ width: '32px', height: '1px', background: 'var(--gold-dim)', display: 'block' }} />
          </div>

          {/* Title */}
          <h1 className="hero-title" style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontSize: 'clamp(52px, 7vw, 88px)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: 'var(--dark)',
            marginBottom: '28px',
          }}>
            Des annonces qui<br />
            <em style={{ fontStyle: 'italic', color: 'var(--gold)', fontWeight: 300 }}>font vendre</em>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle" style={{
            fontSize: '16px', lineHeight: 1.75, color: 'var(--mid)',
            maxWidth: '560px', margin: '0 auto 52px',
            fontWeight: 300,
          }}>
            Votre annonce immobilière rédigée en français et en anglais, livrée sous 24h.
            Au niveau des grandes agences internationales, à partir de 5€.
          </p>

          {/* CTAs */}
          <div className="hero-actions" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '16px', flexWrap: 'wrap',
          }}>
            <Link
              href="#tarifs"
              style={{
                padding: '16px 40px',
                background: 'var(--gold)', color: 'var(--dark)',
                border: 'none',
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500,
                cursor: 'pointer', textDecoration: 'none',
                display: 'inline-block', transition: 'all 0.25s',
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
              Voir les tarifs
            </Link>

            <Link
              href="/register"
              style={{
                padding: '16px 40px',
                background: 'transparent', color: 'var(--dark)',
                border: '1px solid rgba(24,24,26,0.25)',
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase',
                cursor: 'pointer', textDecoration: 'none',
                display: 'inline-block', transition: 'all 0.25s',
              }}
            >
              Commencer gratuitement
            </Link>
          </div>

          {/* Proof */}
          <div className="hero-proof" style={{
            marginTop: '64px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '40px', flexWrap: 'wrap',
          }}>
            {PROOF_ITEMS.map((item, i) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                {i > 0 && (
                  <div style={{ width: '1px', height: '48px', background: 'rgba(24,24,26,0.12)' }}
                       className="proof-sep" />
                )}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: 'var(--font-cormorant), serif',
                    fontSize: '36px', fontWeight: 300, color: 'var(--gold)', lineHeight: 1,
                  }}>
                    {item.number}
                  </div>
                  <div style={{
                    fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: 'var(--mid)', marginTop: '6px',
                  }}>
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .proof-sep { display: none !important; }
        }
      `}</style>
    </>
  )
}
