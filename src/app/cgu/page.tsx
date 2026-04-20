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
      version="Version 1.0"
      effectiveDate="19 avril 2026"
    >

      <Article number="1" title="Objet">
        <P>Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités d'accès et d'utilisation de la plateforme Redac-Immo, accessible à l'adresse redac-immo.fr, éditée par :</P>
        <UL>
          <LI>Raison sociale : Xavier Deplante, auto-entrepreneur</LI>
          <LI>SIRET : 10377554000018</LI>
          <LI>Adresse : 80 rue des Bonnes, 01360 Loyettes</LI>
          <LI>Email : contact@redac-immo.fr</LI>
        </UL>
        <P>Tout accès à la plateforme implique l'acceptation pleine et entière des présentes CGU.</P>
      </Article>

      <Article number="2" title="Accès à la plateforme">
        <SubSection title="2.1 Conditions d'accès">
          <P>L'accès à la plateforme est réservé aux professionnels de l'immobilier : agents immobiliers, mandataires, directeurs d'agence et toute personne agissant dans un cadre professionnel. L'utilisateur doit être majeur et disposer de la capacité juridique pour s'engager.</P>
        </SubSection>
        <SubSection title="2.2 Création de compte">
          <P>L'utilisation des services nécessite la création d'un compte personnel via une adresse email valide. L'utilisateur s'engage à fournir des informations exactes et à les maintenir à jour.</P>
        </SubSection>
        <SubSection title="2.3 Identifiants">
          <P>L'utilisateur est seul responsable de la confidentialité de ses identifiants de connexion. Toute utilisation du compte avec ses identifiants est réputée effectuée par l'utilisateur. En cas de compromission, l'utilisateur doit en informer Redac-Immo sans délai à contact@redac-immo.fr.</P>
        </SubSection>
      </Article>

      <Article number="3" title="Description des services">
        <P>Redac-Immo propose un service de rédaction d'annonces immobilières professionnelles, décliné en plusieurs formules détaillées dans les <a href="/cgv" style={{ color: '#C9A96E' }}>Conditions Générales de Vente (CGV)</a>. Les services comprennent notamment :</P>
        <UL>
          <LI>La génération d'annonces immobilières en langue française</LI>
          <LI>La génération d'annonces en langue anglaise (offres Essentiel et Agence)</LI>
          <LI>La déclinaison réseaux sociaux des annonces</LI>
          <LI>L'accès à un espace client personnel avec historique des annonces</LI>
        </UL>
      </Article>

      <Article number="4" title="Obligations de l'utilisateur">
        <P>L'utilisateur s'engage à :</P>
        <UL>
          <LI>Utiliser la plateforme conformément à sa destination professionnelle</LI>
          <LI>Fournir des informations exactes sur les biens immobiliers saisis</LI>
          <LI>Ne pas tenter de contourner, dégrader ou surcharger les systèmes techniques de la plateforme</LI>
          <LI>Ne pas utiliser le service à des fins illicites, frauduleuses ou contraires aux bonnes mœurs</LI>
          <LI>Ne pas reproduire, copier ou revendre l'accès à la plateforme à des tiers</LI>
          <LI>Respecter les droits de propriété intellectuelle de Redac-Immo</LI>
        </UL>
      </Article>

      <Article number="5" title="Responsabilité de l'utilisateur sur les contenus saisis">
        <P>L'utilisateur est seul responsable des informations qu'il saisit dans la plateforme pour générer ses annonces. Il garantit que ces informations sont exactes, licites et ne portent pas atteinte aux droits de tiers.</P>
        <P>Redac-Immo ne saurait être tenu responsable d'annonces générées sur la base d'informations inexactes, incomplètes ou frauduleuses fournies par l'utilisateur.</P>
        <P>L'utilisateur s'assure que la publication des annonces générées est conforme aux réglementations applicables, notamment la loi Hoguet et les obligations d'affichage en vigueur.</P>
      </Article>

      <Article number="6" title="Propriété intellectuelle">
        <SubSection title="6.1 Plateforme et contenus de Redac-Immo">
          <P>L'ensemble des éléments constituant la plateforme — interface, charte graphique, textes, logos, structure — est la propriété exclusive de Xavier Deplante. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.</P>
        </SubSection>
        <SubSection title="6.2 Annonces générées">
          <P>Les annonces produites par le service sont cédées à l'utilisateur à titre exclusif dès paiement complet, conformément aux CGV. L'utilisateur peut les utiliser, modifier et publier librement.</P>
        </SubSection>
      </Article>

      <Article number="7" title="Disponibilité et maintenance">
        <P>Redac-Immo s'efforce d'assurer la disponibilité de la plateforme 24h/24, 7j/7. Des interruptions ponctuelles peuvent intervenir pour maintenance, mises à jour ou en raison de défaillances des infrastructures tierces (hébergement, API).</P>
        <P>Redac-Immo ne saurait être tenu responsable des conséquences d'une interruption de service non imputable à sa seule volonté.</P>
      </Article>

      <Article number="8" title="Suspension et résiliation de compte">
        <SubSection title="8.1 À l'initiative de l'utilisateur">
          <P>L'utilisateur peut fermer son compte à tout moment depuis son espace client ou en contactant contact@redac-immo.fr. La fermeture entraîne la suppression des données conformément à la Politique de confidentialité.</P>
        </SubSection>
        <SubSection title="8.2 À l'initiative de Redac-Immo">
          <P>Redac-Immo se réserve le droit de suspendre ou résilier un compte en cas de :</P>
          <UL>
            <LI>Violation des présentes CGU</LI>
            <LI>Utilisation frauduleuse ou abusive de la plateforme</LI>
            <LI>Non-paiement caractérisé</LI>
          </UL>
          <P>L'utilisateur est informé par email préalablement, sauf en cas d'urgence ou de fraude avérée.</P>
        </SubSection>
      </Article>

      <Article number="9" title="Données personnelles">
        <P>Le traitement des données personnelles est régi par la <a href="/confidentialite" style={{ color: '#C9A96E' }}>Politique de confidentialité</a> accessible sur le site, conforme au RGPD (UE) 2016/679 et à la loi Informatique et Libertés.</P>
      </Article>

      <Article number="10" title="Liens hypertextes">
        <P>La plateforme peut contenir des liens vers des sites tiers. Redac-Immo n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.</P>
      </Article>

      <Article number="11" title="Droit applicable et litiges">
        <P>Les présentes CGU sont soumises au droit français.</P>
        <P>En cas de litige, l'utilisateur est invité à contacter Redac-Immo en premier lieu pour rechercher une solution amiable. À défaut, les tribunaux français seront compétents.</P>
        <P>Pour les litiges de consommation : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={{ color: '#C9A96E' }}>https://ec.europa.eu/consumers/odr</a></P>
      </Article>

      <Article number="12" title="Modifications">
        <P>Redac-Immo se réserve le droit de modifier les présentes CGU à tout moment. L'utilisateur est informé par email de toute modification substantielle au moins 30 jours avant son entrée en vigueur. La poursuite de l'utilisation du service après cette date vaut acceptation.</P>
      </Article>

    </LegalPage>
  )
}
