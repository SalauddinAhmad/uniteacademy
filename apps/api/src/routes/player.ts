import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { userCanAccessCourse, userCanAccessLesson } from "../lib/access.js";

const router = Router();
router.use(requireAuth);

// ── PUBLIC (enrolled) READS ──────────────────────────────────────

// GET /api/player/courses/:slug/outline — modules + lessons (no content bodies)
router.get("/courses/:slug/outline", async (req, res) => {
  const course = await prisma.course.findUnique({ where: { slug: req.params.slug } });
  if (!course) return res.status(404).json({ error: "Course not found" });

  const canAccess = await userCanAccessCourse(req.user!.sub, req.user!.role, course.id);

  const modules = await prisma.module.findMany({
    where: { courseId: course.id },
    orderBy: { order: "asc" },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        select: {
          id: true, title: true, kind: true, order: true,
          durationMin: true, isFreePreview: true,
        },
      },
    },
  });

  // Progress for this user across these lessons
  const lessonIds = modules.flatMap((m) => m.lessons.map((l) => l.id));
  const progressRows = lessonIds.length
    ? await prisma.lessonProgress.findMany({
        where: { userId: req.user!.sub, lessonId: { in: lessonIds } },
      })
    : [];
  const progressMap = new Map(progressRows.map((p) => [p.lessonId, p]));

  const modulesOut = modules.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    order: m.order,
    lessons: m.lessons.map((l) => ({
      ...l,
      status: progressMap.get(l.id)?.status ?? "not_started",
      watchedSeconds: progressMap.get(l.id)?.watchedSeconds ?? 0,
      locked: !canAccess && !l.isFreePreview,
    })),
  }));

  const totalLessons = lessonIds.length;
  const completed = progressRows.filter((p) => p.status === "completed").length;

  res.json({
    course: {
      id: course.id, slug: course.slug, title: course.title,
      coverUrl: course.coverUrl, subtitle: course.subtitle,
    },
    isEnrolled: canAccess,
    modules: modulesOut,
    progress: {
      totalLessons,
      completedLessons: completed,
      percent: totalLessons ? Math.round((completed / totalLessons) * 100) : 0,
    },
  });
});

// GET /api/player/lessons/:id — full lesson content (enrollment-gated)
router.get("/lessons/:id", async (req, res) => {
  const check = await userCanAccessLesson(req.user!.sub, req.user!.role, req.params.id);
  if (!check.ok) {
    if (check.reason === "not_found") return res.status(404).json({ error: "Lesson not found" });
    return res.status(403).json({ error: "Enroll to access this lesson" });
  }
  const l = check.lesson;
  const progress = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId: req.user!.sub, lessonId: l.id } },
  });

  // Sibling lessons for prev/next
  const siblings = await prisma.lesson.findMany({
    where: { module: { courseId: check.courseId } },
    orderBy: [{ module: { order: "asc" } }, { order: "asc" }],
    select: { id: true, title: true, moduleId: true },
  });
  const idx = siblings.findIndex((s) => s.id === l.id);

  res.json({
    lesson: {
      id: l.id, title: l.title, kind: l.kind, order: l.order,
      contentUrl: l.contentUrl, body: l.body, durationMin: l.durationMin,
      moduleId: l.moduleId,
    },
    course: { id: check.courseId },
    progress: progress ?? null,
    prev: idx > 0 ? siblings[idx - 1] : null,
    next: idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null,
  });
});

// POST /api/player/lessons/:id/progress — upsert watch progress
const progressSchema = z.object({
  watchedSeconds: z.number().int().min(0).optional(),
  status: z.enum(["not_started", "in_progress", "completed"]).optional(),
});
router.post("/lessons/:id/progress", async (req, res) => {
  const check = await userCanAccessLesson(req.user!.sub, req.user!.role, req.params.id);
  if (!check.ok) return res.status(403).json({ error: "Not allowed" });

  const parsed = progressSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const now = new Date();
  const wantCompleted = parsed.data.status === "completed";

  const row = await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: req.user!.sub, lessonId: req.params.id } },
    update: {
      watchedSeconds: parsed.data.watchedSeconds,
      status: parsed.data.status ?? undefined,
      completedAt: wantCompleted ? now : undefined,
    },
    create: {
      userId: req.user!.sub,
      lessonId: req.params.id,
      watchedSeconds: parsed.data.watchedSeconds ?? 0,
      status: parsed.data.status ?? "in_progress",
      completedAt: wantCompleted ? now : null,
    },
  });

  // Roll up to Enrollment.progress
  const all = await prisma.lesson.findMany({
    where: { module: { courseId: check.courseId } },
    select: { id: true },
  });
  const done = await prisma.lessonProgress.count({
    where: { userId: req.user!.sub, lessonId: { in: all.map((a) => a.id) }, status: "completed" },
  });
  const pct = all.length ? Math.round((done / all.length) * 100) : 0;
  await prisma.enrollment.updateMany({
    where: { userId: req.user!.sub, courseId: check.courseId },
    data: { progress: pct },
  });

  res.json({ progress: row, coursePercent: pct });
});

// ── QUIZ ────────────────────────────────────────────────────────

// GET /api/player/lessons/:id/quiz — questions WITHOUT correctIndex
router.get("/lessons/:id/quiz", async (req, res) => {
  const check = await userCanAccessLesson(req.user!.sub, req.user!.role, req.params.id);
  if (!check.ok) return res.status(403).json({ error: "Not allowed" });

  const quiz = await prisma.quiz.findUnique({
    where: { lessonId: req.params.id },
    include: { questions: { orderBy: { order: "asc" } } },
  });
  if (!quiz) return res.status(404).json({ error: "No quiz on this lesson" });

  const lastAttempt = await prisma.quizAttempt.findFirst({
    where: { quizId: quiz.id, userId: req.user!.sub },
    orderBy: { submittedAt: "desc" },
  });

  res.json({
    quiz: {
      id: quiz.id, title: quiz.title, passMarks: quiz.passMarks,
      questions: quiz.questions.map((q) => ({
        id: q.id, order: q.order, prompt: q.prompt,
        options: q.options, points: q.points,
      })),
    },
    lastAttempt: lastAttempt
      ? { score: lastAttempt.score, totalMarks: lastAttempt.totalMarks, passed: lastAttempt.passed, submittedAt: lastAttempt.submittedAt }
      : null,
  });
});

// POST /api/player/lessons/:id/quiz/submit — grade and record
const submitSchema = z.object({
  answers: z.record(z.string(), z.number().int().min(0)),
});
router.post("/lessons/:id/quiz/submit", async (req, res) => {
  const check = await userCanAccessLesson(req.user!.sub, req.user!.role, req.params.id);
  if (!check.ok) return res.status(403).json({ error: "Not allowed" });

  const parsed = submitSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const quiz = await prisma.quiz.findUnique({
    where: { lessonId: req.params.id },
    include: { questions: true },
  });
  if (!quiz) return res.status(404).json({ error: "No quiz" });

  let score = 0;
  let totalMarks = 0;
  const perQuestion: Record<string, { correct: boolean; correctIndex: number }> = {};
  for (const q of quiz.questions) {
    totalMarks += q.points;
    const given = parsed.data.answers[q.id];
    const correct = typeof given === "number" && given === q.correctIndex;
    if (correct) score += q.points;
    perQuestion[q.id] = { correct, correctIndex: q.correctIndex };
  }
  const percent = totalMarks ? Math.round((score / totalMarks) * 100) : 0;
  const passed = percent >= quiz.passMarks;

  const attempt = await prisma.quizAttempt.create({
    data: {
      quizId: quiz.id, userId: req.user!.sub,
      score, totalMarks, passed, answers: parsed.data.answers,
    },
  });

  // If passed → mark lesson complete
  if (passed) {
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: req.user!.sub, lessonId: req.params.id } },
      update: { status: "completed", completedAt: new Date() },
      create: { userId: req.user!.sub, lessonId: req.params.id, status: "completed", completedAt: new Date() },
    });
  }

  res.json({
    attempt: { id: attempt.id, score, totalMarks, percent, passed },
    review: perQuestion,
  });
});

// ── ADMIN CRUD ──────────────────────────────────────────────────

const moduleSchema = z.object({
  courseId: z.string(),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  order: z.number().int().min(0).default(0),
});
router.post("/admin/modules", requireRole("admin", "teacher"), async (req, res) => {
  const parsed = moduleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const row = await prisma.module.create({ data: parsed.data });
  res.status(201).json({ module: row });
});
router.patch("/admin/modules/:id", requireRole("admin", "teacher"), async (req, res) => {
  const parsed = moduleSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const row = await prisma.module.update({ where: { id: req.params.id }, data: parsed.data });
  res.json({ module: row });
});
router.delete("/admin/modules/:id", requireRole("admin", "teacher"), async (req, res) => {
  await prisma.module.delete({ where: { id: req.params.id } }).catch(() => null);
  res.json({ ok: true });
});

const lessonSchema = z.object({
  moduleId: z.string(),
  title: z.string().min(1),
  kind: z.enum(["video", "pdf", "text", "quiz"]).default("video"),
  order: z.number().int().min(0).default(0),
  contentUrl: z.string().optional().nullable(),
  body: z.string().optional().nullable(),
  durationMin: z.number().int().min(0).optional().nullable(),
  isFreePreview: z.boolean().optional(),
});
router.post("/admin/lessons", requireRole("admin", "teacher"), async (req, res) => {
  const parsed = lessonSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const row = await prisma.lesson.create({ data: parsed.data });
  res.status(201).json({ lesson: row });
});
router.patch("/admin/lessons/:id", requireRole("admin", "teacher"), async (req, res) => {
  const parsed = lessonSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const row = await prisma.lesson.update({ where: { id: req.params.id }, data: parsed.data });
  res.json({ lesson: row });
});
router.delete("/admin/lessons/:id", requireRole("admin", "teacher"), async (req, res) => {
  await prisma.lesson.delete({ where: { id: req.params.id } }).catch(() => null);
  res.json({ ok: true });
});

// Quiz admin (upsert whole quiz with questions)
const quizAdminSchema = z.object({
  lessonId: z.string(),
  title: z.string().min(1),
  passMarks: z.number().int().min(0).max(100).default(60),
  questions: z.array(z.object({
    prompt: z.string().min(1),
    options: z.array(z.string()).min(2),
    correctIndex: z.number().int().min(0),
    points: z.number().int().min(1).default(10),
  })).min(1),
});
router.post("/admin/quizzes", requireRole("admin", "teacher"), async (req, res) => {
  const parsed = quizAdminSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { lessonId, title, passMarks, questions } = parsed.data;

  const existing = await prisma.quiz.findUnique({ where: { lessonId } });
  if (existing) {
    await prisma.quizQuestion.deleteMany({ where: { quizId: existing.id } });
    const updated = await prisma.quiz.update({
      where: { id: existing.id },
      data: {
        title, passMarks,
        questions: {
          create: questions.map((q, i) => ({
            order: i, prompt: q.prompt, options: q.options,
            correctIndex: q.correctIndex, points: q.points,
          })),
        },
      },
      include: { questions: true },
    });
    return res.json({ quiz: updated });
  }
  const created = await prisma.quiz.create({
    data: {
      lessonId, title, passMarks,
      questions: {
        create: questions.map((q, i) => ({
          order: i, prompt: q.prompt, options: q.options,
          correctIndex: q.correctIndex, points: q.points,
        })),
      },
    },
    include: { questions: true },
  });
  // Also force parent lesson kind → quiz
  await prisma.lesson.update({ where: { id: lessonId }, data: { kind: "quiz" } });
  res.status(201).json({ quiz: created });
});

// Admin: fetch quiz WITH answers
router.get("/admin/lessons/:id/quiz", requireRole("admin", "teacher"), async (req, res) => {
  const quiz = await prisma.quiz.findUnique({
    where: { lessonId: req.params.id },
    include: { questions: { orderBy: { order: "asc" } } },
  });
  res.json({ quiz });
});

export default router;
