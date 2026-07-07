import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---------- Types (server DTOs) ----------
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

export type MyCoursesDto = {
  program: ProgramEnrollmentDto | null;
  courses: CourseCardDto[]; // stand-alone course enrollments (excl. program)
  recommended: CourseCardDto[];
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

// ---------- helpers ----------
function initialsFrom(name: string | null | undefined, fallback = "US") {
  if (!name) return fallback;
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || fallback;
}

// ---------- getOverview ----------
export const getOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .eq("id", userId)
      .maybeSingle();

    const { data: enrolls } = await supabase
      .from("enrollments")
      .select("id, program_id, course_id, enrolled_at")
      .eq("user_id", userId);

    const programIds = (enrolls ?? []).map((e) => e.program_id).filter(Boolean) as string[];
    let programCourseIds: string[] = [];
    if (programIds.length) {
      const { data: pcs } = await supabase
        .from("program_courses")
        .select("course_id")
        .in("program_id", programIds);
      programCourseIds = (pcs ?? []).map((r) => r.course_id);
    }
    const directCourseIds = (enrolls ?? []).map((e) => e.course_id).filter(Boolean) as string[];
    const allCourseIds = Array.from(new Set([...programCourseIds, ...directCourseIds]));

    let lessonsTotal = 0;
    let lessonsCompleted = 0;
    let minutesSpent = 0;
    if (allCourseIds.length) {
      const { data: lessons } = await supabase
        .from("lessons")
        .select("id, duration_minutes")
        .in("course_id", allCourseIds);
      const lessonIds = (lessons ?? []).map((l) => l.id);
      lessonsTotal = lessons?.length ?? 0;

      if (lessonIds.length) {
        const { data: progress } = await supabase
          .from("lesson_progress")
          .select("lesson_id, completed, watched_seconds")
          .eq("user_id", userId)
          .in("lesson_id", lessonIds);
        lessonsCompleted = (progress ?? []).filter((p) => p.completed).length;
        minutesSpent = Math.round(
          (progress ?? []).reduce((s, p) => s + (p.watched_seconds ?? 0), 0) / 60,
        );
      }
    }

    const { data: quizzes } = await supabase
      .from("quiz_attempts")
      .select("id, score, total")
      .eq("user_id", userId);

    const performancePct = lessonsTotal
      ? Math.round((lessonsCompleted / lessonsTotal) * 100)
      : 0;

    // simple streak strip Wed..Tue with the last day marked as done
    const days = ["Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"];
    const streakByDay = days.map((d, i) => ({ day: d, done: i === days.length - 1 }));

    const dto: OverviewDto = {
      profile: {
        id: userId,
        full_name: profile?.full_name ?? null,
        avatar_url: profile?.avatar_url ?? null,
        initials: initialsFrom(profile?.full_name, "US"),
      },
      performancePct,
      ongoingCourses: (enrolls ?? []).length,
      finishedCourses: 0,
      minutesSpent,
      liveAttended: 0,
      quizzesCompleted: quizzes?.length ?? 0,
      assignmentsCompleted: 0,
      streakDays: 1,
      streakByDay,
    };
    return dto;
  });

// ---------- getMyCourses ----------
export const getMyCourses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: enrolls } = await supabase
      .from("enrollments")
      .select("id, program_id, course_id, enrolled_at, is_behind")
      .eq("user_id", userId);

    let program: ProgramEnrollmentDto | null = null;
    const programEnroll = (enrolls ?? []).find((e) => e.program_id);
    if (programEnroll?.program_id) {
      const { data: p } = await supabase
        .from("programs")
        .select("id, slug, title_bn, batch_label, cover_url")
        .eq("id", programEnroll.program_id)
        .maybeSingle();

      // program progress = completed lessons in all program courses / total lessons
      const { data: pcs } = await supabase
        .from("program_courses")
        .select("course_id")
        .eq("program_id", programEnroll.program_id);
      const courseIds = (pcs ?? []).map((r) => r.course_id);
      let progressPct = 0;
      if (courseIds.length) {
        const { data: lessons } = await supabase
          .from("lessons")
          .select("id")
          .in("course_id", courseIds);
        const lids = (lessons ?? []).map((l) => l.id);
        if (lids.length) {
          const { data: prog } = await supabase
            .from("lesson_progress")
            .select("lesson_id, completed")
            .eq("user_id", userId)
            .in("lesson_id", lids);
          const done = (prog ?? []).filter((r) => r.completed).length;
          progressPct = Math.round((done / lids.length) * 100);
        }
      }
      if (p) {
        program = {
          enrollmentId: programEnroll.id,
          programId: p.id,
          slug: p.slug,
          titleBn: p.title_bn,
          batchLabel: p.batch_label,
          coverUrl: p.cover_url,
          progressPct,
        };
      }
    }

    // stand-alone course enrollments
    const directIds = (enrolls ?? []).map((e) => e.course_id).filter(Boolean) as string[];
    let courses: CourseCardDto[] = [];
    if (directIds.length) {
      const { data: cs } = await supabase
        .from("courses")
        .select("id, slug, title_bn, cover_url, category, type, duration_minutes, description")
        .in("id", directIds);
      courses = (cs ?? []).map((c) => ({
        id: c.id,
        slug: c.slug,
        titleBn: c.title_bn,
        coverUrl: c.cover_url,
        category: c.category,
        type: c.type,
        durationMinutes: c.duration_minutes,
        description: c.description,
        progressPct: 0,
      }));
    }

    // recommended = non-diploma published courses the user is NOT enrolled in
    const enrolledCourseIds = new Set([
      ...directIds,
      ...((program
        ? (
            await supabase
              .from("program_courses")
              .select("course_id")
              .eq("program_id", program.programId)
          ).data?.map((r) => r.course_id)
        : []) ?? []),
    ]);

    const { data: allRec } = await supabase
      .from("courses")
      .select("id, slug, title_bn, cover_url, category, type, duration_minutes, description")
      .neq("category", "diploma")
      .eq("is_published", true)
      .order("created_at", { ascending: true })
      .limit(9);
    const recommended: CourseCardDto[] = (allRec ?? [])
      .filter((c) => !enrolledCourseIds.has(c.id))
      .map((c) => ({
        id: c.id,
        slug: c.slug,
        titleBn: c.title_bn,
        coverUrl: c.cover_url,
        category: c.category,
        type: c.type,
        durationMinutes: c.duration_minutes,
        description: c.description,
      }));

    const dto: MyCoursesDto = { program, courses, recommended };
    return dto;
  });

// ---------- getCourseDetail ----------
export const getCourseDetail = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ enrollmentId: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    const { data: enroll } = await supabase
      .from("enrollments")
      .select("id, user_id, program_id, course_id, enrolled_at, is_behind")
      .eq("id", data.enrollmentId)
      .eq("user_id", userId)
      .maybeSingle();
    if (!enroll || !enroll.program_id) throw new Error("Enrollment not found");

    const { data: p } = await supabase
      .from("programs")
      .select("id, slug, title_bn, title_en, batch_label, cover_url, starts_at, ends_at")
      .eq("id", enroll.program_id)
      .maybeSingle();
    if (!p) throw new Error("Program not found");

    const { data: sems } = await supabase
      .from("semesters")
      .select("id, label, sort, starts_on, ends_on, is_locked")
      .eq("program_id", enroll.program_id)
      .order("sort");

    const { data: pcs } = await supabase
      .from("program_courses")
      .select("course_id, semester_id, sort, courses(id, slug, title_bn, cover_url)")
      .eq("program_id", enroll.program_id)
      .order("sort");

    const allCourseIds = (pcs ?? []).map((r) => r.course_id);
    const { data: lessons } = allCourseIds.length
      ? await supabase.from("lessons").select("id, course_id").in("course_id", allCourseIds)
      : { data: [] as { id: string; course_id: string }[] };

    const lessonIds = (lessons ?? []).map((l) => l.id);
    const { data: progress } = lessonIds.length
      ? await supabase
          .from("lesson_progress")
          .select("lesson_id, completed")
          .eq("user_id", userId)
          .in("lesson_id", lessonIds)
      : { data: [] as { lesson_id: string; completed: boolean }[] };

    const doneSet = new Set((progress ?? []).filter((r) => r.completed).map((r) => r.lesson_id));

    const perCourseLessons = new Map<string, string[]>();
    (lessons ?? []).forEach((l) => {
      const arr = perCourseLessons.get(l.course_id) ?? [];
      arr.push(l.id);
      perCourseLessons.set(l.course_id, arr);
    });

    const courseProgress = new Map<string, number>();
    allCourseIds.forEach((cid) => {
      const lids = perCourseLessons.get(cid) ?? [];
      if (!lids.length) return courseProgress.set(cid, 0);
      const done = lids.filter((id) => doneSet.has(id)).length;
      courseProgress.set(cid, Math.round((done / lids.length) * 100));
    });

    // Teachers across the program's courses (deduped)
    const { data: teachers } = allCourseIds.length
      ? await supabase
          .from("course_teachers")
          .select("name, initials, sort, course_id")
          .in("course_id", allCourseIds)
          .order("sort")
      : { data: [] as { name: string; initials: string; sort: number; course_id: string }[] };
    const teacherMap = new Map<string, { name: string; initials: string }>();
    (teachers ?? []).forEach((t) => {
      if (!teacherMap.has(t.name)) teacherMap.set(t.name, { name: t.name, initials: t.initials });
    });

    const totalLessons = lessonIds.length;
    const doneLessons = doneSet.size;
    const performance = totalLessons ? Math.round((doneLessons / totalLessons) * 100) : 0;

    const { data: quizzes } = await supabase
      .from("quiz_attempts")
      .select("score, total")
      .eq("user_id", userId)
      .in("course_id", allCourseIds.length ? allCourseIds : ["00000000-0000-0000-0000-000000000000"]);
    const quizPcts = (quizzes ?? []).map((q) => (q.total ? (q.score / q.total) * 100 : 0));
    const avgScorePct = quizPcts.length
      ? Math.round(quizPcts.reduce((a, b) => a + b, 0) / quizPcts.length)
      : 0;
    const bestScorePct = quizPcts.length ? Math.round(Math.max(...quizPcts)) : 0;

    const durationMinutes = 0; // computed on the client via summing later if needed

    const semesters = (sems ?? []).map((s) => {
      const items = (pcs ?? [])
        .filter((r) => r.semester_id === s.id)
        .map((r) => ({
          courseId: r.course_id,
          slug: (r.courses as { slug: string } | null)?.slug ?? "",
          titleBn: (r.courses as { title_bn: string } | null)?.title_bn ?? "",
          coverUrl: (r.courses as { cover_url: string | null } | null)?.cover_url ?? null,
          progressPct: courseProgress.get(r.course_id) ?? 0,
        }));
      const semProgress = items.length
        ? Math.round(items.reduce((a, b) => a + b.progressPct, 0) / items.length)
        : 0;
      return {
        id: s.id,
        label: s.label,
        startsOn: s.starts_on,
        endsOn: s.ends_on,
        isLocked: s.is_locked,
        progressPct: semProgress,
        items: s.is_locked ? [] : items,
      };
    });

    const dto: CourseDetailDto = {
      enrollmentId: enroll.id,
      program: {
        id: p.id,
        slug: p.slug,
        titleBn: p.title_bn,
        titleEn: p.title_en,
        batchLabel: p.batch_label,
        coverUrl: p.cover_url,
        startsAt: p.starts_at,
        endsAt: p.ends_at,
        enrolledAt: enroll.enrolled_at,
        isBehind: enroll.is_behind,
        progressPct: performance,
      },
      teachers: Array.from(teacherMap.values()),
      tags: [p.title_en, `${Math.round(durationMinutes / 60)} hour`].filter(Boolean) as string[],
      stats: {
        lessonsCompleted: doneLessons,
        lessonsTotal: totalLessons,
        quizzesCompleted: quizzes?.length ?? 0,
        quizzesTotal: quizzes?.length ?? 0,
        avgScorePct,
        bestScorePct,
      },
      semesters,
    };
    return dto;
  });
