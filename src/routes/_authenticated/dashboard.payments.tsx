import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { GlassCard } from "@/components/dashboard/primitives";

export const Route = createFileRoute("/_authenticated/dashboard/payments")({
  head: () => ({ meta: [{ title: "পেমেন্ট হিস্টরি — Uniteacademy" }] }),
  component: () => (
    <div className="mx-auto max-w-4xl">
      <GlassCard className="grid place-items-center py-12 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
          <Wallet className="h-7 w-7" />
        </span>
        <h3 className="mt-3 text-lg font-bold">কোন পেমেন্ট রেকর্ড নেই</h3>
      </GlassCard>
    </div>
  ),
});
