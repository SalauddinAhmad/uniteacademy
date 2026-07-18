import { type ReactNode } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Bell,
  Settings,
  Shield,
  LogOut,
  ChevronRight,
  Wallet,
  Megaphone,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { logout as apiLogout } from "@/lib/api/auth";
import { useQueryClient } from "@tanstack/react-query";

const navPlatform = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/programs", label: "Programs", icon: GraduationCap },
] as const;

const navContent = [
  { to: "/admin/enrollments", label: "Enrollments", icon: Shield },
  { to: "/admin/notices", label: "Notices", icon: Megaphone },
  { to: "/admin/payments", label: "Payments", icon: Wallet },
] as const;

const navSystem = [
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function AdminSidebar({ userName }: { userName: string }) {
  const pathname = useRouterState({ select: s => s.location.pathname });
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  const renderGroup = (
    label: string,
    items: readonly { to: string; label: string; icon: any; exact?: boolean }[],
  ) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel className="text-[11px] uppercase tracking-widest text-sidebar-foreground/50 px-3">{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(it => {
            const active = isActive(it.to, (it as any).exact);
            return (
              <SidebarMenuItem key={it.to}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  className={`group h-10 rounded-lg font-medium transition-all ${
                    active
                      ? "bg-primary/15 text-primary shadow-sm"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <Link to={it.to} className="flex items-center gap-3">
                    <it.icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-primary" : ""}`} />
                    {!collapsed && <span className="truncate">{it.label}</span>}
                    {!collapsed && active && (
                      <ChevronRight className="ml-auto h-4 w-4 text-primary" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/admin" className="flex items-center gap-3 px-2 py-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-md">
            <Shield className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-sm font-bold leading-tight">Admin Console</div>
              <div className="text-[11px] text-sidebar-foreground/60">Uniteacademy</div>
            </div>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 py-3">
        {renderGroup("Platform", navPlatform)}
        {renderGroup("Content", navContent)}
        {renderGroup("System", navSystem)}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2">
        {!collapsed && (
          <div className="rounded-lg border border-sidebar-border/60 bg-sidebar-accent/30 p-3">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/20 text-primary text-xs font-bold">
                {userName.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold">{userName}</div>
                <div className="text-[10px] text-sidebar-foreground/60">Administrator</div>
              </div>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

function AdminTopbar({ userName, email }: { userName: string; email: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: s => s.location.pathname });

  const crumbs = (() => {
    const map: Record<string, string> = {
      "/admin": "Overview",
      "/admin/users": "Users",
      "/admin/courses": "Courses",
      "/admin/programs": "Programs",
      "/admin/enrollments": "Enrollments",
      "/admin/notices": "Notices",
      "/admin/payments": "Payments",
      "/admin/notifications": "Notifications",
      "/admin/settings": "Settings",
    };
    return map[pathname] ?? "Admin";
  })();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    apiLogout();
    navigate({ to: "/auth/login", replace: true });
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl">
      <SidebarTrigger className="text-foreground/70 hover:text-foreground" />
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Admin</span>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
        <span className="font-semibold">{crumbs}</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Badge variant="outline" className="hidden sm:inline-flex border-primary/30 bg-primary/5 text-primary">
          <Shield className="mr-1 h-3 w-3" /> Admin mode
        </Badge>
        <Button asChild variant="ghost" size="sm">
          <Link to="/dashboard">Student view</Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full border border-border/60 bg-card px-2 py-1 hover:bg-accent">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/20 text-primary text-xs font-bold">
                {userName.slice(0, 2).toUpperCase()}
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="text-sm font-semibold">{userName}</div>
              <div className="text-xs text-muted-foreground truncate">{email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/dashboard">Go to dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function AdminShell({
  children,
  userName,
  email,
}: {
  children: ReactNode;
  userName: string;
  email: string;
}) {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-background to-accent/5">
        <AdminSidebar userName={userName} />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar userName={userName} email={email} />
          <main className="flex-1 p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
