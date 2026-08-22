/**
 * pool.js — Single shared pg.Pool for the entire process.
 * All queries go through the query() helper which logs slow queries in development.
 */
import pg from 'pg';
import { env } from '../config/env.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on('error', (err) => {
  console.error('Unexpected pg pool error', err);
});

/**
 * Execute a parameterised query and (in dev) log slow ones.
 * @param {string} text - Parameterised SQL string
 * @param {any[]} [params] - Query parameters
 * @returns {Promise<pg.QueryResult>}
 */
export async function query(text, params) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;

  if (env.NODE_ENV === 'development' && duration > 200) {
    console.warn(`⚠️  Slow query (${duration}ms): ${text.slice(0, 120)}`);
  }

  return result;
}

/**
 * Get a dedicated client from the pool (for transactions).
 * Remember to call client.release() in a finally block.
 */
export async function getClient() {
  return pool.connect();
}
