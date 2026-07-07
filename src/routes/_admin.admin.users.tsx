import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { listAdminUsers, setUserRole, type AdminRole } from "@/lib/admin.functions";
import { AdminPageHeader } from "@/components/admin/shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, Shield, GraduationCap, User as UserIcon, Users } from "lucide-react";
import { toast } from "sonner";

const usersQuery = queryOptions({
  queryKey: ["admin", "users"],
  queryFn: () => listAdminUsers({ data: {} }),
});

export const Route = createFileRoute("/_admin/admin/users")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(usersQuery);
  },
  component: UsersPage,
  errorComponent: ({ error }) => (
    <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-destructive">
      {error.message}
    </div>
  ),
});

const ROLE_META: Record<AdminRole, { label: string; className: string; icon: any }> = {
  admin: { label: "Admin", className: "bg-primary/15 text-primary border-primary/30", icon: Shield },
  teacher: { label: "Teacher", className: "bg-amber-500/15 text-amber-500 border-amber-500/30", icon: GraduationCap },
  student: { label: "Student", className: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30", icon: UserIcon },
};

function UsersPage() {
  const { data: users } = useSuspenseQuery(usersQuery);
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<AdminRole | "all">("all");

  const mutation = useMutation({
    mutationFn: (vars: { userId: string; role: AdminRole; grant: boolean }) =>
      setUserRole({ data: vars }),
    onSuccess: (_d, vars) => {
      toast.success(`${vars.grant ? "Granted" : "Revoked"} ${vars.role}`);
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  const filtered = users.filter(u => {
    const s = search.trim().toLowerCase();
    const matchSearch =
      !s ||
      (u.fullName ?? "").toLowerCase().includes(s) ||
      (u.email ?? "").toLowerCase().includes(s);
    const matchRole =
      roleFilter === "all" ||
      (roleFilter === "student"
        ? u.roles.length === 0 || u.roles.includes("student")
        : u.roles.includes(roleFilter));
    return matchSearch && matchRole;
  });

  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader
        title="User Management"
        description={`${users.length} total users on the platform`}
      />

      <Card className="border-border/60 bg-card p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="pl-9 h-10"
            />
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-background p-1">
            {(["all", "admin", "teacher", "student"] as const).map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                  roleFilter === r
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "all" ? "All" : r + "s"}
              </button>
            ))}
          </div>
          <Badge variant="outline" className="ml-auto">
            <Users className="mr-1 h-3 w-3" /> {filtered.length} shown
          </Badge>
        </div>
      </Card>

      <Card className="border-border/60 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/60 bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Roles</th>
                <th className="px-4 py-3 font-medium">Enrollments</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.map(u => {
                const displayRoles: AdminRole[] = u.roles.length ? u.roles : ["student"];
                return (
                  <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary/30 to-primary/10 text-xs font-bold text-primary">
                          {(u.fullName ?? u.email ?? "U").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{u.fullName ?? "Unnamed"}</div>
                          <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {displayRoles.map(r => {
                          const meta = ROLE_META[r];
                          const I = meta.icon;
                          return (
                            <Badge key={r} variant="outline" className={meta.className}>
                              <I className="mr-1 h-3 w-3" /> {meta.label}
                            </Badge>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 tabular-nums">{u.enrollmentCount}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {new Date(u.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuLabel>Manage roles</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {(["admin", "teacher", "student"] as AdminRole[]).map(r => {
                            const has = u.roles.includes(r);
                            return (
                              <DropdownMenuItem
                                key={r}
                                onClick={() =>
                                  mutation.mutate({ userId: u.id, role: r, grant: !has })
                                }
                                disabled={mutation.isPending}
                              >
                                {has ? "Revoke" : "Grant"} {ROLE_META[r].label}
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    No users match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
