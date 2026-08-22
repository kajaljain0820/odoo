/**
 * env.js — Load and validate environment variables at boot using Zod.
 * The process will exit with a readable message if any required variable is missing.
 */
import { z } from 'zod';
import { config } from 'dotenv';

config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required (postgresql://user:pass@host:port/db)'),
  JWT_ACCESS_SECRET: z
    .string()
    .min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  CORS_ORIGIN: z.string().min(1, 'CORS_ORIGIN is required (comma-separated allowed origins)'),
  UPLOAD_DIR: z.string().default('./uploads'),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const messages = result.error.errors
    .map((e) => `  ✗ ${e.path.join('.')}: ${e.message}`)
    .join('\n');
  console.error('❌ Server startup failed — missing or invalid environment variables:\n' + messages);
  process.exit(1);
}

export const env = result.data;
