# Phase 7 — Course Player

লক্ষ্য: enrolled student একটা course-এ ঢুকে module → lesson দেখতে পারবে, video/PDF চালাতে পারবে, progress auto-save হবে, lesson শেষে quiz দিতে পারবে। Admin/teacher content upload/CRUD করতে পারবে।

## Scope

### 1. Prisma schema (`apps/api/prisma/schema.prisma`)
- `Module` — courseId, title, order, description
- `Lesson` — moduleId, title, order, kind (`video|pdf|text|quiz`), contentUrl, durationMin, body (text/markdown)
- `LessonProgress` — userId, lessonId, status (`not_started|in_progress|completed`), watchedSeconds, completedAt
- `Quiz` — lessonId, title, passMarks
- `QuizQuestion` — quizId, order, prompt, options (JSON array), correctIndex, points
- `QuizAttempt` — quizId, userId, score, passed, submittedAt, answers (JSON)

Migration SQL + seed: 2-3 modules per flagship course with 3-4 lessons each, 1 sample quiz.

### 2. Backend routes (`apps/api/src/routes/`)
- `modules.ts` — GET `/api/courses/:courseId/modules` (nested lessons), Admin CRUD
- `lessons.ts` — GET `/api/lessons/:id` (enrollment-gated), Admin CRUD
- `progress.ts` — GET `/api/progress/course/:courseId`, POST `/api/progress/lesson/:id` (upsert watchedSeconds/status)
- `quiz.ts` — GET `/api/quiz/:lessonId` (questions without answers), POST `/api/quiz/:lessonId/submit` (grade + record attempt)

Enrollment gate: middleware checks user has active enrollment for the course before serving lesson/quiz content.

### 3. Frontend API (`src/lib/api/`)
- `player.ts` — modules, lesson, progress upsert, quiz fetch/submit
- queryOptions exports for each

### 4. Player route
- `src/routes/_authenticated/learn.$courseSlug.tsx` — layout with left sidebar (modules/lessons tree + progress bar) and right content pane
- `src/routes/_authenticated/learn.$courseSlug.$lessonId.tsx` — lesson viewer
  - Video: HTML5 `<video>` with `timeupdate` throttled progress save (every 10s)
  - PDF: `<iframe>` or react-pdf viewer
  - Text: markdown render
  - Quiz: question-by-question UI, submit → score card, retry button
- "Mark complete" button, prev/next nav, breadcrumb

### 5. Admin UI (`src/routes/_admin.admin.courses.$id.content.tsx`)
- Course content builder: drag-free simple list — add module, add lesson (kind selector), upload URL, quiz question editor
- Reachable from existing Admin Courses table via "Content" action button

### 6. Course detail page
- Update `src/routes/courses_.$slug.tsx` — enrolled users get "Continue learning" CTA → `/learn/:slug`
- Show real module/lesson count from API

## Out of scope (later)
- File upload to disk (use URL for now — admin pastes video/PDF URL)
- Certificate generation on course complete
- Discussion/comments per lesson
- Live class integration (Zoom/Meet)
- Drag-and-drop reorder in admin (use up/down buttons)

## Execution order
1. Prisma schema + migration + seed
2. Backend routes + enrollment middleware helper
3. Frontend API bindings
4. Player routes (sidebar + viewer + quiz)
5. Admin content builder
6. Course detail "Continue learning" wire-up
7. Typecheck + smoke test

User-এর কাছে migration চালাতে হবে: `cd apps/api && npx prisma migrate dev && npm run seed`।

সব একবারে টানা শেষ করব — approve করলে শুরু।