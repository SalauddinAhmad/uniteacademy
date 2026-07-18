// Admin bindings for Phase 5 modules — notices, notifications, payments, enrollments, events.
import { queryOptions } from "@tanstack/react-query";
import { api, ApiError } from "./client";

async function safeGet<T>(path: string, fallback: T): Promise<T> {
  try { return await api.get<T>(path); }
  catch (e) { if (e instanceof ApiError && [0, 401, 403, 404].includes(e.status)) return fallback; throw e; }
}

// ── Notices ────────────────────────────────────────────────────
export type AdminNotice = { id: string; title: string; body: string; audience: "all" | "students" | "teachers"; publishedAt: string };
export const adminNoticesQuery = () =>
  queryOptions({
    queryKey: ["admin", "notices"],
    queryFn: () => safeGet<{ notices: AdminNotice[] }>("/api/notices", { notices: [] }),
    staleTime: 30_000,
  });
export const createNotice = (data: { title: string; body: string; audience: AdminNotice["audience"] }) =>
  api.post("/api/notices", data);
export const updateNotice = (id: string, data: Partial<{ title: string; body: string; audience: AdminNotice["audience"] }>) =>
  api.put(`/api/notices/${id}`, data);
export const deleteNotice = (id: string) => api.delete(`/api/notices/${id}`);

// ── Notifications (admin scope) ────────────────────────────────
export type AdminNotification = {
  id: string; title: string; body: string; link: string | null; readAt: string | null; createdAt: string;
  user: { id: string; email: string; fullName: string };
};
export const adminNotificationsQuery = () =>
  queryOptions({
    queryKey: ["admin", "notifications"],
    queryFn: () => safeGet<{ notifications: AdminNotification[] }>("/api/notifications/all", { notifications: [] }),
    staleTime: 30_000,
  });
export const createNotification = (data: { userId: string; title: string; body: string; link?: string }) =>
  api.post("/api/notifications", data);

// ── Payments (admin scope) ─────────────────────────────────────
export type AdminPayment = {
  id: string; amountCents: number; currency: string; method: string;
  status: "pending" | "success" | "failed" | "refunded"; txnId: string | null; note: string | null; createdAt: string;
  course: { id: string; slug: string; title: string } | null;
  user: { id: string; email: string; fullName: string } | null;
};
export const adminPaymentsQuery = () =>
  queryOptions({
    queryKey: ["admin", "payments"],
    queryFn: () => safeGet<{ payments: AdminPayment[] }>("/api/payments", { payments: [] }),
    staleTime: 30_000,
  });
export const updatePaymentStatus = (id: string, status: AdminPayment["status"], note?: string) =>
  api.patch(`/api/payments/${id}`, { status, ...(note !== undefined ? { note } : {}) });

// ── Enrollments (admin scope) ──────────────────────────────────
export type AdminEnrollment = {
  id: string; progress: number; createdAt: string;
  user: { id: string; email: string; fullName: string };
  course: { id: string; slug: string; title: string; coverUrl: string | null } | null;
  program: { id: string; slug: string; title: string } | null;
};
export const adminEnrollmentsQuery = () =>
  queryOptions({
    queryKey: ["admin", "enrollments"],
    queryFn: () => safeGet<{ enrollments: AdminEnrollment[] }>("/api/enrollments/all", { enrollments: [] }),
    staleTime: 30_000,
  });
export const deleteEnrollment = (id: string) => api.delete(`/api/enrollments/${id}`);
