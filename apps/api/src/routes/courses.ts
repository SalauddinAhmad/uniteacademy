import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

// Public: list published courses
router.get("/", async (_req, res) => {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    include: { instructor: { select: { id: true, fullName: true, avatarUrl: true } } },
  });
  res.json({ courses });
});

// Public: single course by slug
router.get("/:slug", async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { slug: req.params.slug },
    include: { instructor: { select: { id: true, fullName: true, avatarUrl: true } } },
  });
  if (!course || !course.isPublished) return res.status(404).json({ error: "Course not found" });
  res.json({ course });
});

export default router;
