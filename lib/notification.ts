import nodemailer from 'nodemailer';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import juice from 'juice';
import { htmlToText } from 'html-to-text';
import { defaultTemplate } from '@/constants/email-template';

type TemplateData = Record<string, string | number | boolean>;

export interface SendEmailOptions {
  from: string;
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  markdown?: string;
  template?: string; // optional HTML template with {{body}} and tokens
  templateData?: TemplateData;
}

const HTML_TO_TEXT_CONFIG = { wordwrap: 130 } as const;
const DEFAULT_MAX_ATTEMPTS = Number(process.env.EMAIL_SEND_ATTEMPTS || 2);

const SANITIZE_CONFIG: any = {
  allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ['src', 'alt', 'title', 'width', 'height'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'data'],
};

export class NotificationService {
  transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = this.createTransporter();
  }

  private createTransporter() {
    const host = process.env.SMTP_HOST || 'localhost';
    const port = Number(process.env.SMTP_PORT || 1025);
    const user = process.env.SMTP_USER || undefined;
    const pass = process.env.SMTP_PASS || undefined;

    const secureEnv = (() => {
      if (process.env.SMTP_SECURE !== undefined)
        return process.env.SMTP_SECURE === 'true';
      return port === 465;
    })();

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: secureEnv,
      auth: user && pass ? { user, pass } : undefined,
      pool: process.env.SMTP_POOL === 'true' || false,
      connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT || 10_000),
      greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT || 10_000),
    });

    return transporter;
  }

  private dedent(s = ''): string {
    const str = String(s).replace(/\t/g, '    ');
    const lines = str.split('\n');
    while (lines.length && lines[0].trim() === '') lines.shift();
    while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();
    const indents = lines.filter(l => l.trim()).map(l => l.match(/^ */)![0].length);
    const minIndent = indents.length ? Math.min(...indents) : 0;
    return lines.map(l => l.slice(minIndent)).join('\n');
  }

  private markdownToSafeHtml(md: string): string {
    if (!md) return '';
    const source = this.dedent(md);
    const rawHtml = marked(source);
    if (typeof rawHtml !== 'string') return '';
    return sanitizeHtml(rawHtml, SANITIZE_CONFIG);
  }

  private renderTemplate(template: string, data: TemplateData = {}): string {
    const escapeHtml = (s: string) =>
      s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    return template.replace(/{{\s*([a-zA-Z0-9_\-]+)\s*}}/g, (match, token) => {
      const raw = data[token];
      if (raw === undefined || raw === null) return '';
      if (token === 'body') return String(raw);
      return escapeHtml(String(raw));
    });
  }

  private wrapAndInline(htmlBody: string, template: string, templateData: TemplateData) {
    const bodyInlineStyles =
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;' +
      'color:#111827; font-size:16px; line-height:1.5;';

    const elementResets = `
      <style>
        h1,h2,h3,h4,h5{margin:0 0 12px 0; font-weight:700;}
        p{margin:0 0 12px 0;}
        ul,ol{margin:0 0 12px 16px; padding-left:16px;}
        a{color:#2545e0; text-decoration:none;}
      </style>
    `;

    const bodyWrapped = `<div style="${bodyInlineStyles}">${elementResets}${htmlBody}</div>`;
    const rawTemplate = template || defaultTemplate;

    const withBody = rawTemplate
      .replace(/{{\s*body\s*}}/g, bodyWrapped)
      .replace(/{{\s*logoUrl\s*}}/g, String(templateData.logoUrl || ''))
      .replace(/{{\s*footerText\s*}}/g, String(templateData.footerText || ''));

    const inlined = juice(withBody);
    return inlined;
  }

  private generateTextFromHtml(html: string) {
    return htmlToText(html, HTML_TO_TEXT_CONFIG);
  }

  async sendEmail(options: SendEmailOptions) {
    const template = options.template || defaultTemplate;
    const templateData: TemplateData = Object.assign(
      {
        logoUrl: process.env.EMAIL_LOGO_URL || '',
        footerText: process.env.EMAIL_FOOTER || 'If you did not ask for this, ignore it.',
      },
      options.templateData || {}
    );

    let html = options.html ?? '';
    let text = options.text ?? '';

    if (options.markdown) {
      html = this.markdownToSafeHtml(options.markdown);
    }

    if (html) {
      const final = this.wrapAndInline(html, template, templateData);
      html = final;
      text = text || this.generateTextFromHtml(final);
    } else if (!html && template) {
      const rendered = this.renderTemplate(template, templateData);
      html = juice(rendered);
      text = text || this.generateTextFromHtml(html);
    }

    html = html || '';
    text = text || '';
    
    const maxAttempts = Number(process.env.EMAIL_SEND_ATTEMPTS || DEFAULT_MAX_ATTEMPTS);
    let attempt = 0;
    let lastError: unknown = null;

    while (attempt < maxAttempts) {
      try {
        const info = await this.transporter.sendMail({
          from: options.from,
          to: options.to,
          subject: options.subject,
          text,
          html,
        });
        return info;
      } catch (err) {
        lastError = err;
        attempt += 1;
        const backoff = Math.min(200 * attempt, 2000);
        await new Promise((res) => setTimeout(res, backoff));
      }
    }

    throw lastError;
  }
}

const notificationService = new NotificationService();
export default notificationService;
