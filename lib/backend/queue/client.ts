import { PgBoss } from 'pg-boss';

let boss: PgBoss | null = null;

export function getQueue() {
  if (!boss) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined');
    }

    boss = new PgBoss({
      connectionString,
      max: 10, // Max number of connections to keep in the pool
      application_name: 'bprepped-queue',
    });

    boss.on('error', (error) => console.error('Queue error:', error));
  }
  return boss;
}

export const QUEUE_NAMES = {
  SEND_EMAIL: 'send-email',
} as const;

export interface SendEmailJob {
  to: string | string[];
  subject: string;
  markdown?: string;
  templateData?: Record<string, string | number | boolean>;
}
