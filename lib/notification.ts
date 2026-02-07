import nodemailer from 'nodemailer';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import juice from 'juice';
import { htmlToText } from 'html-to-text';
import { defaultTemplate } from '@/constants/email-template';

type TemplateData = Record<string, string | number | boolean>;

export interface SendEmailOptions {
  from?: string;
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  markdown?: string;
  template?: string;
  templateData?: TemplateData;
}

interface NotificationConfig {
  smtp: {
    host: string;
    port: number;
    user?: string;
    pass?: string;
    secure: boolean;
    pool: boolean;
  };
  email: {
    from: string;
    logoUrl: string;
    footerText: string;
    sendAttempts: number;
  };
}

const HTML_TO_TEXT_CONFIG = { wordwrap: 130 } as const;

const SANITIZE_CONFIG: sanitizeHtml.IOptions = {
  allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ['src', 'alt', 'title', 'width', 'height'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'data'],
};

export class NotificationService {
  private readonly transporter: nodemailer.Transporter;
  private readonly config: NotificationConfig;

  constructor() {
    this.config = this.loadConfig();
    this.transporter = this.createTransporter();
  }

  private loadConfig(): NotificationConfig {
    const port = Number(process.env.SMTP_PORT || 1025);
    return {
      smtp: {
        host: process.env.SMTP_HOST || 'localhost',
        port,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        secure: process.env.SMTP_SECURE === 'true' || port === 465,
        pool: process.env.SMTP_POOL === 'true',
      },
      email: {
        from: process.env.EMAIL_FROM || 'noreply@bprepped.ai',
        logoUrl: process.env.EMAIL_LOGO_URL || '',
        footerText: process.env.EMAIL_FOOTER || 'If you did not ask for this, ignore it.',
        sendAttempts: Number(process.env.EMAIL_SEND_ATTEMPTS || 2),
      },
    };
  }

  /**
   * Creates the Nodemailer transporter.
   */
  private createTransporter(): nodemailer.Transporter {
    const { host, port, secure, user, pass, pool } = this.config.smtp;

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
      pool,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
    } as nodemailer.TransportOptions);
  }

  /**
   * Sends an email with retry logic.
   */
  async sendEmail(options: SendEmailOptions): Promise<any> {
    const { html, text } = await this.prepareContent(options);

    let lastError: unknown;

    for (let attempt = 1; attempt <= this.config.email.sendAttempts; attempt++) {
      try {
        return await this.transporter.sendMail({
          from: options.from || this.config.email.from,
          to: options.to,
          subject: options.subject,
          text,
          html,
        });
      } catch (error) {
        lastError = error;
        if (attempt < this.config.email.sendAttempts) {
          await new Promise((resolve) => setTimeout(resolve, Math.min(200 * attempt, 2000)));
        }
      }
    }

    throw lastError;
  }

  private async prepareContent(options: SendEmailOptions): Promise<{ html: string; text: string }> {
    const templateData = {
      logoUrl: this.config.email.logoUrl,
      footerText: this.config.email.footerText,
      ...options.templateData,
    };

    let html = options.html || '';

    if (options.markdown) {
      html = this.markdownToSafeHtml(options.markdown);
    }

    if (html) {
      html = this.wrapAndInline(html, options.template || defaultTemplate, templateData);
    } else if (options.template || defaultTemplate) {
      const rendered = this.renderTemplate(options.template || defaultTemplate, templateData);
      html = juice(rendered);
    }

    const text = options.text || htmlToText(html, HTML_TO_TEXT_CONFIG);

    return { html, text };
  }

  private dedent(str = ''): string {
    const lines = str.replace(/\t/g, '    ').split('\n');
    while (lines.length && lines[0].trim() === '') lines.shift();
    while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();

    const minIndent = lines
      .filter((l) => l.trim())
      .reduce((min, line) => {
        const indent = line.match(/^ */)?.[0].length ?? 0;
        return Math.min(min, indent);
      }, Infinity);

    return lines.map((l) => l.slice(minIndent === Infinity ? 0 : minIndent)).join('\n');
  }

  private markdownToSafeHtml(md: string): string {
    if (!md) return '';
    const rawHtml = marked(this.dedent(md));
    return sanitizeHtml(typeof rawHtml === 'string' ? rawHtml : '', SANITIZE_CONFIG);
  }

  private renderTemplate(template: string, data: TemplateData): string {
    const escapeHtml = (s: string) =>
      s.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m] || m));

    return template.replace(/{{\s*([a-zA-Z0-9_\-]+)\s*}}/g, (match, token) => {
      const value = data[token];
      if (value === undefined || value === null) return '';
      return token === 'body' ? String(value) : escapeHtml(String(value));
    });
  }

  private wrapAndInline(htmlBody: string, template: string, data: TemplateData): string {
    const bodyStyles = 'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;color:#111827;font-size:16px;line-height:1.5;';
    const resets = '<style>h1,h2,h3,h4,h5{margin:0 0 12px 0;font-weight:700;}p{margin:0 0 12px 0;}ul,ol{margin:0 0 12px 16px;padding-left:16px;}a{color:#2545e0;text-decoration:none;}</style>';

    const bodyWrapped = `<div style="${bodyStyles}">${resets}${htmlBody}</div>`;
    const finalHtml = this.renderTemplate(template, { ...data, body: bodyWrapped });

    return juice(finalHtml);
  }
}

const notificationService = new NotificationService();
export default notificationService;
