import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Megaphone } from "lucide-react";
import { GlassCard } from "@/components/dashboard/primitives";
import { noticesQuery } from "@/lib/api/learning";

export const Route = createFileRoute("/_authenticated/dashboard/notice")({
  head: () => ({ meta: [{ title: "নোটিশ বোর্ড — Uniteacademy" }] }),
  loader: ({ context }) => (context as any).queryClient?.ensureQueryData(noticesQuery()),
  component: NoticePage,
});

function NoticePage() {
  const { data } = useSuspenseQuery(noticesQuery());
  if (data.notices.length === 0) {
    return (
      <div className="mx-auto max-w-4xl">
        <GlassCard className="grid place-items-center py-12 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
            <Megaphone className="h-7 w-7" />
          </span>
          <h3 className="mt-3 text-lg font-bold">কোন নোটিশ নেই</h3>
        </GlassCard>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-4xl space-y-3">
      {data.notices.map((n) => (
        <GlassCard key={n.id} className="p-4">
          <div className="mb-1 flex items-center justify-between gap-3">
            <div className="font-bold">{n.title}</div>
            <div className="text-xs text-muted-foreground">{new Date(n.publishedAt).toLocaleDateString("bn-BD")}</div>
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{n.body}</p>
        </GlassCard>
      ))}
    </div>
  );
}
