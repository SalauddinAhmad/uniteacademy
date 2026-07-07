## Ki toiri hobe

Taibah-style student portal er **puro core journey** — login kore student `/dashboard` e dhukbe, sidebar theke navigate korbe, nijer enrolled course dekhbe, ekta course open kore semester + curriculum dekhbe. Backend real (Lovable Cloud) — user sign up korle profile toiri hobe, seed kora demo course/enrollment/progress data dashboard e dekhabe.

## Backend (Lovable Cloud) — schema

Tables (RLS enabled, `has_role` pattern for admin/student):

```text
profiles(id=auth.users.id, full_name, avatar_url, phone, joined_at)
user_roles(user_id, role: 'admin'|'student')
courses(id, slug, title_bn, title_en, description, cover_url,
        category: 'diploma'|'talimul_quran'|'free'|'teacher_training',
        type: 'live'|'recorded', duration_minutes, is_published)
course_teachers(course_id, name, initials, avatar_url, sort)
programs(id, slug, title_bn, cover_url, batch_label)        -- e.g. DIS Batch-11
program_courses(program_id, course_id, semester, sort)
semesters(id, program_id, label, starts_at, ends_at, is_locked)
enrollments(id, user_id, program_id?, course_id?, enrolled_at, is_behind)
lessons(id, course_id, title_bn, sort, duration_minutes, video_url)
lesson_progress(user_id, lesson_id, completed, watched_seconds, updated_at)
quiz_attempts(user_id, course_id, score, total, completed_at)
assignments(id, course_id, title, due_at, published_at, status)
assignment_submissions(user_id, assignment_id, submitted_at, grade)
```

Trigger: `on_auth_user_created` → insert into `profiles` + default role `student`.
Seed migration: 1 program (DIS Batch-11 + 2 semesters), 6 courses (matching Taibah), teachers, lessons per course, and — for the demo student we seed — enrollment + mock progress so the dashboard looks alive on first login.

## Routes toiri hobe

```text
src/routes/
  _authenticated/
    dashboard.tsx                          → Overview
    dashboard.enrollments.tsx              → My Courses
    dashboard.enrollments.$id.tsx          → Course detail
    dashboard.enrollments.view-all.tsx     → "আরও দেখুন" (recommended list)
    (placeholders for assignments/exams/calendar/events/notice/notifications/payment-history — shell only, "Coming soon" empty state)
```

`_authenticated/route.tsx` — integration-managed gate (auto-created by Cloud).
Existing `/auth/login`, `/auth/signup` — Google button ke `lovable.auth.signInWithOAuth("google", ...)` er sathe wire kora hobe.

## Layout shell — `src/components/dashboard/*`

- `DashboardShell` — `SidebarProvider` + sidebar + topbar + `<Outlet />`, `w-full` root
- `DashboardSidebar` — brand top, 3 group (main/notice-notifications/payment), active state via `useRouterState`, `collapsible="icon"`, footer e language switcher + light/dark toggle
- `DashboardTopbar` — sidebar trigger + breadcrumb (route-driven) + avatar dropdown (name, logout)
- `AvatarInitials`, `ProgressRing`, `StatCard`, `StreakStrip`, `CourseCoverCard`, `ProgramWideCard`, `SemesterAccordion`, `CurriculumItem` — reusable primitives

## Overview page composition

- Green welcome banner: "আসসালামু আলাইকুম, {profile.full_name}!" + subtitle + "কোর্সগুলো দেখুন" link (`/dashboard/enrollments`) + dismiss (localStorage)
- Grid (3 col desktop / 1 col mobile):
  1. **Performance** — big `ProgressRing` (avg progress across enrollments)
  2. **Course stats** — মোট চলমান, শেষ হয়েছে, সময় ব্যয় (rows with icon + count chip)
  3. **Activity** — লাইভ ক্লাস, কুইজ সম্পন্ন, অ্যাসাইনমেন্ট সম্পন্ন
- **আপকামিং ক্লাস** card — empty state icon (calendar) + message
- **Streak** card — gold star + day count + Wed–Tue weekday strip (star per completed day)

## My Courses page

- **ডিপ্লোমা প্রোগ্রাম** section (if user enrolled in a program): wide card w/ cover, batch chip, title, progress bar, "কোর্স চালিয়ে যান →" → `/dashboard/enrollments/:programEnrollmentId`
- **কোর্সসমূহ** — 2-col grid of course cards w/ progress
- **আপনার জন্য আরও কোর্স** — 3-col grid (recommended, unenrolled), category badge (Free/Talimul Quran/Teacher's Training) + status badge (Live/Recorded), footer "আরও দেখুন →"
- Section title row includes "আরও দেখুন →" link to view-all page

## Course detail page

- Breadcrumb: আমার কোর্স › {batch_label}
- Header block: cover thumb + title + batch subline + tag pills (category, duration) + teacher grid (avatar-initial + name, wrap) + date range
- Right rail: `ProgressRing` (19%), CTA "শেখা চালিয়ে যান" (primary) + "রিভিউ" (outline), "পিছিয়ে আছেন" pill (conditional), "ভর্তি {date}"
- Info banner: "আপনি এই প্রোগ্রামের একটি অংশে অ্যাক্সেস পেয়েছেন..."
- 4-stat row: Lessons X/Y, Quiz X/Y, Avg %, Best % (each with tiny inline progress bar)
- Semester accordion:
  - Open semester: table of curriculum items — cover thumb, item name w/ "U" batch chip, progress bar + %, "কোর্স" pill, chevron
  - Locked semester: lock icon + "Access restricted" + date range, no children

## Data flow

- Server functions in `src/lib/dashboard.functions.ts` — `getDashboardOverview`, `getMyEnrollments`, `getCourseDetail(programEnrollmentId)`, all with `.middleware([requireSupabaseAuth])`
- Loader pattern: `ensureQueryData(queryOptions)` in loader → `useSuspenseQuery` in component
- Public route (login/signup) untouched — no auth-required loader on public routes
- Root `onAuthStateChange` → `router.invalidate()` (already exists in Cloud template)

## Visual tokens (already in project)

Reuse existing green/teal `--primary` + gradient utilities, glass-strong cards, `gradient-primary`. Bangla font (Hind Siliguri / Noto Sans Bengali) already loaded via signup styling. No new global CSS needed — new components use semantic tokens only.

## Delivery order (single turn)

1. Enable Lovable Cloud
2. Migration: schema + RLS + `has_role` + trigger + seed (program, courses, teachers, lessons, admin/student enrollment sample)
3. Server functions + query options
4. Shell + primitives
5. Overview page
6. My Courses page
7. Course detail page
8. Placeholder stubs for the other 6 sidebar routes (so nav doesn't 404)
9. Wire signup/login Google OAuth via `lovable.auth.signInWithOAuth`
10. Verify: build + Playwright login flow to `/dashboard`

## Out of scope (next turns)

- Actual lesson video player, quiz/exam engine, calendar events, notifications inbox, payment history, admin panel — will build after this foundation ships and you approve the look & feel.
