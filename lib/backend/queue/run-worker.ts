import 'dotenv/config';
import { startWorker } from './worker';

async function main() {
  await startWorker();
  console.log('Worker is running...');

  const timer = setInterval(() => {}, 1 << 30);

  if (process.env.NODE_ENV === 'test') {
    setTimeout(() => {
      console.log('Worker smoke test passed (started successfully)');
      clearInterval(timer);
      process.exit(0);
    }, 5000);
  }
}

main().catch((err) => {
  console.error('Worker crashed with error:', err);
  process.exit(1);
});
