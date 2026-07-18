import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, Trophy, XCircle } from "lucide-react";
import {
  lessonQuery, outlineQuery, quizQuery, saveProgress, submitQuiz,
} from "@/lib/api/player";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/learn/$courseSlug/$lessonId")({
  ssr: false,
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData(lessonQuery(params.lessonId)),
  component: LessonViewer,
  errorComponent: ({ error }) => (
    <Card className="p-6 text-destructive">{error.message}</Card>
  ),
});

function LessonViewer() {
  const { courseSlug, lessonId } = Route.useParams();
  const { data } = useSuspenseQuery(lessonQuery(lessonId));
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [marking, setMarking] = useState(false);

  const lesson = data.lesson;

  async function invalidate() {
    await qc.invalidateQueries({ queryKey: ["player", "outline", courseSlug] });
    await qc.invalidateQueries({ queryKey: ["player", "lesson", lessonId] });
  }

  async function markComplete() {
    setMarking(true);
    try {
      await saveProgress(lessonId, { status: "completed" });
      await invalidate();
      toast.success("পাঠ সম্পন্ন হয়েছে");
      if (data.next) {
        navigate({ to: "/learn/$courseSlug/$lessonId", params: { courseSlug, lessonId: data.next.id } });
      }
    } catch (e: any) {
      toast.error(e.message ?? "Failed");
    } finally {
      setMarking(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline" className="capitalize">{lesson.kind}</Badge>
        {lesson.durationMin ? <span>{lesson.durationMin} মিনিট</span> : null}
      </div>

      <h1 className="text-2xl font-bold sm:text-3xl">{lesson.title}</h1>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
        {lesson.kind === "video" ? (
          <VideoPane lessonId={lessonId} url={lesson.contentUrl} />
        ) : lesson.kind === "pdf" ? (
          <PdfPane url={lesson.contentUrl} />
        ) : lesson.kind === "text" ? (
          <div className="prose prose-slate max-w-none p-6 dark:prose-invert">
            <div className="whitespace-pre-wrap leading-relaxed">{lesson.body || "কোনো কনটেন্ট নেই।"}</div>
          </div>
        ) : lesson.kind === "quiz" ? (
          <QuizPane lessonId={lessonId} onPassed={invalidate} />
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex gap-2">
          {data.prev ? (
            <Button variant="outline" size="sm" asChild>
              <Link to="/learn/$courseSlug/$lessonId" params={{ courseSlug, lessonId: data.prev.id }}>
                <ChevronLeft className="mr-1 h-4 w-4" /> পূর্ববর্তী
              </Link>
            </Button>
          ) : <div />}
        </div>
        <div className="flex gap-2">
          {lesson.kind !== "quiz" && (
            <Button size="sm" onClick={markComplete} disabled={marking}>
              {marking ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-1 h-4 w-4" />}
              সম্পন্ন হিসেবে চিহ্নিত করুন
            </Button>
          )}
          {data.next ? (
            <Button size="sm" variant="secondary" asChild>
              <Link to="/learn/$courseSlug/$lessonId" params={{ courseSlug, lessonId: data.next.id }}>
                পরবর্তী <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ─────────────── Video pane with throttled progress save ─────────────
function VideoPane({ lessonId, url }: { lessonId: string; url: string | null }) {
  const ref = useRef<HTMLVideoElement>(null);
  const lastSave = useRef(0);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const onTime = () => {
      const sec = Math.floor(v.currentTime);
      if (sec - lastSave.current >= 10) {
        lastSave.current = sec;
        saveProgress(lessonId, { watchedSeconds: sec, status: "in_progress" }).catch(() => null);
      }
    };
    const onEnd = () => {
      saveProgress(lessonId, { watchedSeconds: Math.floor(v.duration || 0), status: "completed" })
        .catch(() => null);
    };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnd);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnd);
    };
  }, [lessonId]);

  if (!url) return <div className="p-12 text-center text-muted-foreground">ভিডিও URL সেট করা হয়নি।</div>;
  return (
    <video
      ref={ref}
      src={url}
      controls
      className="aspect-video w-full bg-black"
    />
  );
}

function PdfPane({ url }: { url: string | null }) {
  if (!url) return <div className="p-12 text-center text-muted-foreground">PDF URL সেট করা হয়নি।</div>;
  return (
    <iframe
      src={url}
      title="PDF"
      className="h-[70vh] w-full"
    />
  );
}

// ─────────────── Quiz pane ─────────────
function QuizPane({ lessonId, onPassed }: { lessonId: string; onPassed: () => void }) {
  const { data, isLoading, error } = useQuizWithQuery(lessonId);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<Awaited<ReturnType<typeof submitQuiz>> | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isLoading) return <div className="p-12 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></div>;
  if (error) return <div className="p-6 text-destructive">{(error as Error).message}</div>;
  if (!data) return null;

  const quiz = data.quiz;

  async function submit() {
    if (Object.keys(answers).length !== quiz.questions.length) {
      toast.error("সব প্রশ্নের উত্তর দিন");
      return;
    }
    setSubmitting(true);
    try {
      const r = await submitQuiz(lessonId, answers);
      setResult(r);
      if (r.attempt.passed) {
        toast.success(`পাশ! স্কোর: ${r.attempt.percent}%`);
        onPassed();
      } else {
        toast.error(`ফেইল। স্কোর: ${r.attempt.percent}%`);
      }
    } catch (e: any) {
      toast.error(e.message ?? "Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="space-y-4 p-6">
        <div className={`flex items-center gap-3 rounded-2xl border p-5 ${result.attempt.passed ? "border-emerald-500/40 bg-emerald-500/5" : "border-destructive/40 bg-destructive/5"}`}>
          {result.attempt.passed ? <Trophy className="h-10 w-10 text-emerald-500" /> : <XCircle className="h-10 w-10 text-destructive" />}
          <div>
            <div className="text-lg font-bold">
              {result.attempt.passed ? "অভিনন্দন! পাশ করেছেন" : "আরেকবার চেষ্টা করুন"}
            </div>
            <div className="text-sm text-muted-foreground">
              স্কোর: {result.attempt.score}/{result.attempt.totalMarks} ({result.attempt.percent}%)
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {quiz.questions.map((q, i) => {
            const given = answers[q.id];
            const rev = result.review[q.id];
            return (
              <div key={q.id} className="rounded-xl border border-border/60 p-4">
                <div className="mb-2 flex gap-2 text-sm font-medium">
                  <span className="text-muted-foreground">{i + 1}.</span>
                  <span>{q.prompt}</span>
                </div>
                <div className="space-y-1.5">
                  {q.options.map((opt, oi) => {
                    const isCorrect = oi === rev.correctIndex;
                    const isGiven = oi === given;
                    return (
                      <div
                        key={oi}
                        className={`rounded-lg px-3 py-2 text-sm ${
                          isCorrect ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" :
                          isGiven && !isCorrect ? "bg-destructive/10 text-destructive" :
                          "bg-muted/40"
                        }`}
                      >
                        {opt} {isCorrect && "✓"} {isGiven && !isCorrect && "✗"}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <Button onClick={() => { setResult(null); setAnswers({}); }}>আবার চেষ্টা করুন</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">{quiz.title}</div>
          <div className="text-xs text-muted-foreground">পাশ মার্ক: {quiz.passMarks}% • প্রশ্ন সংখ্যা: {quiz.questions.length}</div>
        </div>
        {data.lastAttempt && (
          <Badge variant={data.lastAttempt.passed ? "default" : "secondary"}>
            শেষ চেষ্টা: {Math.round((data.lastAttempt.score / (data.lastAttempt.totalMarks || 1)) * 100)}%
          </Badge>
        )}
      </div>
      <div className="space-y-4">
        {quiz.questions.map((q, i) => (
          <div key={q.id} className="rounded-xl border border-border/60 p-4">
            <div className="mb-3 flex gap-2 text-sm font-medium">
              <span className="text-muted-foreground">{i + 1}.</span>
              <span>{q.prompt}</span>
            </div>
            <div className="space-y-2">
              {q.options.map((opt, oi) => (
                <label
                  key={oi}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors ${
                    answers[q.id] === oi ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                  }`}
                >
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === oi}
                    onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                    className="h-4 w-4"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Button onClick={submit} disabled={submitting} className="w-full sm:w-auto">
        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        উত্তর জমা দিন
      </Button>
    </div>
  );
}

function useQuizWithQuery(lessonId: string) {
  // dynamic import to avoid re-declaring; simple useQuery hook
  const { useQuery } = require("@tanstack/react-query") as typeof import("@tanstack/react-query");
  return useQuery(quizQuery(lessonId));
}
