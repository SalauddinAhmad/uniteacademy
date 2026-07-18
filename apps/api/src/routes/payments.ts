import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  const user = req.user!;
  const where = user.role === "admin" ? {} : { userId: user.sub };
  const rows = await prisma.payment.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      course: { select: { id: true, slug: true, title: true } },
      user: user.role === "admin" ? { select: { id: true, email: true, fullName: true } } : false,
    },
  });
  res.json({ payments: rows });
});

const createSchema = z.object({
  userId: z.string(),
  courseId: z.string().uuid().optional().nullable(),
  amountCents: z.number().int().min(1),
  method: z.string().min(1),
  status: z.enum(["pending", "success", "failed", "refunded"]).default("pending"),
  txnId: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
});
router.post("/", requireRole("admin"), async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const row = await prisma.payment.create({ data: parsed.data });
  res.status(201).json({ payment: row });
});

router.patch("/:id", requireRole("admin"), async (req, res) => {
  const parsed = z.object({
    status: z.enum(["pending", "success", "failed", "refunded"]).optional(),
    txnId: z.string().optional().nullable(),
    note: z.string().optional().nullable(),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const row = await prisma.payment.update({ where: { id: req.params.id }, data: parsed.data });
  res.json({ payment: row });
});

export default router;
