import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, BookOpen } from "lucide-react";

const nav = [
  { to: "/", label: "হোম" },
  { to: "/courses", label: "কোর্সসমূহ" },
  { to: "/about", label: "আমাদের সম্পর্কে" },
  { to: "/contact", label: "যোগাযোগ" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
            <BookOpen className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight">Uniteacademy</span>
            <span className="text-[10px] font-medium text-muted-foreground">ইউনাইট একাডেমি</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "bg-muted text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/auth/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            লগইন
          </Link>
          <Link
            to="/auth/signup"
            className="rounded-lg gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-transform hover:scale-[1.02]"
          >
            শুরু করুন
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-border md:hidden"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="space-y-1 px-4 py-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-muted"
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 border-t border-border pt-3">
              <Link to="/auth/login" className="flex-1 rounded-lg border border-border px-3 py-2 text-center text-sm font-medium">লগইন</Link>
              <Link to="/auth/signup" className="flex-1 rounded-lg gradient-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground">শুরু করুন</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
