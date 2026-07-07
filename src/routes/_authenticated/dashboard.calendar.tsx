import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { GlassCard } from "@/components/dashboard/primitives";

export const Route = createFileRoute("/_authenticated/dashboard/calendar")({
  head: () => ({ meta: [{ title: "ক্যালেন্ডার — Uniteacademy" }] }),
  component: () => (
    <div className="mx-auto max-w-4xl">
      <GlassCard className="grid place-items-center py-12 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
          <CalendarDays className="h-7 w-7" />
        </span>
        <h3 className="mt-3 text-lg font-bold">ক্যালেন্ডার শীঘ্রই আসছে</h3>
        <p className="text-sm text-muted-foreground">আপনার ক্লাস, এক্সাম ও ইভেন্ট এক ক্যালেন্ডারে।</p>
      </GlassCard>
    </div>
  ),
});
