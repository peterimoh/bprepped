import { Job } from 'pg-boss';
import { getQueue, QUEUE_NAMES, SendEmailJob } from './client';
import notificationService from '@/lib/notification';

export async function startWorker() {
  const boss = getQueue();

  try {
    await boss.start();
    console.log('Background worker started successfully');

    await boss.createQueue(QUEUE_NAMES.SEND_EMAIL);

    await boss.work<SendEmailJob>(
      QUEUE_NAMES.SEND_EMAIL,
      { localConcurrency: 5 },
      async (jobs: Job<SendEmailJob>[]) => {
        for (const job of jobs) {
          const { data } = job;
          await notificationService.sendEmail(data);
        }
      }
    );

  } catch (error) {
    console.error('Failed to start background worker:', error);
  }
}
