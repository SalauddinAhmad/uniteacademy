import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// GET /api/assignments — student: for enrolled courses; teacher/admin: all
router.get("/", async (req, res) => {
  const user = req.user!;
  let courseFilter: string[] | undefined;
  if (user.role === "student") {
    const enrolls = await prisma.enrollment.findMany({
      where: { userId: user.sub, courseId: { not: null } },
      select: { courseId: true },
    });
    courseFilter = enrolls.map((e) => e.courseId!).filter(Boolean);
    if (courseFilter.length === 0) return res.json({ assignments: [] });
  }

  const rows = await prisma.assignment.findMany({
    where: courseFilter ? { courseId: { in: courseFilter } } : undefined,
    orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
    include: {
      course: { select: { id: true, slug: true, title: true, coverUrl: true } },
      submissions: user.role === "student"
        ? { where: { userId: user.sub }, select: { id: true, status: true, score: true, submittedAt: true } }
        : { select: { id: true, userId: true, status: true, score: true, submittedAt: true } },
    },
  });
  res.json({ assignments: rows });
});

// POST /api/assignments — teacher/admin
const createSchema = z.object({
  courseId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  dueAt: z.string().datetime().optional(),
  points: z.number().int().min(1).max(1000).default(100),
});
router.post("/", requireRole("teacher", "admin"), async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const row = await prisma.assignment.create({
    data: { ...parsed.data, dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : null },
  });
  res.status(201).json({ assignment: row });
});

router.delete("/:id", requireRole("teacher", "admin"), async (req, res) => {
  await prisma.assignment.delete({ where: { id: req.params.id } }).catch(() => null);
  res.json({ ok: true });
});

export default router;
