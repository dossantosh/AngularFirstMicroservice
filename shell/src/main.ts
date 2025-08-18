import { initMf } from './mf-runtime';

(async () => {
  await initMf();        // runtime ready for all lazy chunks
  await import('zone.js');
  await import('./bootstrap');
})().catch((err) => {
  console.error('Shell main failed:', err);
});
