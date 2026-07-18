import { prisma } from "../lib/prisma.js";

/**
 * Returns { ok, courseId } if the user is enrolled in the course containing the lesson.
 * Admins and the course instructor also pass.
 */
export async function userCanAccessLesson(userId: string, role: string, lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { include: { course: true } } },
  });
  if (!lesson) return { ok: false as const, reason: "not_found" as const };
  const course = lesson.module.course;
  if (lesson.isFreePreview) return { ok: true as const, courseId: course.id, lesson };
  if (role === "admin" || course.instructorId === userId) {
    return { ok: true as const, courseId: course.id, lesson };
  }
  const enrolled = await prisma.enrollment.findFirst({
    where: { userId, courseId: course.id },
  });
  if (!enrolled) return { ok: false as const, reason: "not_enrolled" as const };
  return { ok: true as const, courseId: course.id, lesson };
}

export async function userCanAccessCourse(userId: string, role: string, courseId: string) {
  if (role === "admin") return true;
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return false;
  if (course.instructorId === userId) return true;
  const enrolled = await prisma.enrollment.findFirst({ where: { userId, courseId } });
  return !!enrolled;
}
