import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/shell";
import { getToken } from "@/lib/api/client";
import { me } from "@/lib/api/auth";

export const Route = createFileRoute("/_admin")({
  ssr: false,
  beforeLoad: async () => {
    if (!getToken()) throw redirect({ to: "/auth/login" });
    const user = await me();
    if (!user) throw redirect({ to: "/auth/login" });
    if (user.role !== "admin") throw redirect({ to: "/dashboard" });
    return { user };
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { user } = Route.useRouteContext();
  return (
    <AdminShell userName={user.name || user.email.split("@")[0]} email={user.email}>
      <Outlet />
    </AdminShell>
  );
}
