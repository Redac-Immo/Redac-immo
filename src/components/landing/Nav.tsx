'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '#methode',        label: 'Notre méthode' },
  { href: '#exemples',       label: 'Exemples' },
  { href: '#fonctionnalites',label: 'Fonctionnalités' },
  { href: '#tarifs',         label: 'Tarifs' },
  { href: '#faq',            label: 'FAQ' },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Bloquer le scroll body quand menu mobile ouvert
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const isDark = resolvedTheme === 'dark'

  function toggleTheme() {
    setTheme(isDark ? 'light' : 'dark')
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <>
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          padding: '20px 60px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: isDark
            ? (scrolled ? 'rgba(18,18,20,0.98)' : 'rgba(18,18,20,0.92)')
            : (scrolled ? 'rgba(250,250,247,0.98)' : 'rgba(250,250,247,0.92)'),
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(201,169,110,0.25)',
          transition: 'background 0.3s',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: '2px', textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '26px', fontWeight: 500, color: 'var(--dark)', letterSpacing: '-0.01em' }}>
            Redac
          </span>
          <span style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '26px', fontWeight: 300, fontStyle: 'italic', color: 'var(--gold)' }}>
            -Immo
          </span>
        </Link>

        {/* Desktop links */}
        <ul style={{ display: 'flex', alignItems: 'center', gap: '36px', listStyle: 'none', margin: 0 }}
            className="nav-desktop">
          {NAV_LINKS.map(l => (
            <li key={l.href}>
              <a href={l.href} style={{ fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--mid)', textDecoration: 'none', transition: 'color 0.2s' }}
                 onMouseEnter={e => (e.currentTarget.style.color = 'var(--dark)')}
                 onMouseLeave={e => (e.currentTarget.style.color = 'var(--mid)')}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={toggleTheme}
              aria-label="Changer le thème"
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'transparent',
                border: '1px solid rgba(201,169,110,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '16px', color: 'var(--mid)',
                transition: 'all 0.2s', flexShrink: 0,
              }}
            >
              {isDark ? '☽' : '☀'}
            </button>
          )}

          {/* CTA */}
          <Link
            href="/register"
            style={{
              padding: '10px 26px',
              background: 'transparent',
              border: '1px solid var(--gold)',
              color: 'var(--gold)',
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase',
              cursor: 'pointer', textDecoration: 'none',
              transition: 'all 0.25s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--gold)'
              e.currentTarget.style.color = 'var(--dark)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--gold)'
            }}
            className="nav-cta-desktop"
          >
            Commencer
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
            style={{
              display: 'none',
              flexDirection: 'column', justifyContent: 'center', gap: '5px',
              width: '40px', height: '40px',
              background: 'none', border: 'none', cursor: 'pointer', padding: '6px',
              flexShrink: 0,
            }}
            className="nav-hamburger"
          >
            <span style={{
              display: 'block', width: '20px', height: '1.5px', background: 'var(--dark)',
              transition: 'all 0.28s cubic-bezier(0.4,0,0.2,1)',
              transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none',
            }} />
            <span style={{
              display: 'block', width: '20px', height: '1.5px', background: 'var(--dark)',
              transition: 'all 0.28s cubic-bezier(0.4,0,0.2,1)',
              opacity: menuOpen ? 0 : 1,
              transform: menuOpen ? 'scaleX(0)' : 'none',
            }} />
            <span style={{
              display: 'block', width: '20px', height: '1.5px', background: 'var(--dark)',
              transition: 'all 0.28s cubic-bezier(0.4,0,0.2,1)',
              transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
            }} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: '#18181A',
          display: 'flex', flexDirection: 'column',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
        className="nav-mobile-overlay"
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid rgba(201,169,110,0.15)',
        }}>
          <span style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '22px' }}>
            <span style={{ fontWeight: 500, color: '#FAFAF7' }}>Redac</span>
            <span style={{ fontWeight: 300, fontStyle: 'italic', color: '#C9A96E' }}>-Immo</span>
          </span>
          <button
            onClick={closeMenu}
            style={{ width: '40px', height: '40px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#FAFAF7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ✕
          </button>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 24px', gap: 0 }}>
          {NAV_LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={closeMenu}
              style={{
                display: 'block', padding: '20px 0',
                fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase',
                color: '#9A9A94', textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#FAFAF7')}
              onMouseLeave={e => (e.currentTarget.style.color = '#9A9A94')}
            >
              {l.label}
            </a>
          ))}
        </div>

        <Link
          href="/register"
          onClick={closeMenu}
          style={{
            margin: '0 24px 32px',
            padding: '18px',
            background: '#C9A96E', color: '#18181A',
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500,
            textDecoration: 'none', textAlign: 'center', display: 'block',
          }}
        >
          Commencer maintenant
        </Link>
      </div>

      {/* Responsive nav styles */}
      <style>{`
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-cta-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          nav { padding: 16px 24px !important; }
        }
      `}</style>
    </>
  )
}
