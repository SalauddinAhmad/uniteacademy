import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { GraduationCap, Clock } from "lucide-react";
import { GlassCard } from "@/components/dashboard/primitives";
import { examsQuery } from "@/lib/api/learning";

export const Route = createFileRoute("/_authenticated/dashboard/exams")({
  head: () => ({ meta: [{ title: "এক্সাম — Uniteacademy" }] }),
  loader: ({ context }) => (context as any).queryClient?.ensureQueryData(examsQuery()),
  component: ExamsPage,
});

function ExamsPage() {
  const { data } = useSuspenseQuery(examsQuery());
  if (data.exams.length === 0) {
    return (
      <div className="mx-auto max-w-4xl">
        <GlassCard className="grid place-items-center py-12 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
            <GraduationCap className="h-7 w-7" />
          </span>
          <h3 className="mt-3 text-lg font-bold">কোন এক্সাম নির্ধারিত নেই</h3>
          <p className="text-sm text-muted-foreground">নতুন পরীক্ষা এলে এখানে দেখতে পাবেন।</p>
        </GlassCard>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-4xl space-y-3">
      {data.exams.map((e) => {
        const d = new Date(e.scheduledAt);
        return (
          <GlassCard key={e.id} className="flex items-start justify-between gap-4 p-4">
            <div>
              <div className="text-xs font-semibold text-primary">{e.course.title}</div>
              <div className="mt-0.5 font-bold">{e.title}</div>
              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                <span>{d.toLocaleString("bn-BD")}</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {e.durationMin} মিনিট</span>
              </div>
            </div>
            <div className="text-right text-sm font-bold">মোট {e.totalMarks}</div>
          </GlassCard>
        );
      })}
    </div>
  );
}
