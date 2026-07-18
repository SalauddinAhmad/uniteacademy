import { useEffect, useState, type ReactNode } from "react";
import {
  Link,
  useRouterState,
  useNavigate,
  useMatches,
} from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  GraduationCap,
  CalendarDays,
  CalendarClock,
  Megaphone,
  Bell,
  Wallet,
  Moon,
  Sun,
  Languages,
  LogOut,
  ChevronDown,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
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
import { logout as apiLogout } from "@/lib/api/auth";
import { useQueryClient } from "@tanstack/react-query";

const mainItems = [
  { to: "/dashboard", label: "ওভারভিউ", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/enrollments", label: "আমার কোর্স", icon: BookOpen },
  { to: "/dashboard/assignments", label: "এসাইনমেন্ট", icon: ClipboardList },
  { to: "/dashboard/exams", label: "এক্সাম", icon: GraduationCap },
  { to: "/dashboard/calendar", label: "আমার ক্যালেন্ডার", icon: CalendarDays },
  { to: "/dashboard/events", label: "ইভেন্ট", icon: CalendarClock },
] as const;

const noticeItems = [
  { to: "/dashboard/notice", label: "নোটিশ বোর্ড", icon: Megaphone },
  { to: "/dashboard/notifications", label: "নোটিফিকেশন", icon: Bell, badge: 2 },
] as const;

const paymentItems = [
  { to: "/dashboard/payments", label: "পেমেন্ট হিস্টরি", icon: Wallet },
] as const;

function AppSidebar({ initials, fullName }: { initials: string; fullName: string | null }) {
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const isActive = (to: string, exact?: boolean) =>
    exact ? currentPath === to : currentPath === to || currentPath.startsWith(`${to}/`);

  const renderItem = (
    item: { to: string; label: string; icon: typeof BookOpen; badge?: number; exact?: boolean },
  ) => (
    <SidebarMenuItem key={item.to}>
      <SidebarMenuButton asChild isActive={isActive(item.to, item.exact)} tooltip={item.label}>
        <Link to={item.to} className="flex items-center gap-3">
          <item.icon className="h-4 w-4 shrink-0" strokeWidth={2.2} />
          {!collapsed && (
            <>
              <span className="flex-1 truncate">{item.label}</span>
              {"badge" in item && item.badge ? (
                <Badge className="h-5 min-w-5 justify-center rounded-md bg-destructive px-1.5 text-[10px] font-semibold text-destructive-foreground">
                  {item.badge}
                </Badge>
              ) : null}
            </>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border/60 p-3">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-lg shadow-primary/25">
            <BookOpen className="h-5 w-5" strokeWidth={2.4} />
          </div>
          {!collapsed && (
            <div className="flex min-w-0 flex-col leading-none">
              <span className="truncate text-sm font-bold tracking-tight">Uniteacademy</span>
              <span className="truncate text-[10px] font-medium text-muted-foreground">
                ইউনাইট একাডেমি
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{mainItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{noticeItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{paymentItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/60 p-3">
        <div className={collapsed ? "flex flex-col items-center gap-2" : "flex items-center gap-2"}>
          <LanguageSwitcher compact={collapsed} />
          <ThemeToggle />
        </div>
        {!collapsed && (
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-muted/40 p-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-xs font-bold text-primary">
              {initials}
            </span>
            <span className="truncate text-xs font-medium">{fullName ?? "Student"}</span>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

function LanguageSwitcher({ compact }: { compact: boolean }) {
  const [lang, setLang] = useState<"bn" | "en">("bn");
  useEffect(() => {
    const stored = localStorage.getItem("ua_lang") as "bn" | "en" | null;
    if (stored) setLang(stored);
  }, []);
  const toggle = () => {
    const next = lang === "bn" ? "en" : "bn";
    setLang(next);
    localStorage.setItem("ua_lang", next);
  };
  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-2.5 py-1.5 text-xs font-medium hover:bg-background"
    >
      <Languages className="h-3.5 w-3.5" />
      {!compact && (lang === "bn" ? "বাংলা" : "English")}
    </button>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("ua_theme");
    const shouldDark = stored ? stored === "dark" : document.documentElement.classList.contains("dark");
    setDark(shouldDark);
    document.documentElement.classList.toggle("dark", shouldDark);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("ua_theme", next ? "dark" : "light");
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-background/60 hover:bg-background"
    >
      {dark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
    </button>
  );
}

function Topbar({
  initials,
  fullName,
}: {
  initials: string;
  fullName: string | null;
}) {
  const matches = useMatches();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const currentPath = useRouterState({ select: (r) => r.location.pathname });

  const crumb =
    currentPath === "/dashboard"
      ? "ওভারভিউ"
      : currentPath.startsWith("/dashboard/enrollments")
      ? "আমার কোর্স"
      : currentPath.startsWith("/dashboard/assignments")
      ? "এসাইনমেন্ট"
      : currentPath.startsWith("/dashboard/exams")
      ? "এক্সাম"
      : currentPath.startsWith("/dashboard/calendar")
      ? "আমার ক্যালেন্ডার"
      : currentPath.startsWith("/dashboard/events")
      ? "ইভেন্ট"
      : currentPath.startsWith("/dashboard/notice")
      ? "নোটিশ বোর্ড"
      : currentPath.startsWith("/dashboard/notifications")
      ? "নোটিফিকেশন"
      : currentPath.startsWith("/dashboard/payments")
      ? "পেমেন্ট হিস্টরি"
      : "";
  void matches;

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    apiLogout();
    navigate({ to: "/auth/login", replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 bg-background/85 px-4 backdrop-blur">
      <SidebarTrigger className="rounded-lg" />
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">{crumb}</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full border border-border bg-background/60 px-2.5 py-1.5 text-xs font-semibold hover:bg-background">
              <span className="grid h-7 w-7 place-items-center rounded-full gradient-primary text-primary-foreground">
                {initials}
              </span>
              <span className="hidden max-w-[10rem] truncate sm:inline">
                {fullName ?? "Student"}
              </span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{fullName ?? "Student"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              সাইন আউট
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function DashboardShell({
  children,
  initials,
  fullName,
}: {
  children: ReactNode;
  initials: string;
  fullName: string | null;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/20">
        <AppSidebar initials={initials} fullName={fullName} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar initials={initials} fullName={fullName} />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
