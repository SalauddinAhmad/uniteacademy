import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// GET /api/notices — scoped to caller's audience
router.get("/", async (req, res) => {
  const role = req.user!.role;
  const audience = role === "teacher" ? ["all", "teachers"] : role === "student" ? ["all", "students"] : ["all", "students", "teachers"];
  const rows = await prisma.notice.findMany({
    where: { audience: { in: audience as any } },
    orderBy: { publishedAt: "desc" },
    take: 100,
  });
  res.json({ notices: rows });
});

const upsertSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  audience: z.enum(["all", "students", "teachers"]).default("all"),
});

router.post("/", requireRole("admin"), async (req, res) => {
  const parsed = upsertSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const row = await prisma.notice.create({ data: parsed.data });
  res.status(201).json({ notice: row });
});

router.put("/:id", requireRole("admin"), async (req, res) => {
  const parsed = upsertSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const row = await prisma.notice.update({ where: { id: req.params.id }, data: parsed.data });
  res.json({ notice: row });
});

router.delete("/:id", requireRole("admin"), async (req, res) => {
  await prisma.notice.delete({ where: { id: req.params.id } }).catch(() => null);
  res.json({ ok: true });
});

export default router;
