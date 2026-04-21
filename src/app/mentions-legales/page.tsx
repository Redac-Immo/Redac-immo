import LegalPage, { Article, P, TableLegal } from '@/components/legal/LegalPage'

export const metadata = {
  title: 'Mentions légales — Redac-Immo',
  description: 'Mentions légales du site Redac-Immo. Éditeur, hébergement, propriété intellectuelle.',
  robots: 'noindex',
}

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      title="Mentions légales"
      version="Version 1.0"
      effectiveDate="21 avril 2026"
    >

      <Article number="1" title="Éditeur du site">
        <TableLegal
          headers={['', '']}
          rows={[
            ['Raison sociale', 'Xavier Deplante, auto-entrepreneur'],
            ['SIRET', '10377554000018'],
            ['Code APE', '6831Z — Agences immobilières'],
            ['Adresse', '80 rue des Bonnes, 01360 Loyettes'],
            ['Email', 'contact@redac-immo.fr'],
            ['Site', 'https://redac-immo.fr'],
            ['Directeur de la publication', 'Xavier Deplante'],
          ]}
        />
      </Article>

      <Article number="2" title="Hébergement et sous-traitants">
        <TableLegal
          headers={['', '']}
          rows={[
            ['Hébergeur', 'Vercel Inc.'],
            ['Adresse', '340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis'],
            ['Site', 'https://vercel.com'],
            ['Base de données', 'Supabase Inc. (région Europe)'],
            ['Emails transactionnels', 'Resend Inc. (États-Unis, clauses contractuelles types UE)'],
          ]}
        />
        <P>Les données sont stockées sur les serveurs de Supabase Inc. (région Europe).</P>
      </Article>

      <Article number="3" title="Propriété intellectuelle">
        <P>L'ensemble du site redac-immo.fr — structure, charte graphique, textes, logo — est la propriété exclusive de Xavier Deplante.</P>
        <P>Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.</P>
        <P>Les annonces générées par le service sont cédées au Client à titre exclusif dès paiement complet, conformément aux Conditions Générales de Vente.</P>
      </Article>

      <Article number="4" title="Données personnelles">
        <P>Le traitement des données personnelles est régi par la{' '}
          <a href="/confidentialite" style={{ color: '#C9A96E' }}>Politique de confidentialité</a>.
        </P>
        <P>Conformément à la loi Informatique et Libertés du 6 janvier 1978 modifiée et au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données.</P>
        <P>Pour exercer ces droits : <a href="mailto:contact@redac-immo.fr" style={{ color: '#C9A96E' }}>contact@redac-immo.fr</a></P>
      </Article>

      <Article number="5" title="Cookies">
        <P>Le site utilise des cookies techniques strictement nécessaires à son fonctionnement :</P>
        <ul style={{ paddingLeft: '20px', marginBottom: '12px' }}>
          <li>Cookie de session utilisateur (authentification Supabase)</li>
          <li>Cookie de préférence de thème (clair/sombre)</li>
          <li>Cookie de sécurité Stripe (paiement)</li>
        </ul>
        <P>Ces cookies ne collectent aucune donnée personnelle à des fins publicitaires et ne requièrent pas de consentement préalable (art. 82 de la loi Informatique et Libertés).</P>
        <P>Aucun cookie tiers n'est déposé.</P>
      </Article>

      <Article number="6" title="Loi applicable">
        <P>Le site redac-immo.fr est régi par le droit français. En cas de litige, les tribunaux français sont seuls compétents.</P>
      </Article>

    </LegalPage>
  )
}