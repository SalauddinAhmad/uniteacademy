import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { AdminPageHeader } from "@/components/admin/shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { adminNotificationsQuery, createNotification } from "@/lib/api/admin-learning";
import { adminUsersQuery } from "@/lib/api/admin";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/admin/notifications")({
  loader: ({ context }) => {
    const c = (context as any).queryClient;
    c?.ensureQueryData(adminNotificationsQuery());
    c?.ensureQueryData(adminUsersQuery());
  },
  component: NotificationsAdmin,
});

function NotificationsAdmin() {
  const { data } = useSuspenseQuery(adminNotificationsQuery());
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="Notifications"
        description="Send targeted notifications to individual users"
        actions={<Button onClick={() => setOpen(true)}><Plus className="mr-1 h-4 w-4" /> Send</Button>}
      />

      {data.notifications.length === 0 ? (
        <Card className="border-dashed p-12 text-center text-muted-foreground">No notifications sent yet.</Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="p-3 text-left">Recipient</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Body</th>
                <th className="p-3 text-left">Sent</th>
                <th className="p-3 text-left">Read</th>
              </tr>
            </thead>
            <tbody>
              {data.notifications.map((n) => (
                <tr key={n.id} className="border-b last:border-0">
                  <td className="p-3">
                    <div className="font-medium">{n.user.fullName}</div>
                    <div className="text-xs text-muted-foreground">{n.user.email}</div>
                  </td>
                  <td className="p-3 font-medium">{n.title}</td>
                  <td className="p-3 text-muted-foreground line-clamp-2 max-w-md">{n.body}</td>
                  <td className="p-3 text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString("bn-BD")}</td>
                  <td className="p-3 text-xs">{n.readAt ? <span className="text-emerald-600">✓ Read</span> : <span className="text-amber-600">Unread</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <SendDialog open={open} setOpen={setOpen} onSent={() => qc.invalidateQueries({ queryKey: ["admin", "notifications"] })} />
    </div>
  );
}

function SendDialog({ open, setOpen, onSent }: { open: boolean; setOpen: (o: boolean) => void; onSent: () => void }) {
  const { data: users } = useSuspenseQuery(adminUsersQuery());
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");

  const send = useMutation({
    mutationFn: () => createNotification({ userId, title, body, link: link || undefined }),
    onSuccess: () => { toast.success("Notification sent"); setOpen(false); setTitle(""); setBody(""); setLink(""); setUserId(""); onSent(); },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader><DialogTitle>Send notification</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value="">— Select user —</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.fullName} ({u.email})</option>)}
          </select>
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Body" rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
          <Input placeholder="Link (optional)" value={link} onChange={(e) => setLink(e.target.value)} />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => send.mutate()} disabled={!userId || !title || !body || send.isPending}>
            {send.isPending ? "Sending..." : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
