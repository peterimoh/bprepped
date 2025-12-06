import nodemailer from 'nodemailer';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import juice from 'juice';
import { htmlToText } from 'html-to-text';
import { defaultTemplate } from '@/constants/email-template';

export class NotificationService {
  transporter: nodemailer.Transporter;

  constructor() {
    const host = process.env.SMTP_HOST || 'localhost';
    const port = Number(process.env.SMTP_PORT || 1025);
    const user = process.env.SMTP_USER || undefined;
    const pass = process.env.SMTP_PASS || undefined;

    const secureEnv = (() => {
      if (process.env.SMTP_SECURE !== undefined)
        return process.env.SMTP_SECURE === 'true';
      return port === 465;
    })();

    this.transporter = nodemailer.createTransport({
      // @ts-expect-error host throwing error
      host,
      port,
      secure: secureEnv,
      auth: user && pass ? { user, pass } : undefined,
      pool: process.env.SMTP_POOL === 'true' || false,
      connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT || 10_000),
      greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT || 10_000),
    });
  }

  renderTemplate(
    template: string,
    data: Record<string, string | number | boolean> = {}
  ) {
    const escapeHtml = (s: string) =>
      s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    return template.replace(/{{\s*([a-zA-Z0-9_\-]+)\s*}}/g, (_, token) => {
      const raw = data[token];
      if (raw === undefined || raw === null) return '';
      return escapeHtml(String(raw));
    });
  }

  async sendEmail(options: {
    from: string;
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    markdown?: string;
    template?: string; // optional HTML template with {{body}} and other tokens
    templateData?: Record<string, string | number | boolean>;
  }) {
    let html = options.html;
    let text = options.text;

    if (options.markdown) {
      const rawHtml = marked(options.markdown);

      if (typeof rawHtml === 'string') {
        html = sanitizeHtml(rawHtml, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ['src', 'alt', 'title', 'width', 'height'],
          },
          allowedSchemes: ['http', 'https', 'mailto', 'data'],
        });
      }

      const templateToUse = options.template || defaultTemplate;
      const templateData = Object.assign(
        {
          body: html,
          logoUrl: process.env.EMAIL_LOGO_URL || '',
          footerText:
            process.env.EMAIL_FOOTER ||
            'If you did not ask for this, ignore it.',
        },
        options.templateData || {}
      );
      this.renderTemplate(templateToUse, templateData);
      if (html != null) {
        const finalHtml = (options.template || defaultTemplate)
          .replace(/{{\s*body\s*}}/g, html)
          .replace(/{{\s*logoUrl\s*}}/g, String(templateData.logoUrl))
          .replace(/{{\s*footerText\s*}}/g, String(templateData.footerText));

        html = juice(finalHtml);
      }

      if (html != null) {
        text = htmlToText(html, { wordwrap: 130 });
      }
    } else {
      if (html && !text) {
        const inlined = juice(html);
        html = inlined;
        text = htmlToText(inlined, { wordwrap: 130 });
      }

      if (!html && options.template) {
        const templateData = Object.assign(
          {
            body: '',
            logoUrl: process.env.EMAIL_LOGO_URL || '',
            footerText:
              process.env.EMAIL_FOOTER ||
              'If you did not ask for this, ignore it.',
          },
          options.templateData || {}
        );
        const rendered = this.renderTemplate(options.template, templateData);
        html = juice(rendered);
        text = htmlToText(html, { wordwrap: 130 });
      }
    }

    html = html || '';
    text = text || '';

    const maxAttempts = Number(process.env.EMAIL_SEND_ATTEMPTS || 2);
    let attempt = 0;
    let lastError: null | unknown = null;

    while (attempt < maxAttempts) {
      try {
        return await this.transporter.sendMail({
          from: options.from,
          to: options.to,
          subject: options.subject,
          text,
          html,
        });
      } catch (err) {
        lastError = err;
        attempt += 1;
        // exponential backoff (simple)
        await new Promise((res) => setTimeout(res, 200 * attempt));
      }
    }

    throw lastError;
  }
}

const notificationService = new NotificationService();
export default notificationService;
