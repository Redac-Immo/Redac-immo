'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait son choix
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setVisible(true)
    }
  }, [])

  function acceptAll() {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  function acceptEssential() {
    localStorage.setItem('cookie-consent', 'essential')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '24px',
      right: '24px',
      maxWidth: '420px',
      background: '#18181A',
      border: '1px solid rgba(201,169,110,0.25)',
      borderLeft: '3px solid #C9A96E',
      padding: '24px',
      zIndex: 9999,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <p style={{
        fontSize: '13px',
        color: '#FAFAF7',
        margin: '0 0 16px 0',
        lineHeight: 1.6,
      }}>
        Nous utilisons des cookies techniques nécessaires au fonctionnement du site. 
        Aucun cookie publicitaire n'est utilisé. 
        En continuant, vous acceptez leur utilisation.
      </p>

      <div style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '12px',
      }}>
        <button
          onClick={acceptAll}
          style={{
            padding: '10px 20px',
            background: '#C9A96E',
            color: '#18181A',
            border: 'none',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Accepter
        </button>

        <button
          onClick={acceptEssential}
          style={{
            padding: '10px 20px',
            background: 'transparent',
            color: '#9A9A94',
            border: '1px solid #333336',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Cookies essentiels uniquement
        </button>
      </div>

      <p style={{
        fontSize: '11px',
        color: '#6B6B65',
        margin: 0,
      }}>
        En savoir plus dans notre{' '}
        <Link
          href="/confidentialite"
          style={{
            color: '#C9A96E',
            textDecoration: 'none',
          }}
        >
          Politique de confidentialité
        </Link>
        .
      </p>
    </div>
  )
}