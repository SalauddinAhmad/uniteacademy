import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  const from = req.query.from ? new Date(String(req.query.from)) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const to = req.query.to ? new Date(String(req.query.to)) : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
  const rows = await prisma.event.findMany({
    where: { startAt: { gte: from, lte: to } },
    orderBy: { startAt: "asc" },
    take: 300,
    include: { course: { select: { id: true, slug: true, title: true } } },
  });
  res.json({ events: rows });
});

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime().optional().nullable(),
  courseId: z.string().uuid().optional().nullable(),
  kind: z.enum(["class_session", "exam", "holiday", "other"]).default("other"),
});
router.post("/", requireRole("teacher", "admin"), async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const d = parsed.data;
  const row = await prisma.event.create({
    data: { ...d, startAt: new Date(d.startAt), endAt: d.endAt ? new Date(d.endAt) : null },
  });
  res.status(201).json({ event: row });
});

router.delete("/:id", requireRole("teacher", "admin"), async (req, res) => {
  await prisma.event.delete({ where: { id: req.params.id } }).catch(() => null);
  res.json({ ok: true });
});

export default router;
