## Progress

- ✅ **Phase 1 — Backend bootstrap** (complete): `apps/api/` scaffold with Express + Prisma + JWT auth, MySQL schema, `/api/auth/*` + `/api/courses/*`, `.env.example`, README.
- ✅ **Phase 2 — Data layer** (complete): seed script (11 courses + DIS + admin/teacher/student accounts), `/api/enrollments`, `/api/programs`, full `/api/admin/*` CRUD.
- 🟡 **Phase 3 — Frontend rewire** (in progress)
  - ✅ 3a: REST API client (`src/lib/api/client.ts`), `AuthUser` types, `useAuth()` context, login/signup pages rewired, `_authenticated` gate uses JWT.
  - ✅ 3b: Public courses (`/courses` list + `/courses/$slug` detail) rewired via TanStack Query → REST (`/api/courses`, `/api/courses/:slug`). Static fallback if API unreachable. Home page (`/`) intentionally still uses static curated data.
  - ⏳ 3c: Student dashboard (`/dashboard/*`)
  - ⏳ 3d: Admin console (`/admin/*`)
- ⏳ Phase 4 — File uploads (multer → local disk / cPanel)
- ⏳ Phase 5 — Email (Gmail SMTP: verification, password reset)
- ⏳ Phase 6 — Google OAuth (optional)
- ⏳ Phase 7 — cPanel deployment (IT Host BD Regular-Pro)

---

## লক্ষ্য

বর্তমান Uniteacademy সাইটের **frontend অপরিবর্তিত** রেখে backend পুরোপুরি নিজস্ব **Node.js API server + MySQL database**-এ সরিয়ে আনা। Lovable Cloud / Supabase-এর উপর কোনো নির্ভরতা থাকবে না, নিজের VPS-এ deploy করা যাবে।

## Final Architecture

```text
┌─────────────────────────┐        ┌──────────────────────────┐
│  Frontend (TanStack)    │  HTTPS │  Node.js API (Express)   │
│  Static build → Nginx   │ ─────► │  /api/*  JWT auth        │
│  Vite output: dist/     │        │  Prisma ORM              │
└─────────────────────────┘        └────────────┬─────────────┘
                                                │
                                        ┌───────▼────────┐
                                        │  MySQL 8.x     │
                                        │  (VPS/managed) │
                                        └────────────────┘
                                        ┌────────────────┐
                                        │ S3/local disk  │
                                        │ course covers  │
                                        └────────────────┘
```

## Repository Layout (migration শেষে)

```text
uniteacademy/
├── apps/
│   ├── web/          ← বর্তমান TanStack Start project (SSR বাদ, SPA build)
│   └── api/          ← নতুন Node.js + Express + Prisma server
├── packages/
│   └── shared-types/ ← DTO types দুই side শেয়ার করবে
└── docker-compose.yml (MySQL + api + nginx)
```

---

## Phase 1 — Node.js API server bootstrap

- `apps/api/` তে নতুন Express (বা Fastify) app: TypeScript, Prisma, Zod, bcrypt, jsonwebtoken, passport-google-oauth20, multer/S3, cors, helmet, express-rate-limit, pino logger।
- Folder: `src/routes/`, `src/middleware/`, `src/services/`, `src/lib/prisma.ts`।
- Config: `.env` (DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET, GOOGLE_CLIENT_ID/SECRET, S3_*, CORS_ORIGIN)।
- Health check: `GET /api/health`।

## Phase 2 — MySQL schema (Prisma)

বর্তমান ১১টি Postgres table → Prisma schema-তে convert:

```text
User            (id, email, username, password_hash, google_id, created_at)
Profile         (user_id PK, full_name, avatar_url, phone, joined_at)
UserRole        (user_id, role ENUM['admin','teacher','student'])
Course          (id, slug, title_bn, title_en, description, long_description,
                 cover_url, category, type, level, instructor,
                 duration_minutes, duration_text, lessons_count, price,
                 original_price, rating, students, is_published,
                 learn_points JSON, requirements JSON, modules JSON)
CourseTeacher   (course_id, name, initials, avatar_url, sort)
Program         (id, slug, title_bn, title_en, batch_label, cover_url,
                 starts_at, ends_at)
ProgramCourse   (program_id, course_id, semester_id, sort)
Semester        (id, program_id, label, sort, starts_on, ends_on, is_locked)
Enrollment      (id, user_id, program_id?, course_id?, enrolled_at, is_behind)
Lesson          (id, course_id, title_bn, sort, duration_minutes, video_url)
LessonProgress  (user_id, lesson_id, completed, watched_seconds, updated_at)
QuizAttempt     (user_id, course_id, score, total, completed_at)
Assignment      (id, course_id, title, due_at, published_at, status)
```

মূল conversion rules:
- Postgres `uuid` → MySQL `CHAR(36)` + application-generated UUIDv4।
- `JSONB` → MySQL `JSON`।
- `TIMESTAMPTZ` → `DATETIME(3)` (UTC store)।
- `has_role()` DB function → API middleware (`requireRole('admin')`)।
- **RLS policies → application-layer authorization** (প্রতিটি query-তে `WHERE user_id = req.user.id` middleware দিয়ে enforce)।

Deliverable: `prisma/schema.prisma` + প্রথম migration + seed script (১১টা course + Diploma program + demo admin/student user)।

## Phase 3 — Auth system (Supabase Auth replacement)

- `POST /api/auth/signup` — email + password + username, bcrypt hash (cost 12), profile auto-create, default role `student`।
- `POST /api/auth/login` — issue access token (JWT, 15min) + refresh token (httpOnly cookie, 30d)।
- `POST /api/auth/refresh` — rotate refresh token।
- `POST /api/auth/logout` — clear cookie, blacklist।
- `GET /api/auth/me` — current user।
- `GET /api/auth/google` + `/api/auth/google/callback` — Passport Google OAuth strategy।
- `POST /api/auth/forgot-password` + `POST /api/auth/reset-password` — token via email (Resend/SMTP)।
- Middleware: `requireAuth`, `requireRole('admin' | 'teacher')`।

## Phase 4 — REST endpoint mapping (server functions → HTTP)

বর্তমান `createServerFn` → REST routes:

```text
Public (no auth)
  GET  /api/courses                     ← courses list page
  GET  /api/courses/:slug               ← course detail page
  GET  /api/programs/:slug

Student (requireAuth)
  GET  /api/dashboard/overview          ← getOverview
  GET  /api/dashboard/my-courses        ← getMyCourses
  GET  /api/dashboard/enrollments/:id   ← getCourseDetail
  POST /api/enrollments                 ← enroll in course/program
  POST /api/lessons/:id/progress
  POST /api/quiz-attempts

Admin (requireRole 'admin')
  GET/POST/PUT/DELETE  /api/admin/courses
  GET/POST/PUT/DELETE  /api/admin/users
  GET/POST/PUT/DELETE  /api/admin/programs
  ...                  /api/admin/enrollments|notices|payments|settings

Uploads
  POST /api/uploads/course-cover        ← multipart, returns URL
```

প্রতিটি endpoint-এ Zod validation + Prisma query + typed response।

## Phase 5 — Frontend rewire

- `apps/web/` থেকে **সরানো হবে**: `src/integrations/supabase/*`, `src/lib/*.functions.ts`, `src/routes/_authenticated/route.tsx`-এর Supabase gate, `src/start.ts`-এর `attachSupabaseAuth`।
- **নতুন `src/lib/api.ts`** — একটি typed fetch client (`fetch` wrapper), automatic bearer token attachment (memory + refresh cookie), 401 হলে refresh retry।
- **নতুন `src/lib/auth-context.tsx`** — React Context: `user`, `login`, `logout`, `signup`, `loginWithGoogle`।
- `_authenticated/route.tsx` gate — `useAuth()` দিয়ে check, না থাকলে `/auth/login`-এ redirect।
- সব `createServerFn` call site (dashboard pages, admin pages, course detail) → `api.get()/post()` calls (TanStack Query দিয়ে wrap)।
- **SSR বাদ** — TanStack Start-কে SPA mode-এ build (`vite build`), অথবা আলাদা করে Vite + React Router-এ port করা (optional; SPA-only অনেক সহজ)।
- `head()` metadata → static SPA route-level meta (react-helmet-async দিয়ে replace)।

## Phase 6 — File storage (course covers)

বর্তমান `public/course-covers/*.jpg` files:
- **Option A (simple)**: API server-এ `apps/api/uploads/` folder + Express static serve `/uploads/*`।
- **Option B (production)**: S3-compatible (AWS S3 / Cloudflare R2 / MinIO), API returns signed URL।

Recommendation: শুরুতে Option A, traffic বাড়লে B।

## Phase 7 — Deployment

VPS setup (Ubuntu 22.04, 2GB RAM যথেষ্ট):

```text
Nginx (reverse proxy + SSL via certbot)
  ├── /            → serve apps/web/dist/ (static)
  └── /api/*       → proxy to http://localhost:4000

PM2 (process manager)
  └── apps/api (Node.js, cluster mode)

MySQL 8.x (systemd service, daily mysqldump cron → /backups)
```

Docker option: `docker-compose.yml` — mysql, api, nginx তিনটি service। এক command-এ dev/prod up।

CI: GitHub Actions → SSH deploy → `git pull && bun install && prisma migrate deploy && pm2 reload api && web build`।

---

## Migration Order (এক phase শেষ করে পরের-টা)

1. **Phase 1 + 2** (একসাথে) — API skeleton + Prisma schema + seed। Postman দিয়ে test।
2. **Phase 3** — Auth endpoints। Postman/Insomnia collection দিয়ে verify।
3. **Phase 4** — Public course endpoints, তারপর student, তারপর admin। প্রতিটার পর manual test।
4. **Phase 5** — Frontend rewire (একটা section-এ একটা: auth → dashboard → admin → public pages)। এই phase-এ dual-run — Cloud এখনো live, নতুন API side-by-side test।
5. **Phase 6** — Upload endpoint + existing images migrate (script যা Cloud storage থেকে download করে API server-এ upload করে)।
6. **Phase 7** — VPS provision → deploy → DNS cutover → Lovable Cloud disconnect।

## Technical Details (developer-facing)

- **UUID strategy**: MySQL 8-এ `CHAR(36)` + Prisma `@default(uuid())` — Postgres থেকে data migrate করলে existing UUIDs preserve হবে।
- **JSON columns**: MySQL 8-এর JSON type native, Prisma `Json` scalar কাজ করবে।
- **Full-text search**: প্রয়োজন হলে MySQL FULLTEXT index (`title_bn`, `description`) — বর্তমানে দরকার নেই।
- **Enum**: Prisma-তে native enum (`Role`, `CourseCategory`, `CourseType`)।
- **Data migration script**: `scripts/migrate-from-cloud.ts` — Cloud থেকে REST দিয়ে সব table dump → MySQL-এ Prisma দিয়ে insert।
- **Testing**: Vitest (api) + Playwright (e2e), অন্তত auth flow + course enrollment cover।

## Timeline Estimate (আপনি single dev হিসেবে)

| Phase | সময় |
|-------|-----|
| 1 + 2 | ১ দিন |
| 3     | ১ দিন |
| 4     | ২ দিন |
| 5     | ২-৩ দিন (সবচেয়ে বড় phase) |
| 6     | আধা দিন |
| 7     | ১ দিন |
| **মোট** | **৭-৮ কার্যদিবস** |

## এখন যা লাগবে (আপনার কাছ থেকে confirm)

1. **Repo structure** — monorepo (`apps/web` + `apps/api`) নাকি সম্পূর্ণ আলাদা দুটো repo?
2. **ORM** — Prisma (recommended) নাকি Drizzle/TypeORM/Sequelize?
3. **Hosting** — নিজের VPS (DigitalOcean/Hetzner) নাকি managed (Railway/Render)? MySQL managed (PlanetScale/AWS RDS) নাকি VPS-এ self-hosted?
4. **File storage** — Option A (local disk) নাকি Option B (S3/R2) দিয়ে শুরু?
5. **Email** — password reset ইত্যাদির জন্য SMTP (Gmail) নাকি Resend/SendGrid?

Approve করলে আমরা **Phase 1 + 2** দিয়ে শুরু করব — `apps/api` folder তৈরি হবে, Prisma schema লেখা হবে, seed script চলবে।

## এই migration-এর trade-off (স্পষ্ট করে)

**হারাবেন**: Cloud-এর auto-scaling, auto-backup, built-in auth UI, realtime subscriptions (এখন ব্যবহার হচ্ছে না), one-click publish।
**পাবেন**: পূর্ণ নিয়ন্ত্রণ, MySQL চেনা database, নিজের VPS-এ চালানোর স্বাধীনতা, vendor lock-in নেই।
