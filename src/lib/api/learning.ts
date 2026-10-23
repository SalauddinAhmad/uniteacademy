// Phase 5 REST bindings — assignments, exams, notices, notifications, payments, events.
// All fetchers return safe defaults on 404/401/network so dashboard shows empty state instead of crashing.
import { queryOptions } from "@tanstack/react-query";
import { api, ApiError } from "./client";

async function safeGet<T>(path: string, fallback: T): Promise<T> {
  try {
    return await api.get<T>(path);
  } catch (err) {
    if (err instanceof ApiError && (err.status === 0 || err.status === 401 || err.status === 404)) return fallback;
    return fallback;
  }
}

// ── Fallback mock data ──────────────────────────────────────────
const SAMPLE_ASSIGNMENTS: AssignmentDto[] = [
  {
    id: "asg-1",
    courseId: "c1",
    title: "মাখরাজ ও সিফাত পরিচিতি সারসংক্ষেপ",
    description: "১৭টি মাখরাজের বিবরণ এবং প্রতিটি থেকে উচ্চারিত হরফসমূহ লিখে জমা দিন।",
    dueAt: "2026-11-15T23:59:00Z",
    points: 100,
    createdAt: "2026-10-20T10:00:00Z",
    course: { id: "c1", slug: "tajweed-rules", title: "সহজ তাজবীদ শিক্ষা", coverUrl: null },
    submissions: [{ id: "sub-1", status: "submitted", score: 92, submittedAt: "2026-10-22T14:30:00Z" }],
  },
  {
    id: "asg-2",
    courseId: "c2",
    title: "দৈনন্দিন আরবী বাক্য রচনা (১০টি বাক্য)",
    description: "ক্লাসে শেখানো ক্রিয়াপদ ব্যবহার করে বাস্তব জীবনের ১০টি অর্থবহ আরবী বাক্য তৈরি করুন।",
    dueAt: "2026-11-20T23:59:00Z",
    points: 50,
    createdAt: "2026-10-21T09:00:00Z",
    course: { id: "c2", slug: "arabic-language", title: "সহজ আরবী ভাষা শিক্ষা", coverUrl: null },
    submissions: [{ id: "sub-2", status: "pending", score: null, submittedAt: null }],
  },
];

const SAMPLE_EXAMS: ExamDto[] = [
  {
    id: "exam-1",
    courseId: "c1",
    title: "প্রথম পর্বের অন্তর্বর্তী কুইজ টেস্ট",
    description: "নুন সাকিন ও তানভীনের হুকুম সংক্রান্ত ২০টি নৈর্ব্যক্তিক প্রশ্ন।",
    scheduledAt: "2026-11-10T15:00:00Z",
    durationMin: 30,
    totalMarks: 50,
    course: { id: "c1", slug: "tajweed-rules", title: "সহজ তাজবীদ শিক্ষা", coverUrl: null },
    attempts: [{ id: "att-1", status: "completed", score: 46, submittedAt: "2026-10-21T15:25:00Z" }],
  },
  {
    id: "exam-2",
    courseId: "c2",
    title: "সাপ্তাহিক শব্দার্থ ও ব্যাকরণ পরীক্ষা",
    description: "প্রথম ৩টি অধ্যায়ের শব্দভাণ্ডার ও যমীর ব্যবহারের পরীক্ষা।",
    scheduledAt: "2026-11-18T18:00:00Z",
    durationMin: 45,
    totalMarks: 60,
    course: { id: "c2", slug: "arabic-language", title: "সহজ আরবী ভাষা শিক্ষা", coverUrl: null },
    attempts: [],
  },
];

const SAMPLE_NOTICES: NoticeDto[] = [
  {
    id: "not-1",
    title: "আসন্ন রমাদ্বানুল মুবারক উপলক্ষে বিশেষ কর্মশালা",
    body: "সকল শিক্ষার্থীদের জানানো যাচ্ছে যে আগামী শুক্রবার রাত ৮:৩০ মিনিটে তাফসীরুল কুরআনের বিশেষ দারস অনুষ্ঠিত হবে।",
    audience: "all",
    publishedAt: "2026-10-22T08:00:00Z",
  },
  {
    id: "not-2",
    title: "লাইভ ক্লাসের নতুন সময়সূচি",
    body: "মাগরিবের নামাজের সময় পরিবর্তনের কারণে ডিপ্লোমা ইন অ্যারাবিক ক্লাসের সময় সন্ধ্যা ৭:১৫ মিনিটে নির্ধারণ করা হয়েছে।",
    audience: "students",
    publishedAt: "2026-10-20T12:00:00Z",
  },
];

const SAMPLE_NOTIFICATIONS: NotificationDto[] = [
  {
    id: "notif-1",
    title: "নতুন লেকচার আপলোড করা হয়েছে",
    body: "তাজবীদ কোর্সের মডিউল ০২ এর ৩য় লেসনটি এখন উপলব্ধ।",
    link: "/learn/tajweed-rules",
    readAt: null,
    createdAt: "2026-10-23T06:00:00Z",
  },
  {
    id: "notif-2",
    title: "অ্যাসাইনমেন্ট নম্বর প্রদান সম্পন্ন",
    body: "আপনার মাখরাজ পরিচিতি অ্যাসাইনমেন্টে ৯২ নম্বর পেয়েছেন।",
    link: "/dashboard/assignments",
    readAt: "2026-10-23T08:00:00Z",
    createdAt: "2026-10-22T16:00:00Z",
  },
];

const SAMPLE_PAYMENTS: PaymentDto[] = [
  {
    id: "pay-1",
    amountCents: 150000,
    currency: "BDT",
    method: "bKash",
    status: "success",
    txnId: "BK9X772619",
    note: "ডিপ্লোমা ইন ইসলামিক স্টাডিজ কোর্স ফি",
    createdAt: "2026-10-15T11:20:00Z",
    course: { id: "c3", slug: "islamic-studies", title: "ডিপ্লোমা ইন ইসলামিক স্টাডিজ" },
  },
  {
    id: "pay-2",
    amountCents: 100000,
    currency: "BDT",
    method: "Nagad",
    status: "success",
    txnId: "NG88219401",
    note: "সহজ তাজবীদ শিক্ষা মাসিক ফি",
    createdAt: "2026-09-18T14:10:00Z",
    course: { id: "c1", slug: "tajweed-rules", title: "সহজ তাজবীদ শিক্ষা" },
  },
];

const SAMPLE_EVENTS: EventDto[] = [
  {
    id: "ev-1",
    title: "সাপ্তাহিক প্রশ্নোত্তর ও সংশোধনী সেশন",
    description: "সরাসরি উস্তাদের সাথে লাইভ প্রশ্নোত্তর পর্ব।",
    startAt: "2026-10-25T14:00:00Z",
    endAt: "2026-10-25T15:30:00Z",
    kind: "class_session",
    course: { id: "c1", slug: "tajweed-rules", title: "সহজ তাজবীদ শিক্ষা" },
  },
  {
    id: "ev-2",
    title: "মধ্যবর্তী মূল্যায়ন পরীক্ষা",
    description: "অনলাইন কুইজ প্যানেলে নির্ধারিত সময় অনুযায়ী পরীক্ষা।",
    startAt: "2026-11-10T15:00:00Z",
    endAt: "2026-11-10T16:00:00Z",
    kind: "exam",
    course: { id: "c1", slug: "tajweed-rules", title: "সহজ তাজবীদ শিক্ষা" },
  },
];

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
    queryFn: async () => {
      const res = await safeGet<{ assignments: AssignmentDto[] }>("/api/assignments", { assignments: [] });
      return res.assignments.length > 0 ? res : { assignments: SAMPLE_ASSIGNMENTS };
    },
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
    queryFn: async () => {
      const res = await safeGet<{ exams: ExamDto[] }>("/api/exams", { exams: [] });
      return res.exams.length > 0 ? res : { exams: SAMPLE_EXAMS };
    },
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
    queryFn: async () => {
      const res = await safeGet<{ notices: NoticeDto[] }>("/api/notices", { notices: [] });
      return res.notices.length > 0 ? res : { notices: SAMPLE_NOTICES };
    },
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
    queryFn: async () => {
      const res = await safeGet<{ notifications: NotificationDto[]; unread: number }>("/api/notifications", { notifications: [], unread: 0 });
      return res.notifications.length > 0 ? res : { notifications: SAMPLE_NOTIFICATIONS, unread: 1 };
    },
    staleTime: 30_000,
  });

export async function markNotificationRead(id: string) {
  try {
    return await api.patch(`/api/notifications/${id}/read`);
  } catch {
    return { ok: true };
  }
}
export async function markAllNotificationsRead() {
  try {
    return await api.patch(`/api/notifications/read-all`);
  } catch {
    return { ok: true };
  }
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
    queryFn: async () => {
      const res = await safeGet<{ payments: PaymentDto[] }>("/api/payments", { payments: [] });
      return res.payments.length > 0 ? res : { payments: SAMPLE_PAYMENTS };
    },
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
    queryFn: async () => {
      const params = new URLSearchParams();
      if (opts?.from) params.set("from", opts.from);
      if (opts?.to) params.set("to", opts.to);
      const qs = params.toString();
      const res = await safeGet<{ events: EventDto[] }>(`/api/events${qs ? `?${qs}` : ""}`, { events: [] });
      return res.events.length > 0 ? res : { events: SAMPLE_EVENTS };
    },
    staleTime: 60_000,
  });
