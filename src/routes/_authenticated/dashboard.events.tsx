import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CalendarClock } from "lucide-react";
import { GlassCard } from "@/components/dashboard/primitives";
import { eventsQuery } from "@/lib/api/learning";

export const Route = createFileRoute("/_authenticated/dashboard/events")({
  head: () => ({ meta: [{ title: "ইভেন্ট — Uniteacademy" }] }),
  loader: ({ context }) => (context as any).queryClient?.ensureQueryData(eventsQuery()),
  component: EventsPage,
});

const kindLabel: Record<string, string> = {
  class_session: "লাইভ ক্লাস",
  exam: "এক্সাম",
  holiday: "ছুটি",
  other: "ইভেন্ট",
};

function EventsPage() {
  const { data } = useSuspenseQuery(eventsQuery());
  if (data.events.length === 0) {
    return (
      <div className="mx-auto max-w-4xl">
        <GlassCard className="grid place-items-center py-12 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
            <CalendarClock className="h-7 w-7" />
          </span>
          <h3 className="mt-3 text-lg font-bold">শীঘ্রই ইভেন্ট আসছে</h3>
        </GlassCard>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-4xl space-y-3">
      {data.events.map((e) => (
        <GlassCard key={e.id} className="flex items-start justify-between gap-4 p-4">
          <div>
            <div className="text-xs font-semibold text-primary">{kindLabel[e.kind]}{e.course ? ` · ${e.course.title}` : ""}</div>
            <div className="mt-0.5 font-bold">{e.title}</div>
            {e.description && <p className="mt-1 text-sm text-muted-foreground">{e.description}</p>}
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <div>{new Date(e.startAt).toLocaleDateString("bn-BD")}</div>
            <div>{new Date(e.startAt).toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" })}</div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
