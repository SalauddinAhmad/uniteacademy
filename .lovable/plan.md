
# Phase 5 — Learning Modules

লক্ষ্য: Dashboard-এর যে subroutes এখনো empty placeholder আছে (এসাইনমেন্ট, এক্সাম, নোটিশ, নোটিফিকেশন, পেমেন্ট, ইভেন্ট, ক্যালেন্ডার), সেগুলো Node API-তে real data দিয়ে চালু করা। সাথে Admin panel থেকে এদের manage করা যাবে।

## Scope

1. **Prisma schema extension** (`apps/api/prisma/schema.prisma`)
   - `Assignment` (courseId, title, description, dueAt, points)
   - `AssignmentSubmission` (assignmentId, userId, submittedAt, score, status)
   - `Exam` (courseId, title, scheduledAt, durationMin, totalMarks)
   - `ExamAttempt` (examId, userId, score, status, submittedAt)
   - `Notice` (title, body, publishedAt, audience: all|students|teachers)
   - `Notification` (userId, title, body, link, readAt, createdAt)
   - `Payment` (userId, courseId?, programId?, amountCents, method, status, txnId, createdAt)
   - `Event` (title, description, startAt, endAt, courseId?, kind: class|exam|holiday|other)

2. **Course model gap-fill** — add `category`, `type` (live/recorded), `durationMinutes`, `longDescription` কলাম যাতে Admin edit dialog-এর সব field persist হয়।

3. **Migration + seed** — একটি নতুন migration SQL, plus seed.ts-এ 5-10 sample row per model (dev-only)।

4. **API routes** (`apps/api/src/routes/`)
   - `assignments.ts` — GET /api/assignments (student: own courses only; teacher/admin: all)
   - `exams.ts` — GET /api/exams
   - `notices.ts` — GET /api/notices (public read for authenticated), Admin CRUD
   - `notifications.ts` — GET/POST/PATCH /api/notifications
   - `payments.ts` — GET /api/payments (own), Admin list-all
   - `events.ts` — GET /api/events
   - `admin.ts`-এ এদের CRUD endpoints যোগ

5. **Frontend REST bindings** (`src/lib/api/`)
   - `assignments.ts`, `exams.ts`, `notices.ts`, `notifications.ts`, `payments.ts`, `events.ts`
   - প্রতিটির queryOptions export

6. **Dashboard subroute rewire** — প্রতিটি placeholder route-কে useSuspenseQuery দিয়ে list render করানো, empty-state fallback রাখা।

7. **Admin subroute rewire** — `_admin.admin.notices.tsx`, `_admin.admin.notifications.tsx`, `_admin.admin.payments.tsx`, `_admin.admin.enrollments.tsx` কে নতুন API-তে connect।

## Out of scope (later phases)

- Video/lesson player, quiz taking flow, file uploads (assignment submission), payment gateway integration। এখন শুধু read + admin manage।
- Frontend UI redesign — শুধু existing placeholder-এর জায়গায় list render।

## Approach note

Backend schema change breaking — user-কে `apps/api`-এ `npx prisma migrate dev && npm run seed` চালাতে হবে (README-এ instruction যোগ করব)। Frontend fallback থাকবে: API 404/network fail হলে UI empty-state দেখাবে (crash হবে না)।

## Execution order

Step A: schema + migration + seed
Step B: API routes + admin CRUD
Step C: frontend api/ bindings + dashboard rewire
Step D: admin subroute rewire
Step E: typecheck + doc update

চাইলে ধাপে ধাপে confirmation নিয়ে যাব, নয়তো টানা A→E একবারেই শেষ করব।
