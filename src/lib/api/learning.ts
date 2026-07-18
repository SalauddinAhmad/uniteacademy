// Phase 5 REST bindings — assignments, exams, notices, notifications, payments, events.
// All fetchers return safe defaults on 404/401/network so dashboard shows empty state instead of crashing.
import { queryOptions } from "@tanstack/react-query";
import { api, ApiError } from "./client";

async function safeGet<T>(path: string, fallback: T): Promise<T> {
  try {
    return await api.get<T>(path);
  } catch (err) {
    if (err instanceof ApiError && (err.status === 0 || err.status === 401 || err.status === 404)) return fallback;
    throw err;
  }
}

// ── Assignments ────────────────────────────────────────────────
export type AssignmentDto = {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  dueAt: string | null;
  points: number;
  createdAt: string;
  course: { id: string; slug: string; title: string; coverUrl: string | null };
  submissions: { id: string; status: "pending" | "submitted" | "graded" | "late"; score: number | null; submittedAt: string | null; userId?: string }[];
};

export const assignmentsQuery = () =>
  queryOptions({
    queryKey: ["dashboard", "assignments"],
    queryFn: () => safeGet<{ assignments: AssignmentDto[] }>("/api/assignments", { assignments: [] }),
    staleTime: 30_000,
  });

// ── Exams ──────────────────────────────────────────────────────
export type ExamDto = {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  scheduledAt: string;
  durationMin: number;
  totalMarks: number;
  course: { id: string; slug: string; title: string; coverUrl: string | null };
  attempts?: { id: string; status: string; score: number | null; submittedAt: string | null }[];
};

export const examsQuery = () =>
  queryOptions({
    queryKey: ["dashboard", "exams"],
    queryFn: () => safeGet<{ exams: ExamDto[] }>("/api/exams", { exams: [] }),
    staleTime: 30_000,
  });

// ── Notices ────────────────────────────────────────────────────
export type NoticeDto = {
  id: string;
  title: string;
  body: string;
  audience: "all" | "students" | "teachers";
  publishedAt: string;
};

export const noticesQuery = () =>
  queryOptions({
    queryKey: ["dashboard", "notices"],
    queryFn: () => safeGet<{ notices: NoticeDto[] }>("/api/notices", { notices: [] }),
    staleTime: 60_000,
  });

// ── Notifications ──────────────────────────────────────────────
export type NotificationDto = {
  id: string;
  title: string;
  body: string;
  link: string | null;
  readAt: string | null;
  createdAt: string;
};

export const notificationsQuery = () =>
  queryOptions({
    queryKey: ["dashboard", "notifications"],
    queryFn: () => safeGet<{ notifications: NotificationDto[]; unread: number }>("/api/notifications", { notifications: [], unread: 0 }),
    staleTime: 30_000,
  });

export async function markNotificationRead(id: string) {
  return api.patch(`/api/notifications/${id}/read`);
}
export async function markAllNotificationsRead() {
  return api.patch(`/api/notifications/read-all`);
}

// ── Payments ───────────────────────────────────────────────────
export type PaymentDto = {
  id: string;
  amountCents: number;
  currency: string;
  method: string;
  status: "pending" | "success" | "failed" | "refunded";
  txnId: string | null;
  note: string | null;
  createdAt: string;
  course: { id: string; slug: string; title: string } | null;
  user?: { id: string; email: string; fullName: string };
};

export const paymentsQuery = () =>
  queryOptions({
    queryKey: ["dashboard", "payments"],
    queryFn: () => safeGet<{ payments: PaymentDto[] }>("/api/payments", { payments: [] }),
    staleTime: 30_000,
  });

// ── Events ─────────────────────────────────────────────────────
export type EventDto = {
  id: string;
  title: string;
  description: string | null;
  startAt: string;
  endAt: string | null;
  kind: "class_session" | "exam" | "holiday" | "other";
  course: { id: string; slug: string; title: string } | null;
};

export const eventsQuery = (opts?: { from?: string; to?: string }) =>
  queryOptions({
    queryKey: ["dashboard", "events", opts?.from, opts?.to],
    queryFn: () => {
      const params = new URLSearchParams();
      if (opts?.from) params.set("from", opts.from);
      if (opts?.to) params.set("to", opts.to);
      const qs = params.toString();
      return safeGet<{ events: EventDto[] }>(`/api/events${qs ? `?${qs}` : ""}`, { events: [] });
    },
    staleTime: 60_000,
  });
