import LegalPage, { Article, P, UL, LI, TableLegal } from '@/components/legal/LegalPage'

export const metadata = {
  title: 'Politique de confidentialité — Redac-Immo',
  description: 'Politique de confidentialité de Redac-Immo, conforme RGPD. Version 1.0, en vigueur le 19 avril 2026.',
  robots: 'noindex',
}

export default function ConfidentialitePage() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      version="Version 1.0 — Conforme RGPD (UE) 2016/679"
      effectiveDate="19 avril 2026"
    >

      <Article number="1" title="Responsable du traitement">
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
      </Article>

      <Article number="2" title="Données collectées et finalités">
        <TableLegal
          headers={['Catégorie', 'Données', 'Finalité', 'Base légale']}
          rows={[
            ['Compte', 'Email, nom', 'Création de compte, envoi des annonces', 'Exécution du contrat'],
            ['Commande', 'Informations de facturation', 'Émission de factures', 'Obligation légale'],
            ['Paiement', 'Transaction (réf. Stripe)', 'Paiement sécurisé', 'Exécution du contrat'],
            ['Contenu', 'Infos sur le bien saisi', "Génération de l'annonce", 'Exécution du contrat'],
            ['Navigation', 'Logs, cookies techniques', 'Fonctionnement du site', 'Intérêt légitime'],
          ]}
        />
        <P>Redac-Immo ne collecte pas de données sensibles au sens de l'article 9 du RGPD. Aucune donnée n'est vendue ni cédée à des tiers à des fins commerciales.</P>
      </Article>

      <Article number="3" title="Sous-traitants et transferts hors UE">
        <P>Les données sont traitées par les sous-traitants suivants dans le cadre de la fourniture du service :</P>
        <TableLegal
          headers={['Sous-traitant', 'Rôle', 'Localisation', 'Garanties']}
          rows={[
            ['Vercel Inc.', 'Hébergement du site', 'USA (EU via DPA)', 'Clauses contractuelles types UE'],
            ['Anthropic PBC', 'Génération du contenu', 'USA', 'Politique de confidentialité Anthropic'],
            ['Supabase Inc.', 'Base de données', 'UE (région EU)', 'Clauses contractuelles types UE'],
            ['Stripe Payments Europe', 'Paiement en ligne', 'Irlande (UE)', 'Conformité RGPD — PCI-DSS'],
            ['Resend Inc.', 'Emails transactionnels', 'USA', 'Clauses contractuelles types UE'],
          ]}
        />
      </Article>

      <Article number="4" title="Durée de conservation">
        <TableLegal
          headers={['Catégorie de données', 'Durée de conservation']}
          rows={[
            ['Données de compte', 'Durée de la relation commerciale + 3 ans'],
            ['Données de facturation', '10 ans (obligation comptable légale)'],
            ['Contenu des annonces générées', '12 mois après la dernière génération'],
            ['Logs techniques', '12 mois'],
            ['Données de paiement (Stripe)', 'Selon politique Stripe — non conservées par Redac-Immo'],
          ]}
        />
      </Article>

      <Article number="5" title="Droits des personnes concernées">
        <P>Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :</P>
        <TableLegal
          headers={['Droit', 'Article RGPD', 'Description']}
          rows={[
            ['Accès', 'Art. 15', 'Obtenir une copie de vos données'],
            ['Rectification', 'Art. 16', 'Corriger des données inexactes'],
            ['Effacement', 'Art. 17', 'Demander la suppression de vos données'],
            ['Limitation', 'Art. 18', 'Restreindre le traitement de vos données'],
            ['Portabilité', 'Art. 20', 'Recevoir vos données dans un format structuré'],
            ['Opposition', 'Art. 21', "S'opposer à un traitement fondé sur l'intérêt légitime"],
          ]}
        />
        <P>Pour exercer ces droits : <a href="mailto:contact@redac-immo.fr" style={{ color: '#C9A96E' }}>contact@redac-immo.fr</a> — Réponse sous 30 jours maximum.</P>
        <P>En cas de réclamation non résolue, vous pouvez saisir la CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: '#C9A96E' }}>www.cnil.fr</a> — 3 Place de Fontenoy, 75007 Paris.</P>
      </Article>

      <Article number="6" title="Cookies">
        <TableLegal
          headers={['Cookie', 'Type', 'Finalité', 'Durée']}
          rows={[
            ['Session auth', 'Nécessaire', 'Maintien de la session utilisateur', 'Session'],
            ['Préférences UI', 'Fonctionnel', 'Mémorisation du thème clair/sombre', '12 mois'],
            ['Stripe', 'Nécessaire', 'Sécurité et lutte contre la fraude', 'Session'],
          ]}
        />
        <P>Aucun cookie publicitaire ou de traçage tiers n'est utilisé. Les cookies nécessaires et fonctionnels ne requièrent pas de consentement préalable (art. 82 de la loi Informatique et Libertés — lignes directrices CNIL 2020).</P>
      </Article>

      <Article number="7" title="Sécurité">
        <P>Redac-Immo met en œuvre les mesures techniques et organisationnelles suivantes pour protéger vos données :</P>
        <UL>
          <LI>Transmission des données chiffrée en HTTPS (TLS)</LI>
          <LI>Accès aux bases de données restreint par authentification et Row Level Security (Supabase)</LI>
          <LI>Paiements traités selon les normes PCI-DSS niveau 1 (Stripe)</LI>
          <LI>Accès administrateur protégé par authentification forte</LI>
        </UL>
      </Article>

      <Article number="8" title="Modifications">
        <P>Toute modification substantielle de la présente politique est notifiée par email aux utilisateurs ayant un compte actif, avec un délai de préavis de 30 jours. La version en vigueur est toujours accessible sur redac-immo.fr.</P>
      </Article>

    </LegalPage>
  )
}
