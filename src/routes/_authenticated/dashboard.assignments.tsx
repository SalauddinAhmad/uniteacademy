import { createFileRoute } from "@tanstack/react-router";
import { Inbox } from "lucide-react";
import { GlassCard } from "@/components/dashboard/primitives";

export const Route = createFileRoute("/_authenticated/dashboard/assignments")({
  head: () => ({ meta: [{ title: "এসাইনমেন্ট — Uniteacademy" }] }),
  component: () => (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex gap-2">
        <TabPill label="পেন্ডিং এসাইনমেন্ট" active />
        <TabPill label="পূর্ববর্তী এসাইনমেন্ট" />
        <TabPill label="প্রকাশিত ফলাফল" />
      </div>
      <GlassCard className="grid place-items-center py-12 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
          <Inbox className="h-7 w-7" />
        </span>
        <h3 className="mt-3 text-lg font-bold">কোন পেন্ডিং এসাইনমেন্ট নেই</h3>
        <p className="text-sm text-muted-foreground">এই মুহূর্তে কোনো পেন্ডিং এসাইনমেন্ট নেই।</p>
      </GlassCard>
    </div>
  ),
});

function TabPill({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
        active
          ? "bg-primary/15 text-primary ring-1 ring-primary/25"
          : "text-muted-foreground hover:bg-muted"
      }`}
    >
      {label}
    </button>
  );
}
