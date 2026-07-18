import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Check } from "lucide-react";
import { GlassCard } from "@/components/dashboard/primitives";
import { Button } from "@/components/ui/button";
import { notificationsQuery, markAllNotificationsRead, markNotificationRead } from "@/lib/api/learning";

export const Route = createFileRoute("/_authenticated/dashboard/notifications")({
  head: () => ({ meta: [{ title: "নোটিফিকেশন — Uniteacademy" }] }),
  loader: ({ context }) => (context as any).queryClient?.ensureQueryData(notificationsQuery()),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { data } = useSuspenseQuery(notificationsQuery());
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["dashboard", "notifications"] });

  if (data.notifications.length === 0) {
    return (
      <div className="mx-auto max-w-4xl">
        <GlassCard className="grid place-items-center py-12 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
            <Bell className="h-7 w-7" />
          </span>
          <h3 className="mt-3 text-lg font-bold">কোন নতুন নোটিফিকেশন নেই</h3>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-3">
      {data.unread > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">{data.unread}টি অপঠিত</div>
          <Button size="sm" variant="outline" onClick={() => markAllNotificationsRead().then(invalidate)}>
            <Check className="mr-1 h-4 w-4" /> সব পঠিত হিসেবে চিহ্নিত করুন
          </Button>
        </div>
      )}
      {data.notifications.map((n) => (
        <GlassCard key={n.id} className={`p-4 ${!n.readAt ? "border-primary/30 bg-primary/5" : ""}`}>
          <div className="mb-1 flex items-center justify-between gap-3">
            <div className="font-bold">{n.title}</div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString("bn-BD")}</span>
              {!n.readAt && (
                <button className="text-xs text-primary" onClick={() => markNotificationRead(n.id).then(invalidate)}>
                  পঠিত
                </button>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{n.body}</p>
          {n.link && <a href={n.link} className="mt-2 inline-block text-sm text-primary underline">বিস্তারিত দেখুন</a>}
        </GlassCard>
      ))}
    </div>
  );
}
