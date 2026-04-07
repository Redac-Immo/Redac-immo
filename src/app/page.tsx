'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function LandingPage() {
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Scroll reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80)
          observer.unobserve(e.target)
        }
      })
    }, { threshold: 0.1 })

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))

    // Nav scroll
    const handleScroll = () => {
      if (navRef.current) {
        navRef.current.style.background = window.scrollY > 60
          ? 'rgba(24,24,26,0.97)'
          : 'rgba(24,24,26,0.85)'
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  function toggleFaq(el: HTMLElement) {
    const item = el.closest('.faq-item') as HTMLElement | null
    if (!item) return
    const isOpen = item.classList.contains('open')
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'))
    if (!isOpen) item.classList.add('open')
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: var(--font-dm-sans), 'DM Sans', sans-serif; background: var(--dark); color: var(--cream); overflow-x: hidden; }

        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 20px 60px; display: flex; align-items: center; justify-content: space-between; background: rgba(24,24,26,0.85); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(201,169,110,0.15); transition: all 0.3s; }
        .nav-logo { display: flex; align-items: baseline; gap: 2px; font-family: var(--font-cormorant), 'Cormorant Garamond', serif; }
        .nav-logo-main { font-size: 26px; font-weight: 500; color: var(--cream); letter-spacing: -0.01em; }
        .nav-logo-accent { font-size: 26px; font-weight: 300; font-style: italic; color: var(--gold); }
        .nav-links { display: flex; align-items: center; gap: 36px; list-style: none; }
        .nav-links a { font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: #888; text-decoration: none; transition: color 0.2s; }
        .nav-links a:hover { color: var(--cream); }
        .nav-cta { padding: 10px 26px; background: transparent; border: 1px solid var(--gold); color: var(--gold); font-family: var(--font-dm-sans), 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; cursor: pointer; text-decoration: none; transition: all 0.25s; }
        .nav-cta:hover { background: var(--gold); color: var(--dark); }

        .hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 120px 60px 80px; position: relative; overflow: hidden; text-align: center; }
        .hero-bg { position: absolute; inset: 0; z-index: 0; background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,169,110,0.07) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(201,169,110,0.04) 0%, transparent 60%); }
        .hero-grid { position: absolute; inset: 0; z-index: 0; background-image: linear-gradient(rgba(201,169,110,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.04) 1px, transparent 1px); background-size: 80px 80px; mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%); }
        .hero-content { position: relative; z-index: 1; max-width: 860px; }
        .hero-eyebrow { display: inline-flex; align-items: center; gap: 12px; font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold); margin-bottom: 36px; opacity: 0; animation: fadeUp 0.8s 0.2s forwards; }
        .hero-eyebrow::before, .hero-eyebrow::after { content: ''; width: 32px; height: 1px; background: var(--gold-dim); }
        .hero-title { font-family: var(--font-cormorant), 'Cormorant Garamond', serif; font-size: clamp(52px, 7vw, 88px); font-weight: 300; line-height: 1.05; letter-spacing: -0.02em; color: var(--cream); margin-bottom: 28px; opacity: 0; animation: fadeUp 0.8s 0.35s forwards; }
        .hero-title em { font-style: italic; color: var(--gold); font-weight: 300; }
        .hero-subtitle { font-size: 16px; line-height: 1.75; color: #999; max-width: 560px; margin: 0 auto 52px; font-weight: 300; opacity: 0; animation: fadeUp 0.8s 0.5s forwards; }
        .hero-actions { display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap; opacity: 0; animation: fadeUp 0.8s 0.65s forwards; }
        .btn-primary { padding: 16px 40px; background: var(--gold); color: var(--dark); border: none; font-family: var(--font-dm-sans), 'DM Sans', sans-serif; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; cursor: pointer; text-decoration: none; transition: all 0.25s; display: inline-block; }
        .btn-primary:hover { background: var(--gold-light); transform: translateY(-1px); }
        .btn-ghost { padding: 16px 40px; background: transparent; color: var(--cream); border: 1px solid rgba(255,255,255,0.15); font-family: var(--font-dm-sans), 'DM Sans', sans-serif; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; text-decoration: none; transition: all 0.25s; display: inline-block; }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.4); }
        .hero-proof { margin-top: 64px; display: flex; align-items: center; justify-content: center; gap: 40px; flex-wrap: wrap; opacity: 0; animation: fadeUp 0.8s 0.8s forwards; }
        .proof-item { text-align: center; }
        .proof-number { font-family: var(--font-cormorant), 'Cormorant Garamond', serif; font-size: 36px; font-weight: 300; color: var(--gold); line-height: 1; }
        .proof-label { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #666; margin-top: 6px; }
        .proof-sep { width: 1px; height: 48px; background: rgba(255,255,255,0.08); }

        .demo-section { padding: 0 60px 100px; display: flex; justify-content: center; }
        .demo-window { width: 100%; max-width: 900px; background: var(--dark2); border: 1px solid rgba(201,169,110,0.2); border-top: 2px solid var(--gold); opacity: 0; animation: fadeUp 1s 1s forwards; }
        .demo-bar { padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 10px; }
        .demo-dot { width: 10px; height: 10px; border-radius: 50%; }
        .demo-url { flex: 1; text-align: center; font-size: 11px; color: #555; letter-spacing: 0.08em; }
        .demo-content { display: grid; grid-template-columns: 260px 1fr; min-height: 320px; }
        .demo-sidebar { border-right: 1px solid rgba(255,255,255,0.06); padding: 24px 20px; display: flex; flex-direction: column; gap: 16px; }
        .demo-field-group { display: flex; flex-direction: column; gap: 8px; }
        .demo-label { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: #555; }
        .demo-field { height: 32px; background: var(--dark3); border: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; padding: 0 10px; }
        .demo-field-highlight { font-size: 11px; color: var(--gold-light); }
        .demo-btn-generate { height: 36px; background: var(--gold); display: flex; align-items: center; justify-content: center; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--dark); font-weight: 500; margin-top: 4px; }
        .demo-main { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
        .demo-result-header { display: flex; align-items: center; gap: 10px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .demo-result-title { font-size: 11px; color: #777; letter-spacing: 0.1em; }
        .demo-copy-btn { margin-left: auto; padding: 5px 14px; background: rgba(201,169,110,0.1); border: 1px solid rgba(201,169,110,0.3); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold); }
        .demo-lines { display: flex; flex-direction: column; gap: 6px; }
        .demo-line { height: 9px; background: rgba(255,255,255,0.06); border-radius: 2px; transform-origin: left; animation: lineReveal 0.4s ease forwards; opacity: 0; }
        .demo-line:nth-child(1) { width: 92%; animation-delay: 1.2s; }
        .demo-line:nth-child(2) { width: 87%; animation-delay: 1.35s; }
        .demo-line:nth-child(3) { width: 94%; animation-delay: 1.5s; }
        .demo-line:nth-child(4) { width: 78%; animation-delay: 1.65s; }
        .demo-line:nth-child(5) { width: 89%; animation-delay: 1.8s; }
        .demo-line:nth-child(6) { width: 60%; animation-delay: 1.95s; }
        @keyframes lineReveal { from { opacity: 0; width: 0; } to { opacity: 1; } }

        .section { padding: 100px 60px; position: relative; }
        .section-light { background: var(--cream); color: var(--dark); }
        .section-mid { background: var(--bg2); color: var(--dark); }
        .section-header { text-align: center; margin-bottom: 72px; }
        .section-eyebrow { display: inline-flex; align-items: center; gap: 12px; font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold); margin-bottom: 20px; }
        .section-light .section-eyebrow { color: var(--gold-dim); }
        .section-title { font-family: var(--font-cormorant), 'Cormorant Garamond', serif; font-size: clamp(36px, 4vw, 54px); font-weight: 300; line-height: 1.1; letter-spacing: -0.02em; }
        .section-light .section-title { color: var(--dark); }
        .section-title em { font-style: italic; color: var(--gold); }
        .section-sub { font-size: 15px; color: #888; margin-top: 16px; line-height: 1.7; max-width: 500px; margin-left: auto; margin-right: auto; }
        .section-light .section-sub { color: var(--mid); }

        .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; max-width: 1000px; margin: 0 auto; background: rgba(255,255,255,0.04); }
        .step { background: var(--dark2); padding: 48px 36px; position: relative; transition: background 0.3s; }
        .step:hover { background: var(--dark3); }
        .step-number { font-family: var(--font-cormorant), 'Cormorant Garamond', serif; font-size: 72px; font-weight: 300; color: rgba(201,169,110,0.12); line-height: 1; margin-bottom: 24px; letter-spacing: -0.04em; }
        .step-icon { font-size: 28px; margin-bottom: 20px; }
        .step-title { font-family: var(--font-cormorant), 'Cormorant Garamond', serif; font-size: 22px; font-weight: 500; color: var(--cream); margin-bottom: 12px; }
        .step-desc { font-size: 13px; line-height: 1.75; color: #777; }

        .features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; max-width: 1000px; margin: 0 auto; background: var(--light); }
        .feature { background: var(--cream); padding: 44px 40px; transition: background 0.3s; }
        .feature:hover { background: #fff; }
        .feature-icon { width: 44px; height: 44px; border: 1px solid var(--gold-dim); display: flex; align-items: center; justify-content: center; font-size: 18px; margin-bottom: 24px; color: var(--gold-dim); }
        .feature-title { font-family: var(--font-cormorant), 'Cormorant Garamond', serif; font-size: 22px; font-weight: 500; color: var(--dark); margin-bottom: 10px; }
        .feature-desc { font-size: 13px; line-height: 1.75; color: var(--mid); }

        .sample-section { background: var(--dark); padding: 100px 60px; }
        .sample-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; max-width: 1000px; margin: 0 auto; }
        .sample-card { background: var(--dark2); border-top: 2px solid var(--gold); padding: 36px; }
        .sample-label { font-size: 9px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--gold); margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .sample-label::after { content: ''; flex: 1; height: 1px; background: rgba(201,169,110,0.2); }
        .sample-title { font-family: var(--font-cormorant), 'Cormorant Garamond', serif; font-size: 20px; font-weight: 400; color: var(--cream); margin-bottom: 16px; line-height: 1.3; }
        .sample-text { font-size: 13px; line-height: 1.85; color: #888; }

        .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; max-width: 900px; margin: 0 auto; background: rgba(255,255,255,0.04); }
        .price-card { background: var(--dark2); padding: 44px 32px; display: flex; flex-direction: column; transition: background 0.3s; position: relative; }
        .price-card.featured { background: var(--dark3); border-top: 2px solid var(--gold); }
        .price-badge { position: absolute; top: -1px; left: 50%; transform: translateX(-50%); background: var(--gold); color: var(--dark); font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; padding: 4px 14px; font-weight: 500; }
        .price-name { font-size: 10px; letter-spacing: 0.24em; text-transform: uppercase; color: #666; margin-bottom: 24px; }
        .price-card.featured .price-name { color: var(--gold); }
        .price-amount { font-family: var(--font-cormorant), 'Cormorant Garamond', serif; font-size: 56px; font-weight: 300; line-height: 1; color: var(--cream); margin-bottom: 6px; }
        .price-amount sup { font-size: 22px; vertical-align: super; margin-right: 2px; }
        .price-unit { font-size: 12px; color: #555; margin-bottom: 32px; }
        .price-features { list-style: none; display: flex; flex-direction: column; gap: 12px; flex: 1; margin-bottom: 36px; }
        .price-features li { font-size: 13px; color: #888; display: flex; align-items: flex-start; gap: 10px; line-height: 1.5; }
        .price-features li::before { content: '✦'; color: var(--gold); font-size: 8px; margin-top: 4px; flex-shrink: 0; }
        .price-card.featured .price-features li { color: #aaa; }
        .price-cta { padding: 14px; text-align: center; border: 1px solid rgba(255,255,255,0.1); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #666; cursor: pointer; text-decoration: none; display: block; transition: all 0.25s; }
        .price-cta:hover { border-color: var(--gold); color: var(--gold); }
        .price-card.featured .price-cta { background: var(--gold); border-color: var(--gold); color: var(--dark); font-weight: 500; }
        .price-card.featured .price-cta:hover { background: var(--gold-light); }

        .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1000px; margin: 0 auto; }
        .testimonial { background: #fff; padding: 36px; border-left: 3px solid var(--light); transition: border-color 0.3s; }
        .testimonial:hover { border-left-color: var(--gold); }
        .testimonial-text { font-family: var(--font-cormorant), 'Cormorant Garamond', serif; font-size: 18px; font-weight: 400; font-style: italic; line-height: 1.65; color: var(--dark); margin-bottom: 24px; }
        .testimonial-name { font-weight: 500; color: var(--dark); font-size: 12px; }
        .testimonial-role { font-size: 11px; color: #aaa; margin-top: 3px; }

        .faq-list { max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 2px; }
        .faq-item { background: var(--dark2); overflow: hidden; }
        .faq-question { padding: 22px 28px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: background 0.2s; font-size: 15px; color: var(--cream); font-weight: 400; gap: 16px; }
        .faq-question:hover { background: var(--dark3); }
        .faq-toggle { width: 24px; height: 24px; flex-shrink: 0; border: 1px solid rgba(201,169,110,0.3); display: flex; align-items: center; justify-content: center; font-size: 14px; color: var(--gold); transition: transform 0.3s; }
        .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; }
        .faq-answer-inner { padding: 0 28px 24px; font-size: 14px; line-height: 1.8; color: #888; }
        .faq-item.open .faq-answer { max-height: 300px; }
        .faq-item.open .faq-toggle { transform: rotate(45deg); }

        .cta-section { background: var(--dark); padding: 120px 60px; text-align: center; position: relative; overflow: hidden; }
        .cta-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 60% 80% at 50% 100%, rgba(201,169,110,0.08) 0%, transparent 70%); }
        .cta-content { position: relative; z-index: 1; }
        .cta-title { font-family: var(--font-cormorant), 'Cormorant Garamond', serif; font-size: clamp(40px, 5vw, 68px); font-weight: 300; line-height: 1.1; color: var(--cream); margin-bottom: 20px; }
        .cta-title em { font-style: italic; color: var(--gold); }
        .cta-sub { font-size: 15px; color: #666; margin-bottom: 48px; line-height: 1.7; }
        .cta-note { margin-top: 24px; font-size: 12px; color: #555; letter-spacing: 0.06em; }

        footer { background: #111112; padding: 48px 60px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px; }
        .footer-logo { font-family: var(--font-cormorant), 'Cormorant Garamond', serif; font-size: 22px; }
        .footer-logo span:first-child { color: var(--cream); font-weight: 500; }
        .footer-logo span:last-child { color: var(--gold); font-style: italic; font-weight: 300; }
        .footer-links { display: flex; gap: 28px; list-style: none; flex-wrap: wrap; }
        .footer-links a { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #555; text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: var(--gold); }
        .footer-copy { font-size: 11px; color: #444; }

        .gold-divider { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 24px; }
        .gold-divider span { color: var(--gold); font-size: 10px; }
        .gold-divider::before, .gold-divider::after { content: ''; flex: 1; height: 1px; background: rgba(201,169,110,0.2); }

        @media (max-width: 900px) {
          nav { padding: 16px 24px; }
          .nav-links { display: none; }
          .hero { padding: 100px 24px 60px; }
          .section { padding: 72px 24px; }
          .demo-section { padding: 0 24px 72px; }
          .sample-section { padding: 72px 24px; }
          .cta-section { padding: 80px 24px; }
          footer { padding: 36px 24px; }
          .steps { grid-template-columns: 1fr; }
          .features-grid { grid-template-columns: 1fr; }
          .pricing-grid { grid-template-columns: 1fr; }
          .testimonials-grid { grid-template-columns: 1fr; }
          .sample-grid { grid-template-columns: 1fr; }
          .demo-content { grid-template-columns: 1fr; }
          .demo-sidebar { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .hero-proof { gap: 24px; }
          .proof-sep { display: none; }
        }
      `}</style>

      {/* NAV */}
      <nav ref={navRef}>
        <div className="nav-logo">
          <span className="nav-logo-main">Redac</span>
          <span className="nav-logo-accent">Immo</span>
        </div>
        <ul className="nav-links">
          <li><a href="#fonctionnement">Fonctionnement</a></li>
          <li><a href="#fonctionnalites">Fonctionnalités</a></li>
          <li><a href="#tarifs">Tarifs</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <Link href="/register" className="nav-cta">Commencer</Link>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-content">
          <div className="hero-eyebrow">Annonces immobilières professionnelles</div>
          <h1 className="hero-title">
            Vos annonces,<br />
            rédigées en <em>24h</em><br />
            par nos rédacteurs
          </h1>
          <p className="hero-subtitle">
            Descriptions précises, ton professionnel, versions française et anglaise —
            conçu pour les agents immobiliers qui veulent vendre plus vite.
          </p>
          <div className="hero-actions">
            <Link href="/register" className="btn-primary">Obtenir mon annonce</Link>
            <a href="#fonctionnement" className="btn-ghost">Voir comment ça marche</a>
          </div>
          <div className="hero-proof">
            <div className="proof-item">
              <div className="proof-number">2 min</div>
              <div className="proof-label">Pour remplir le formulaire</div>
            </div>
            <div className="proof-sep" />
            <div className="proof-item">
              <div className="proof-number">24h</div>
              <div className="proof-label">Délai de livraison</div>
            </div>
            <div className="proof-sep" />
            <div className="proof-item">
              <div className="proof-number">2</div>
              <div className="proof-label">Versions incluses (FR + EN)</div>
            </div>
            <div className="proof-sep" />
            <div className="proof-item">
              <div className="proof-number">5€</div>
              <div className="proof-label">À partir de</div>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO PREVIEW */}
      <div className="demo-section">
        <div className="demo-window">
          <div className="demo-bar">
            <div className="demo-dot" style={{ background: '#ff5f57' }} />
            <div className="demo-dot" style={{ background: '#febc2e' }} />
            <div className="demo-dot" style={{ background: '#28c840' }} />
            <div className="demo-url">redac-immo.fr — Interface de génération</div>
          </div>
          <div className="demo-content">
            <div className="demo-sidebar">
              <div className="demo-field-group">
                <div className="demo-label">Type de bien</div>
                <div className="demo-field"><span className="demo-field-highlight">Appartement</span></div>
              </div>
              <div className="demo-field-group">
                <div className="demo-label">Surface</div>
                <div className="demo-field"><span className="demo-field-highlight">87 m²</span></div>
              </div>
              <div className="demo-field-group">
                <div className="demo-label">Localisation</div>
                <div className="demo-field"><span className="demo-field-highlight">Lyon 6ème — Brotteaux</span></div>
              </div>
              <div className="demo-field-group">
                <div className="demo-label">Prix</div>
                <div className="demo-field"><span className="demo-field-highlight">385 000 €</span></div>
              </div>
              <div className="demo-btn-generate">✦ Générer l'annonce</div>
            </div>
            <div className="demo-main">
              <div className="demo-result-header">
                <span style={{ fontSize: 14 }}>🇫🇷</span>
                <div className="demo-result-title">Version française générée</div>
                <div className="demo-copy-btn">Copier</div>
              </div>
              <div className="demo-lines">
                {[...Array(6)].map((_, i) => <div key={i} className="demo-line" />)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="section" id="fonctionnement">
        <div className="section-header reveal">
          <div className="section-eyebrow">Processus</div>
          <h2 className="section-title">Simple comme<br /><em>un formulaire</em></h2>
          <p className="section-sub">Trois étapes, aucune compétence rédactionnelle requise.</p>
        </div>
        <div className="steps">
          {[
            { n: '01', icon: '📋', title: 'Remplissez le formulaire', desc: 'Surface, localisation, équipements, prix — renseignez les informations clés de votre bien en 2 minutes.' },
            { n: '02', icon: '✦', title: 'Notre équipe rédige', desc: 'Nos rédacteurs spécialisés en immobilier produisent une annonce structurée, précise et professionnelle — sans superlatifs creux, avec de vrais arguments de vente.' },
            { n: '03', icon: '📤', title: 'Publiez en un clic', desc: 'Copiez et publiez directement sur LeBonCoin, PAP.fr, Rightmove ou Zoopla. Version réseaux sociaux incluse.' },
          ].map(s => (
            <div key={s.n} className="step reveal">
              <div className="step-number">{s.n}</div>
              <div className="step-icon">{s.icon}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SAMPLE LISTINGS */}
      <section className="sample-section" id="exemples">
        <div className="section-header reveal">
          <div className="section-eyebrow" style={{ color: 'var(--gold)' }}>Exemples</div>
          <h2 className="section-title" style={{ color: 'var(--cream)' }}>Des annonces qui<br /><em>font vendre</em></h2>
          <p className="section-sub">Voici ce que Redac-Immo produit pour vos biens.</p>
        </div>
        <div className="sample-grid">
          <div className="sample-card reveal">
            <div className="sample-label">🇫🇷 Appartement · Lyon 6ème</div>
            <div className="sample-title">87 m² aux Brotteaux — lumière et caractère</div>
            <div className="sample-text">Dans l'un des quartiers les plus recherchés de Lyon, cet appartement du 4ème étage s'ouvre sur un double séjour de 32 m² orienté sud-ouest, traversé de lumière en fin de journée. La cuisine indépendante, récemment rénovée, conserve ses moulures d'origine. Deux chambres calmes sur cour, une salle de bain en pierre naturelle. Parquet point de Hongrie, double vitrage, cave et parking en sous-sol. À 4 minutes à pied du marché de la Tête d'Or.</div>
          </div>
          <div className="sample-card reveal">
            <div className="sample-label">🇬🇧 Villa · Mougins</div>
            <div className="sample-title">293 m² overlooking the Côte d'Azur</div>
            <div className="sample-text">Set on a 1,016 m² landscaped plot above Mougins, this six-room villa captures unobstructed views across the bay toward Cannes. The main living area — 58 m² with original stone fireplace — opens directly onto a south-facing terrace. An 11×6m heated pool, fully equipped summer kitchen, and four-car garage complete the property. Ten minutes from the village centre, twenty from Nice Côte d'Azur airport.</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section section-mid" id="fonctionnalites">
        <div className="section-header reveal">
          <div className="section-eyebrow">Fonctionnalités</div>
          <h2 className="section-title">Tout ce dont vous<br /><em>avez besoin</em></h2>
        </div>
        <div className="features-grid">
          {[
            { icon: '🌍', title: 'Multilingue natif', desc: 'Version française et anglaise générées simultanément. Idéal pour les biens destinés à une clientèle internationale.' },
            { icon: '✦', title: 'Rédaction sans jargon', desc: 'Aucun superlatif vide. Chaque phrase porte une information concrète — surface, matériaux, orientation, proximités.' },
            { icon: '📱', title: 'Version réseaux sociaux', desc: 'Un résumé percutant de 280 caractères, prêt à coller sur Instagram, Facebook ou LinkedIn.' },
            { icon: '⚡', title: 'Livraison sous 24h', desc: 'Commandez le soir, publiez le lendemain matin. Le délai est garanti sur chaque commande.' },
            { icon: '🔗', title: 'Publication directe', desc: 'Liens intégrés vers LeBonCoin, PAP.fr, Rightmove et Zoopla. Copiez, collez, publiez.' },
            { icon: '📂', title: 'Historique complet', desc: 'Retrouvez toutes vos annonces passées, rechargez-les en un clic, téléchargez-les au format texte.' },
          ].map(f => (
            <div key={f.title} className="feature reveal">
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="section" id="tarifs">
        <div className="section-header reveal">
          <div className="section-eyebrow">Tarifs</div>
          <h2 className="section-title">Prix <em>transparents</em><br />sans abonnement</h2>
          <p className="section-sub">Vous ne payez que ce dont vous avez besoin, quand vous en avez besoin.</p>
        </div>
        <div className="pricing-grid">
          <div className="price-card reveal">
            <div className="price-name">Basique</div>
            <div className="price-amount"><sup>€</sup>5</div>
            <div className="price-unit">par annonce</div>
            <ul className="price-features">
              <li>Version française complète</li>
              <li>Version réseaux sociaux</li>
              <li>Liens publication directe</li>
              <li>Historique de vos annonces</li>
            </ul>
            <Link href="/register" className="price-cta">Commander</Link>
          </div>
          <div className="price-card featured reveal">
            <div className="price-badge">Le plus demandé</div>
            <div className="price-name">Essentiel</div>
            <div className="price-amount"><sup>€</sup>9<span style={{ fontSize: 28 }}>,99</span></div>
            <div className="price-unit">par annonce</div>
            <ul className="price-features">
              <li>Version française complète</li>
              <li>Version anglaise incluse</li>
              <li>Version réseaux sociaux</li>
              <li>Liens publication directe</li>
              <li>Historique de vos annonces</li>
            </ul>
            <Link href="/register" className="price-cta">Commander</Link>
          </div>
          <div className="price-card reveal">
            <div className="price-name">Agence</div>
            <div className="price-amount"><sup>€</sup>65</div>
            <div className="price-unit">/ mois · illimité</div>
            <div style={{ display: 'inline-block', marginBottom: 20, padding: '4px 12px', border: '1px solid rgba(201,169,110,0.4)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)' }}>Sans engagement</div>
            <ul className="price-features">
              <li>Annonces illimitées</li>
              <li>Versions française &amp; anglaise</li>
              <li>Version réseaux sociaux</li>
              <li>Liens publication directe</li>
              <li>Dashboard agence dédié</li>
              <li>Support prioritaire</li>
              <li><strong style={{ color: 'var(--gold)' }}>3 annonces offertes à l'activation</strong></li>
              <li>Résiliable à tout moment</li>
            </ul>
            <Link href="/register" className="price-cta">Nous contacter</Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section section-light">
        <div className="section-header reveal">
          <div className="section-eyebrow">Témoignages</div>
          <h2 className="section-title">Ce qu'en disent<br /><em>nos clients</em></h2>
        </div>
        <div className="testimonials-grid">
          {[
            { text: "\u201cLe temps pass\u00e9 \u00e0 r\u00e9diger mes annonces a \u00e9t\u00e9 divis\u00e9 par cinq. La qualit\u00e9 est au rendez-vous, et mes clients le remarquent.\u201d", name: 'Sophie M.', role: 'Agent ind\u00e9pendante \u00b7 Bordeaux' },
            { text: "\u201cJe g\u00e8re un portefeuille de 30 biens. Redac-Immo m\u2019a permis de tout publier en anglais aussi, sans traducteur.\u201d", name: '\u00c9ric D.', role: "Directeur d\u2019agence \u00b7 C\u00f4te d\u2019Azur" },
            { text: "\u201cLes textes sont pr\u00e9cis, sans les formules toutes faites qu\u2019on voit partout. Mes annonces se d\u00e9marquent vraiment.\u201d", name: 'Laure B.', role: 'Mandataire immobilier \u00b7 Lyon' },
          ].map(t => (
            <div key={t.name} className="testimonial reveal">
              <div className="testimonial-text">{t.text}</div>
              <div>
                <div className="testimonial-name">{t.name}</div>
                <div className="testimonial-role">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="section-header reveal">
          <div className="section-eyebrow">FAQ</div>
          <h2 className="section-title">Questions <em>fréquentes</em></h2>
        </div>
        <div className="faq-list">
          {[
            { q: "En quoi Redac-Immo est-il diff\u00e9rent d\u2019un r\u00e9dacteur humain\u00a0?", a: "Redac-Immo g\u00e9n\u00e8re des annonces en quelques secondes, disponibles sous 24h, pour 5\u20ac au lieu de 50 \u00e0 150\u20ac par annonce chez un r\u00e9dacteur freelance. La qualit\u00e9 est calibr\u00e9e sur les standards des grandes agences \u2014 sans les superlatifs vides." },
            { q: "Puis-je modifier l\u2019annonce apr\u00e8s g\u00e9n\u00e9ration\u00a0?", a: "Oui, bien s\u00fbr. Le texte g\u00e9n\u00e9r\u00e9 est enti\u00e8rement modifiable. Vous pouvez copier, coller et ajuster selon vos pr\u00e9f\u00e9rences avant publication. L\u2019annonce vous appartient." },
            { q: "La version anglaise est-elle une traduction ou une r\u00e9daction originale\u00a0?", a: "C\u2019est une r\u00e9daction originale adapt\u00e9e au march\u00e9 anglophone \u2014 pas une traduction litt\u00e9rale. Le ton et les arguments sont ajust\u00e9s pour s\u00e9duire un acheteur britannique ou international." },
            { q: "Mes donn\u00e9es sont-elles confidentielles\u00a0?", a: "Oui. Redac-Immo est conforme au RGPD. Les informations que vous saisissez sont utilis\u00e9es uniquement pour g\u00e9n\u00e9rer votre annonce et ne sont jamais revendues ni transmises \u00e0 des tiers." },
            { q: "Fonctionne-t-il pour tous les types de biens\u00a0?", a: "Appartements, maisons, villas, ch\u00e2teaux, terrains constructibles, locaux commerciaux \u2014 Redac-Immo adapte le style et la structure selon le type de bien et la gamme de prix." },
          ].map(({ q, a }) => (
            <div key={q} className="faq-item reveal">
              <div className="faq-question" onClick={e => toggleFaq(e.currentTarget)}>
                <span>{q}</span>
                <div className="faq-toggle">+</div>
              </div>
              <div className="faq-answer">
                <div className="faq-answer-inner">{a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-section">
        <div className="cta-bg" />
        <div className="cta-content reveal">
          <h2 className="cta-title">Votre prochaine annonce,<br />en <em>moins de 24h</em></h2>
          <p className="cta-sub">Sans abonnement. Sans engagement. Juste une annonce professionnelle.</p>
          <Link href="/register" className="btn-primary">Commencer maintenant</Link>
          <div className="cta-note">À partir de 5€ · Livraison garantie sous 24h</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">
          <span>Redac</span><span>Immo</span>
        </div>
        <ul className="footer-links">
          <li><a href="#">Mentions légales</a></li>
          <li><a href="#">Politique de confidentialité</a></li>
          <li><a href="#">CGV</a></li>
          <li><Link href="/login">Connexion</Link></li>
        </ul>
        <div className="footer-copy">© 2025 Redac-Immo — Tous droits réservés</div>
      </footer>
    </>
  )
}
