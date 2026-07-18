import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { AdminPageHeader } from "@/components/admin/shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { adminPaymentsQuery, updatePaymentStatus, type AdminPayment } from "@/lib/api/admin-learning";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/admin/payments")({
  loader: ({ context }) => (context as any).queryClient?.ensureQueryData(adminPaymentsQuery()),
  component: PaymentsAdmin,
});

const statusCls: Record<AdminPayment["status"], string> = {
  pending: "bg-amber-500/15 text-amber-700",
  success: "bg-emerald-500/15 text-emerald-700",
  failed: "bg-red-500/15 text-red-700",
  refunded: "bg-slate-500/15 text-slate-700",
};

function PaymentsAdmin() {
  const { data } = useSuspenseQuery(adminPaymentsQuery());
  const qc = useQueryClient();
  const totals = data.payments.reduce(
    (acc, p) => { if (p.status === "success") acc.revenue += p.amountCents; if (p.status === "pending") acc.pending += 1; return acc; },
    { revenue: 0, pending: 0 },
  );

  const mut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AdminPayment["status"] }) => updatePaymentStatus(id, status),
    onSuccess: () => { toast.success("Payment updated"); qc.invalidateQueries({ queryKey: ["admin", "payments"] }); },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader title="Payments" description="Track and manage all payment transactions" />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Card className="p-4"><div className="text-xs text-muted-foreground">Total revenue</div><div className="mt-1 text-2xl font-bold">৳ {(totals.revenue / 100).toLocaleString("bn-BD")}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Pending</div><div className="mt-1 text-2xl font-bold">{totals.pending}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Total transactions</div><div className="mt-1 text-2xl font-bold">{data.payments.length}</div></Card>
      </div>

      {data.payments.length === 0 ? (
        <Card className="border-dashed p-12 text-center text-muted-foreground">No payments yet.</Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Course</th>
                <th className="p-3 text-left">Method</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.payments.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="p-3">{new Date(p.createdAt).toLocaleDateString("bn-BD")}</td>
                  <td className="p-3">
                    <div className="font-medium">{p.user?.fullName ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">{p.user?.email}</div>
                  </td>
                  <td className="p-3">{p.course?.title ?? p.note ?? "—"}</td>
                  <td className="p-3 uppercase text-xs">{p.method}</td>
                  <td className="p-3 text-right font-bold">৳ {(p.amountCents / 100).toLocaleString("bn-BD")}</td>
                  <td className="p-3 text-center">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusCls[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1">
                      {p.status !== "success" && <Button size="sm" variant="outline" onClick={() => mut.mutate({ id: p.id, status: "success" })}>Approve</Button>}
                      {p.status !== "refunded" && p.status === "success" && <Button size="sm" variant="ghost" onClick={() => mut.mutate({ id: p.id, status: "refunded" })}>Refund</Button>}
                      {p.status === "pending" && <Button size="sm" variant="ghost" className="text-destructive" onClick={() => mut.mutate({ id: p.id, status: "failed" })}>Reject</Button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
