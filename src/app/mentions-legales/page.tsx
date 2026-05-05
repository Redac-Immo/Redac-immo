import LegalPage, { Article, P, TableLegal } from '@/components/legal/LegalPage'

export const metadata = {
  title: 'Mentions légales — Redac-Immo',
  description: 'Mentions légales du site Redac-Immo. Conformes LCEN 2004, Loi SREN 2024, RGPD.',
  robots: 'noindex',
}

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      title="Mentions légales"
      version="Version 1.1"
      effectiveDate="19 avril 2026"
    >

      <Article number="1" title="Éditeur du site">
        <TableLegal
          headers={['', '']}
          rows={[
            ['Raison sociale', 'Redac-Immo — Xavier Deplante'],
            ['Forme juridique', 'Entrepreneur individuel — Micro-entreprise'],
            ['SIREN', '103 775 540'],
            ['SIRET', '10377554000018'],
            ['N° TVA', 'FR88103775540'],
            ['Code APE', '6831Z'],
            ['Date de création', '14 avril 2026'],
            ['Adresse', '80 Rue des Bonnes, 01360 Loyettes'],
            ['Email', 'contact@redac-immo.fr'],
            ['Site', 'redac-immo.fr'],
          ]}
        />
        <P>TVA non applicable — article 293 B du CGI (régime micro-entrepreneur).</P>
      </Article>

      <Article number="2" title="Directeur de la publication">
        <P>Xavier Deplante, en qualité d'entrepreneur individuel.</P>
      </Article>

      <Article number="3" title="Hébergement">
        <TableLegal
          headers={['', '']}
          rows={[
            ['Hébergeur', 'Vercel Inc.'],
            ['Adresse', '340 Pine Street, Suite 701, San Francisco, CA 94104, USA'],
            ['Site', 'vercel.com'],
            ['Garanties', 'Data Processing Agreement (DPA) — Clauses contractuelles types UE'],
          ]}
        />
      </Article>

      <Article number="4" title="Sous-traitants techniques">
        <TableLegal
          headers={['Prestataire', 'Rôle', 'Pays']}
          rows={[
            ['Vercel Inc.', 'Hébergement', 'USA'],
            ['Anthropic PBC', 'Génération de contenu', 'USA'],
            ['Supabase Inc.', 'Base de données', 'UE'],
            ['Stripe Payments Europe', 'Paiement sécurisé', 'Irlande'],
            ['Resend Inc.', 'Emails transactionnels', 'USA'],
          ]}
        />
      </Article>

      <Article number="5" title="Propriété intellectuelle">
        <P>L'ensemble des éléments du site redac-immo.fr (textes, visuels, interface, logo, charte graphique) est la propriété exclusive de Xavier Deplante. Toute reproduction, même partielle, sans autorisation écrite préalable est interdite et constitue une contrefaçon sanctionnée par les articles L. 335-2 et suivants du Code de la propriété intellectuelle.</P>
      </Article>

      <Article number="6" title="Données personnelles et RGPD">
        <P>Le traitement des données personnelles est régi par la <a href="/confidentialite" style={{ color: '#C9A96E' }}>Politique de confidentialité</a> accessible sur le site, conforme au Règlement (UE) 2016/679 (RGPD) et à la loi Informatique et Libertés.</P>
        <P>Responsable du traitement : Xavier Deplante — contact@redac-immo.fr.</P>
        <P>Autorité de contrôle compétente : CNIL — <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: '#C9A96E' }}>www.cnil.fr</a></P>
      </Article>

      <Article number="7" title="Cookies">
        <P>Le site utilise uniquement des cookies nécessaires au fonctionnement technique et à la sécurité des paiements. Aucun cookie publicitaire ou de traçage tiers n'est utilisé. Pour plus d'informations, consulter la <a href="/confidentialite" style={{ color: '#C9A96E' }}>Politique de confidentialité</a>.</P>
      </Article>

      <Article number="8" title="Liens hypertextes">
        <P>Le site peut contenir des liens vers des sites tiers. Redac-Immo n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou leur politique de confidentialité.</P>
      </Article>

      <Article number="9" title="Droit applicable">
        <P>Les présentes mentions légales sont régies par le droit français (loi pour la confiance dans l'économie numérique du 21 juin 2004 — LCEN, loi SREN du 21 mai 2024). Tout litige relatif au site relève de la compétence exclusive des tribunaux français.</P>
      </Article>

    </LegalPage>
  )
}