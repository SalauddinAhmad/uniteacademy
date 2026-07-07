import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/shell";
import { checkAdminAccess } from "@/lib/admin.functions";

export const Route = createFileRoute("/_admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth/login" });
    try {
      const res = await checkAdminAccess();
      if (!res.isAdmin) throw redirect({ to: "/dashboard" });
    } catch (e) {
      if ((e as any)?.isRedirect) throw e;
      throw redirect({ to: "/dashboard" });
    }
    return { user: data.user };
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { user } = Route.useRouteContext();
  const name =
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.name as string) ||
    user.email?.split("@")[0] ||
    "Admin";
  return (
    <AdminShell userName={name} email={user.email ?? ""}>
      <Outlet />
    </AdminShell>
  );
}
