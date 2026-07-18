import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { AdminPageHeader } from "@/components/admin/shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trash2 } from "lucide-react";
import { adminEnrollmentsQuery, deleteEnrollment } from "@/lib/api/admin-learning";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/admin/enrollments")({
  loader: ({ context }) => (context as any).queryClient?.ensureQueryData(adminEnrollmentsQuery()),
  component: EnrollmentsAdmin,
});

function EnrollmentsAdmin() {
  const { data } = useSuspenseQuery(adminEnrollmentsQuery());
  const qc = useQueryClient();
  const del = useMutation({
    mutationFn: deleteEnrollment,
    onSuccess: () => { toast.success("Enrollment removed"); qc.invalidateQueries({ queryKey: ["admin", "enrollments"] }); },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader title="Enrollments" description={`${data.enrollments.length} total enrollments`} />
      {data.enrollments.length === 0 ? (
        <Card className="border-dashed p-12 text-center text-muted-foreground">No enrollments yet.</Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="p-3 text-left">Student</th>
                <th className="p-3 text-left">Course / Program</th>
                <th className="p-3 text-left w-64">Progress</th>
                <th className="p-3 text-left">Enrolled</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.enrollments.map((e) => (
                <tr key={e.id} className="border-b last:border-0">
                  <td className="p-3">
                    <div className="font-medium">{e.user.fullName}</div>
                    <div className="text-xs text-muted-foreground">{e.user.email}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-medium">{e.course?.title ?? e.program?.title ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">{e.course ? "Course" : "Program"}</div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Progress value={e.progress} className="h-2" />
                      <span className="text-xs w-10 text-right">{e.progress}%</span>
                    </div>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">{new Date(e.createdAt).toLocaleDateString("bn-BD")}</td>
                  <td className="p-3 text-right">
                    <Button size="icon" variant="ghost" onClick={() => { if (confirm("Remove enrollment?")) del.mutate(e.id); }}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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
