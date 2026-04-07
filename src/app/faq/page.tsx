'use client'

import Link from 'next/link'
import { useState } from 'react'

const FAQS = [
  {
    q: "En quoi Redac-Immo est-il diff\u00e9rent d\u2019un r\u00e9dacteur humain\u00a0?",
    a: "Redac-Immo g\u00e9n\u00e8re des annonces en quelques secondes pour 5\u20ac au lieu de 50 \u00e0 150\u20ac chez un r\u00e9dacteur freelance. La qualit\u00e9 est calibr\u00e9e sur les standards des grandes agences \u2014 Sotheby\u2019s, Barnes, Engel & V\u00f6lkers \u2014 sans les superlatifs vides. Vous obtenez un texte structur\u00e9, pr\u00e9cis et professionnel, pr\u00eat \u00e0 publier.",
  },
  {
    q: "Puis-je modifier l\u2019annonce apr\u00e8s g\u00e9n\u00e9ration\u00a0?",
    a: "Oui, bien s\u00fbr. Le texte g\u00e9n\u00e9r\u00e9 est enti\u00e8rement modifiable. Vous pouvez copier, coller et ajuster selon vos pr\u00e9f\u00e9rences avant publication. L\u2019annonce vous appartient \u2014 aucune restriction d\u2019usage.",
  },
  {
    q: "La version anglaise est-elle une traduction ou une r\u00e9daction originale\u00a0?",
    a: "C\u2019est une r\u00e9daction originale adapt\u00e9e au march\u00e9 anglophone \u2014 pas une traduction litt\u00e9rale. Le ton et les arguments sont ajust\u00e9s pour s\u00e9duire un acheteur britannique ou international, avec les rep\u00e8res culturels appropri\u00e9s.",
  },
  {
    q: "Mes donn\u00e9es sont-elles confidentielles\u00a0?",
    a: "Oui. Redac-Immo est conforme au RGPD. Les informations que vous saisissez sont utilis\u00e9es uniquement pour g\u00e9n\u00e9rer votre annonce et ne sont jamais revendues ni transmises \u00e0 des tiers. Vos donn\u00e9es sont stock\u00e9es de mani\u00e8re s\u00e9curis\u00e9e et chiffr\u00e9es.",
  },
  {
    q: "Fonctionne-t-il pour tous les types de biens\u00a0?",
    a: "Appartements, maisons, villas, ch\u00e2teaux, terrains constructibles, locaux commerciaux \u2014 Redac-Immo adapte le style et la structure selon le type de bien et la gamme de prix. Chaque annonce est calibr\u00e9e pour son march\u00e9 cible.",
  },
  {
    q: "Combien de temps faut-il pour obtenir mon annonce\u00a0?",
    a: "La g\u00e9n\u00e9ration prend quelques secondes. Vous avez votre annonce imm\u00e9diatement dans votre dashboard. Le d\u00e9lai annonc\u00e9 de 24h est une garantie maximale \u2014 en pratique, c\u2019est instantan\u00e9.",
  },
  {
    q: "Puis-je commander plusieurs annonces\u00a0?",
    a: "Oui. Chaque commande g\u00e9n\u00e8re une annonce ind\u00e9pendante. Toutes vos annonces sont sauvegard\u00e9es dans votre dashboard et accessibles \u00e0 tout moment. L\u2019offre Agence permet un volume illimit\u00e9 \u00e0 tarif mensuel fixe.",
  },
  {
    q: "Comment fonctionne l\u2019offre Agence\u00a0?",
    a: "L\u2019offre Agence \u00e0 65\u20ac/mois donne acc\u00e8s \u00e0 un volume illimit\u00e9 d\u2019annonces, avec les versions fran\u00e7aise, anglaise et r\u00e9seaux sociaux incluses. Sans engagement, r\u00e9siliable \u00e0 tout moment. 3 annonces offertes \u00e0 l\u2019activation pour tester le service.",
  },
  {
    q: "Dois-je cr\u00e9er un compte pour commander\u00a0?",
    a: "Oui, un compte est n\u00e9cessaire pour acc\u00e9der \u00e0 l\u2019interface de g\u00e9n\u00e9ration et retrouver vos annonces. La cr\u00e9ation de compte est gratuite et prend moins de 2 minutes.",
  },
  {
    q: "La version r\u00e9seaux sociaux est-elle incluse dans toutes les offres\u00a0?",
    a: "Oui. Chaque annonce g\u00e9n\u00e9r\u00e9e inclut une version courte (280 caract\u00e8res max) adapt\u00e9e \u00e0 Instagram, Facebook et LinkedIn, quelle que soit la formule choisie.",
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
        <div className="footer-copy">© 2025 Redac-Immo — Tous droits réservés</div>
      </footer>
    </>
  )
}
