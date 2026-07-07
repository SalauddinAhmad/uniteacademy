import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Calendar,
  ChevronRight,
  Star,
  BookOpen,
  ListChecks,
  Target,
  Trophy,
  Lock,
  ArrowRight,
} from "lucide-react";
import { courseDetailQuery } from "@/lib/dashboard-queries";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CoverThumb,
  GlassCard,
  MiniProgress,
  ProgressRing,
} from "@/components/dashboard/primitives";

export const Route = createFileRoute("/_authenticated/dashboard/enrollments/$id")({
  head: () => ({ meta: [{ title: "কোর্স — Uniteacademy" }] }),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(courseDetailQuery(params.id)),
  component: CourseDetailPage,
});

function formatDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function CourseDetailPage() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(courseDetailQuery(id));
  const p = data.program;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/dashboard/enrollments" className="hover:text-foreground">
          আমার কোর্স
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{p.batchLabel ?? p.titleBn}</span>
      </div>

      {/* header */}
      <GlassCard className="grid gap-6 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-4 sm:flex-row">
          <CoverThumb title={p.titleBn} src={p.coverUrl} className="h-28 w-28 shrink-0" />
          <div className="min-w-0 space-y-3">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">{p.titleBn}</h1>
              {p.batchLabel && (
                <p className="text-xs font-semibold text-muted-foreground">{p.batchLabel}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {p.titleEn && (
                <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-foreground/80">
                  {p.titleEn}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {data.teachers.slice(0, 6).map((t) => (
                <span
                  key={t.name}
                  className="inline-flex items-center gap-2 rounded-full bg-muted/60 py-1 pl-1 pr-3 text-[11px] font-semibold"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                    {t.initials}
                  </span>
                  {t.name}
                </span>
              ))}
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(p.startsAt)} – {formatDate(p.endsAt)}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 sm:items-end">
          <ProgressRing
            value={p.progressPct}
            size={110}
            label={
              <div className="text-center">
                <div className="text-lg font-extrabold leading-none">{p.progressPct}%</div>
                <div className="text-[10px] font-medium text-muted-foreground">অগ্রগতি</div>
              </div>
            }
          />
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-xl gradient-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow shadow-primary/25 hover:-translate-y-0.5">
              ▶ শেখা চালিয়ে যান
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background/60 px-3.5 py-2 text-xs font-semibold hover:bg-background">
              <Star className="h-3.5 w-3.5" /> রিভিউ
            </button>
          </div>
          {p.isBehind && (
            <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-semibold text-accent">
              📉 পিছিয়ে আছেন
            </span>
          )}
          <span className="text-[11px] font-medium text-muted-foreground">
            🎓 ভর্তি {formatDate(p.enrolledAt)}
          </span>
        </div>
      </GlassCard>

      {/* info banner */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm">
        📌 আপনি এই প্রোগ্রামের একটি অংশে অ্যাক্সেস পেয়েছেন — আপনার অগ্রগতি ও পরিসংখ্যান শুধু কেনা কনটেন্ট অনুযায়ী গণনা করা হয়েছে।
      </div>

      {/* 4-stat row */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatBlock
          icon={BookOpen}
          label="সম্পন্ন লেসন"
          numer={data.stats.lessonsCompleted}
          denom={data.stats.lessonsTotal}
        />
        <StatBlock
          icon={ListChecks}
          label="সম্পন্ন কুইজ ও অ্যাসাইনমেন্ট"
          numer={data.stats.quizzesCompleted}
          denom={data.stats.quizzesTotal}
        />
        <StatBlock icon={Target} label="কুইজ ও অ্যা. গড় স্কোর" pct={data.stats.avgScorePct} />
        <StatBlock icon={Trophy} label="কুইজ ও অ্যা. সেরা স্কোর" pct={data.stats.bestScorePct} />
      </div>

      {/* semester accordion */}
      <Accordion type="multiple" defaultValue={data.semesters.filter((s) => !s.isLocked).map((s) => s.id)}>
        {data.semesters.map((sem) => (
          <AccordionItem key={sem.id} value={sem.id} className="mb-3 rounded-2xl border border-border bg-card/85">
            <AccordionTrigger className="px-5 py-4 hover:no-underline">
              <div className="flex w-full items-center gap-3">
                {sem.isLocked ? (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <span className="grid h-6 w-6 place-items-center rounded bg-primary/15 text-[10px] font-bold text-primary">
                    ⚑
                  </span>
                )}
                <div className="flex-1 text-left">
                  <div className="text-sm font-bold">{sem.label}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {sem.isLocked ? "Access restricted · " : ""}
                    {formatDate(sem.startsOn)} - {formatDate(sem.endsOn)}
                  </div>
                </div>
                <div className="hidden w-40 items-center gap-2 sm:flex">
                  <MiniProgress value={sem.progressPct} className="flex-1" />
                  <span className="text-xs font-bold">{sem.progressPct}%</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
              {sem.isLocked ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  🔒 এই সেমিস্টার এখনো লক করা রয়েছে।
                </p>
              ) : (
                <div className="divide-y divide-border/60">
                  <div className="grid grid-cols-[1fr_10rem_6rem_2rem] gap-3 px-1 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <span>আইটেমের নাম</span>
                    <span>প্রগ্রেস</span>
                    <span></span>
                    <span></span>
                  </div>
                  {sem.items.map((it) => (
                    <div
                      key={it.courseId}
                      className="grid grid-cols-[1fr_10rem_6rem_2rem] items-center gap-3 px-1 py-3 text-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <CoverThumb title={it.titleBn} src={it.coverUrl} className="h-9 w-9 shrink-0" />
                        <div className="min-w-0">
                          <div className="truncate font-semibold">{it.titleBn}</div>
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">U</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MiniProgress value={it.progressPct} className="flex-1" />
                        <span className="text-xs font-bold">{it.progressPct}%</span>
                      </div>
                      <span className="justify-self-start rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        কোর্স
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function StatBlock({
  icon: Icon,
  label,
  numer,
  denom,
  pct,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  numer?: number;
  denom?: number;
  pct?: number;
}) {
  const value = pct ?? (denom ? Math.round((numer! / denom) * 100) : 0);
  return (
    <GlassCard>
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
          <Icon className="h-4 w-4" strokeWidth={2.4} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-lg font-extrabold leading-none">
            {pct != null ? `${pct}%` : `${numer}/${denom}`}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">{label}</div>
        </div>
      </div>
      <div className="mt-3">
        <MiniProgress value={value} />
      </div>
    </GlassCard>
  );
}
