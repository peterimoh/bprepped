export const defaultTemplate = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { margin:0; padding:0; background:#f4f6f8; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
    .wrapper { width:100%; table-layout:fixed; padding:30px 0; }
    .container { max-width:600px; margin:0 auto; background:#ffffff; border-radius:6px; overflow:hidden; }
    .header { padding:24px; text-align:center; }
    .content { padding:24px; color:#111827; line-height:1.5; font-size:16px; }
    .btn { display:inline-block; padding:12px 20px; background:#2545e0; color:#ffffff !important; text-decoration:none; border-radius:6px; font-weight:600; }
    .footer { padding:18px; font-size:13px; color:#6b7280; text-align:center; }
    @media (max-width:480px){ .container{ width:100% !important; } .content{ padding:16px; } }
  </style>
</head>
<body>
  <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center">
        <table class="container" width="600" cellpadding="0" cellspacing="0" role="presentation">
          <tr><td class="header"><img src="{{logoUrl}}" width="140" alt="Logo" style="display:block;margin:0 auto;"/></td></tr>
          <tr><td class="content">{{body}}</td></tr>
          <tr><td class="footer">{{footerText}}</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
