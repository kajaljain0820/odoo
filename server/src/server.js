/**
 * server.js — HTTP server entry point.
 * Starts listening and drains the pg pool on SIGTERM / SIGINT.
 */
import app from './app.js';
import { env } from './config/env.js';
import { pool } from './db/pool.js';

const server = app.listen(env.PORT, () => {
  console.log(`🚀 GlobeTrotter API running on port ${env.PORT} [${env.NODE_ENV}]`);
});

async function gracefulShutdown(signal) {
  console.log(`\n${signal} received — shutting down gracefully…`);
  server.close(async () => {
    console.log('HTTP server closed');
    await pool.end();
    console.log('Database pool drained');
    process.exit(0);
  });

  // Force-kill if shutdown takes too long
  setTimeout(() => {
    console.error('Forced shutdown after 10s');
    process.exit(1);
  }, 10_000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  // Don't exit; let the request fail naturally and be caught by the error handler
});
