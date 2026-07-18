import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// GET /api/enrollments — current user's enrollments
router.get("/", async (req, res) => {
  const rows = await prisma.enrollment.findMany({
    where: { userId: req.user!.sub },
    orderBy: { createdAt: "desc" },
    include: {
      course: { select: { id: true, slug: true, title: true, coverUrl: true, totalLessons: true, level: true } },
      program: { select: { id: true, slug: true, title: true, coverUrl: true } },
    },
  });
  res.json({ enrollments: rows });
});

const enrollSchema = z.object({
  courseSlug: z.string().optional(),
  programSlug: z.string().optional(),
}).refine((d) => d.courseSlug || d.programSlug, { message: "courseSlug or programSlug required" });

// POST /api/enrollments — enroll self in a course or program
router.post("/", async (req, res) => {
  const parsed = enrollSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { courseSlug, programSlug } = parsed.data;
  const userId = req.user!.sub;

  if (courseSlug) {
    const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
    if (!course || !course.isPublished) return res.status(404).json({ error: "Course not found" });
    const row = await prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId: course.id } },
      update: {},
      create: { userId, courseId: course.id },
    });
    return res.status(201).json({ enrollment: row });
  }

  const program = await prisma.program.findUnique({ where: { slug: programSlug! } });
  if (!program) return res.status(404).json({ error: "Program not found" });
  const row = await prisma.enrollment.upsert({
    where: { userId_programId: { userId, programId: program.id } },
    update: {},
    create: { userId, programId: program.id },
  });
  res.status(201).json({ enrollment: row });
});

// PATCH /api/enrollments/:id/progress
router.patch("/:id/progress", async (req, res) => {
  const parsed = z.object({ progress: z.number().int().min(0).max(100) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const row = await prisma.enrollment.findUnique({ where: { id: req.params.id } });
  if (!row || row.userId !== req.user!.sub) return res.status(404).json({ error: "Not found" });

  const updated = await prisma.enrollment.update({
    where: { id: row.id },
    data: { progress: parsed.data.progress },
  });
  res.json({ enrollment: updated });
});

export default router;
