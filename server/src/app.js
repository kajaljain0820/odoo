/**
 * app.js — Express application.
 * Middleware stack order matches PROJECT.md §4:
 * helmet → cors → rateLimit → parsers → logger → routes → errorHandler
 */
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { pinoHttp } from 'pino-http';
import pino from 'pino';

import { env } from './config/env.js';
import { errorHandler } from './errors/errorHandler.js';
import healthRouter from './routes/health.routes.js';

const app = express();

// ── Security headers ────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS — only allow listed origins; credentials require an explicit origin ─
const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());
app.use(
  cors({
    origin: (origin, cb) => {
      // Allow same-origin (no Origin header) and listed origins
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: ${origin} is not allowed`));
    },
    credentials: true,
  })
);

// ── Compression ─────────────────────────────────────────────────────────────
app.use(compression());

// ── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// ── Cookie parser ────────────────────────────────────────────────────────────
app.use(cookieParser());

// ── Structured logger (pino-http) ────────────────────────────────────────────
const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
});
app.use(pinoHttp({ logger }));

// ── Static uploads ───────────────────────────────────────────────────────────
app.use('/uploads', express.static(env.UPLOAD_DIR));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', healthRouter);

// 404 for unknown routes
app.use((_req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found.' } });
});

// ── Central error handler (must be last) ────────────────────────────────────
app.use(errorHandler);

export default app;
