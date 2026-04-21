import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#18181A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        
        {/* Code erreur */}
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '120px',
          fontWeight: 300,
          color: '#C9A96E',
          lineHeight: 1,
          marginBottom: '16px',
          opacity: 0.4,
        }}>
          404
        </div>

        {/* Titre */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '32px',
          fontWeight: 300,
          color: '#FAFAF7',
          marginBottom: '16px',
        }}>
          Page introuvable
        </h1>

        {/* Message */}
        <p style={{
          fontSize: '14px',
          color: '#9A9A94',
          lineHeight: 1.7,
          marginBottom: '32px',
        }}>
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{
              padding: '12px 28px',
              background: '#C9A96E',
              color: '#18181A',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '11px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
          >
            Retour à l'accueil
          </Link>
          <Link
            href="/dashboard"
            style={{
              padding: '12px 28px',
              background: 'transparent',
              color: '#9A9A94',
              border: '1px solid #333336',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '11px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            Espace client
          </Link>
        </div>

        {/* Logo discret */}
        <div style={{ marginTop: '64px' }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '18px',
            color: '#333336',
          }}>
            Redac<span style={{ fontStyle: 'italic', color: '#9A7A48' }}>-Immo</span>
          </span>
        </div>

      </div>
    </div>
  )
}