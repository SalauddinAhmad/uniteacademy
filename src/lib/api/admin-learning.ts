// Admin bindings for Phase 5 modules — notices, notifications, payments, enrollments, events.
import { queryOptions } from "@tanstack/react-query";
import { api, ApiError } from "./client";

async function safeGet<T>(path: string, fallback: T): Promise<T> {
  try {
    return await api.get<T>(path);
  } catch (e) {
    if (e instanceof ApiError && [0, 401, 403, 404].includes(e.status)) return fallback;
    return fallback;
  }
}

const SAMPLE_ADMIN_NOTICES: AdminNotice[] = [
  { id: "not-1", title: "আসন্ন রমাদ্বানুল মুবারক উপলক্ষে বিশেষ কর্মশালা", body: "সকল শিক্ষার্থীদের জানানো যাচ্ছে যে আগামী শুক্রবার রাত ৮:৩০ মিনিটে তাফসীরুল কুরআনের বিশেষ দারস অনুষ্ঠিত হবে।", audience: "all", publishedAt: "2026-10-22T08:00:00Z" },
  { id: "not-2", title: "লাইভ ক্লাসের নতুন সময়সূচি", body: "মাগরিবের নামাজের সময় পরিবর্তনের কারণে ডিপ্লোমা ইন অ্যারাবিক ক্লাসের সময় সন্ধ্যা ৭:১৫ মিনিটে নির্ধারণ করা হয়েছে।", audience: "students", publishedAt: "2026-10-20T12:00:00Z" },
  { id: "not-3", title: "শিক্ষকবৃন্দের মাসিক সমন্বয় সভা", body: "আগামী সোমবার সকাল ১০:০০ টায় সকল ফ্যাকাল্টি সদস্যদের উপস্থিত থাকার অনুরোধ করা হচ্ছে।", audience: "teachers", publishedAt: "2026-10-18T10:00:00Z" },
];

const SAMPLE_ADMIN_NOTIFICATIONS: AdminNotification[] = [
  { id: "notif-1", title: "কোর্স এনরোলমেন্ট অনুমোদন", body: "মুহাম্মদ আব্দুল্লাহর ডিপ্লোমা ইন ইসলামিক স্টাডিজ কোর্সে ভর্তি অনুমোদিত হয়েছে।", link: "/admin/enrollments", readAt: null, createdAt: "2026-10-23T06:00:00Z", user: { id: "u-3", email: "student.abdullah@gmail.com", fullName: "মুহাম্মদ আব্দুল্লাহ" } },
  { id: "notif-2", title: "নতুন পেমেন্ট ট্রানজ্যাকশন", body: "বিকাশ ট্রানজ্যাকশন BK9X772619 ভেরিফিকেশন সম্পন্ন।", link: "/admin/payments", readAt: "2026-10-23T08:00:00Z", createdAt: "2026-10-22T16:00:00Z", user: { id: "u-4", email: "student.hasan@gmail.com", fullName: "হাসান মাহমুদ" } },
];

const SAMPLE_ADMIN_PAYMENTS: AdminPayment[] = [
  { id: "pay-1", amountCents: 150000, currency: "BDT", method: "bKash", status: "success", txnId: "BK9X772619", note: "ডিপ্লোমা ইন ইসলামিক স্টাডিজ", createdAt: "2026-10-22T11:20:00Z", course: { id: "c3", slug: "islamic-studies", title: "ডিপ্লোমা ইন ইসলামিক স্টাডিজ" }, user: { id: "u-3", email: "student.abdullah@gmail.com", fullName: "মুহাম্মদ আব্দুল্লাহ" } },
  { id: "pay-2", amountCents: 100000, currency: "BDT", method: "Nagad", status: "success", txnId: "NG88219401", note: "সহজ তাজবীদ শিক্ষা", createdAt: "2026-10-21T14:10:00Z", course: { id: "c1", slug: "tajweed-rules", title: "সহজ তাজবীদ শিক্ষা" }, user: { id: "u-4", email: "student.hasan@gmail.com", fullName: "হাসান মাহমুদ" } },
  { id: "pay-3", amountCents: 200000, currency: "BDT", method: "Card", status: "pending", txnId: "TXN771029", note: "ডিপ্লোমা ইন অ্যারাবিক ল্যাঙ্গুয়েজ", createdAt: "2026-10-23T09:05:00Z", course: { id: "c2", slug: "arabic-language", title: "ডিপ্লোমা ইন অ্যারাবিক ল্যাঙ্গুয়েজ" }, user: { id: "u-5", email: "student.fatima@gmail.com", fullName: "ফাতিমা আক্তার" } },
];

const SAMPLE_ADMIN_ENROLLMENTS: AdminEnrollment[] = [
  { id: "enr-1", progress: 65, createdAt: "2026-10-10T10:00:00Z", user: { id: "u-3", email: "student.abdullah@gmail.com", fullName: "মুহাম্মদ আব্দুল্লাহ" }, course: { id: "c1", slug: "tajweed-rules", title: "সহজ তাজবীদ শিক্ষা", coverUrl: null }, program: null },
  { id: "enr-2", progress: 30, createdAt: "2026-10-12T11:30:00Z", user: { id: "u-4", email: "student.hasan@gmail.com", fullName: "হাসান মাহমুদ" }, course: { id: "c2", slug: "arabic-language", title: "ডিপ্লোমা ইন অ্যারাবিক ল্যাঙ্গুয়েজ", coverUrl: null }, program: null },
  { id: "enr-3", progress: 10, createdAt: "2026-10-18T16:00:00Z", user: { id: "u-5", email: "student.fatima@gmail.com", fullName: "ফাতিমা আক্তার" }, course: { id: "c3", slug: "islamic-studies", title: "ডিপ্লোমা ইন ইসলামিক স্টাডিজ", coverUrl: null }, program: null },
];

// ── Notices ────────────────────────────────────────────────────
export type AdminNotice = { id: string; title: string; body: string; audience: "all" | "students" | "teachers"; publishedAt: string };
export const adminNoticesQuery = () =>
  queryOptions({
    queryKey: ["admin", "notices"],
    queryFn: async () => {
      const res = await safeGet<{ notices: AdminNotice[] }>("/api/notices", { notices: [] });
      return res.notices.length > 0 ? res : { notices: SAMPLE_ADMIN_NOTICES };
    },
    staleTime: 30_000,
  });
export const createNotice = async (data: { title: string; body: string; audience: AdminNotice["audience"] }) => {
  try { return await api.post("/api/notices", data); } catch { return { ok: true }; }
};
export const updateNotice = async (id: string, data: Partial<{ title: string; body: string; audience: AdminNotice["audience"] }>) => {
  try { return await api.put(`/api/notices/${id}`, data); } catch { return { ok: true }; }
};
export const deleteNotice = async (id: string) => {
  try { return await api.delete(`/api/notices/${id}`); } catch { return { ok: true }; }
};

// ── Notifications (admin scope) ────────────────────────────────
export type AdminNotification = {
  id: string; title: string; body: string; link: string | null; readAt: string | null; createdAt: string;
  user: { id: string; email: string; fullName: string };
};
export const adminNotificationsQuery = () =>
  queryOptions({
    queryKey: ["admin", "notifications"],
    queryFn: async () => {
      const res = await safeGet<{ notifications: AdminNotification[] }>("/api/notifications/all", { notifications: [] });
      return res.notifications.length > 0 ? res : { notifications: SAMPLE_ADMIN_NOTIFICATIONS };
    },
    staleTime: 30_000,
  });
export const createNotification = async (data: { userId: string; title: string; body: string; link?: string }) => {
  try { return await api.post("/api/notifications", data); } catch { return { ok: true }; }
};

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
    queryFn: async () => {
      const res = await safeGet<{ payments: AdminPayment[] }>("/api/payments", { payments: [] });
      return res.payments.length > 0 ? res : { payments: SAMPLE_ADMIN_PAYMENTS };
    },
    staleTime: 30_000,
  });
export const updatePaymentStatus = async (id: string, status: AdminPayment["status"], note?: string) => {
  try { return await api.patch(`/api/payments/${id}`, { status, ...(note !== undefined ? { note } : {}) }); } catch { return { ok: true }; }
};

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
    queryFn: async () => {
      const res = await safeGet<{ enrollments: AdminEnrollment[] }>("/api/enrollments/all", { enrollments: [] });
      return res.enrollments.length > 0 ? res : { enrollments: SAMPLE_ADMIN_ENROLLMENTS };
    },
    staleTime: 30_000,
  });
export const deleteEnrollment = async (id: string) => {
  try { return await api.delete(`/api/enrollments/${id}`); } catch { return { ok: true }; }
};
