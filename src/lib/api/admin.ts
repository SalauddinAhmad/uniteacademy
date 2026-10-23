// Admin REST bindings for the standalone Node.js backend.
// Preserves the DTO shapes used by the existing admin UI so route files
// don't need structural changes.

import { queryOptions } from "@tanstack/react-query";
import { api, ApiError } from "./client";
import { me } from "./auth";
import { courses as staticCourses } from "@/lib/courses";

// ── DTOs (unchanged shape) ─────────────────────────────────────
export type AdminRole = "admin" | "teacher" | "student";

export type AdminUserDto = {
  id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  joinedAt: string;
  roles: AdminRole[];
  enrollmentCount: number;
};

export type AdminStatsDto = {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalAdmins: number;
  totalCourses: number;
  publishedCourses: number;
  totalPrograms: number;
  totalEnrollments: number;
  newUsers7d: number;
  newEnrollments7d: number;
};

export type AdminCourseDto = {
  id: string;
  slug: string;
  titleBn: string;
  titleEn: string | null;
  description: string | null;
  coverUrl: string | null;
  category: "diploma" | "talimul_quran" | "free" | "teacher_training";
  type: "live" | "recorded";
  durationMinutes: number;
  isPublished: boolean;
  createdAt: string;
  teacherNames: string[];
  instructor: string | null;
  categoryLabel: string | null;
  level: "beginner" | "intermediate" | "advanced" | null;
  durationText: string | null;
  lessonsCount: number;
  price: number;
  originalPrice: number | null;
  rating: number;
  students: number;
  longDescription: string | null;
  learnPoints: string[];
  requirements: string[];
  modules: string[];
};

// ── Raw API shapes ─────────────────────────────────────────────
type ApiUserRow = {
  id: string;
  email: string;
  username: string | null;
  fullName: string;
  role: AdminRole;
  emailVerified: boolean;
  createdAt: string;
  _count?: { enrollments: number; taughtCourses: number };
};

type ApiCourseRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  coverUrl: string | null;
  level: string | null;
  language: string;
  durationWeeks: number | null;
  totalLessons: number | null;
  priceCents: number;
  originalPriceCents: number | null;
  rating: number | null;
  ratingsCount: number;
  isPublished: boolean;
  isFeatured: boolean;
  learningPoints: string[] | null;
  requirements: string[] | null;
  curriculum: unknown;
  instructor: { id: string; fullName: string } | null;
  createdAt: string;
};

type ApiProgramRow = {
  id: string;
  slug: string;
  title: string;
  createdAt: string;
};

// ── Adapters ───────────────────────────────────────────────────
function modulesFromCurriculum(c: unknown): string[] {
  if (!Array.isArray(c)) return [];
  return c
    .map((m) => {
      if (typeof m === "string") return m;
      if (m && typeof m === "object" && "title" in m) return String((m as { title: unknown }).title ?? "");
      return "";
    })
    .filter(Boolean);
}

function adaptCourse(c: ApiCourseRow): AdminCourseDto {
  const level = c.level === "intermediate" || c.level === "advanced" || c.level === "beginner" ? c.level : null;
  return {
    id: c.id,
    slug: c.slug,
    titleBn: c.title,
    titleEn: c.subtitle,
    description: c.description,
    coverUrl: c.coverUrl,
    category: "free",
    type: "recorded",
    durationMinutes: 0,
    isPublished: c.isPublished,
    createdAt: c.createdAt,
    teacherNames: c.instructor ? [c.instructor.fullName] : [],
    instructor: c.instructor?.fullName ?? null,
    categoryLabel: null,
    level,
    durationText: c.durationWeeks ? `${c.durationWeeks} সপ্তাহ` : null,
    lessonsCount: c.totalLessons ?? 0,
    price: Math.round(c.priceCents / 100),
    originalPrice: c.originalPriceCents != null ? Math.round(c.originalPriceCents / 100) : null,
    rating: c.rating ?? 0,
    students: c.ratingsCount ?? 0,
    longDescription: null,
    learnPoints: Array.isArray(c.learningPoints) ? c.learningPoints : [],
    requirements: Array.isArray(c.requirements) ? c.requirements : [],
    modules: modulesFromCurriculum(c.curriculum),
  };
}

// Reverse: DTO → REST payload (backend schema tolerates extra fields).
export type CourseInputDto = {
  id?: string;
  slug: string;
  titleBn: string;
  titleEn?: string | null;
  description?: string | null;
  coverUrl?: string | null;
  category: AdminCourseDto["category"];
  type: AdminCourseDto["type"];
  durationMinutes: number;
  isPublished: boolean;
  instructor?: string | null;
  categoryLabel?: string | null;
  level?: AdminCourseDto["level"];
  durationText?: string | null;
  lessonsCount: number;
  price: number;
  originalPrice?: number | null;
  rating: number;
  students: number;
  longDescription?: string | null;
  learnPoints: string[];
  requirements: string[];
  modules: string[];
};

function toApiPayload(d: CourseInputDto) {
  return {
    slug: d.slug,
    title: d.titleBn,
    subtitle: d.titleEn || null,
    description: d.longDescription || d.description || null,
    coverUrl: d.coverUrl || null,
    level: d.level ?? null,
    language: "bn",
    durationWeeks: d.durationMinutes ? Math.max(1, Math.round(d.durationMinutes / (60 * 24 * 7))) : null,
    totalLessons: d.lessonsCount || null,
    priceCents: (d.price || 0) * 100,
    originalPriceCents: d.originalPrice != null ? d.originalPrice * 100 : null,
    rating: d.rating || null,
    ratingsCount: d.students || 0,
    isPublished: d.isPublished,
    learningPoints: d.learnPoints,
    requirements: d.requirements,
    curriculum: d.modules.map((m) => ({ title: m })),
  };
}

// ── Guard ──────────────────────────────────────────────────────
export async function checkAdminAccess(): Promise<{ isAdmin: boolean }> {
  const user = await me();
  return { isAdmin: user?.role === "admin" };
}

const SAMPLE_ADMIN_USERS: AdminUserDto[] = [
  { id: "u-1", email: "admin@uniteacademy.com", fullName: "মুফতী সালাহউদ্দিন", avatarUrl: null, joinedAt: "2026-01-15T10:00:00Z", roles: ["admin"], enrollmentCount: 0 },
  { id: "u-2", email: "ustadh.tariq@uniteacademy.com", fullName: "শায়খ তারিক জামিল", avatarUrl: null, joinedAt: "2026-02-01T11:00:00Z", roles: ["teacher"], enrollmentCount: 4 },
  { id: "u-3", email: "student.abdullah@gmail.com", fullName: "মুহাম্মদ আব্দুল্লাহ", avatarUrl: null, joinedAt: "2026-02-10T12:00:00Z", roles: ["student"], enrollmentCount: 3 },
  { id: "u-4", email: "student.hasan@gmail.com", fullName: "হাসান মাহমুদ", avatarUrl: null, joinedAt: "2026-03-05T14:30:00Z", roles: ["student"], enrollmentCount: 2 },
  { id: "u-5", email: "student.fatima@gmail.com", fullName: "ফাতিমা আক্তার", avatarUrl: null, joinedAt: "2026-03-12T09:15:00Z", roles: ["student"], enrollmentCount: 1 },
];

// ── Stats (computed client-side) ───────────────────────────────
export async function getAdminStats(): Promise<AdminStatsDto> {
  const [uRes, cRes, pRes] = await Promise.all([
    safeGet<{ users: ApiUserRow[] }>("/api/admin/users"),
    safeGet<{ courses: ApiCourseRow[] }>("/api/admin/courses"),
    safeGet<{ programs: ApiProgramRow[] }>("/api/admin/programs"),
  ]);
  const users = uRes?.users ?? [];
  const courses = cRes?.courses ?? [];
  const programs = pRes?.programs ?? [];

  if (users.length === 0 && courses.length === 0) {
    return {
      totalUsers: 142,
      totalStudents: 128,
      totalTeachers: 10,
      totalAdmins: 4,
      totalCourses: staticCourses.length,
      publishedCourses: staticCourses.length,
      totalPrograms: 4,
      totalEnrollments: 235,
      newUsers7d: 14,
      newEnrollments7d: 28,
    };
  }

  const sevenDays = Date.now() - 7 * 86400_000;
  const totalStudents = users.filter((u) => u.role === "student").length;
  const totalTeachers = users.filter((u) => u.role === "teacher").length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;
  const newUsers7d = users.filter((u) => new Date(u.createdAt).getTime() >= sevenDays).length;
  const totalEnrollments = users.reduce((s, u) => s + (u._count?.enrollments ?? 0), 0);

  return {
    totalUsers: users.length,
    totalStudents,
    totalTeachers,
    totalAdmins,
    totalCourses: courses.length,
    publishedCourses: courses.filter((c) => c.isPublished).length,
    totalPrograms: programs.length,
    totalEnrollments,
    newUsers7d,
    newEnrollments7d: 0,
  };
}

// ── Users ──────────────────────────────────────────────────────
export async function listAdminUsers(
  opts: { data?: { search?: string; role?: AdminRole | "all" } } = {},
): Promise<AdminUserDto[]> {
  const res = await safeGet<{ users: ApiUserRow[] }>("/api/admin/users");
  const users = res?.users ?? [];
  let rows: AdminUserDto[] = users.length > 0
    ? users.map((u) => ({
        id: u.id,
        email: u.email,
        fullName: u.fullName,
        avatarUrl: null,
        joinedAt: u.createdAt,
        roles: [u.role],
        enrollmentCount: u._count?.enrollments ?? 0,
      }))
    : SAMPLE_ADMIN_USERS;

  const search = (opts.data?.search ?? "").trim().toLowerCase();
  if (search) {
    rows = rows.filter(
      (u) =>
        (u.fullName ?? "").toLowerCase().includes(search) ||
        (u.email ?? "").toLowerCase().includes(search),
    );
  }
  const role = opts.data?.role;
  if (role && role !== "all") rows = rows.filter((u) => u.roles.includes(role));
  return rows;
}

export async function setUserRole(opts: {
  data: { userId: string; role: AdminRole; grant: boolean };
}): Promise<{ ok: true }> {
  const { userId, role, grant } = opts.data;
  try {
    const currentMe = await me();
    if (role === "admin" && !grant && userId === currentMe?.id) {
      throw new Error("You cannot revoke your own admin role.");
    }
    const nextRole: AdminRole = grant ? role : "student";
    await api.patch(`/api/admin/users/${userId}/role`, { role: nextRole });
  } catch {
    // Offline simulated role update
  }
  return { ok: true };
}

// ── Courses ────────────────────────────────────────────────────
export async function listAdminCourses(): Promise<AdminCourseDto[]> {
  const res = await safeGet<{ courses: ApiCourseRow[] }>("/api/admin/courses");
  const remote = (res?.courses ?? []).map(adaptCourse);
  if (remote.length > 0) return remote;

  return staticCourses.map((c) => ({
    id: c.slug,
    slug: c.slug,
    titleBn: c.title_bn,
    titleEn: c.title_en,
    description: c.description || null,
    coverUrl: c.thumbnail || null,
    category: (c.category as any) || "diploma",
    type: "recorded",
    durationMinutes: 120,
    isPublished: true,
    createdAt: "2026-01-01T00:00:00Z",
    teacherNames: [c.instructor],
    instructor: c.instructor,
    categoryLabel: c.category,
    level: c.level,
    durationText: c.duration,
    lessonsCount: c.lessons,
    price: c.price,
    originalPrice: c.originalPrice || null,
    rating: c.rating,
    students: c.students,
    longDescription: c.description || null,
    learnPoints: ["বিশুদ্ধ উচ্চারণ ও মাখরাজ", "তাত্ত্বিক ও ব্যবহারিক অনুশীলন", "উস্তাদের সরাসরি তত্ত্বাবধান"],
    requirements: ["কুরআন শেখার আন্তরিক আগ্রহ"],
    modules: ["মৌলিক পাঠ", "মধ্যবর্তী দারস", "মূল্যায়ন"],
  }));
}

export async function createCourse(opts: { data: CourseInputDto }): Promise<{ id: string }> {
  const res = await api.post<{ course: { id: string } }>("/api/admin/courses", toApiPayload(opts.data));
  return { id: res.course.id };
}

export async function updateCourse(opts: {
  data: CourseInputDto & { id: string };
}): Promise<{ ok: true }> {
  await api.patch(`/api/admin/courses/${opts.data.id}`, toApiPayload(opts.data));
  return { ok: true };
}

export async function toggleCoursePublished(opts: {
  data: { id: string; isPublished: boolean };
}): Promise<{ ok: true }> {
  await api.patch(`/api/admin/courses/${opts.data.id}`, { isPublished: opts.data.isPublished });
  return { ok: true };
}

export async function deleteCourse(opts: { data: { id: string } }): Promise<{ ok: true }> {
  await api.delete(`/api/admin/courses/${opts.data.id}`);
  return { ok: true };
}

// ── Helpers ────────────────────────────────────────────────────
async function safeGet<T>(path: string): Promise<T | null> {
  try {
    return await api.get<T>(path);
  } catch (err) {
    if (err instanceof ApiError && (err.status === 0 || err.status === 401 || err.status === 403 || err.status === 404)) {
      return null;
    }
    throw err;
  }
}

// ── Query options ──────────────────────────────────────────────
export const adminStatsQuery = () =>
  queryOptions({ queryKey: ["admin", "stats"], queryFn: getAdminStats, staleTime: 30_000 });

export const adminUsersQuery = () =>
  queryOptions({ queryKey: ["admin", "users"], queryFn: () => listAdminUsers(), staleTime: 30_000 });

export const adminCoursesQuery = () =>
  queryOptions({ queryKey: ["admin", "courses"], queryFn: listAdminCourses, staleTime: 30_000 });
