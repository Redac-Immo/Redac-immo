'use client'
import ScrollReveal from './ScrollReveal'

/* ═══════════════════════════════════════════════════
   SECTION HEADER
═══════════════════════════════════════════════════ */
export function SectionHeader({
  eyebrow, title, sub, light = false,
}: {
  eyebrow: string
  title: React.ReactNode
  sub?: string
  light?: boolean
}) {
  return (
    <ScrollReveal>
      <div style={{ textAlign: 'center', marginBottom: '72px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '12px',
          fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase',
          color: light ? 'var(--gold-dim)' : 'var(--gold)',
          marginBottom: '20px',
        }}>
          {eyebrow}
        </div>
        <h2 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(36px, 4vw, 54px)',
          fontWeight: 300, lineHeight: 1.1,
          letterSpacing: '-0.02em',
          color: 'var(--dark)',
        }}>
          {title}
        </h2>
        {sub && (
          <p style={{
            fontSize: '15px', color: '#888', marginTop: '16px',
            lineHeight: 1.7, maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto',
          }}>
            {sub}
          </p>
        )}
      </div>
    </ScrollReveal>
  )
}

/* ═══════════════════════════════════════════════════
   HOW IT WORKS
═══════════════════════════════════════════════════ */
const STEPS = [
  { icon: '✏️', title: 'Renseignez votre bien', desc: 'Type, surface, localisation, points forts. 60 secondes de saisie au maximum.' },
  { icon: '⚡', title: 'Génération instantanée', desc: 'Votre annonce est rédigée en quelques secondes par notre système éditorial calibré.' },
  { icon: '✅', title: 'Recevez et publiez', desc: 'Version française, version anglaise, version réseaux sociaux. Copiez, ajustez, publiez.' },
]

export function HowItWorks() {
  return (
    <section style={{ padding: '100px 60px', background: 'var(--bg2)', position: 'relative', zIndex: 1 }}
             id="comment-ca-marche">
      <SectionHeader
        eyebrow="Comment ça marche"
        title={<>Trois étapes,<br />une annonce <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>professionnelle</em></>}
      />
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2px', maxWidth: '1000px', margin: '0 auto',
        background: 'var(--light)',
      }} className="steps-grid">
        {STEPS.map((step, i) => (
          <ScrollReveal key={step.title} delay={i * 80}>
            <div style={{ background: 'var(--cream)', padding: '48px 36px', transition: 'background 0.3s' }}
                 onMouseEnter={e => (e.currentTarget.style.background = '#fff')}
                 onMouseLeave={e => (e.currentTarget.style.background = 'var(--cream)')}>
              <div style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: '72px', fontWeight: 300,
                color: 'rgba(201,169,110,0.12)', lineHeight: 1, marginBottom: '24px',
                letterSpacing: '-0.04em',
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ fontSize: '28px', marginBottom: '20px' }}>{step.icon}</div>
              <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '22px', fontWeight: 500, color: 'var(--dark)', marginBottom: '12px' }}>
                {step.title}
              </div>
              <div style={{ fontSize: '13px', lineHeight: 1.75, color: 'var(--mid)' }}>
                {step.desc}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
      <style>{`
        @media (max-width: 900px) { .steps-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}

/* ═══════════════════════════════════════════════════
   NOTRE MÉTHODE
═══════════════════════════════════════════════════ */
const METHODE = [
  {
    num: 'I',
    title: 'Le bon registre pour chaque bien',
    desc: 'Un studio haussmannien à Paris ne se décrit pas comme une ferme rénovée en Dordogne. Notre système sélectionne automatiquement le registre éditorial adapté, prestige, résidentiel, caractère, locatif, investissement, et ajuste le vocabulaire, la structure et le ton en conséquence.',
  },
  {
    num: 'II',
    title: 'Une structure en 5 paragraphes calibrée',
    desc: 'Cadre & environnement, espaces de vie, cuisine, espaces privés, extérieur & pratique — chaque annonce suit la structure des grands réseaux internationaux. Pas de remplissage, pas de répétition : chaque paragraphe porte une information concrète et un argument de vente.',
  },
  {
    num: 'III',
    title: 'Zéro superlatif vide, 100% concret',
    desc: 'Pas de "magnifique", "exceptionnel" ou "coup de cœur". Chaque phrase cite une surface, un matériau, une orientation, une distance. Ce sont ces détails précis qui convainquent un acheteur, pas les adjectifs. Vous retravaillez et ajustez avant de publier : le texte final est le vôtre.',
  },
]

export function Methode() {
  return (
    <section style={{ padding: '100px 60px', background: 'var(--cream)', position: 'relative', zIndex: 1 }}
             id="methode">
      <SectionHeader
        eyebrow="Notre méthode"
        title={<>Ce qui fait la différence<br />entre un texte et une <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>annonce</em></>}
        sub="N'importe quel outil produit des mots. Notre process produit des arguments de vente."
        light
      />
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2px', maxWidth: '1000px', margin: '0 auto',
        background: 'var(--light)',
      }} className="methode-grid">
        {METHODE.map((m, i) => (
          <ScrollReveal key={m.num} delay={i * 80}>
            <div style={{ background: 'var(--cream)', padding: '48px 36px', transition: 'background 0.3s', height: '100%' }}
                 onMouseEnter={e => (e.currentTarget.style.background = '#fff')}
                 onMouseLeave={e => (e.currentTarget.style.background = 'var(--cream)')}>
              <div style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: '48px', fontWeight: 300, color: 'var(--gold)',
                marginBottom: '20px', opacity: 0.4,
              }}>
                {m.num}
              </div>
              <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '22px', fontWeight: 500, color: 'var(--dark)', marginBottom: '12px' }}>
                {m.title}
              </div>
              <div style={{ fontSize: '13px', lineHeight: 1.75, color: 'var(--mid)' }}>
                {m.desc}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
      <style>{`
        @media (max-width: 900px) { .methode-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}

/* ═══════════════════════════════════════════════════
   SAMPLE LISTINGS
═══════════════════════════════════════════════════ */
const SAMPLES = [
  {
    flag: '🇫🇷', tag: 'Appartement · Lyon 6ème',
    title: '87 m² aux Brotteaux, lumière et caractère',
    text: 'Dans l\'un des quartiers les plus recherchés de Lyon, cet appartement du 4ème étage s\'ouvre sur un double séjour de 32 m² orienté sud-ouest, traversé de lumière en fin de journée. La cuisine indépendante, récemment rénovée, conserve ses moulures d\'origine. Deux chambres calmes sur cour, une salle de bain en pierre naturelle. Parquet point de Hongrie, double vitrage, cave et parking en sous-sol. À 4 minutes à pied du marché de la Tête d\'Or.',
  },
  {
    flag: '🇫🇷', tag: 'Mas · Périgord Noir',
    title: 'Mas du XVIIe siècle, 340 m² de caractère',
    text: 'Au cœur du Périgord Noir, à moins de dix minutes de Sarlat, ce mas du XVIIe siècle déploie 340 m² sur un terrain boisé de 4 200 m². Pierres apparentes, poutres en chêne, deux cheminées en pierre de taille : chaque pièce témoigne d\'un patrimoine préservé. Sept chambres dont une suite parentale au rez-de-chaussée. Grange attenante convertible, piscine naturelle, potager clos. Raccordé au tout-à-l\'égout, double vitrage sur l\'ensemble des ouvertures.',
  },
  {
    flag: '🇬🇧', tag: 'Villa · Mougins',
    title: '293 m² overlooking the Côte d\'Azur',
    text: 'Set on a 1,016 m² landscaped plot above Mougins, this six-room villa captures unobstructed views across the bay toward Cannes. The main living area, 58 m² with original stone fireplace, opens directly onto a south-facing terrace. An 11×6m heated pool, fully equipped summer kitchen, and four-car garage complete the property. Ten minutes from the village centre, twenty from Nice Côte d\'Azur airport.',
  },
]

export function SampleListings() {
  return (
    <section style={{
      background: 'var(--dark)',
      borderTop: '1px solid rgba(201,169,110,0.15)',
      borderBottom: '1px solid rgba(201,169,110,0.15)',
      padding: '100px 60px',
      position: 'relative', zIndex: 1,
    }} id="exemples">
      <SectionHeader
        eyebrow="Exemples"
        title={<span style={{ color: 'var(--cream)' }}>Des annonces qui<br /><em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>font vendre</em></span>}
        sub="Voici ce que Redac-Immo produit pour vos biens."
      />
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px', maxWidth: '1000px', margin: '0 auto',
      }} className="samples-grid">
        {SAMPLES.map((s, i) => (
          <ScrollReveal key={s.title} delay={i * 80}>
            <div style={{
              background: '#fff',
              border: '1px solid var(--light)',
              borderTop: '2px solid var(--gold)',
              padding: '36px',
              height: '100%',
            }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px' }}>
                {s.flag} {s.tag}
              </div>
              <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '20px', fontWeight: 500, color: '#18181A', marginBottom: '16px', lineHeight: 1.3 }}>
                {s.title}
              </div>
              <div style={{ fontSize: '13px', lineHeight: 1.8, color: '#444' }}>
                {s.text}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
      <style>{`
        @media (max-width: 900px) { .samples-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}

/* ═══════════════════════════════════════════════════
   FEATURES
═══════════════════════════════════════════════════ */
const FEATURES = [
  { icon: '🌍', title: 'Multilingue natif', desc: 'Version française et anglaise générées simultanément. Idéal pour les biens destinés à une clientèle internationale.' },
  { icon: '✦',  title: 'Rédaction sans jargon', desc: 'Aucun superlatif vide. Chaque phrase porte une information concrète, surface, matériaux, orientation, proximités.' },
  { icon: '📱', title: 'Version réseaux sociaux', desc: 'Un résumé percutant de 280 caractères, prêt à coller sur Instagram, Facebook ou LinkedIn.' },
  { icon: '⚡', title: 'Livraison sous 24h', desc: 'Commandez le soir, publiez le lendemain matin. Le délai est garanti sur chaque commande.' },
  { icon: '🔗', title: 'Publication directe', desc: 'Liens intégrés vers LeBonCoin, PAP.fr, Rightmove et Zoopla. Copiez, collez, publiez.' },
  { icon: '📂', title: 'Historique complet', desc: 'Retrouvez toutes vos annonces passées, rechargez-les en un clic, téléchargez-les au format texte.' },
]

export function Features() {
  return (
    <section style={{ padding: '100px 60px', background: 'var(--bg2)', position: 'relative', zIndex: 1 }}
             id="fonctionnalites">
      <SectionHeader
        eyebrow="Fonctionnalités"
        title={<>Tout ce dont vous<br /><em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>avez besoin</em></>}
      />
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1px', maxWidth: '1000px', margin: '0 auto',
        background: 'var(--light)',
      }} className="features-grid">
        {FEATURES.map((f, i) => (
          <ScrollReveal key={f.title} delay={i * 60}>
            <div style={{ background: 'var(--cream)', padding: '44px 40px', transition: 'background 0.3s', height: '100%' }}
                 onMouseEnter={e => (e.currentTarget.style.background = '#fff')}
                 onMouseLeave={e => (e.currentTarget.style.background = 'var(--cream)')}>
              <div style={{
                width: '44px', height: '44px',
                border: '1px solid var(--gold-dim)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', marginBottom: '24px', color: 'var(--gold-dim)',
              }}>
                {f.icon}
              </div>
              <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '22px', fontWeight: 500, color: 'var(--dark)', marginBottom: '10px' }}>
                {f.title}
              </div>
              <div style={{ fontSize: '13px', lineHeight: 1.75, color: 'var(--mid)' }}>
                {f.desc}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
      <style>{`
        @media (max-width: 900px) { .features-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}

/* ═══════════════════════════════════════════════════
   PRICING
═══════════════════════════════════════════════════ */
const PLANS = [
  {
    name: 'Basique', amount: '5', unit: 'par annonce',
    features: ['Version française complète', 'Version réseaux sociaux', 'Liens publication directe', 'Livraison sous 24h'],
    cta: 'Commander', href: '/register',
  },
    {
    name: 'Essentiel', amount: '12', unit: '3 annonces',
    badge: 'Le plus demandé',
    featured: true,
    features: ['Version française complète', 'Version anglaise incluse', 'Version réseaux sociaux', 'Liens publication directe', 'Livraison sous 24h'],
    cta: 'Commander', href: '/register',
  },
  {
    name: 'Agence', amount: '65', unit: '/ mois · résiliable à tout moment',
    features: ['Annonces illimitées', 'Versions française & anglaise', 'Version réseaux sociaux', 'Liens publication directe', 'Dashboard agence dédié', '3 annonces offertes à l\'activation', 'Résiliable à tout moment'],
    cta: 'Nous contacter', href: 'mailto:contact@redac-immo.fr',
  },
  {
    name: 'Agence · Fondateur', amount: '50', unit: '/ mois · à vie · 10 places',
    badge: 'Offre fondateur', founder: true,
    features: ['Toutes les fonctionnalités Agence', 'Prix garanti à vie sur votre compte', 'Accès prioritaire aux nouvelles fonctionnalités', 'Réservé aux 10 premiers abonnés'],
    cta: 'Réserver ma place', href: 'mailto:contact@redac-immo.fr',
  },
]

export function Pricing() {
  return (
    <section style={{ padding: '100px 60px', background: 'var(--bg2)', position: 'relative', zIndex: 1 }}
             id="tarifs">
      <SectionHeader
        eyebrow="Tarifs"
        title={<>Des tarifs <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>transparents</em>,<br />à l'annonce ou au forfait</>}
        sub="Une tarification à la carte, selon vos besoins."
      />
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1px', maxWidth: '1100px', margin: '0 auto',
        background: 'var(--light)',
      }} className="pricing-grid">
        {PLANS.map((plan, i) => (
          <ScrollReveal key={plan.name} delay={i * 60}>
            <div style={{
             background: plan.founder ? '#0E0E10' : plan.featured ? 'var(--cream)' : 'var(--cream)',
              padding: '40px 32px',
              position: 'relative',
              height: '100%',
              display: 'flex', flexDirection: 'column',
            }}>
              {plan.badge && (
                <div style={{
                  fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: plan.founder ? '#C9A96E' : 'var(--mid)',
                  border: `1px solid ${plan.founder ? 'rgba(201,169,110,0.3)' : 'var(--light)'}`,
                  padding: '4px 10px', display: 'inline-block', marginBottom: '16px', width: 'fit-content',
                }}>
                  {plan.badge}
                </div>
              )}
              <div style={{
                fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase',
                color: plan.featured ? 'var(--gold)' : plan.founder ? 'var(--mid)' : 'var(--mid)',
                marginBottom: '16px',
              }}>
                {plan.name}
              </div>
              <div style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: '56px', fontWeight: 300, lineHeight: 1,
                color: plan.founder ? '#FAFAF7' : plan.featured ? 'var(--dark)' : 'var(--dark)',
                marginBottom: '4px',
              }}>
                <sup style={{ fontSize: '20px', verticalAlign: 'super' }}>€</sup>
                {plan.amount}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--mid)', marginBottom: '28px' }}>
                {plan.unit}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, marginBottom: '28px' }}>
                {plan.features.map(f => (
                  <li key={f} style={{
                    fontSize: '13px', lineHeight: 1.5,
                    color: plan.founder ? '#888' : 'var(--mid)',
                    display: 'flex', alignItems: 'flex-start', gap: '8px',
                  }}>
                    <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '1px' }}>—</span>
                    <span dangerouslySetInnerHTML={{
                      __html: f.includes('offertes') || f.includes('garanti') || f.includes('Réservé')
                        ? `<strong style="color:var(--gold)">${f}</strong>`
                        : f
                    }} />
                  </li>
                ))}
              </ul>
              <a
                href={plan.href}
                style={{
                  display: 'block', textAlign: 'center',
                  padding: '12px 20px',
                  border: `1px solid ${plan.founder ? 'rgba(201,169,110,0.4)' : 'var(--light)'}`,
                  color: plan.founder ? 'var(--gold)' : 'var(--mid)',
                  fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase',
                  textDecoration: 'none', transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--gold)'
                  e.currentTarget.style.color = 'var(--gold)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = plan.founder ? 'rgba(201,169,110,0.4)' : 'var(--light)'
                  e.currentTarget.style.color = plan.founder ? 'var(--gold)' : 'var(--mid)'
                }}
              >
                {plan.cta}
              </a>
            </div>
          </ScrollReveal>
        ))}
      </div>
      <style>{`
        @media (max-width: 900px) { .pricing-grid { grid-template-columns: 1fr !important; max-width: 420px; } }
        @media (min-width: 600px) and (max-width: 900px) { .pricing-grid { grid-template-columns: repeat(2, 1fr) !important; max-width: 660px; } }
      `}</style>
    </section>
  )
}

/* ═══════════════════════════════════════════════════
   EARLY ACCESS
═══════════════════════════════════════════════════ */
export function EarlyAccess() {
  return (
    <section style={{ padding: '100px 60px', background: 'var(--cream)', position: 'relative', zIndex: 1 }}
             id="early-adopters">
      <SectionHeader
        eyebrow="Lancement"
        title={<>Rejoignez les<br /><em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>premiers utilisateurs</em></>}
        sub="Redac-Immo est en phase de lancement. Les premiers clients bénéficient d'un tarif préférentiel et d'un accès prioritaire aux nouvelles fonctionnalités."
        light
      />
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1px', maxWidth: '700px', margin: '0 auto',
        background: 'var(--light)',
      }} className="early-grid">
        {[
          { icon: '✦', title: 'Tarif fondateur', desc: 'Les 10 premiers abonnés Agence accèdent au forfait à 50€/mois, garanti à vie sur leur compte, quelle que soit l\'évolution tarifaire future.' },
          { icon: '◈', title: 'Retours bienvenus', desc: 'Chaque retour compte. Vos suggestions façonnent directement les prochaines fonctionnalités, dashboard agence, nouveaux styles, intégrations.' },
        ].map((card, i) => (
          <ScrollReveal key={card.title} delay={i * 80}>
            <div style={{ background: 'var(--cream)', padding: '48px 36px', transition: 'background 0.3s', height: '100%' }}
                 onMouseEnter={e => (e.currentTarget.style.background = '#fff')}
                 onMouseLeave={e => (e.currentTarget.style.background = 'var(--cream)')}>
              <span style={{ fontSize: '22px', color: 'var(--gold)', marginBottom: '20px', display: 'block' }}>
                {card.icon}
              </span>
              <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '22px', fontWeight: 500, color: 'var(--dark)', marginBottom: '12px' }}>
                {card.title}
              </div>
              <div style={{ fontSize: '13px', lineHeight: 1.75, color: 'var(--mid)' }}>
                {card.desc}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
      <style>{`
        @media (max-width: 900px) { .early-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
