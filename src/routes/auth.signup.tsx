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

      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8 lg:py-14">
        {/* LEFT — Brand & pitch (glass panel) */}
        <aside className="relative hidden lg:flex">
          <div className="glass-strong relative flex w-full flex-col justify-between rounded-3xl p-10">
            {/* soft grid overlay */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-3xl opacity-[0.15]"
              style={{
                backgroundImage:
                  "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
                maskImage:
                  "radial-gradient(ellipse at center, black 40%, transparent 75%)",
              }}
            />

            <div className="relative">
              <Link to="/" className="inline-flex items-center gap-2.5">
                <div className="grid h-11 w-11 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-lg shadow-primary/30">
                  <BookOpen className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-xl font-bold tracking-tight">
                    Uniteacademy
                  </span>
                  <span className="text-[11px] font-medium text-muted-foreground">
                    ইউনাইট একাডেমি
                  </span>
                </div>
              </Link>

              <div className="mt-12 inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-3 py-1.5 text-xs font-medium text-foreground/80 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                বিনামূল্যে সাইনআপ • কোনো কার্ড লাগবে না
              </div>

              <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight xl:text-5xl">
                ইসলামী জ্ঞানের{" "}
                <span className="text-gradient">প্রিমিয়াম</span> যাত্রা
                <br />
                আজই শুরু করুন
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                কুরআন, হাদীস, ফিকহ ও সীরাত — সব একটি একাডেমিতে। অভিজ্ঞ উস্তাদদের
                সাথে ঘরে বসে, নিজের সময়ে শিখুন।
              </p>

              <ul className="mt-8 space-y-3.5">
                {[
                  { i: GraduationCap, t: "২৫+ অভিজ্ঞ উস্তাদ ও স্কলার" },
                  { i: BookOpen, t: "১১টি কোর্স, ৪০০+ শিক্ষা উপকরণ" },
                  { i: ShieldCheck, t: "লাইফটাইম অ্যাক্সেস ও সার্টিফিকেট" },
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-lg bg-primary/12 text-primary ring-1 ring-primary/20">
                      <f.i className="h-4 w-4" strokeWidth={2.4} />
                    </span>
                    <span className="text-sm font-medium text-foreground/90">
                      {f.t}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Testimonial glass card */}
            <div className="relative mt-10 rounded-2xl border border-border bg-background/40 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
                  আ
                </div>
                <div>
                  <p className="text-sm font-semibold">আব্দুল্লাহ আল-মামুন</p>
                  <p className="text-xs text-muted-foreground">
                    শিক্ষার্থী • ঢাকা
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground/85">
                “Uniteacademy আমার দ্বীন শেখার পথ সহজ করে দিয়েছে। উস্তাদগণ
                অসাধারণ এবং প্ল্যাটফর্মটি অত্যন্ত সুন্দর।”
              </p>
            </div>
          </div>
        </aside>

        {/* RIGHT — Signup form */}
        <section className="flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Mobile brand */}
            <div className="mb-6 flex items-center justify-center lg:hidden">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-lg shadow-primary/25">
                  <BookOpen className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <span className="text-lg font-bold">Uniteacademy</span>
              </Link>
            </div>

            <div className="glass-strong rounded-3xl p-7 sm:p-9">
              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  অ্যাকাউন্ট তৈরি করুন
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
                  <Link
                    to="/auth/login"
                    className="font-semibold text-primary hover:underline"
                  >
                    লগইন করুন
                  </Link>
                </p>
              </div>

              {/* Social */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/50 px-3 py-2.5 text-sm font-medium backdrop-blur transition-all hover:bg-background/80 hover:shadow-md"
                >
                  <GoogleIcon className="h-4 w-4" />
                  Google
                </button>
                <button
                  type="button"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/50 px-3 py-2.5 text-sm font-medium backdrop-blur transition-all hover:bg-background/80 hover:shadow-md"
                >
                  <AppleIcon className="h-4 w-4" />
                  Apple
                </button>
              </div>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-medium text-muted-foreground">
                  অথবা ইমেইল দিয়ে
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="space-y-4"
                autoComplete="off"
              >
                <Field
                  id="name"
                  label="পূর্ণ নাম"
                  icon={User}
                  type="text"
                  placeholder="আপনার নাম লিখুন"
                />
                <Field
                  id="email"
                  label="ইমেইল ঠিকানা"
                  icon={Mail}
                  type="email"
                  placeholder="you@example.com"
                />
                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-xs font-semibold text-foreground/80"
                  >
                    পাসওয়ার্ড
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="password"
                      type={showPw ? "text" : "password"}
                      placeholder="কমপক্ষে ৮ অক্ষর"
                      className="peer w-full rounded-xl border border-border bg-background/60 py-2.5 pl-10 pr-11 text-sm text-foreground placeholder:text-muted-foreground/70 backdrop-blur transition-all focus:border-primary/50 focus:bg-background/80 focus:outline-none focus:ring-4 focus:ring-primary/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    বড় হাতের অক্ষর, সংখ্যা ও একটি বিশেষ চিহ্ন ব্যবহার করুন।
                  </p>
                </div>

                <label className="flex cursor-pointer items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/30"
                  />
                  <span className="text-xs leading-relaxed text-foreground/80">
                    আমি{" "}
                    <a href="#" className="font-medium text-primary hover:underline">
                      শর্তাবলি
                    </a>{" "}
                    ও{" "}
                    <a href="#" className="font-medium text-primary hover:underline">
                      প্রাইভেসি পলিসি
                    </a>{" "}
                    মেনে নিচ্ছি।
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!agree}
                  className="group relative mt-2 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl gradient-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative">অ্যাকাউন্ট তৈরি করুন</span>
                  <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </form>

              <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                আপনার তথ্য এনক্রিপ্টেড ও সুরক্ষিত
              </div>
            </div>

            {/* Trust row */}
            <div className="mt-5 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> বিনামূল্যে
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> কার্ড নয়
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> ৩০ সেকেন্ডে
              </span>
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
