export function templateConfirmationInscription({
  prenom,
  confirmationUrl,
}: {
  prenom: string
  confirmationUrl: string
}): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Confirmez votre compte Redac-Immo</title>
</head>
<body style="margin:0;padding:0;background:#F2F2EE;font-family:'DM Sans',Helvetica,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#F2F2EE;padding:40px 20px;">
  <tr>
    <td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- LOGO -->
        <tr>
          <td style="padding-bottom:32px;text-align:center;">
            <span style="font-family:Georgia,serif;font-size:28px;color:#18181A;font-weight:500;letter-spacing:-0.01em;">
              Redac<span style="font-style:italic;color:#C9A96E;font-weight:300;">-Immo</span>
            </span>
          </td>
        </tr>

        <!-- CARD -->
        <tr>
          <td style="background:#FAFAF7;border-top:3px solid #C9A96E;padding:40px 40px 32px;">

            <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#6B6B65;">
              Bienvenue
            </p>
            <h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:28px;font-weight:300;color:#18181A;line-height:1.2;">
              Bonjour <em style="font-style:italic;color:#C9A96E;">${prenom}</em>
            </h1>

            <p style="margin:0 0 16px;font-size:14px;color:#6B6B65;line-height:1.7;">
              Votre compte Redac-Immo a bien été créé. Il ne reste plus qu'une étape — confirmez votre adresse e-mail pour accéder à votre espace client.
            </p>

            <p style="margin:0 0 32px;font-size:14px;color:#6B6B65;line-height:1.7;">
              Ce lien est valable <strong style="color:#18181A;">24 heures</strong>.
            </p>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td style="background:#C9A96E;">
                  <a href="${confirmationUrl}"
                     style="display:inline-block;padding:14px 32px;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;color:#18181A;text-decoration:none;">
                    Confirmer mon compte
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:12px;color:#9A9A94;line-height:1.6;">
              Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
              <a href="${confirmationUrl}" style="color:#C9A96E;word-break:break-all;">${confirmationUrl}</a>
            </p>

          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="padding:24px 0;text-align:center;">
            <p style="margin:0;font-size:11px;color:#9A9A94;line-height:1.6;">
              Redac-Immo · contact@redac-immo.fr<br>
              Si vous n'avez pas créé de compte, ignorez cet e-mail.
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
