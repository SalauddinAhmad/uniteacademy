import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin only");
}

// ---------- Types ----------
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

// ---------- Guard ----------
export const checkAdminAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error) throw new Error(error.message);
    return { isAdmin: !!data };
  });

// ---------- Stats ----------
export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminStatsDto> => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400_000).toISOString();

    const [users, roles, courses, programs, enrollments, newEnroll] = await Promise.all([
      supabaseAdmin.from("profiles").select("id, joined_at", { count: "exact", head: false }),
      supabaseAdmin.from("user_roles").select("role"),
      supabaseAdmin.from("courses").select("id, is_published"),
      supabaseAdmin.from("programs").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("enrollments").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("enrollments").select("id", { count: "exact", head: true }).gte("enrolled_at", sevenDaysAgo),
    ]);

    const roleCounts = { admin: 0, teacher: 0, student: 0 };
    for (const r of roles.data ?? []) {
      const k = r.role as AdminRole;
      if (k in roleCounts) roleCounts[k]++;
    }
    const newUsers7d = (users.data ?? []).filter(u => u.joined_at >= sevenDaysAgo).length;
    const totalCourses = courses.data?.length ?? 0;
    const publishedCourses = (courses.data ?? []).filter(c => c.is_published).length;

    return {
      totalUsers: users.count ?? users.data?.length ?? 0,
      totalStudents: roleCounts.student,
      totalTeachers: roleCounts.teacher,
      totalAdmins: roleCounts.admin,
      totalCourses,
      publishedCourses,
      totalPrograms: programs.count ?? 0,
      totalEnrollments: enrollments.count ?? 0,
      newUsers7d,
      newEnrollments7d: newEnroll.count ?? 0,
    };
  });

// ---------- Users ----------
export const listAdminUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { search?: string; role?: AdminRole | "all" }) => d ?? {})
  .handler(async ({ data, context }): Promise<AdminUserDto[]> => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: profiles, error } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, avatar_url, joined_at")
      .order("joined_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);

    const ids = (profiles ?? []).map(p => p.id);
    if (ids.length === 0) return [];

    const [rolesRes, enrollRes, authList] = await Promise.all([
      supabaseAdmin.from("user_roles").select("user_id, role").in("user_id", ids),
      supabaseAdmin.from("enrollments").select("user_id").in("user_id", ids),
      supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
    ]);

    const rolesByUser = new Map<string, AdminRole[]>();
    for (const r of rolesRes.data ?? []) {
      const arr = rolesByUser.get(r.user_id) ?? [];
      arr.push(r.role as AdminRole);
      rolesByUser.set(r.user_id, arr);
    }
    const enrollByUser = new Map<string, number>();
    for (const e of enrollRes.data ?? []) {
      enrollByUser.set(e.user_id, (enrollByUser.get(e.user_id) ?? 0) + 1);
    }
    const emailByUser = new Map<string, string>();
    for (const u of authList.data?.users ?? []) {
      if (u.email) emailByUser.set(u.id, u.email);
    }

    let rows: AdminUserDto[] = (profiles ?? []).map(p => ({
      id: p.id,
      email: emailByUser.get(p.id) ?? null,
      fullName: p.full_name,
      avatarUrl: p.avatar_url,
      joinedAt: p.joined_at,
      roles: rolesByUser.get(p.id) ?? [],
      enrollmentCount: enrollByUser.get(p.id) ?? 0,
    }));

    const search = (data.search ?? "").trim().toLowerCase();
    if (search) {
      rows = rows.filter(
        u =>
          (u.fullName ?? "").toLowerCase().includes(search) ||
          (u.email ?? "").toLowerCase().includes(search),
      );
    }
    if (data.role && data.role !== "all") {
      rows = rows.filter(u => u.roles.includes(data.role as AdminRole));
    }
    return rows;
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        userId: z.string().uuid(),
        role: z.enum(["admin", "teacher", "student"]),
        grant: z.boolean(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Prevent an admin from removing their own admin role (lockout guard)
    if (
      data.role === "admin" &&
      !data.grant &&
      data.userId === context.userId
    ) {
      throw new Error("You cannot revoke your own admin role.");
    }

    if (data.grant) {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: data.userId, role: data.role }, { onConflict: "user_id,role" });
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", data.role);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

// ---------- Courses ----------
export const listAdminCourses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminCourseDto[]> => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: courses, error } = await supabaseAdmin
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const ids = (courses ?? []).map(c => c.id);
    const teachersByCourse = new Map<string, string[]>();
    if (ids.length) {
      const { data: ts } = await supabaseAdmin
        .from("course_teachers")
        .select("course_id, name")
        .in("course_id", ids);
      for (const t of ts ?? []) {
        const arr = teachersByCourse.get(t.course_id) ?? [];
        arr.push(t.name);
        teachersByCourse.set(t.course_id, arr);
      }
    }

    return (courses ?? []).map((c: any) => ({
      id: c.id,
      slug: c.slug,
      titleBn: c.title_bn,
      titleEn: c.title_en,
      description: c.description,
      coverUrl: c.cover_url,
      category: c.category as AdminCourseDto["category"],
      type: c.type as AdminCourseDto["type"],
      durationMinutes: c.duration_minutes ?? 0,
      isPublished: !!c.is_published,
      createdAt: c.created_at,
      teacherNames: teachersByCourse.get(c.id) ?? [],
      instructor: c.instructor ?? null,
      categoryLabel: c.category_label ?? null,
      level: (c.level as AdminCourseDto["level"]) ?? null,
      durationText: c.duration_text ?? null,
      lessonsCount: c.lessons_count ?? 0,
      price: c.price ?? 0,
      originalPrice: c.original_price ?? null,
      rating: Number(c.rating ?? 0),
      students: c.students ?? 0,
      longDescription: c.long_description ?? null,
      learnPoints: Array.isArray(c.learn_points) ? c.learn_points : [],
      requirements: Array.isArray(c.requirements) ? c.requirements : [],
      modules: Array.isArray(c.modules) ? c.modules : [],
    }));
  });

const courseInput = z.object({
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/, "lowercase letters, digits, hyphens only"),
  titleBn: z.string().min(2).max(200),
  titleEn: z.string().max(200).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  coverUrl: z.string().url().optional().nullable().or(z.literal("")),
  category: z.enum(["diploma", "talimul_quran", "free", "teacher_training"]),
  type: z.enum(["live", "recorded"]),
  durationMinutes: z.number().int().min(0).default(0),
  isPublished: z.boolean().default(false),
});

export const createCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => courseInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("courses")
      .insert({
        slug: data.slug,
        title_bn: data.titleBn,
        title_en: data.titleEn ?? null,
        description: data.description ?? null,
        cover_url: data.coverUrl ? data.coverUrl : null,
        category: data.category,
        type: data.type,
        duration_minutes: data.durationMinutes,
        is_published: data.isPublished,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const updateCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    courseInput.extend({ id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("courses")
      .update({
        slug: data.slug,
        title_bn: data.titleBn,
        title_en: data.titleEn ?? null,
        description: data.description ?? null,
        cover_url: data.coverUrl ? data.coverUrl : null,
        category: data.category,
        type: data.type,
        duration_minutes: data.durationMinutes,
        is_published: data.isPublished,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const toggleCoursePublished = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), isPublished: z.boolean() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("courses")
      .update({ is_published: data.isPublished })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("courses").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
