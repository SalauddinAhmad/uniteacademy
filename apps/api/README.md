# Uniteacademy API

Node.js + Express + Prisma + MySQL backend for Uniteacademy.

## Prerequisites

- Node.js **18.18+** (20.x recommended)
- MySQL 5.7+ / 8.0
- npm / pnpm / bun

## Local Setup

```bash
cd apps/api
cp .env.example .env
# edit .env — set DATABASE_URL, JWT_SECRET, SMTP_*

npm install
npx prisma migrate dev --name init
npm run dev
```

API runs at `http://localhost:4000`.

Health check: `GET http://localhost:4000/api/health`

## Available Endpoints (Phase 1)

| Method | Path                 | Auth  | Description              |
| ------ | -------------------- | ----- | ------------------------ |
| POST   | `/api/auth/register` | No    | Create student account   |
| POST   | `/api/auth/login`    | No    | Email/username + password |
| GET    | `/api/auth/me`       | Bearer | Current user profile     |
| GET    | `/api/courses`       | No    | List published courses   |
| GET    | `/api/courses/:slug` | No    | Course detail            |
| GET    | `/api/health`        | No    | Liveness check           |

More endpoints (enrollments, programs, admin CRUD, uploads, email) arrive in
Phase 2–6 per `.lovable/plan.md`.

## Deploying to cPanel (IT Host BD — Regular-Pro)

Full guide arrives in Phase 7. Short version:

1. **MySQL Databases** → create DB, DB user, grant ALL, note the full name
   (e.g. `cpuser_uniteacademy`).
2. **SSH** into the server, `cd ~/`, clone or upload `apps/api/`, run
   `npm ci --omit=dev` then `npx prisma migrate deploy`.
3. **Setup Node.js App** → Application root: `apps/api`, startup file:
   `dist/index.js`, Node version: 20.x, add all `.env` vars.
4. Passenger will proxy to your Express app at the domain you pick.
