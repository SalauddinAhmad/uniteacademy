import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BookOpen,
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({
    meta: [
      { title: "সাইনআপ — Uniteacademy" },
      {
        name: "description",
        content:
          "Uniteacademy-তে বিনামূল্যে অ্যাকাউন্ট তৈরি করুন — কুরআন, হাদীস, ফিকহ ও সীরাত শিখুন অভিজ্ঞ উস্তাদদের কাছ থেকে।",
      },
      { property: "og:title", content: "সাইনআপ — Uniteacademy" },
      {
        property: "og:description",
        content: "বিনামূল্যে অ্যাকাউন্ট তৈরি করে আজই ইসলামী জ্ঞানের যাত্রা শুরু করুন।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Ambient premium glow layer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 45% at 12% 8%, color-mix(in oklab, var(--primary-glow) 32%, transparent), transparent 60%), radial-gradient(45% 40% at 92% 18%, color-mix(in oklab, var(--accent) 28%, transparent), transparent 60%), radial-gradient(55% 45% at 82% 92%, color-mix(in oklab, var(--primary) 26%, transparent), transparent 60%)",
        }}
      />
      {/* Floating orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute right-[-6rem] top-1/3 h-80 w-80 rounded-full bg-accent/25 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-1/3 h-96 w-96 rounded-full bg-primary-glow/25 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">


        {/* RIGHT — Signup form */}
        <section className="flex w-full items-center justify-center">
          <div className="w-full max-w-3xl">
            {/* Brand */}
            <div className="mb-6 flex items-center justify-center">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="grid h-11 w-11 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-lg shadow-primary/25">
                  <BookOpen className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-lg font-bold tracking-tight">Uniteacademy</span>
                  <span className="text-[10px] font-medium text-muted-foreground">ইউনাইট একাডেমি</span>
                </div>
              </Link>
            </div>

            {/* Premium glass card with decorative gradient border */}
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-px rounded-[2rem] opacity-70 blur-sm"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in oklab, var(--primary) 60%, transparent), color-mix(in oklab, var(--accent) 45%, transparent) 55%, color-mix(in oklab, var(--primary-glow) 60%, transparent))",
                }}
              />
              <div className="glass-strong relative overflow-hidden rounded-[2rem] p-8 sm:p-10">
                <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/25 blur-3xl" />
                <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />

                <div className="relative">
                  <div className="text-center">

                    <h2 className="text-3xl font-extrabold tracking-tight sm:text-[2rem]">
                      অ্যাকাউন্ট তৈরি করুন
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
                      <Link to="/auth/login" className="font-semibold text-primary hover:underline">
                        লগইন করুন
                      </Link>
                    </p>
                  </div>

                  <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      className="group inline-flex items-center justify-center gap-2.5 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm font-semibold backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-background/90 hover:shadow-lg"
                    >
                      <GoogleIcon className="h-4 w-4" />
                      Google দিয়ে
                    </button>
                    <button
                      type="button"
                      className="group inline-flex items-center justify-center gap-2.5 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm font-semibold backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-background/90 hover:shadow-lg"
                    >
                      <AppleIcon className="h-4 w-4" />
                      Apple দিয়ে
                    </button>
                  </div>

                  <div className="my-7 flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      অথবা ইমেইল দিয়ে
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <form onSubmit={(e) => e.preventDefault()} className="space-y-5" autoComplete="off">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <Field id="name" label="পূর্ণ নাম" icon={User} type="text" placeholder="আপনার নাম" />
                      <Field id="email" label="ইমেইল ঠিকানা" icon={Mail} type="email" placeholder="you@example.com" />
                    </div>

                    <div>
                      <label htmlFor="password" className="mb-2 block text-xs font-semibold text-foreground/80">
                        পাসওয়ার্ড
                      </label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="password"
                          type={showPw ? "text" : "password"}
                          placeholder="কমপক্ষে ৮ অক্ষর"
                          className="w-full rounded-xl border border-border bg-background/60 py-3 pl-11 pr-12 text-sm text-foreground placeholder:text-muted-foreground/70 backdrop-blur transition-all focus:border-primary/50 focus:bg-background/85 focus:outline-none focus:ring-4 focus:ring-primary/15"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw((v) => !v)}
                          className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label={showPw ? "Hide password" : "Show password"}
                        >
                          {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <p className="mt-2 text-[11px] text-muted-foreground">
                        বড় হাতের অক্ষর, সংখ্যা ও একটি বিশেষ চিহ্ন ব্যবহার করুন।
                      </p>
                    </div>

                    <label className="flex cursor-pointer items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/30"
                      />
                      <span className="text-xs leading-relaxed text-foreground/80">
                        আমি{" "}
                        <a href="#" className="font-medium text-primary hover:underline">শর্তাবলি</a>{" "}
                        ও{" "}
                        <a href="#" className="font-medium text-primary hover:underline">প্রাইভেসি পলিসি</a>{" "}
                        মেনে নিচ্ছি।
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={!agree}
                      className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl gradient-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
                    >
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                      <span className="relative">অ্যাকাউন্ট তৈরি করুন</span>
                      <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </form>

                  <div className="mt-7 grid grid-cols-3 gap-3 border-t border-border pt-5">
                    {[
                      { i: GraduationCap, t: "২৫+ উস্তাদ" },
                      { i: BookOpen, t: "১১টি কোর্স" },
                      { i: ShieldCheck, t: "লাইফটাইম অ্যাক্সেস" },
                    ].map((p, i) => (
                      <div key={i} className="flex items-center justify-center gap-2 text-[11px] font-medium text-foreground/75">
                        <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                          <p.i className="h-3.5 w-3.5" strokeWidth={2.4} />
                        </span>
                        {p.t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </section>
      </div>
    </main>
  );
}

function Field({
  id,
  label,
  icon: Icon,
  type,
  placeholder,
}: {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  type: string;
  placeholder: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-semibold text-foreground/80"
      >
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className="w-full rounded-xl border border-border bg-background/60 py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground/70 backdrop-blur transition-all focus:border-primary/50 focus:bg-background/80 focus:outline-none focus:ring-4 focus:ring-primary/15"
        />
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.4 14.7 2.4 12 2.4 6.9 2.4 2.8 6.5 2.8 11.7S6.9 21 12 21c6.9 0 9.2-4.9 9.2-7.4 0-.5-.1-.9-.1-1.3H12z"
      />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.5-.2-2.8.9-3.6.9-.7 0-1.9-.8-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.5.8 1.1 1.7 2.4 3 2.4 1.2-.1 1.6-.8 3.1-.8 1.4 0 1.8.8 3.1.7 1.3 0 2.1-1.1 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.6-1-2.6-4zM14 5.4c.7-.8 1.2-2 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1.1 3 1.1 0 2.2-.6 3-1.4z" />
    </svg>
  );
}
