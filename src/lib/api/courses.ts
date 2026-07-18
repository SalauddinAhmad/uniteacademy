// Public course API — REST bindings + adapter to the frontend `Course` shape.
// Falls back to bundled static data when the API is unreachable so the
// Lovable preview keeps rendering while the Node backend runs elsewhere.

import { queryOptions } from "@tanstack/react-query";
import { api, ApiError } from "./client";
import type { Course } from "@/lib/courses";
import { courses as staticCourses } from "@/lib/courses";
import { getCourseMeta } from "@/lib/course-meta";

// ── Raw API types ──────────────────────────────────────────────
type ApiInstructor = { id: string; fullName: string; avatarUrl: string | null };
type ApiCourse = {
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
  instructor: ApiInstructor | null;
};

// ── Adapter ────────────────────────────────────────────────────
function normLevel(l: string | null | undefined): Course["level"] {
  if (l === "intermediate" || l === "advanced") return l;
  return "beginner";
}

function durationLabel(weeks: number | null): string {
  if (!weeks) return "—";
  if (weeks >= 48) return `${Math.round(weeks / 4)} মাস`;
  if (weeks >= 8 && weeks % 4 === 0) return `${weeks / 4} মাস`;
  return `${weeks} সপ্তাহ`;
}

export function adaptCourse(c: ApiCourse): Course {
  const meta = getCourseMeta(c.slug);
  return {
    slug: c.slug,
    title_bn: c.title,
    title_en: meta.title_en || c.title,
    instructor: c.instructor?.fullName ?? "Uniteacademy",
    category: meta.category,
    level: normLevel(c.level),
    duration: durationLabel(c.durationWeeks),
    lessons: c.totalLessons ?? 0,
    price: Math.round(c.priceCents / 100),
    originalPrice: c.originalPriceCents ? Math.round(c.originalPriceCents / 100) : undefined,
    rating: c.rating ?? 0,
    students: c.ratingsCount || 0,
    cover: meta.cover,
    emoji: meta.emoji,
    thumbnail: c.coverUrl || meta.thumbnail,
    description: c.description ?? "",
  };
}

// ── Fetchers ───────────────────────────────────────────────────
export async function fetchCourses(): Promise<Course[]> {
  try {
    const { courses } = await api.get<{ courses: ApiCourse[] }>("/api/courses", { auth: false });
    return courses.map(adaptCourse);
  } catch (err) {
    // Network / API unreachable → fall back to bundled static list so the
    // preview stays usable while apps/api is not deployed yet.
    if (err instanceof ApiError && err.status === 0) return staticCourses;
    throw err;
  }
}

export async function fetchCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const { course } = await api.get<{ course: ApiCourse }>(`/api/courses/${slug}`, { auth: false });
    return adaptCourse(course);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    if (err instanceof ApiError && err.status === 0) {
      return staticCourses.find((c) => c.slug === slug) ?? null;
    }
    throw err;
  }
}

// ── Query options ──────────────────────────────────────────────
export const coursesQueryOptions = () =>
  queryOptions({
    queryKey: ["public", "courses"],
    queryFn: fetchCourses,
    staleTime: 60_000,
  });

export const courseBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["public", "courses", slug],
    queryFn: () => fetchCourseBySlug(slug),
    staleTime: 60_000,
  });
