import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { GlassCard } from "@/components/dashboard/primitives";

export const Route = createFileRoute("/_authenticated/dashboard/exams")({
  head: () => ({ meta: [{ title: "এক্সাম — Uniteacademy" }] }),
  component: () => (
    <div className="mx-auto max-w-4xl">
      <GlassCard className="grid place-items-center py-12 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
          <GraduationCap className="h-7 w-7" />
        </span>
        <h3 className="mt-3 text-lg font-bold">কোন এক্সাম নির্ধারিত নেই</h3>
        <p className="text-sm text-muted-foreground">নতুন পরীক্ষা এলে এখানে দেখতে পাবেন।</p>
      </GlassCard>
    </div>
  ),
});
