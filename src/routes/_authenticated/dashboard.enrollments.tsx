import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Radio, PlayCircle } from "lucide-react";
import { myCoursesQuery } from "@/lib/dashboard-queries";
import { CoverThumb, GlassCard, MiniProgress } from "@/components/dashboard/primitives";
import type { CourseCardDto } from "@/lib/dashboard-queries";

export const Route = createFileRoute("/_authenticated/dashboard/enrollments")({
  head: () => ({ meta: [{ title: "আমার কোর্স — Uniteacademy" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(myCoursesQuery()),
  component: EnrollmentsLayout,
});

function EnrollmentsLayout() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  // If child route active (:id or view-all), render outlet; else list
  if (path !== "/dashboard/enrollments") return <Outlet />;
  return <EnrollmentsList />;
}

function EnrollmentsList() {
  const { data } = useSuspenseQuery(myCoursesQuery());

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {data.program && (
        <section>
          <h2 className="mb-3 text-sm font-bold text-foreground/80">ডিপ্লোমা প্রোগ্রাম</h2>
          <GlassCard className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            <CoverThumb
              title={data.program.titleBn}
              src={data.program.coverUrl}
              className="h-32 w-full shrink-0 sm:h-28 sm:w-48"
            />
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {data.program.batchLabel && (
                  <span className="rounded-md bg-primary/12 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    {data.program.batchLabel}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold">{data.program.titleBn}</h3>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-muted-foreground">Progress</span>
                <MiniProgress value={data.program.progressPct} className="flex-1" />
                <span className="text-xs font-bold">{data.program.progressPct}%</span>
              </div>
            </div>
            <Link
              to="/dashboard/enrollments/$id"
              params={{ id: data.program.enrollmentId }}
              className="inline-flex items-center gap-1.5 self-start rounded-xl gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow shadow-primary/25 transition hover:-translate-y-0.5 sm:self-center"
            >
              কোর্স চালিয়ে যান <ArrowRight className="h-4 w-4" />
            </Link>
          </GlassCard>
        </section>
      )}

      {data.courses.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-bold text-foreground/80">কোর্সসমূহ</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {data.courses.map((c) => (
              <CourseProgressCard key={c.id} c={c} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground/80">আপনার জন্য আরও কোর্স</h2>
          <Link to="/dashboard/enrollments" className="text-xs font-semibold text-primary hover:underline">
            আরও দেখুন <ArrowRight className="ml-0.5 inline h-3 w-3" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.recommended.map((c) => (
            <RecommendedCard key={c.id} c={c} />
          ))}
        </div>
      </section>
    </div>
  );
}

function CourseProgressCard({ c }: { c: CourseCardDto }) {
  return (
    <GlassCard className="flex flex-col">
      <CoverThumb title={c.titleBn} src={c.coverUrl} className="h-40 w-full" />
      <div className="pt-4">
        <h3 className="font-bold">{c.titleBn}</h3>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground">Progress</span>
          <MiniProgress value={c.progressPct ?? 0} className="flex-1" />
          <span className="text-xs font-bold">{c.progressPct ?? 0}%</span>
        </div>
        <button className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/15">
          কোর্স চালিয়ে যান <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </GlassCard>
  );
}

const categoryLabels: Record<CourseCardDto["category"], string> = {
  diploma: "Diploma",
  talimul_quran: "Talimul Quran",
  free: "Free Courses",
  teacher_training: "Teacher's Training",
};

function RecommendedCard({ c }: { c: CourseCardDto }) {
  return (
    <GlassCard className="flex flex-col p-0">
      <div className="relative">
        <CoverThumb title={c.titleBn} src={c.coverUrl} className="h-40 w-full rounded-b-none" />
        <span className="absolute left-3 top-3 rounded-md bg-primary/90 px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
          {categoryLabels[c.category]}
        </span>
        <span
          className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
            c.type === "live"
              ? "bg-emerald-500 text-white"
              : "bg-destructive/90 text-destructive-foreground"
          }`}
        >
          {c.type === "live" ? <Radio className="h-3 w-3" /> : <PlayCircle className="h-3 w-3" />}
          {c.type === "live" ? "Live" : "Recorded"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold text-muted-foreground">
          {c.durationMinutes} মিনিট
        </p>
        <h3 className="mt-1 line-clamp-2 font-bold">{c.titleBn}</h3>
        {c.description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.description}</p>
        )}
        <div className="mt-auto pt-3">
          <button className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            আরও দেখুন <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
