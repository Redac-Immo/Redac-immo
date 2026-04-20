import LegalPage, { Article, SubSection, P, UL, LI, TableLegal } from '@/components/legal/LegalPage'

export const metadata = {
  title: 'Conditions Générales de Vente — Redac-Immo',
  description: 'Conditions Générales de Vente de la plateforme Redac-Immo. Version 1.0, en vigueur le 19 avril 2026.',
  robots: 'noindex',
}

export default function CGVPage() {
  return (
    <LegalPage
      title="Conditions Générales de Vente"
      version="Version 1.0"
      effectiveDate="19 avril 2026"
    >

      <Article number="1" title="Identification de l'éditeur">
        <P>Le présent site est édité par :</P>
        <TableLegal
          headers={['', '']}
          rows={[
            ['Raison sociale', 'Xavier Deplante, auto-entrepreneur'],
            ['SIRET', '10377554000018'],
            ['Adresse', '80 rue des Bonnes, 01360 Loyettes'],
            ['Email', 'contact@redac-immo.fr'],
            ['Site', 'redac-immo.fr'],
          ]}
        />
        <P>Le service Redac-Immo est une plateforme de rédaction d'annonces immobilières professionnelles à destination des professionnels de l'immobilier.</P>
      </Article>

      <Article number="2" title="Champ d'application">
        <P>Les présentes Conditions Générales de Vente (CGV) s'appliquent à toute commande passée sur le site redac-immo.fr, à l'exclusion de tout autre document.</P>
        <P>Elles sont opposables au Client dès lors que celui-ci a coché la case « J'accepte les CGV » lors de sa commande. Toute commande vaut acceptation pleine et entière des présentes CGV.</P>
      </Article>

      <Article number="3" title="Offres et tarifs">
        <SubSection title="3.1 Offres à l'acte">
          <TableLegal
            headers={['Offre', 'Tarif TTC', 'Contenu']}
            rows={[
              ['Basique', '5,00 €', 'Annonce FR + version réseaux sociaux + liens de publication'],
              ['Essentiel', '12,00 €', 'Annonce FR + EN + version réseaux sociaux + liens de publication (3 annonces)'],
            ]}
          />
          <P>Ces offres donnent lieu à un paiement unique, non récurrent. Aucun abonnement n'est souscrit.</P>
        </SubSection>
        <SubSection title="3.2 Offre Agence — abonnement mensuel">
          <TableLegal
            headers={['Offre', 'Tarif TTC', 'Contenu']}
            rows={[
              ['Agence', '65,00 €/mois', "Annonces illimitées · FR + EN · réseaux sociaux · dashboard dédié · support prioritaire · 3 annonces offertes à l'activation"],
            ]}
          />
          <P>L'offre Agence est un abonnement sans engagement à durée indéterminée, renouvelé automatiquement selon les modalités de l'article 5.</P>
        </SubSection>
        <P>Les prix sont exprimés en euros, toutes taxes comprises (TVA non applicable, art. 293 B du CGI — régime micro-entrepreneur).</P>
      </Article>

      <Article number="4" title="Commande et paiement">
        <SubSection title="4.1 Processus de commande">
          <P>La commande est réputée ferme et définitive à l'issue du paiement en ligne. Un email de confirmation est adressé au Client dans les meilleurs délais.</P>
        </SubSection>
        <SubSection title="4.2 Paiement">
          <P>Le paiement est effectué en ligne par carte bancaire via Stripe (Stripe Payments Europe, Ltd.), prestataire de paiement sécurisé. Redac-Immo ne conserve aucune donnée bancaire du Client.</P>
        </SubSection>
        <SubSection title="4.3 Facturation">
          <P>Une facture est émise et adressée par email au Client après chaque paiement.</P>
        </SubSection>
      </Article>

      <Article number="5" title="Abonnement Agence — tacite reconduction et résiliation">
        <SubSection title="5.1 Durée et renouvellement automatique">
          <P>L'abonnement Agence est souscrit pour une période mensuelle, renouvelée automatiquement à chaque date anniversaire de la souscription, par tacite reconduction, conformément à l'article L. 215-1 du Code de la consommation.</P>
          <P>Le Client est informé du prochain renouvellement par email, au plus tard 15 jours avant la date d'échéance.</P>
        </SubSection>
        <SubSection title="5.2 Résiliation">
          <P>Le Client peut résilier son abonnement à tout moment, sans frais ni pénalité, depuis son espace client ou par email à contact@redac-immo.fr.</P>
          <P>La résiliation prend effet à la fin de la période mensuelle en cours. Aucun remboursement au prorata n'est effectué pour la période déjà facturée.</P>
        </SubSection>
        <SubSection title="5.3 Conséquences de la résiliation">
          <P>À la date d'effet de la résiliation, l'accès aux fonctionnalités de l'offre Agence est suspendu. Les annonces déjà générées restent accessibles en consultation dans l'historique pendant 12 mois.</P>
        </SubSection>
      </Article>

      <Article number="6" title="Livraison">
        <P>Les annonces sont générées automatiquement par le service et mises à disposition dans l'espace client immédiatement après paiement, ou au plus tard sous 24 heures en cas d'incident technique.</P>
      </Article>

      <Article number="7" title="Droit de rétractation">
        <P>Conformément à l'article L. 221-28, 1° du Code de la consommation, le droit de rétractation ne s'applique pas aux contrats de fourniture de contenu numérique non fourni sur support matériel, dont l'exécution a commencé avec l'accord préalable exprès du consommateur.</P>
        <P>En passant commande, le Client reconnaît expressément renoncer à son droit de rétractation dès la mise à disposition de l'annonce générée. Cette renonciation est recueillie lors de la commande par case à cocher dédiée.</P>
      </Article>

      <Article number="8" title="Responsabilité">
        <SubSection title="8.1 Obligations de Redac-Immo">
          <P>Redac-Immo s'engage à fournir un service de rédaction de qualité professionnelle. Les annonces générées sont fournies à titre d'aide à la rédaction. Le Client demeure responsable de leur vérification, adaptation et publication.</P>
        </SubSection>
        <SubSection title="8.2 Limitation de responsabilité">
          <P>Redac-Immo ne saurait être tenu responsable :</P>
          <UL>
            <LI>Des inexactitudes dans les annonces résultant d'informations incorrectes fournies par le Client ;</LI>
            <LI>De l'adéquation de l'annonce aux réglementations locales de publication (loi Hoguet, obligations d'affichage, etc.) ;</LI>
            <LI>Des interruptions de service liées aux infrastructures tierces (Vercel, Anthropic, Supabase, Stripe).</LI>
          </UL>
          <P>La responsabilité de Redac-Immo est, en tout état de cause, limitée au montant payé par le Client pour la commande concernée.</P>
        </SubSection>
      </Article>

      <Article number="9" title="Propriété intellectuelle">
        <SubSection title="9.1 Droits sur les annonces générées">
          <P>Les annonces produites par le service sont cédées au Client à titre exclusif, pour tout usage, dès paiement complet de la commande.</P>
        </SubSection>
        <SubSection title="9.2 Droits de Redac-Immo">
          <P>La marque Redac-Immo, le site, l'interface et les éléments visuels sont la propriété exclusive du fondateur. Toute reproduction est interdite sans autorisation préalable.</P>
        </SubSection>
      </Article>

      <Article number="10" title="Données personnelles">
        <P>Le traitement des données personnelles du Client est régi par la <a href="/confidentialite" style={{ color: '#C9A96E' }}>Politique de confidentialité</a> accessible sur le site, conforme au Règlement (UE) 2016/679 (RGPD) et à la loi Informatique et Libertés.</P>
      </Article>

      <Article number="11" title="Droit applicable et juridiction">
        <P>Les présentes CGV sont soumises au droit français.</P>
        <P>En cas de litige, le Client est invité à contacter Redac-Immo en premier lieu pour rechercher une solution amiable. À défaut, les tribunaux français seront compétents.</P>
        <P>Pour les litiges de consommation, le Client peut recourir à la médiation via la plateforme européenne : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={{ color: '#C9A96E' }}>https://ec.europa.eu/consumers/odr</a></P>
      </Article>

      <Article number="12" title="Modifications">
        <P>Redac-Immo se réserve le droit de modifier les présentes CGV. Le Client abonné (offre Agence) est informé par email de toute modification substantielle au moins 30 jours avant son entrée en vigueur. L'usage du service après cette date vaut acceptation.</P>
      </Article>

    </LegalPage>
  )
}