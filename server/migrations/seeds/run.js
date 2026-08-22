/**
 * run.js — Seed runner for Phase 1.
 * Seeds are plain SQL files executed in order.
 * This file is a placeholder; the actual seeds will be added in Phase 1.
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../../src/db/pool.js';
import '../../src/config/env.js'; // ensure env is validated

const __dirname = dirname(fileURLToPath(import.meta.url));

const seedFiles = [
  '01_countries.sql',
  '02_cities.sql',
  '03_categories.sql',
  '04_activities.sql',
  '05_users.sql',
  '06_demo_trips.sql',
];

async function runSeeds() {
  console.log('🌱 Running seeds…');
  for (const file of seedFiles) {
    const path = join(__dirname, file);
    try {
      const sql = readFileSync(path, 'utf8');
      await pool.query(sql);
      console.log(`  ✓ ${file}`);
    } catch (err) {
      // Skip files that don't exist yet (they'll be added in Phase 1)
      if (err.code === 'ENOENT') {
        console.log(`  – ${file} (not yet created — Phase 1)`);
      } else {
        console.error(`  ✗ ${file}: ${err.message}`);
        process.exit(1);
      }
    }
  }
  await pool.end();
  console.log('✅ Seed complete');
}

runSeeds();
