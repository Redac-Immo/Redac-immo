export function templateConfirmationCommande({
  prenom,
  numeroFacture,
  bien,
  formule,
  montant,
  date,
  dashboardUrl,
}: {
  prenom: string
  numeroFacture: string
  bien: string
  formule: string
  montant: string
  date: string
  dashboardUrl: string
}): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Confirmation de commande — Redac-Immo</title>
</head>
<body style="margin:0;padding:0;background:#F2F2EE;font-family:'DM Sans',Helvetica,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#F2F2EE;padding:40px 20px;">
  <tr>
    <td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- LOGO -->
        <tr>
          <td style="padding-bottom:32px;text-align:center;">
            <span style="font-family:Georgia,serif;font-size:28px;color:#18181A;font-weight:500;">
              Redac<span style="font-style:italic;color:#C9A96E;font-weight:300;">-Immo</span>
            </span>
          </td>
        </tr>

        <!-- CARD -->
        <tr>
          <td style="background:#FAFAF7;border-top:3px solid #C9A96E;padding:40px 40px 32px;">

            <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#6B6B65;">
              Confirmation de commande
            </p>
            <h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:26px;font-weight:300;color:#18181A;line-height:1.2;">
              Merci <em style="font-style:italic;color:#C9A96E;">${prenom}</em>.
            </h1>

            <p style="margin:0 0 24px;font-size:14px;color:#6B6B65;line-height:1.7;">
              Votre commande a bien été reçue. Votre annonce sera générée et disponible dans votre espace client sous quelques instants.
            </p>

            <!-- Récap commande -->
            <table cellpadding="0" cellspacing="0" width="100%"
                   style="background:#F2F2EE;border:1px solid #E8E8E4;margin-bottom:32px;">
              <tr>
                <td style="padding:0;">
                  <!-- Header -->
                  <table cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="padding:14px 20px;background:#18181A;">
                        <span style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#C9A96E;">
                          Récapitulatif
                        </span>
                      </td>
                    </tr>
                  </table>
                  <!-- Lignes -->
                  <table cellpadding="0" cellspacing="0" width="100%">
                    ${[
                      ['N° de facture', numeroFacture],
                      ['Date', date],
                      ['Bien', bien],
                      ['Formule', formule],
                    ].map(([label, value]) => `
                    <tr>
                      <td style="padding:12px 20px;border-bottom:1px solid #E8E8E4;font-size:12px;color:#6B6B65;width:40%;">${label}</td>
                      <td style="padding:12px 20px;border-bottom:1px solid #E8E8E4;font-size:13px;color:#18181A;font-weight:500;">${value}</td>
                    </tr>`).join('')}
                    <!-- Total -->
                    <tr>
                      <td style="padding:16px 20px;font-size:12px;color:#6B6B65;">Montant</td>
                      <td style="padding:16px 20px;font-size:20px;font-family:Georgia,serif;font-weight:300;color:#C9A96E;">${montant}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="background:#C9A96E;">
                  <a href="${dashboardUrl}"
                     style="display:inline-block;padding:14px 32px;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;color:#18181A;text-decoration:none;">
                    Accéder à mon espace client
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:12px;color:#9A9A94;line-height:1.6;">
              La facture est disponible en téléchargement depuis la section <strong>Mes factures</strong> de votre espace client.
            </p>

          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="padding:24px 0;text-align:center;">
            <p style="margin:0;font-size:11px;color:#9A9A94;line-height:1.6;">
              Redac-Immo · contact@redac-immo.fr<br>
              Pour toute question, répondez directement à cet e-mail.
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`
}
