import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Radio,
  ListChecks,
  ClipboardCheck,
  ArrowRight,
  X,
  CalendarClock,
  Star,
} from "lucide-react";
import { overviewQuery } from "@/lib/dashboard-queries";
import { GlassCard, ProgressRing, StatRow } from "@/components/dashboard/primitives";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  head: () => ({ meta: [{ title: "ওভারভিউ — Uniteacademy" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(overviewQuery()),
  component: OverviewPage,
});

function OverviewPage() {
  const { data } = useSuspenseQuery(overviewQuery());
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    setDismissed(localStorage.getItem("ua_welcome_dismissed") === "1");
  }, []);
  const dismiss = () => {
    localStorage.setItem("ua_welcome_dismissed", "1");
    setDismissed(true);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {!dismissed && (
        <div className="relative overflow-hidden rounded-2xl gradient-primary p-6 text-primary-foreground shadow-lg shadow-primary/25">
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                আসসালামু আলাইকুম, {data.profile.full_name ?? "শিক্ষার্থী"}!
              </h1>
              <p className="mt-1 text-sm text-primary-foreground/85">
                Uniteacademy তে আপনাকে স্বাগতম। আপনার শেখার যাত্রা শুরু করুন —{" "}
                <Link
                  to="/dashboard/enrollments"
                  className="font-semibold underline decoration-primary-foreground/40 underline-offset-4 hover:decoration-primary-foreground"
                >
                  কোর্সগুলো দেখুন →
                </Link>
              </p>
            </div>
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="grid h-8 w-8 place-items-center rounded-lg bg-white/15 text-primary-foreground hover:bg-white/25"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-accent/25 blur-3xl" />
        </div>
      )}

      {/* stat cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              পারফরম্যান্স
            </span>
          </div>
          <div className="mt-3 flex items-center justify-center">
            <ProgressRing value={data.performancePct} size={148} />
          </div>
        </GlassCard>

        <GlassCard>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            কোর্স স্ট্যাটাস
          </span>
          <div className="mt-4 space-y-3">
            <StatRow icon={BookOpen} label="মোট চলমান কোর্স" value={data.ongoingCourses} />
            <StatRow icon={CheckCircle2} label="কোর্স শেষ হয়েছে" value={data.finishedCourses} />
            <StatRow icon={Clock} label="সময় ব্যয় (মিনিট)" value={data.minutesSpent} />
          </div>
        </GlassCard>

        <GlassCard>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            অ্যাক্টিভিটি
          </span>
          <div className="mt-4 space-y-3">
            <StatRow icon={Radio} label="লাইভ ক্লাসে অংশগ্রহণ" value={data.liveAttended} />
            <StatRow icon={ListChecks} label="কুইজ সম্পন্ন" value={data.quizzesCompleted} tone="accent" />
            <StatRow icon={ClipboardCheck} label="অ্যাসাইনমেন্ট সম্পন্ন" value={data.assignmentsCompleted} />
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">আপকামিং ক্লাস</span>
            <Link to="/dashboard/calendar" className="text-xs font-semibold text-primary hover:underline">
              ক্যালেন্ডার দেখুন <ArrowRight className="ml-0.5 inline h-3 w-3" />
            </Link>
          </div>
          <div className="mt-8 flex flex-col items-center justify-center gap-2 py-8 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
              <CalendarClock className="h-6 w-6" />
            </span>
            <p className="text-sm text-muted-foreground">কোন আসন্ন ক্লাস নির্ধারিত নেই</p>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="relative">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent/15 text-accent shadow-inner">
                <Star className="h-7 w-7 fill-current" />
              </span>
              <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
                {data.streakDays}
              </span>
            </div>
            <p className="text-sm font-bold">{data.streakDays} দিন বিরতিহীন</p>
            <p className="text-[11px] text-muted-foreground">
              সর্বশেষ রেকর্ড হলো {data.streakDays} দিন বিরতিহীন
            </p>
            <div className="mt-2 flex w-full items-center justify-between px-1">
              {data.streakByDay.map((d) => (
                <div key={d.day} className="flex flex-col items-center gap-1">
                  <Star
                    className={
                      d.done
                        ? "h-4 w-4 fill-accent text-accent"
                        : "h-4 w-4 fill-muted stroke-muted-foreground/50 text-muted"
                    }
                  />
                  <span className="text-[10px] font-semibold text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
