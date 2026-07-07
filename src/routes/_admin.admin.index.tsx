import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getAdminStats } from "@/lib/admin.functions";
import { AdminPageHeader } from "@/components/admin/shell";
import { Card } from "@/components/ui/card";
import {
  Users,
  GraduationCap,
  BookOpen,
  BookOpenCheck,
  TrendingUp,
  UserPlus,
  Shield,
  Sparkles,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const statsQuery = queryOptions({
  queryKey: ["admin", "stats"],
  queryFn: () => getAdminStats(),
});

export const Route = createFileRoute("/_admin/admin/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(statsQuery);
  },
  component: AdminOverview,
  errorComponent: ({ error }) => (
    <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-destructive">
      Error: {error.message}
    </div>
  ),
});

function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  hint,
}: {
  label: string;
  value: string | number;
  icon: any;
  tone?: "default" | "success" | "warning" | "info";
  hint?: string;
}) {
  const tones: Record<string, string> = {
    default: "from-primary/15 to-primary/5 text-primary",
    success: "from-emerald-500/15 to-emerald-500/5 text-emerald-500",
    warning: "from-amber-500/15 to-amber-500/5 text-amber-500",
    info: "from-sky-500/15 to-sky-500/5 text-sky-500",
  };
  return (
    <Card className="group relative overflow-hidden border-border/60 bg-card p-5 transition-all hover:shadow-lg hover:border-primary/30">
      <div className={`absolute inset-0 bg-gradient-to-br opacity-60 ${tones[tone]}`} />
      <div className="relative flex items-start justify-between">
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <div className="mt-2 text-3xl font-bold tabular-nums">{value}</div>
          {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
        </div>
        <div className={`grid h-11 w-11 place-items-center rounded-xl bg-background/70 backdrop-blur ${tones[tone].split(" ").pop()}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

function AdminOverview() {
  const { data: s } = useSuspenseQuery(statsQuery);
  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader
        title="Platform Overview"
        description="Uniteacademy — real-time snapshot of your academy"
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/users">Manage users</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/admin/courses">Manage courses</Link>
            </Button>
          </>
        }
      />

      <div className="relative mb-6 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-wrap items-center gap-6">
          <div className="grid h-14 w-14 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <Sparkles className="h-7 w-7" />
          </div>
          <div>
            <div className="text-lg font-semibold">Welcome back, Admin</div>
            <div className="text-sm text-muted-foreground">
              {s.newUsers7d} new users and {s.newEnrollments7d} new enrollments this week.
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Users" value={s.totalUsers} icon={Users} tone="info" hint={`+${s.newUsers7d} this week`} />
        <StatCard label="Students" value={s.totalStudents} icon={GraduationCap} tone="success" />
        <StatCard label="Teachers" value={s.totalTeachers} icon={Shield} tone="warning" />
        <StatCard label="Administrators" value={s.totalAdmins} icon={Shield} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Courses" value={s.totalCourses} icon={BookOpen} tone="info" />
        <StatCard label="Published" value={s.publishedCourses} icon={BookOpenCheck} tone="success" />
        <StatCard label="Programs" value={s.totalPrograms} icon={GraduationCap} />
        <StatCard label="Enrollments" value={s.totalEnrollments} icon={UserPlus} tone="warning" hint={`+${s.newEnrollments7d} this week`} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60 bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Quick actions</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              to="/admin/users"
              className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background p-4 transition-all hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">User management</div>
                <div className="text-xs text-muted-foreground">Assign roles, view students & teachers</div>
              </div>
            </Link>
            <Link
              to="/admin/courses"
              className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background p-4 transition-all hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">Course catalog</div>
                <div className="text-xs text-muted-foreground">Create, edit, publish courses</div>
              </div>
            </Link>
          </div>
        </Card>
        <Card className="border-border/60 bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Health</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Publish rate</span>
              <span className="font-semibold">
                {s.totalCourses > 0
                  ? Math.round((s.publishedCourses / s.totalCourses) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Avg enroll / user</span>
              <span className="font-semibold">
                {s.totalStudents > 0
                  ? (s.totalEnrollments / s.totalStudents).toFixed(1)
                  : "0.0"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Teachers coverage</span>
              <span className="font-semibold">
                {s.totalCourses > 0
                  ? Math.round((s.totalTeachers / s.totalCourses) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
