import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { outlineQuery } from "@/lib/api/player";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, PlayCircle, FileText, HelpCircle, Lock, ArrowLeft, BookOpen } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated/learn/$courseSlug")({
  ssr: false,
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData(outlineQuery(params.courseSlug)),
  component: LearnLayout,
  errorComponent: ({ error }) => (
    <div className="p-8 text-destructive">{error.message}</div>
  ),
});

function iconFor(kind: string, done: boolean, locked: boolean) {
  if (locked) return <Lock className="h-4 w-4 text-muted-foreground" />;
  if (done) return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  if (kind === "quiz") return <HelpCircle className="h-4 w-4 text-primary" />;
  if (kind === "pdf" || kind === "text") return <FileText className="h-4 w-4 text-primary" />;
  return <PlayCircle className="h-4 w-4 text-primary" />;
}

function LearnLayout() {
  const { courseSlug } = Route.useParams();
  const { data } = useSuspenseQuery(outlineQuery(courseSlug));
  const navigate = useNavigate();

  // If landed on layout without lesson param, redirect to first accessible lesson
  const firstLesson = data.modules.flatMap((m) => m.lessons).find((l) => !l.locked);
  useEffect(() => {
    const path = window.location.pathname;
    if (path === `/learn/${courseSlug}` && firstLesson) {
      navigate({
        to: "/learn/$courseSlug/$lessonId",
        params: { courseSlug, lessonId: firstLesson.id },
        replace: true,
      });
    }
  }, [courseSlug, firstLesson, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/courses/$slug"
              params={{ slug: courseSlug }}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> ফিরে যান
            </Link>
            <div className="hidden h-4 w-px bg-border sm:block" />
            <BookOpen className="hidden h-4 w-4 text-primary sm:block" />
            <div className="truncate text-sm font-semibold">{data.course.title}</div>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <div className="text-xs text-muted-foreground">
              {data.progress.completedLessons}/{data.progress.totalLessons} lessons
            </div>
            <div className="w-40">
              <Progress value={data.progress.percent} className="h-2" />
            </div>
            <Badge variant="secondary" className="tabular-nums">{data.progress.percent}%</Badge>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[320px_1fr]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-[68px] lg:h-[calc(100vh-88px)] lg:overflow-y-auto rounded-2xl border border-border/60 bg-card">
          <div className="p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              পাঠ্যসূচী
            </div>
          </div>
          <div className="space-y-1 px-2 pb-4">
            {data.modules.map((m, mi) => (
              <div key={m.id} className="rounded-xl">
                <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs text-primary">
                    {mi + 1}
                  </span>
                  <span className="truncate">{m.title}</span>
                </div>
                <div className="space-y-0.5 pl-3">
                  {m.lessons.map((l) => (
                    <Link
                      key={l.id}
                      to="/learn/$courseSlug/$lessonId"
                      params={{ courseSlug, lessonId: l.id }}
                      disabled={l.locked}
                      activeProps={{ className: "bg-primary/10 text-primary" }}
                      className={`flex items-start gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                        l.locked
                          ? "cursor-not-allowed opacity-60"
                          : "hover:bg-muted"
                      }`}
                    >
                      <span className="mt-0.5 shrink-0">{iconFor(l.kind, l.status === "completed", l.locked)}</span>
                      <span className="flex-1 truncate">{l.title}</span>
                      {l.durationMin ? (
                        <span className="shrink-0 text-[10px] text-muted-foreground">{l.durationMin}m</span>
                      ) : null}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            {data.modules.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                এই কোর্সে এখনো কোনো মডিউল যুক্ত হয়নি।
              </div>
            )}
          </div>
        </aside>

        {/* Content */}
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
