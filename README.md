# GlobeTrotter

> Multi-city travel planning — dated, costed, shareable itineraries.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite, React Router v6, TanStack Query, React Hook Form + Zod, Tailwind CSS |
| Backend | Node.js 20, Express 4, node-postgres (`pg`) |
| Database | PostgreSQL 15+, `node-pg-migrate` |

## Setup

### Prerequisites
- Node.js 20 LTS
- PostgreSQL 15+ running locally

### 1. Create the database

```bash
psql -U postgres -c "CREATE DATABASE globetrotter;"
```

### 2. Configure environment

```bash
cd server
cp .env.example .env
# Edit .env — set DATABASE_URL, and optionally regenerate JWT secrets
```

### 3. Install dependencies

```bash
# Server
cd server && npm install

# Client
cd ../client && npm install
```

### 4. Run migrations

```bash
cd server
npm run migrate:up
npm run seed      # loads seed data (Phase 1+)
```

### 5. Start development servers

Open two terminals:

```bash
# Terminal 1 — API server (port 5000)
cd server && npm run dev

# Terminal 2 — React SPA (port 5173)
cd client && npm run dev
```

Visit `http://localhost:5173` — the Vite proxy forwards `/api/*` to the Express server.

## Scripts

| Command | Location | Purpose |
|---|---|---|
| `npm run dev` | server/ | Start API with nodemon |
| `npm run migrate:up` | server/ | Apply pending migrations |
| `npm run migrate:down` | server/ | Roll back last migration |
| `npm run seed` | server/ | Load seed data |
| `npm run dev` | client/ | Start Vite dev server |

## Environment variables (server/.env)

| Variable | Description |
|---|---|
| `PORT` | HTTP port (default 5000) |
| `NODE_ENV` | `development` \| `production` |
| `DATABASE_URL` | `postgresql://user:pass@host:port/db` |
| `JWT_ACCESS_SECRET` | ≥32 chars — signs 15-min access tokens |
| `JWT_REFRESH_SECRET` | ≥32 chars — signs 7-day refresh tokens |
| `CORS_ORIGIN` | Comma-separated allowed origins |
| `UPLOAD_DIR` | Path for local file uploads |

## Demo credentials (after seeding — Phase 1)

| Role | Email | Password |
|---|---|---|
| Admin | admin@globetrotter.dev | (see Phase 1 seed) |
| User | alice@example.com | (see Phase 1 seed) |
| User | bob@example.com | (see Phase 1 seed) |

## Health check

```
GET /api/health
→ { "status": "ok", "db": "up", "uptime": 42.3 }
```


hello odoo from team codeify.