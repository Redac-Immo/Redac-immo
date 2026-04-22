'use client'

import Link from 'next/link'
import { useState } from 'react'

const FAQS = [
  {
    q: "En quoi Redac-Immo est-il différent d'un rédacteur humain ?",
    a: "Redac-Immo génère des annonces en quelques secondes pour 5€ au lieu de 50 à 150€ chez un rédacteur freelance. La qualité est calibrée sur les standards des grandes agences — Sotheby's, Barnes, Engel & Völkers — sans les superlatifs vides. Vous obtenez un texte structuré, précis et professionnel, prêt à publier.",
  },
  {
    q: "Puis-je modifier l'annonce après génération ?",
    a: "Oui, bien sûr. Le texte généré est entièrement modifiable. Vous pouvez copier, coller et ajuster selon vos préférences avant publication. L'annonce vous appartient — aucune restriction d'usage.",
  },
  {
    q: "La version anglaise est-elle une traduction ou une rédaction originale ?",
    a: "C'est une rédaction originale adaptée au marché anglophone — pas une traduction littérale. Le ton et les arguments sont ajustés pour séduire un acheteur britannique ou international, avec les repères culturels appropriés.",
  },
  {
    q: "Mes données sont-elles confidentielles ?",
    a: "Oui. Redac-Immo est conforme au RGPD. Les informations que vous saisissez sont utilisées uniquement pour générer votre annonce et ne sont jamais revendues ni transmises à des tiers. Vos données sont stockées de manière sécurisée et chiffrées.",
  },
  {
    q: "Fonctionne-t-il pour tous les types de biens ?",
    a: "Appartements, maisons, villas, châteaux, terrains constructibles, locaux commerciaux — Redac-Immo adapte le style et la structure selon le type de bien et la gamme de prix. Chaque annonce est calibrée pour son marché cible.",
  },
  {
    q: "Combien de temps faut-il pour obtenir mon annonce ?",
    a: "La génération prend quelques secondes. Vous avez votre annonce immédiatement dans votre dashboard. Le délai annoncé de 24h est une garantie maximale — en pratique, c'est instantané.",
  },
  {
    q: "Puis-je commander plusieurs annonces ?",
    a: "Oui. Chaque commande génère une annonce indépendante. Toutes vos annonces sont sauvegardées dans votre dashboard et accessibles à tout moment. L'offre Agence permet un volume illimité à tarif mensuel fixe.",
  },
  {
    q: "Comment fonctionne l'offre Agence ?",
    a: "L'offre Agence à 65€/mois donne accès à un volume illimité d'annonces, avec les versions française, anglaise et réseaux sociaux incluses. Sans engagement, résiliable à tout moment. 3 annonces offertes à l'activation pour tester le service.",
  },
  {
    q: "Dois-je créer un compte pour commander ?",
    a: "Oui, un compte est nécessaire pour accéder à l'interface de génération et retrouver vos annonces. La création de compte est gratuite et prend moins de 2 minutes.",
  },
  {
    q: "La version réseaux sociaux est-elle incluse dans toutes les offres ?",
    a: "Oui. Chaque annonce générée inclut une version courte (280 caractères max) adaptée à Instagram, Facebook et LinkedIn, quelle que soit la formule choisie.",
  },
  {
    q: "Proposez-vous une période d'essai gratuite ?",
    a: "Nous n'avons pas d'essai gratuit automatique, mais nous offrons 3 annonces à l'activation de la formule Agence. Pour tester la qualité, vous pouvez commander une annonce Basique à 5€ sans engagement.",
  },
  {
    q: "Quels sont les délais de livraison réels ?",
    a: "La génération prend moins de 30 secondes. L'annonce est disponible immédiatement dans votre espace client. Le délai de 24h est une garantie maximale en cas d'incident technique.",
  },
  {
    q: "Puis-je utiliser les annonces sur tous les portails ?",
    a: "Oui. Les annonces sont livrées en texte brut, compatibles avec tous les portails : LeBonCoin, SeLoger, Bien'ici, PAP, Logic-immo, et les portails internationaux comme Rightmove ou Zoopla.",
  },
  {
    q: "Comment sont calculés les 3 crédits de la formule Essentiel ?",
    a: "Chaque génération d'annonce consomme 1 crédit. Vous pouvez générer 3 annonces complètes (FR + EN + réseaux sociaux). Les crédits n'expirent pas et sont utilisables quand vous le souhaitez.",
  },
]

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function toggle(i: number) {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: var(--font-dm-sans), 'DM Sans', sans-serif; background: var(--dark); color: var(--cream); }

        .faq-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 20px 60px; display: flex; align-items: center; justify-content: space-between; background: rgba(24,24,26,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(201,169,110,0.15); }
        .nav-logo { display: flex; align-items: baseline; font-family: var(--font-cormorant), 'Cormorant Garamond', serif; }
        .nav-logo-main { font-size: 24px; font-weight: 500; color: var(--cream); }
        .nav-logo-accent { font-size: 24px; font-weight: 300; font-style: italic; color: var(--gold); }
        .nav-back { font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--gold); text-decoration: none; display: flex; align-items: center; gap: 8px; }
        .nav-back:hover { opacity: 0.8; }

        .faq-hero { padding: 160px 60px 80px; text-align: center; }
        .faq-eyebrow { display: inline-flex; align-items: center; gap: 12px; font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold); margin-bottom: 24px; }
        .faq-eyebrow::before, .faq-eyebrow::after { content: ''; width: 32px; height: 1px; background: var(--gold-dim); }
        .faq-title { font-family: var(--font-cormorant), 'Cormorant Garamond', serif; font-size: clamp(42px, 6vw, 72px); font-weight: 300; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 20px; }
        .faq-title em { font-style: italic; color: var(--gold); }
        .faq-sub { font-size: 15px; color: #888; line-height: 1.7; max-width: 480px; margin: 0 auto; }

        .faq-body { max-width: 760px; margin: 0 auto; padding: 0 60px 120px; }
        .faq-list { display: flex; flex-direction: column; gap: 2px; }
        .faq-item { background: var(--dark2); overflow: hidden; }
        .faq-question { padding: 22px 28px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: background 0.2s; font-size: 15px; color: var(--cream); font-weight: 400; gap: 16px; border: none; background: var(--dark2); width: 100%; text-align: left; }
        .faq-question:hover { background: var(--dark3); }
        .faq-toggle { width: 24px; height: 24px; flex-shrink: 0; border: 1px solid rgba(201,169,110,0.3); display: flex; align-items: center; justify-content: center; font-size: 14px; color: var(--gold); transition: transform 0.3s; }
        .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; }
        .faq-answer.open { max-height: 400px; }
        .faq-toggle.open { transform: rotate(45deg); }
        .faq-answer-inner { padding: 0 28px 24px; font-size: 14px; line-height: 1.85; color: #888; }

        .faq-cta { margin-top: 80px; padding: 56px; background: var(--dark2); border-top: 2px solid var(--gold); text-align: center; }
        .faq-cta-title { font-family: var(--font-cormorant), 'Cormorant Garamond', serif; font-size: 32px; font-weight: 300; color: var(--cream); margin-bottom: 12px; }
        .faq-cta-sub { font-size: 14px; color: #777; margin-bottom: 32px; }
        .btn-primary { padding: 14px 36px; background: var(--gold); color: var(--dark); border: none; font-family: var(--font-dm-sans), 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; cursor: pointer; text-decoration: none; display: inline-block; transition: all 0.25s; }
        .btn-primary:hover { background: var(--gold-light); }

        footer { background: #111112; padding: 36px 60px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
        .footer-logo { font-family: var(--font-cormorant), 'Cormorant Garamond', serif; font-size: 20px; }
        .footer-logo span:first-child { color: var(--cream); font-weight: 500; }
        .footer-logo span:last-child { color: var(--gold); font-style: italic; font-weight: 300; }
        .footer-copy { font-size: 11px; color: #444; }

        @media (max-width: 768px) {
          .faq-nav { padding: 16px 24px; }
          .faq-hero { padding: 120px 24px 60px; }
          .faq-body { padding: 0 24px 80px; }
          footer { padding: 28px 24px; }
        }
      `}</style>

      <nav className="faq-nav">
        <Link href="/" className="nav-logo">
          <span className="nav-logo-main">Redac</span>
          <span className="nav-logo-accent">Immo</span>
        </Link>
        <Link href="/" className="nav-back">← Retour</Link>
      </nav>

      <div className="faq-hero">
        <div className="faq-eyebrow">Centre d'aide</div>
        <h1 className="faq-title">Questions <em>fréquentes</em></h1>
        <p className="faq-sub">Tout ce que vous devez savoir sur Redac-Immo. Vous ne trouvez pas votre réponse ? Contactez-nous.</p>
      </div>

      <div className="faq-body">
        <div className="faq-list">
          {FAQS.map(({ q, a }, i) => (
            <div key={i} className="faq-item">
              <button className="faq-question" onClick={() => toggle(i)}>
                <span>{q}</span>
                <div className={`faq-toggle${openIndex === i ? ' open' : ''}`}>+</div>
              </button>
              <div className={`faq-answer${openIndex === i ? ' open' : ''}`}>
                <div className="faq-answer-inner">{a}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-cta">
          <div className="faq-cta-title">Prêt à commencer ?</div>
          <div className="faq-cta-sub">Créez votre compte gratuitement et générez votre première annonce.</div>
          <Link href="/register" className="btn-primary">Créer un compte</Link>
        </div>
      </div>

      <footer>
        <div className="footer-logo"><span>Redac</span><span>Immo</span></div>
        <div className="footer-copy">© 2026 Redac-Immo — Tous droits réservés</div>
      </footer>
    </>
  )
}