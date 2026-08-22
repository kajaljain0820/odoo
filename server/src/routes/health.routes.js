/**
 * health.routes.js — GET /api/health
 * Returns server uptime and database connectivity status.
 */
import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { pool } from '../db/pool.js';

const router = Router();

router.get(
  '/health',
  asyncHandler(async (_req, res) => {
    let dbStatus = 'down';
    try {
      await pool.query('SELECT 1');
      dbStatus = 'up';
    } catch {
      // db is down — still return 200 with status info so load balancers can distinguish
    }

    res.json({
      status: 'ok',
      db: dbStatus,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;
