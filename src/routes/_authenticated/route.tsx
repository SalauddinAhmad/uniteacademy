import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getToken } from "@/lib/api/client";
import { me } from "@/lib/api/auth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const token = getToken();
    if (!token) throw redirect({ to: "/auth/login" });
    const user = await me();
    if (!user) throw redirect({ to: "/auth/login" });
    return { user };
  },
  component: () => <Outlet />,
});
