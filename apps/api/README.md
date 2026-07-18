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

## Available Endpoints

### Public
| Method | Path                 | Description              |
| ------ | -------------------- | ------------------------ |
| GET    | `/api/health`        | Liveness check           |
| POST   | `/api/auth/register` | Create student account   |
| POST   | `/api/auth/login`    | Email/username + password |
| GET    | `/api/courses`       | List published courses   |
| GET    | `/api/courses/:slug` | Course detail            |
| GET    | `/api/programs`      | List programs            |
| GET    | `/api/programs/:slug`| Program detail           |

### Authenticated (Bearer token)
| Method | Path                              | Description                    |
| ------ | --------------------------------- | ------------------------------ |
| GET    | `/api/auth/me`                    | Current user profile           |
| GET    | `/api/enrollments`                | My enrollments                 |
| POST   | `/api/enrollments`                | Enroll in course/program       |
| PATCH  | `/api/enrollments/:id/progress`   | Update progress 0-100          |

### Admin (Bearer token, role=admin)
| Method | Path                          | Description        |
| ------ | ----------------------------- | ------------------ |
| GET/POST/PATCH/DELETE | `/api/admin/courses[/:id]`   | Course CRUD  |
| GET/POST/PATCH/DELETE | `/api/admin/programs[/:id]`  | Program CRUD |
| GET    | `/api/admin/users`            | List users         |
| PATCH  | `/api/admin/users/:id/role`   | Change role        |
| DELETE | `/api/admin/users/:id`        | Delete user        |

## Seed the database

After `prisma migrate dev`, run:

```bash
npm run seed
```

Creates:
- Admin: `admin@uniteacademy.com` / `Admin@12345`
- Student: `student@uniteacademy.com` / `Student@12345`
- 11 courses + DIS program + teacher accounts (password: `Teacher@12345`)

More features (uploads, email, Google OAuth) arrive in Phase 4–6 per `.lovable/plan.md`.

## Deploying to cPanel (IT Host BD — Regular-Pro)

Full guide arrives in Phase 7. Short version:

1. **MySQL Databases** → create DB, DB user, grant ALL, note the full name
   (e.g. `cpuser_uniteacademy`).
2. **SSH** into the server, `cd ~/`, clone or upload `apps/api/`, run
   `npm ci --omit=dev` then `npx prisma migrate deploy`.
3. **Setup Node.js App** → Application root: `apps/api`, startup file:
   `dist/index.js`, Node version: 20.x, add all `.env` vars.
4. Passenger will proxy to your Express app at the domain you pick.
