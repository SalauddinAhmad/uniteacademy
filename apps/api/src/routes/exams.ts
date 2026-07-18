import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  const user = req.user!;
  let courseFilter: string[] | undefined;
  if (user.role === "student") {
    const enrolls = await prisma.enrollment.findMany({
      where: { userId: user.sub, courseId: { not: null } },
      select: { courseId: true },
    });
    courseFilter = enrolls.map((e) => e.courseId!).filter(Boolean);
    if (courseFilter.length === 0) return res.json({ exams: [] });
  }

  const rows = await prisma.exam.findMany({
    where: courseFilter ? { courseId: { in: courseFilter } } : undefined,
    orderBy: { scheduledAt: "asc" },
    include: {
      course: { select: { id: true, slug: true, title: true, coverUrl: true } },
      attempts: user.role === "student"
        ? { where: { userId: user.sub }, select: { id: true, status: true, score: true, submittedAt: true } }
        : false,
    },
  });
  res.json({ exams: rows });
});

const createSchema = z.object({
  courseId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  scheduledAt: z.string().datetime(),
  durationMin: z.number().int().min(5).max(600).default(60),
  totalMarks: z.number().int().min(1).max(1000).default(100),
});
router.post("/", requireRole("teacher", "admin"), async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const row = await prisma.exam.create({
    data: { ...parsed.data, scheduledAt: new Date(parsed.data.scheduledAt) },
  });
  res.status(201).json({ exam: row });
});

router.delete("/:id", requireRole("teacher", "admin"), async (req, res) => {
  await prisma.exam.delete({ where: { id: req.params.id } }).catch(() => null);
  res.json({ ok: true });
});

export default router;
