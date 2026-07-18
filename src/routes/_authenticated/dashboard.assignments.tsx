import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Inbox, Calendar as CalIcon } from "lucide-react";
import { GlassCard } from "@/components/dashboard/primitives";
import { assignmentsQuery, type AssignmentDto } from "@/lib/api/learning";

export const Route = createFileRoute("/_authenticated/dashboard/assignments")({
  head: () => ({ meta: [{ title: "এসাইনমেন্ট — Uniteacademy" }] }),
  loader: ({ context }) => (context as any).queryClient?.ensureQueryData(assignmentsQuery()),
  component: AssignmentsPage,
});

function AssignmentsPage() {
  const { data } = useSuspenseQuery(assignmentsQuery());
  const now = Date.now();
  const pending = data.assignments.filter((a) => (a.dueAt ? new Date(a.dueAt).getTime() >= now : true) && !a.submissions?.[0]);
  const past = data.assignments.filter((a) => a.dueAt && new Date(a.dueAt).getTime() < now);

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <h2 className="text-lg font-bold">পেন্ডিং এসাইনমেন্ট ({pending.length})</h2>
      {pending.length === 0 ? (
        <EmptyState label="কোন পেন্ডিং এসাইনমেন্ট নেই" />
      ) : (
        <div className="space-y-3">{pending.map((a) => <AssignmentRow key={a.id} a={a} />)}</div>
      )}
      {past.length > 0 && (
        <>
          <h2 className="pt-4 text-lg font-bold">পূর্ববর্তী এসাইনমেন্ট</h2>
          <div className="space-y-3">{past.map((a) => <AssignmentRow key={a.id} a={a} />)}</div>
        </>
      )}
    </div>
  );
}

function AssignmentRow({ a }: { a: AssignmentDto }) {
  const due = a.dueAt ? new Date(a.dueAt) : null;
  const sub = a.submissions?.[0];
  return (
    <GlassCard className="flex items-start justify-between gap-4 p-4">
      <div>
        <div className="text-xs font-semibold text-primary">{a.course.title}</div>
        <div className="mt-0.5 font-bold">{a.title}</div>
        {a.description && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{a.description}</p>}
        {due && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalIcon className="h-3.5 w-3.5" /> শেষ তারিখ: {due.toLocaleDateString("bn-BD")}
          </div>
        )}
      </div>
      <div className="text-right">
        <div className="text-sm font-bold">{a.points} পয়েন্ট</div>
        {sub ? (
          <div className="mt-1 text-xs text-emerald-600">
            {sub.status === "graded" ? `স্কোর: ${sub.score ?? 0}` : sub.status === "submitted" ? "জমা দেওয়া হয়েছে" : sub.status}
          </div>
        ) : (
          <div className="mt-1 text-xs text-amber-600">পেন্ডিং</div>
        )}
      </div>
    </GlassCard>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <GlassCard className="grid place-items-center py-12 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <Inbox className="h-7 w-7" />
      </span>
      <h3 className="mt-3 text-lg font-bold">{label}</h3>
    </GlassCard>
  );
}
