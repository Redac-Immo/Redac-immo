export function templateConfirmationAnnonce({
  prenom,
  bien,
  localisation,
  prix,
  formule,
  dashboardUrl,
  extrait,
}: {
  prenom: string
  bien: string
  localisation: string
  prix: string
  formule: string
  dashboardUrl: string
  extrait: string
}): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Votre annonce est prête — Redac-Immo</title>
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
              Annonce générée
            </p>
            <h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:26px;font-weight:300;color:#18181A;line-height:1.2;">
              Bonjour <em style="font-style:italic;color:#C9A96E;">${prenom}</em>,<br>votre annonce est prête.
            </h1>

            <!-- Récap bien -->
            <table cellpadding="0" cellspacing="0" width="100%"
                   style="background:#F2F2EE;border:1px solid #E8E8E4;margin-bottom:24px;">
              <tr>
                <td style="padding:20px 24px;border-left:3px solid #C9A96E;">
                  <p style="margin:0 0 4px;font-size:15px;font-weight:500;color:#18181A;">${bien}</p>
                  <p style="margin:0;font-size:12px;color:#6B6B65;">
                    ${localisation} &nbsp;·&nbsp; ${prix} &nbsp;·&nbsp; Formule ${formule}
                  </p>
                </td>
              </tr>
            </table>

            <!-- Extrait -->
            <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#6B6B65;">
              Extrait — Version française
            </p>
            <p style="margin:0 0 32px;font-size:13px;color:#18181A;line-height:1.8;font-style:italic;border-left:2px solid #C9A96E;padding-left:16px;">
              ${extrait}…
            </p>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="background:#C9A96E;">
                  <a href="${dashboardUrl}"
                     style="display:inline-block;padding:14px 32px;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;color:#18181A;text-decoration:none;">
                    Voir l'annonce complète
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:12px;color:#9A9A94;line-height:1.6;">
              Vous pouvez copier, modifier et télécharger votre annonce depuis votre espace client.
            </p>

          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="padding:24px 0;text-align:center;">
            <p style="margin:0;font-size:11px;color:#9A9A94;line-height:1.6;">
              Redac-Immo · contact@redac-immo.fr
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
