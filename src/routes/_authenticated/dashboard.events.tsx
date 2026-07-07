import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock } from "lucide-react";
import { GlassCard } from "@/components/dashboard/primitives";

export const Route = createFileRoute("/_authenticated/dashboard/events")({
  head: () => ({ meta: [{ title: "ইভেন্ট — Uniteacademy" }] }),
  component: () => (
    <div className="mx-auto max-w-4xl">
      <GlassCard className="grid place-items-center py-12 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
          <CalendarClock className="h-7 w-7" />
        </span>
        <h3 className="mt-3 text-lg font-bold">শীঘ্রই ইভেন্ট আসছে</h3>
      </GlassCard>
    </div>
  ),
});
