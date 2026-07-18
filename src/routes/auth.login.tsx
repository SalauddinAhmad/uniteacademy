import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  BookOpen,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";



export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "লগইন — Uniteacademy" },
      {
        name: "description",
        content:
          "Uniteacademy অ্যাকাউন্টে লগইন করুন এবং আপনার কোর্সসমূহে প্রবেশ করুন।",
      },
      { property: "og:title", content: "লগইন — Uniteacademy" },
      {
        property: "og:description",
        content: "আপনার Uniteacademy অ্যাকাউন্টে সহজে ও নিরাপদে লগইন করুন।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res.error) {
      toast.error(res.error.message || "Google sign-in failed");
      setGoogleLoading(false);
      return;
    }
    if (res.redirected) return;
    navigate({ to: "/dashboard" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Login successful");
    navigate({ to: "/dashboard" });
  };

  return (
    <main className="relative min-h-screen overflow-hidden">

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 45% at 12% 8%, color-mix(in oklab, var(--primary-glow) 32%, transparent), transparent 60%), radial-gradient(45% 40% at 92% 18%, color-mix(in oklab, var(--accent) 28%, transparent), transparent 60%), radial-gradient(55% 45% at 82% 92%, color-mix(in oklab, var(--primary) 26%, transparent), transparent 60%)",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute right-[-6rem] top-1/3 h-80 w-80 rounded-full bg-accent/25 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-1/3 h-96 w-96 rounded-full bg-primary-glow/25 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <section className="flex w-full items-center justify-center">
          <div className="w-full max-w-xl">
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

            {/* Premium glass card with gradient border */}
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
                      আবার স্বাগতম
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      নতুন এখানে?{" "}
                      <Link to="/auth/signup" className="font-semibold text-primary hover:underline">
                        অ্যাকাউন্ট তৈরি করুন
                      </Link>
                    </p>
                  </div>

                  {/* Google */}
                  <div className="mt-7">
                    <button
                      type="button"
                      onClick={handleGoogle}
                      disabled={googleLoading}
                      className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm font-semibold backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-background/90 hover:shadow-lg disabled:opacity-60"
                    >
                      {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon className="h-4 w-4" />}
                      Google দিয়ে চালিয়ে যান
                    </button>
                  </div>


                  <div className="my-7 flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      অথবা ইমেইল দিয়ে
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
                    <div>
                      <label htmlFor="email" className="mb-2 block text-xs font-semibold text-foreground/80">
                        ইমেইল ঠিকানা
                      </label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full rounded-xl border border-border bg-background/60 py-3 pl-11 pr-3 text-sm text-foreground placeholder:text-muted-foreground/70 backdrop-blur transition-all focus:border-primary/50 focus:bg-background/85 focus:outline-none focus:ring-4 focus:ring-primary/15"
                        />
                      </div>
                    </div>


                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label htmlFor="password" className="block text-xs font-semibold text-foreground/80">
                          পাসওয়ার্ড
                        </label>
                        <Link
                          to="/auth/forgot-password"
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          ভুলে গেছেন?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="password"
                          type={showPw ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="আপনার পাসওয়ার্ড"
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
                    </div>

                    <label className="flex cursor-pointer items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/30"
                      />
                      <span className="text-xs font-medium text-foreground/80">
                        আমাকে মনে রাখুন
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl gradient-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40 disabled:opacity-60"
                    >
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                      {loading ? <Loader2 className="relative h-4 w-4 animate-spin" /> : <span className="relative">লগইন করুন</span>}
                      {!loading && <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
                    </button>

                  </form>

                  <div className="mt-7 grid grid-cols-3 gap-3 border-t border-border pt-5">
                    {[
                      { i: GraduationCap, t: "২৫+ উস্তাদ" },
                      { i: BookOpen, t: "১১টি কোর্স" },
                      { i: ShieldCheck, t: "নিরাপদ লগইন" },
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

