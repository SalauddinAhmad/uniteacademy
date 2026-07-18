import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CalendarDays } from "lucide-react";
import { GlassCard } from "@/components/dashboard/primitives";
import { eventsQuery, type EventDto } from "@/lib/api/learning";

export const Route = createFileRoute("/_authenticated/dashboard/calendar")({
  head: () => ({ meta: [{ title: "ক্যালেন্ডার — Uniteacademy" }] }),
  loader: ({ context }) => (context as any).queryClient?.ensureQueryData(eventsQuery()),
  component: CalendarPage,
});

function CalendarPage() {
  const { data } = useSuspenseQuery(eventsQuery());
  // Group events by date (YYYY-MM-DD)
  const groups = new Map<string, EventDto[]>();
  for (const ev of data.events) {
    const key = new Date(ev.startAt).toISOString().slice(0, 10);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(ev);
  }
  const sorted = Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));

  if (sorted.length === 0) {
    return (
      <div className="mx-auto max-w-4xl">
        <GlassCard className="grid place-items-center py-12 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
            <CalendarDays className="h-7 w-7" />
          </span>
          <h3 className="mt-3 text-lg font-bold">ক্যালেন্ডারে কিছু নেই</h3>
          <p className="text-sm text-muted-foreground">আপনার ক্লাস, এক্সাম ও ইভেন্ট এক ক্যালেন্ডারে দেখা যাবে।</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {sorted.map(([date, evs]) => (
        <div key={date}>
          <div className="mb-2 text-sm font-bold text-primary">
            {new Date(date).toLocaleDateString("bn-BD", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
          <div className="space-y-2">
            {evs.map((e) => (
              <GlassCard key={e.id} className="flex items-start justify-between gap-3 p-3">
                <div>
                  <div className="font-medium">{e.title}</div>
                  {e.course && <div className="text-xs text-muted-foreground">{e.course.title}</div>}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(e.startAt).toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
