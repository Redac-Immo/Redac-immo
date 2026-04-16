'use client'

import { useState } from 'react'
import ScrollReveal from './ScrollReveal'
import { SectionHeader } from './Sections'

const FAQ_ITEMS = [
  {
    q: 'Vous utilisez l\'intelligence artificielle ?',
    a: 'Oui, comme un studio graphique utilise Photoshop ou un architecte AutoCAD. Notre process s\'appuie sur des outils d\'édition avancés, mais le résultat n\'est pas du texte générique : chaque annonce est configurée selon le type de bien, le registre adapté et les standards des grandes agences internationales. Vous relisez et validez avant de publier, le texte final est le vôtre. L\'outil, c\'est notre méthode. La valeur, c\'est ce qu\'elle produit.',
  },
  {
    q: 'En quoi Redac-Immo se distingue des autres outils de rédaction ?',
    a: 'Alors qu\'un rédacteur freelance facture entre 50 et 150€ par annonce, avec des délais variables et un style qui évolue d\'une commande à l\'autre, Redac-Immo vous livre sous 24h, à chaque commande, avec la même structure éditoriale, celle des grands réseaux internationaux de l\'immobilier : cadre, espaces de vie, matériaux, proximités. Aucun superlatif sans intérêt, aucune phrase de remplissage superflue. Chaque annonce est produite simultanément en français et en anglais natif, sans surcoût de traduction.',
  },
  {
    q: 'Puis-je modifier l\'annonce après réception ?',
    a: 'Oui, bien sûr, et c\'est même recommandé. Le texte livré est une base professionnelle solide que vous adaptez à votre voix et à vos habitudes de communication avant publication. Vous pouvez copier, ajuster, compléter librement. L\'annonce vous appartient.',
  },
  {
    q: 'La version anglaise est-elle une traduction ou une rédaction originale ?',
    a: 'C\'est une rédaction originale adaptée au marché anglophone, pas une traduction littérale. Le ton et les arguments sont ajustés pour séduire un acheteur britannique ou international, avec les codes de communication qui leur correspondent.',
  },
  {
    q: 'Mes données sont-elles confidentielles ?',
    a: 'Oui. Redac-Immo est conforme au RGPD. Les informations que vous saisissez sont utilisées uniquement pour produire votre annonce et ne sont jamais revendues ni transmises à des tiers à des fins commerciales.',
  },
  {
    q: 'Fonctionne-t-il pour tous les types de biens ?',
    a: 'Oui. Appartements, maisons, villas, propriétés de caractère, terrains, locaux commerciaux — notre système adapte automatiquement le registre éditorial selon le type de bien et la gamme de prix. Un studio locatif et un mas du Périgord ne se décrivent pas de la même façon.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function toggle(i: number) {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <section style={{ padding: '100px 60px', background: 'var(--bg2)', position: 'relative', zIndex: 1 }}
             id="faq">
      <SectionHeader
        eyebrow="FAQ"
        title={<>Questions <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>fréquentes</em></>}
      />
      <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {FAQ_ITEMS.map((item, i) => (
          <ScrollReveal key={i} delay={i * 40}>
            <div style={{ background: 'var(--cream)', border: '1px solid var(--light)', overflow: 'hidden' }}>
              <button
                onClick={() => toggle(i)}
                style={{
                  width: '100%', padding: '22px 28px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  cursor: 'pointer', background: 'none', border: 'none',
                  fontSize: '15px', color: 'var(--dark)', fontWeight: 400,
                  gap: '16px', textAlign: 'left',
                  fontFamily: 'var(--font-dm-sans), sans-serif',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <span>{item.q}</span>
                <div style={{
                  width: '24px', height: '24px', flexShrink: 0,
                  border: '1px solid rgba(201,169,110,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', color: 'var(--gold)',
                  transition: 'transform 0.3s',
                  transform: openIndex === i ? 'rotate(45deg)' : 'none',
                }}>
                  +
                </div>
              </button>
              <div style={{
                maxHeight: openIndex === i ? '400px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.4s ease',
              }}>
                <div style={{ padding: '0 28px 24px', fontSize: '14px', lineHeight: 1.8, color: 'var(--mid)' }}>
                  {item.a}
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
