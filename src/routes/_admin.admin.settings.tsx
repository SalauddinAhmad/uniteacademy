import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/components/admin/shell";
import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/settings")({
  component: () => (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader title="Settings" description="Platform configuration" />
      <Card className="border-dashed border-border/60 p-12 text-center">
        <Construction className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <div className="mt-3 font-semibold">Coming soon</div>
      </Card>
    </div>
  ),
});
