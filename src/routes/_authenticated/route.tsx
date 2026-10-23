import { createFileRoute, Outlet } from "@tanstack/react-router";
import { me, DEMO_STUDENT } from "@/lib/api/auth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    let user = await me();
    if (!user) {
      user = DEMO_STUDENT;
    }
    return { user };
  },
  component: () => <Outlet />,
});
