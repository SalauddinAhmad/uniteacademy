import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  const rows = await prisma.notification.findMany({
    where: { userId: req.user!.sub },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  const unread = rows.filter((r) => !r.readAt).length;
  res.json({ notifications: rows, unread });
});

// Admin: list every notification with user info
router.get("/all", requireRole("admin"), async (_req, res) => {
  const rows = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: 300,
    include: { user: { select: { id: true, email: true, fullName: true } } },
  });
  res.json({ notifications: rows });
});

router.patch("/:id/read", async (req, res) => {
  const row = await prisma.notification.findUnique({ where: { id: req.params.id } });
  if (!row || row.userId !== req.user!.sub) return res.status(404).json({ error: "Not found" });
  const updated = await prisma.notification.update({ where: { id: row.id }, data: { readAt: new Date() } });
  res.json({ notification: updated });
});

router.patch("/read-all", async (req, res) => {
  await prisma.notification.updateMany({ where: { userId: req.user!.sub, readAt: null }, data: { readAt: new Date() } });
  res.json({ ok: true });
});

const createSchema = z.object({
  userId: z.string(),
  title: z.string().min(1),
  body: z.string().min(1),
  link: z.string().optional(),
});
router.post("/", requireRole("admin"), async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const row = await prisma.notification.create({ data: parsed.data });
  res.status(201).json({ notification: row });
});

export default router;
