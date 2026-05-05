import LegalPage, { Article, SubSection, P, UL, LI } from '@/components/legal/LegalPage'

export const metadata = {
  title: "Conditions Générales d'Utilisation — Redac-Immo",
  description: "Conditions Générales d'Utilisation de la plateforme Redac-Immo. Version 1.0, en vigueur le 19 avril 2026.",
  robots: 'noindex',
}

export default function CGUPage() {
  return (
    <LegalPage
      title="Conditions Générales d'Utilisation"
      version="Version 1.0 — En vigueur à compter du 19 avril 2026"
      effectiveDate="19 avril 2026"
    >

      <Article number="1" title="Objet">
        <P>Les présentes CGU définissent les modalités d'accès et d'utilisation de la plateforme Redac-Immo (redac-immo.fr), éditée par Redac-Immo — Xavier Deplante, SIRET 10377554000018, N° TVA FR88103775540. Tout accès à la plateforme implique l'acceptation pleine et entière des présentes CGU.</P>
      </Article>

      <Article number="2" title="Accès à la plateforme">
        <SubSection title="2.1 Conditions d'accès">
          <P>L'accès est réservé aux professionnels de l'immobilier : agents, mandataires, directeurs d'agence. L'utilisateur doit être majeur et disposer de la capacité juridique pour s'engager.</P>
        </SubSection>
        <SubSection title="2.2 Création de compte">
          <P>L'utilisation des services nécessite la création d'un compte via une adresse email valide. L'utilisateur s'engage à fournir des informations exactes et à les maintenir à jour.</P>
        </SubSection>
        <SubSection title="2.3 Identifiants">
          <P>L'utilisateur est seul responsable de la confidentialité de ses identifiants. En cas de compromission, il doit en informer Redac-Immo sans délai à contact@redac-immo.fr.</P>
        </SubSection>
      </Article>

      <Article number="3" title="Description des services">
        <P>Redac-Immo propose notamment :</P>
        <UL>
          <LI>La génération d'annonces immobilières professionnelles en français</LI>
          <LI>La génération d'annonces en anglais (offres Essentiel et Agence)</LI>
          <LI>La déclinaison réseaux sociaux des annonces</LI>
          <LI>Un espace client personnel avec historique des annonces</LI>
        </UL>
      </Article>

      <Article number="4" title="Obligations de l'utilisateur">
        <P>L'utilisateur s'engage à :</P>
        <UL>
          <LI>Utiliser la plateforme conformément à sa destination professionnelle</LI>
          <LI>Fournir des informations exactes sur les biens immobiliers saisis</LI>
          <LI>Ne pas tenter de contourner, dégrader ou surcharger les systèmes techniques</LI>
          <LI>Ne pas utiliser le service à des fins illicites ou frauduleuses</LI>
          <LI>Ne pas reproduire ni revendre l'accès à la plateforme à des tiers</LI>
          <LI>Respecter les droits de propriété intellectuelle de Redac-Immo</LI>
        </UL>
      </Article>

      <Article number="5" title="Responsabilité de l'utilisateur sur les contenus saisis">
        <P>L'utilisateur est seul responsable des informations saisies pour générer ses annonces. Il garantit leur exactitude et leur licéité. Redac-Immo ne saurait être tenu responsable d'annonces générées sur la base d'informations inexactes ou frauduleuses.</P>
        <P>L'utilisateur s'assure de la conformité des annonces publiées avec la réglementation applicable (loi Hoguet, obligations d'affichage).</P>
      </Article>

      <Article number="6" title="Propriété intellectuelle">
        <SubSection title="6.1 Plateforme">
          <P>L'ensemble des éléments de la plateforme (interface, charte graphique, textes, logos) est la propriété exclusive de Xavier Deplante. Toute reproduction sans autorisation est interdite.</P>
        </SubSection>
        <SubSection title="6.2 Annonces générées">
          <P>Les annonces produites sont cédées à l'utilisateur à titre exclusif dès paiement complet. L'utilisateur peut les utiliser, modifier et publier librement.</P>
        </SubSection>
      </Article>

      <Article number="7" title="Disponibilité et maintenance">
        <P>Redac-Immo s'efforce d'assurer la disponibilité de la plateforme 24h/24, 7j/7. Des interruptions ponctuelles peuvent intervenir pour maintenance ou en raison de défaillances d'infrastructures tierces. Redac-Immo ne saurait être tenu responsable des conséquences d'une interruption non imputable à sa seule volonté.</P>
      </Article>

      <Article number="8" title="Suspension et résiliation de compte">
        <SubSection title="8.1 À l'initiative de l'utilisateur">
          <P>L'utilisateur peut fermer son compte à tout moment depuis son espace client ou via contact@redac-immo.fr.</P>
        </SubSection>
        <SubSection title="8.2 À l'initiative de Redac-Immo">
          <P>Redac-Immo se réserve le droit de suspendre un compte en cas de :</P>
          <UL>
            <LI>Violation des présentes CGU</LI>
            <LI>Utilisation frauduleuse ou abusive</LI>
            <LI>Non-paiement caractérisé</LI>
          </UL>
          <P>L'utilisateur est informé par email préalablement, sauf urgence ou fraude avérée.</P>
        </SubSection>
      </Article>

      <Article number="9" title="Données personnelles">
        <P>Le traitement des données est régi par la <a href="/confidentialite" style={{ color: '#C9A96E' }}>Politique de confidentialité</a> accessible sur le site, conforme au RGPD (UE) 2016/679.</P>
      </Article>

      <Article number="10" title="Liens hypertextes">
        <P>La plateforme peut contenir des liens vers des sites tiers. Redac-Immo n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.</P>
      </Article>

      <Article number="11" title="Droit applicable et litiges">
        <P>Les présentes CGU sont soumises au droit français. En cas de litige, l'utilisateur contacte Redac-Immo à contact@redac-immo.fr. À défaut de résolution amiable, les tribunaux français seront compétents.</P>
        <P>Plateforme européenne : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={{ color: '#C9A96E' }}>https://ec.europa.eu/consumers/odr</a></P>
      </Article>

      <Article number="12" title="Modifications">
        <P>Redac-Immo se réserve le droit de modifier les présentes CGU. L'utilisateur est informé par email au moins 30 jours avant toute modification substantielle.</P>
      </Article>

    </LegalPage>
  )
}