// Dashboard REST bindings for the standalone Node.js backend.
// Keeps the DTO shape identical to the previous Supabase server functions
// so the existing dashboard UI keeps rendering unchanged.

import { queryOptions } from "@tanstack/react-query";
import { api, ApiError } from "./client";
import { me } from "./auth";
import { getCourseMeta } from "@/lib/course-meta";

// ── DTOs (unchanged shape) ─────────────────────────────────────
export type ProfileDto = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  initials: string;
};

export type OverviewDto = {
  profile: ProfileDto;
  performancePct: number;
  ongoingCourses: number;
  finishedCourses: number;
  minutesSpent: number;
  liveAttended: number;
  quizzesCompleted: number;
  assignmentsCompleted: number;
  streakDays: number;
  streakByDay: { day: string; done: boolean }[];
};

export type ProgramEnrollmentDto = {
  enrollmentId: string;
  programId: string;
  slug: string;
  titleBn: string;
  batchLabel: string | null;
  coverUrl: string | null;
  progressPct: number;
};

export type CourseCardDto = {
  id: string;
  slug: string;
  titleBn: string;
  coverUrl: string | null;
  category: "diploma" | "talimul_quran" | "free" | "teacher_training";
  type: "live" | "recorded";
  durationMinutes: number;
  description: string | null;
  progressPct?: number;
};

export type CourseDetailDto = {
  enrollmentId: string;
  program: {
    id: string;
    slug: string;
    titleBn: string;
    titleEn: string | null;
    batchLabel: string | null;
    coverUrl: string | null;
    startsAt: string | null;
    endsAt: string | null;
    enrolledAt: string;
    isBehind: boolean;
    progressPct: number;
  };
  teachers: { name: string; initials: string }[];
  tags: string[];
  stats: {
    lessonsCompleted: number;
    lessonsTotal: number;
    quizzesCompleted: number;
    quizzesTotal: number;
    avgScorePct: number;
    bestScorePct: number;
  };
  semesters: {
    id: string;
    label: string;
    startsOn: string | null;
    endsOn: string | null;
    isLocked: boolean;
    progressPct: number;
    items: {
      courseId: string;
      slug: string;
      titleBn: string;
      coverUrl: string | null;
      progressPct: number;
    }[];
  }[];
};

export type MyCoursesDto = {
  program: ProgramEnrollmentDto | null;
  courses: CourseCardDto[];
  recommended: CourseCardDto[];
};

// ── API raw shapes ─────────────────────────────────────────────
type ApiCourseLite = {
  id: string;
  slug: string;
  title: string;
  coverUrl: string | null;
  totalLessons: number | null;
  level: string | null;
};
type ApiProgramLite = {
  id: string;
  slug: string;
  title: string;
  coverUrl: string | null;
};
type ApiEnrollment = {
  id: string;
  progress: number;
  isBehind: boolean;
  createdAt: string;
  course: ApiCourseLite | null;
  program: ApiProgramLite | null;
};
type ApiCourse = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  durationWeeks: number | null;
  totalLessons: number | null;
  isPublished: boolean;
};

// ── Helpers ────────────────────────────────────────────────────
function initialsFrom(name: string | null | undefined, fallback = "US") {
  if (!name) return fallback;
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || fallback;
}

function toCourseCard(c: ApiCourseLite, progressPct = 0): CourseCardDto {
  const meta = getCourseMeta(c.slug);
  return {
    id: c.id,
    slug: c.slug,
    titleBn: c.title,
    coverUrl: c.coverUrl ?? meta.thumbnail ?? null,
    category: meta.category === "diploma" ? "diploma" : meta.category === "talimul_quran" ? "talimul_quran" : meta.category === "teacher_training" ? "teacher_training" : "free",
    type: "recorded",
    durationMinutes: 0,
    description: null,
    progressPct,
  };
}

async function safeGet<T>(path: string, opts?: Parameters<typeof api.get>[1]): Promise<T | null> {
  try {
    return await api.get<T>(path, opts);
  } catch (err) {
    if (err instanceof ApiError && (err.status === 0 || err.status === 401 || err.status === 404)) return null;
    throw err;
  }
}

// ── Fetchers ───────────────────────────────────────────────────
export async function fetchOverview(): Promise<OverviewDto> {
  const [user, enrollRes] = await Promise.all([
    me(),
    safeGet<{ enrollments: ApiEnrollment[] }>("/api/enrollments"),
  ]);
  const enrolls = enrollRes?.enrollments ?? [];

  const finished = enrolls.filter((e) => e.progress >= 100).length;
  const totalProg = enrolls.reduce((s, e) => s + (e.progress ?? 0), 0);
  const performancePct = enrolls.length ? Math.round(totalProg / enrolls.length) : 0;

  const days = ["Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"];
  const streakByDay = days.map((d, i) => ({ day: d, done: i === days.length - 1 }));

  const fullName = user?.name ?? null;
  return {
    profile: {
      id: user?.id ?? "",
      full_name: fullName,
      avatar_url: user?.avatarUrl ?? null,
      initials: initialsFrom(fullName, "US"),
    },
    performancePct,
    ongoingCourses: enrolls.length - finished,
    finishedCourses: finished,
    minutesSpent: 0,
    liveAttended: 0,
    quizzesCompleted: 0,
    assignmentsCompleted: 0,
    streakDays: 1,
    streakByDay,
  };
}

export async function fetchMyCourses(): Promise<MyCoursesDto> {
  const [enrollRes, allRes] = await Promise.all([
    safeGet<{ enrollments: ApiEnrollment[] }>("/api/enrollments"),
    safeGet<{ courses: ApiCourse[] }>("/api/courses", { auth: false }),
  ]);
  const enrolls = enrollRes?.enrollments ?? [];
  const all = allRes?.courses ?? [];

  const programEnroll = enrolls.find((e) => e.program);
  const program: ProgramEnrollmentDto | null = programEnroll?.program
    ? {
        enrollmentId: programEnroll.id,
        programId: programEnroll.program.id,
        slug: programEnroll.program.slug,
        titleBn: programEnroll.program.title,
        batchLabel: null,
        coverUrl: programEnroll.program.coverUrl,
        progressPct: programEnroll.progress ?? 0,
      }
    : null;

  const courses: CourseCardDto[] = enrolls
    .filter((e) => e.course)
    .map((e) => toCourseCard(e.course as ApiCourseLite, e.progress ?? 0));

  const enrolledIds = new Set(courses.map((c) => c.id));
  const recommended: CourseCardDto[] = all
    .filter((c) => c.isPublished && !enrolledIds.has(c.id))
    .slice(0, 9)
    .map((c) =>
      toCourseCard(
        { id: c.id, slug: c.slug, title: c.title, coverUrl: c.coverUrl, totalLessons: c.totalLessons, level: null },
        0,
      ),
    );

  return { program, courses, recommended };
}

export async function fetchCourseDetail(enrollmentId: string): Promise<CourseDetailDto> {
  const enrollRes = await safeGet<{ enrollments: ApiEnrollment[] }>("/api/enrollments");
  const enrolls = enrollRes?.enrollments ?? [];
  const enroll = enrolls.find((e) => e.id === enrollmentId);
  if (!enroll) throw new Error("Enrollment not found");

  const p = enroll.program;
  const c = enroll.course;
  const title = p?.title ?? c?.title ?? "Course";
  const coverUrl = p?.coverUrl ?? c?.coverUrl ?? null;
  const slug = p?.slug ?? c?.slug ?? "";
  const id = p?.id ?? c?.id ?? enroll.id;

  const totalLessons = c?.totalLessons ?? 0;
  const lessonsCompleted = Math.round((totalLessons * (enroll.progress ?? 0)) / 100);

  return {
    enrollmentId: enroll.id,
    program: {
      id,
      slug,
      titleBn: title,
      titleEn: null,
      batchLabel: null,
      coverUrl,
      startsAt: null,
      endsAt: null,
      enrolledAt: enroll.createdAt,
      isBehind: enroll.isBehind,
      progressPct: enroll.progress ?? 0,
    },
    teachers: [],
    tags: [],
    stats: {
      lessonsCompleted,
      lessonsTotal: totalLessons,
      quizzesCompleted: 0,
      quizzesTotal: 0,
      avgScorePct: 0,
      bestScorePct: 0,
    },
    semesters: [],
  };
}

// ── Query options ──────────────────────────────────────────────
export const overviewQuery = () =>
  queryOptions({ queryKey: ["dashboard", "overview"], queryFn: fetchOverview, staleTime: 30_000 });

export const myCoursesQuery = () =>
  queryOptions({ queryKey: ["dashboard", "my-courses"], queryFn: fetchMyCourses, staleTime: 30_000 });

export const courseDetailQuery = (enrollmentId: string) =>
  queryOptions({
    queryKey: ["dashboard", "course-detail", enrollmentId],
    queryFn: () => fetchCourseDetail(enrollmentId),
    staleTime: 30_000,
  });
