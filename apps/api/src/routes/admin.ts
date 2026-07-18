import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth, requireRole("admin"));

// ─── Courses CRUD ─────────────────────────────────────

const courseSchema = z.object({
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/),
  title: z.string().min(2).max(200),
  subtitle: z.string().max(300).optional().nullable(),
  description: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional().nullable(),
  language: z.string().default("bn"),
  durationWeeks: z.number().int().min(0).optional().nullable(),
  totalLessons: z.number().int().min(0).optional().nullable(),
  priceCents: z.number().int().min(0).default(0),
  originalPriceCents: z.number().int().min(0).optional().nullable(),
  rating: z.number().min(0).max(5).optional().nullable(),
  ratingsCount: z.number().int().min(0).default(0),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  learningPoints: z.array(z.string()).optional().nullable(),
  requirements: z.array(z.string()).optional().nullable(),
  curriculum: z.any().optional().nullable(),
  instructorId: z.string().uuid().optional().nullable(),
});

router.get("/courses", async (_req, res) => {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: { instructor: { select: { id: true, fullName: true } } },
  });
  res.json({ courses });
});

router.post("/courses", async (req, res) => {
  const parsed = courseSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const course = await prisma.course.create({ data: parsed.data as any });
    res.status(201).json({ course });
  } catch (e: any) {
    if (e.code === "P2002") return res.status(409).json({ error: "Slug already exists" });
    throw e;
  }
});

router.patch("/courses/:id", async (req, res) => {
  const parsed = courseSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const course = await prisma.course.update({ where: { id: req.params.id }, data: parsed.data as any });
  res.json({ course });
});

router.delete("/courses/:id", async (req, res) => {
  await prisma.course.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

// ─── Programs CRUD ────────────────────────────────────

const programSchema = z.object({
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/),
  title: z.string().min(2).max(200),
  description: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
});

router.get("/programs", async (_req, res) => {
  const programs = await prisma.program.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ programs });
});

router.post("/programs", async (req, res) => {
  const parsed = programSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const program = await prisma.program.create({ data: parsed.data });
  res.status(201).json({ program });
});

router.patch("/programs/:id", async (req, res) => {
  const parsed = programSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const program = await prisma.program.update({ where: { id: req.params.id }, data: parsed.data });
  res.json({ program });
});

router.delete("/programs/:id", async (req, res) => {
  await prisma.program.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

// ─── Users management ─────────────────────────────────

router.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, email: true, username: true, fullName: true, role: true,
      emailVerified: true, createdAt: true,
      _count: { select: { enrollments: true, taughtCourses: true } },
    },
  });
  res.json({ users });
});

router.patch("/users/:id/role", async (req, res) => {
  const parsed = z.object({ role: z.enum(["student", "teacher", "admin"]) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { role: parsed.data.role },
    select: { id: true, email: true, fullName: true, role: true },
  });
  res.json({ user });
});

router.delete("/users/:id", async (req, res) => {
  if (req.params.id === req.user!.sub) return res.status(400).json({ error: "Cannot delete self" });
  await prisma.user.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

export default router;
