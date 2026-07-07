import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/dashboard/shell";
import { overviewQuery } from "@/lib/dashboard-queries";

export const Route = createFileRoute("/_authenticated/dashboard")({
  loader: ({ context }) => context.queryClient.ensureQueryData(overviewQuery()),
  component: DashboardLayout,
  errorComponent: DashboardError,
  notFoundComponent: () => <div className="p-8 text-center text-muted-foreground">Page not found</div>,
});

function DashboardLayout() {
  const { data } = useSuspenseQuery(overviewQuery());
  return (
    <DashboardShell initials={data.profile.initials} fullName={data.profile.full_name}>
      <Outlet />
    </DashboardShell>
  );
}

function DashboardError({ error }: { error: Error }) {
  return (
    <div className="grid min-h-screen place-items-center p-8 text-center">
      <div className="max-w-md">
        <h2 className="text-lg font-semibold">ড্যাশবোর্ড লোড হয়নি</h2>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      </div>
    </div>
  );
}
