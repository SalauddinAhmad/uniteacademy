// Course player REST bindings
import { queryOptions } from "@tanstack/react-query";
import { api } from "./client";

export type PlayerLesson = {
  id: string;
  title: string;
  kind: "video" | "pdf" | "text" | "quiz";
  order: number;
  durationMin: number | null;
  isFreePreview: boolean;
  status: "not_started" | "in_progress" | "completed";
  watchedSeconds: number;
  locked: boolean;
};

export type PlayerModule = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  lessons: PlayerLesson[];
};

export type PlayerOutline = {
  course: { id: string; slug: string; title: string; coverUrl: string | null; subtitle: string | null };
  isEnrolled: boolean;
  modules: PlayerModule[];
  progress: { totalLessons: number; completedLessons: number; percent: number };
};

export type LessonDetail = {
  lesson: {
    id: string; title: string; kind: PlayerLesson["kind"]; order: number;
    contentUrl: string | null; body: string | null; durationMin: number | null;
    moduleId: string;
  };
  course: { id: string };
  progress: { status: string; watchedSeconds: number } | null;
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
};

export type QuizPayload = {
  quiz: {
    id: string;
    title: string;
    passMarks: number;
    questions: {
      id: string;
      order: number;
      prompt: string;
      options: string[];
      points: number;
    }[];
  };
  lastAttempt: { score: number; totalMarks: number; passed: boolean; submittedAt: string } | null;
};

export type QuizResult = {
  attempt: { id: string; score: number; totalMarks: number; percent: number; passed: boolean };
  review: Record<string, { correct: boolean; correctIndex: number }>;
};

// ─── Fetchers ────────────────────────────────────────
export const fetchOutline = (slug: string) =>
  api.get<PlayerOutline>(`/api/player/courses/${slug}/outline`);

export const fetchLesson = (id: string) =>
  api.get<LessonDetail>(`/api/player/lessons/${id}`);

export const saveProgress = (id: string, body: { watchedSeconds?: number; status?: PlayerLesson["status"] }) =>
  api.post<{ progress: { status: string }; coursePercent: number }>(
    `/api/player/lessons/${id}/progress`, body,
  );

export const fetchQuiz = (lessonId: string) =>
  api.get<QuizPayload>(`/api/player/lessons/${lessonId}/quiz`);

export const submitQuiz = (lessonId: string, answers: Record<string, number>) =>
  api.post<QuizResult>(`/api/player/lessons/${lessonId}/quiz/submit`, { answers });

// ─── Query options ────────────────────────────────────
export const outlineQuery = (slug: string) =>
  queryOptions({ queryKey: ["player", "outline", slug], queryFn: () => fetchOutline(slug) });

export const lessonQuery = (id: string) =>
  queryOptions({ queryKey: ["player", "lesson", id], queryFn: () => fetchLesson(id) });

export const quizQuery = (lessonId: string) =>
  queryOptions({ queryKey: ["player", "quiz", lessonId], queryFn: () => fetchQuiz(lessonId) });

// ─── Admin content builder ───────────────────────────
export type AdminModuleInput = { courseId: string; title: string; description?: string | null; order?: number };
export type AdminLessonInput = {
  moduleId: string; title: string; kind: PlayerLesson["kind"]; order?: number;
  contentUrl?: string | null; body?: string | null; durationMin?: number | null; isFreePreview?: boolean;
};
export type AdminQuizInput = {
  lessonId: string; title: string; passMarks?: number;
  questions: { prompt: string; options: string[]; correctIndex: number; points?: number }[];
};

export const createModule = (input: AdminModuleInput) =>
  api.post<{ module: any }>("/api/player/admin/modules", input);
export const updateModule = (id: string, input: Partial<AdminModuleInput>) =>
  api.patch<{ module: any }>(`/api/player/admin/modules/${id}`, input);
export const deleteModule = (id: string) =>
  api.delete<{ ok: boolean }>(`/api/player/admin/modules/${id}`);

export const createLesson = (input: AdminLessonInput) =>
  api.post<{ lesson: any }>("/api/player/admin/lessons", input);
export const updateLesson = (id: string, input: Partial<AdminLessonInput>) =>
  api.patch<{ lesson: any }>(`/api/player/admin/lessons/${id}`, input);
export const deleteLesson = (id: string) =>
  api.delete<{ ok: boolean }>(`/api/player/admin/lessons/${id}`);

export const upsertQuiz = (input: AdminQuizInput) =>
  api.post<{ quiz: any }>("/api/player/admin/quizzes", input);
export const fetchAdminQuiz = (lessonId: string) =>
  api.get<{ quiz: any }>(`/api/player/admin/lessons/${lessonId}/quiz`);

export type AdminOutlineLesson = {
  id: string; title: string; kind: PlayerLesson["kind"]; order: number;
  contentUrl: string | null; body: string | null; durationMin: number | null;
  isFreePreview: boolean;
  quiz: { id: string; passMarks: number; _count: { questions: number } } | null;
};
export type AdminOutline = {
  course: { id: string; slug: string; title: string };
  modules: {
    id: string; title: string; description: string | null; order: number;
    lessons: AdminOutlineLesson[];
  }[];
};
export const fetchAdminOutline = (courseId: string) =>
  api.get<AdminOutline>(`/api/player/admin/courses/${courseId}/outline`);

export const adminOutlineQuery = (courseId: string) =>
  queryOptions({ queryKey: ["admin", "outline", courseId], queryFn: () => fetchAdminOutline(courseId) });
