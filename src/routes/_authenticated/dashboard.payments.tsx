import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Wallet } from "lucide-react";
import { GlassCard } from "@/components/dashboard/primitives";
import { paymentsQuery } from "@/lib/api/learning";

export const Route = createFileRoute("/_authenticated/dashboard/payments")({
  head: () => ({ meta: [{ title: "পেমেন্ট হিস্টরি — Uniteacademy" }] }),
  loader: ({ context }) => (context as any).queryClient?.ensureQueryData(paymentsQuery()),
  component: PaymentsPage,
});

const statusLabel: Record<string, { label: string; cls: string }> = {
  pending: { label: "পেন্ডিং", cls: "bg-amber-500/15 text-amber-700" },
  success: { label: "সফল", cls: "bg-emerald-500/15 text-emerald-700" },
  failed: { label: "ব্যর্থ", cls: "bg-red-500/15 text-red-700" },
  refunded: { label: "ফেরত", cls: "bg-slate-500/15 text-slate-700" },
};

function PaymentsPage() {
  const { data } = useSuspenseQuery(paymentsQuery());
  if (data.payments.length === 0) {
    return (
      <div className="mx-auto max-w-4xl">
        <GlassCard className="grid place-items-center py-12 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
            <Wallet className="h-7 w-7" />
          </span>
          <h3 className="mt-3 text-lg font-bold">কোন পেমেন্ট রেকর্ড নেই</h3>
        </GlassCard>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-4xl">
      <GlassCard className="p-0">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th className="p-3 text-left">তারিখ</th>
              <th className="p-3 text-left">কোর্স / বিবরণ</th>
              <th className="p-3 text-left">মেথড</th>
              <th className="p-3 text-right">পরিমাণ</th>
              <th className="p-3 text-center">স্ট্যাটাস</th>
            </tr>
          </thead>
          <tbody>
            {data.payments.map((p) => {
              const st = statusLabel[p.status];
              return (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="p-3">{new Date(p.createdAt).toLocaleDateString("bn-BD")}</td>
                  <td className="p-3">
                    <div className="font-medium">{p.course?.title ?? p.note ?? "সাধারণ পেমেন্ট"}</div>
                    {p.txnId && <div className="text-xs text-muted-foreground">TXN: {p.txnId}</div>}
                  </td>
                  <td className="p-3 uppercase">{p.method}</td>
                  <td className="p-3 text-right font-bold">৳ {(p.amountCents / 100).toLocaleString("bn-BD")}</td>
                  <td className="p-3 text-center">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${st.cls}`}>{st.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
