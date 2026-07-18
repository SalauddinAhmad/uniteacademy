import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
  const programs = await prisma.program.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ programs });
});

router.get("/:slug", async (req, res) => {
  const program = await prisma.program.findUnique({ where: { slug: req.params.slug } });
  if (!program) return res.status(404).json({ error: "Program not found" });
  res.json({ program });
});

export default router;
