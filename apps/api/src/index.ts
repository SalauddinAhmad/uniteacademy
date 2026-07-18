import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "node:path";

import authRouter from "./routes/auth.js";
import coursesRouter from "./routes/courses.js";
import programsRouter from "./routes/programs.js";
import enrollmentsRouter from "./routes/enrollments.js";
import adminRouter from "./routes/admin.js";
import assignmentsRouter from "./routes/assignments.js";
import examsRouter from "./routes/exams.js";
import noticesRouter from "./routes/notices.js";
import notificationsRouter from "./routes/notifications.js";
import paymentsRouter from "./routes/payments.js";
import eventsRouter from "./routes/events.js";
import playerRouter from "./routes/player.js";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);
const CORS_ORIGIN = process.env.CORS_ORIGIN?.split(",").map((s) => s.trim()) ?? ["http://localhost:8080"];
const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR ?? "./uploads");

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Static uploads (local disk storage)
app.use("/uploads", express.static(UPLOAD_DIR, { maxAge: "7d", immutable: true }));

// Rate-limit auth endpoints
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });
app.use("/api/auth", authLimiter, authRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/programs", programsRouter);
app.use("/api/enrollments", enrollmentsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/assignments", assignmentsRouter);
app.use("/api/exams", examsRouter);
app.use("/api/notices", noticesRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/events", eventsRouter);
app.use("/api/player", playerRouter);

app.get("/api/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));

// 404
app.use((_req, res) => res.status(404).json({ error: "Not found" }));

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[api-error]", err);
  res.status(err.status ?? 500).json({ error: err.message ?? "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Uniteacademy API listening on http://localhost:${PORT}`);
});
