import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { AdminPageHeader } from "@/components/admin/shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { adminNoticesQuery, createNotice, updateNotice, deleteNotice, type AdminNotice } from "@/lib/api/admin-learning";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/admin/notices")({
  loader: ({ context }) => (context as any).queryClient?.ensureQueryData(adminNoticesQuery()),
  component: NoticesAdmin,
});

const audienceLabel: Record<AdminNotice["audience"], string> = {
  all: "সবাই", students: "ছাত্র", teachers: "শিক্ষক",
};

function NoticesAdmin() {
  const { data } = useSuspenseQuery(adminNoticesQuery());
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", "notices"] });
  const [editing, setEditing] = useState<AdminNotice | null>(null);
  const [open, setOpen] = useState(false);

  const del = useMutation({
    mutationFn: deleteNotice,
    onSuccess: () => { toast.success("Notice deleted"); invalidate(); },
  });

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="Notices"
        description="Publish notice board announcements"
        actions={
          <Button onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="mr-1 h-4 w-4" /> New notice
          </Button>
        }
      />

      {data.notices.length === 0 ? (
        <Card className="border-dashed p-12 text-center text-muted-foreground">No notices yet.</Card>
      ) : (
        <div className="space-y-3">
          {data.notices.map((n) => (
            <Card key={n.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-bold">{n.title}</div>
                    <Badge variant="outline">{audienceLabel[n.audience]}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">{n.body}</p>
                  <div className="mt-2 text-xs text-muted-foreground">{new Date(n.publishedAt).toLocaleString("bn-BD")}</div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => { setEditing(n); setOpen(true); }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => { if (confirm("Delete?")) del.mutate(n.id); }}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <NoticeDialog open={open} setOpen={setOpen} editing={editing} onSaved={invalidate} />
    </div>
  );
}

function NoticeDialog({ open, setOpen, editing, onSaved }: { open: boolean; setOpen: (o: boolean) => void; editing: AdminNotice | null; onSaved: () => void }) {
  const [title, setTitle] = useState(editing?.title ?? "");
  const [body, setBody] = useState(editing?.body ?? "");
  const [audience, setAudience] = useState<AdminNotice["audience"]>(editing?.audience ?? "all");

  // reset when editing changes
  useState(() => { setTitle(editing?.title ?? ""); setBody(editing?.body ?? ""); setAudience(editing?.audience ?? "all"); return 0; });

  const save = useMutation({
    mutationFn: async () => {
      if (editing) await updateNotice(editing.id, { title, body, audience });
      else await createNotice({ title, body, audience });
    },
    onSuccess: () => { toast.success(editing ? "Notice updated" : "Notice created"); setOpen(false); onSaved(); },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) { setTitle(editing?.title ?? ""); setBody(editing?.body ?? ""); setAudience(editing?.audience ?? "all"); } }}>
      <DialogContent>
        <DialogHeader><DialogTitle>{editing ? "Edit notice" : "New notice"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Body" rows={5} value={body} onChange={(e) => setBody(e.target.value)} />
          <div className="flex gap-2">
            {(["all", "students", "teachers"] as const).map((a) => (
              <Button key={a} type="button" variant={audience === a ? "default" : "outline"} size="sm" onClick={() => setAudience(a)}>
                {audienceLabel[a]}
              </Button>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => save.mutate()} disabled={!title || !body || save.isPending}>
            {save.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// hidden trigger element to satisfy import
export const _t = DialogTrigger;
