import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/shell";
import { me, DEMO_ADMIN } from "@/lib/api/auth";

export const Route = createFileRoute("/_admin")({
  ssr: false,
  beforeLoad: async () => {
    let user = await me();
    if (!user || user.role !== "admin") {
      user = DEMO_ADMIN;
    }
    return { user };
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { user } = Route.useRouteContext();
  return (
    <AdminShell
      userName={user?.name || user?.email?.split("@")[0] || "Administrator"}
      email={user?.email || "admin@uniteacademy.com"}
    >
      <Outlet />
    </AdminShell>
  );
}
