import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  Layers,
  PlayCircle,
  HelpCircle,
  Clock,
  Star,
  Users,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  ChevronDown,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CourseCard } from "@/components/course-card";
import { courses, fmtBn } from "@/lib/courses";

export const Route = createFileRoute("/courses/$slug")({
  head: ({ params }) => {
    const c = courses.find((x) => x.slug === params.slug);
    const title = c ? `${c.title_bn} — Uniteacademy` : "কোর্স — Uniteacademy";
    const desc = c?.description ?? "Uniteacademy-এর ইসলামী কোর্সসমূহ।";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(c ? [{ property: "og:image", content: c.thumbnail as unknown as string }] : []),
      ],
    };
  },
  loader: ({ params }) => {
    const course = courses.find((c) => c.slug === params.slug);
    if (!course) throw notFound();
    return { course };
  },
  component: CourseDetailPage,
  notFoundComponent: NotFoundView,
});

function NotFoundView() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-3xl font-bold">কোর্স পাওয়া যায়নি</h1>
        <p className="mt-3 text-muted-foreground">এই লিংকে কোনো কোর্স নেই।</p>
        <Link
          to="/courses"
          className="mt-6 inline-flex rounded-xl gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md"
        >
          সব কোর্স দেখুন
        </Link>
      </div>
      <SiteFooter />
    </div>
  );
}

const TABS = [
  { id: "info", label: "কোর্সের তথ্য" },
  { id: "batch", label: "ব্যাচ" },
  { id: "modules", label: "মডিউল" },
  { id: "teacher", label: "শিক্ষক" },
  { id: "reviews", label: "শিক্ষার্থীদের মতামত" },
] as const;

function CourseDetailPage() {
  const { course } = Route.useLoaderData();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("info");
  const related = courses.filter((c) => c.slug !== course.slug && c.category === course.category).slice(0, 3);
  const topics = Math.round(course.lessons * 3.2);
  const quizzes = Math.round(course.lessons * 0.4);
  const hours = Math.round(course.lessons * 1.4);

  const modules = [
    "মডিউল ১ : পরিচিতি ও ভূমিকা",
    "মডিউল ২ : মৌলিক ধারণা ও পরিভাষা",
    "মডিউল ৩ : ব্যবহারিক প্রয়োগ",
    "মডিউল ৪ : গভীর বিশ্লেষণ",
    "মডিউল ৫ : কেস স্টাডি ও উদাহরণ",
    "মডিউল ৬ : রিভিশন ও মূল্যায়ন",
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="border-b border-border gradient-hero">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <nav className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">হোম</Link>
            <span>/</span>
            <Link to="/courses" className="hover:text-foreground">কোর্সসমূহ</Link>
            <span>/</span>
            <span className="text-foreground">{course.title_bn}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Cover */}
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
              <div className={`aspect-[16/10] bg-gradient-to-br ${course.cover}`}>
                <img
                  src={course.thumbnail}
                  alt={course.title_bn}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-primary shadow">
                  {course.category}
                </span>
                <span className="rounded-full bg-primary/90 px-3 py-1 text-[11px] font-semibold text-primary-foreground shadow">
                  {course.level === "beginner" ? "বিগিনার" : course.level === "intermediate" ? "ইন্টারমিডিয়েট" : "অ্যাডভান্সড"}
                </span>
              </div>
            </div>

            {/* Purchase card */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-lg">
                <h3 className="text-sm font-semibold text-muted-foreground">কোর্স কন্টেন্ট</h3>
                <ul className="mt-4 space-y-3 text-sm">
                  <li className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><Layers className="h-4 w-4" /></span>
                    <span><b>{fmtBn(topics)}</b>টি+ টপিক</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><PlayCircle className="h-4 w-4" /></span>
                    <span><b>{fmtBn(course.lessons)}</b>টি+ ভিডিও</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><HelpCircle className="h-4 w-4" /></span>
                    <span><b>{fmtBn(quizzes)}</b>টি+ কুইজ</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><Clock className="h-4 w-4" /></span>
                    <span>সময় লাগবে <b>{fmtBn(hours)} h +</b></span>
                  </li>
                </ul>

                <div className="mt-5 rounded-xl border border-border bg-background/60 p-4">
                  <div className="text-xs font-medium text-muted-foreground">One Time Purchase</div>
                  <div className="mt-1 flex items-baseline justify-between">
                    <div className="text-sm font-semibold">Lifetime Access</div>
                    <div className="text-right">
                      {course.originalPrice && (
                        <span className="mr-1.5 text-xs text-muted-foreground line-through">৳{fmtBn(course.originalPrice)}</span>
                      )}
                      <span className="text-2xl font-extrabold text-primary">৳{fmtBn(course.price)}</span>
                    </div>
                  </div>
                  <button className="mt-4 w-full rounded-xl gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-transform hover:-translate-y-0.5">
                    Enroll Now
                  </button>
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5" /> নিরাপদ পেমেন্ট · আজীবন অ্যাক্সেস
                  </p>
                </div>
              </div>
            </aside>
          </div>

          {/* Quick meta */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Star className="h-4 w-4 fill-accent text-accent" /><b className="text-foreground">{course.rating}</b> রেটিং</span>
            <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" /> {fmtBn(course.students)}+ শিক্ষার্থী</span>
            <span className="inline-flex items-center gap-1.5"><GraduationCap className="h-4 w-4" /> {course.instructor}</span>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-16 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                tab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {tab === "info" && (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{course.title_bn}</h1>
                <p className="mt-2 text-sm text-muted-foreground">{course.title_en}</p>
                <p className="mt-5 text-[15px] leading-loose text-foreground/85">{course.description}</p>
                <p className="mt-4 text-[15px] leading-loose text-foreground/80">
                  এই কোর্সে ধাপে ধাপে প্র্যাকটিসের মাধ্যমে শেখানো হবে {course.category} বিষয়ের মৌলিক ও প্রয়োগিক জ্ঞান — অভিজ্ঞ উস্তাযের তত্ত্বাবধানে, বাস্তব উদাহরণ ও পরীক্ষা-মূল্যায়নসহ।
                </p>
              </div>

              <Section title="কাদের জন্য এই কোর্স?">
                <ul className="space-y-2.5 text-[15px]">
                  {[
                    "যারা এই বিষয়ে মৌলিক জ্ঞান অর্জন করতে চান।",
                    "যারা অভিজ্ঞ উস্তাযের তত্ত্বাবধানে দক্ষতা বাড়াতে আগ্রহী।",
                    "যারা ইসলামী জ্ঞানকে বাস্তব জীবনে প্রয়োগ করতে চান।",
                    "যারা ধাপে ধাপে অনুশীলনের মাধ্যমে শিখতে পছন্দ করেন।",
                  ].map((t) => (
                    <li key={t} className="flex gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title="কোর্স করে যা শিখতে পারবেন">
                <ul className="grid gap-2.5 text-[15px] sm:grid-cols-2">
                  {[
                    "মৌলিক ধারণা ও পরিভাষার শক্ত ভিত্তি",
                    "দৈনন্দিন জীবনে প্রয়োগের কৌশল",
                    "উদাহরণসহ গভীর বিশ্লেষণ",
                    "প্রশ্নোত্তরে সমস্যার সমাধান",
                    "MCQ ও অ্যাসাইনমেন্টে আত্মমূল্যায়ন",
                    "সম্পূর্ণ কোর্সের সার্টিফিকেট",
                  ].map((t) => (
                    <li key={t} className="flex gap-2.5 rounded-xl border border-border bg-card p-3">
                      <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title="কোর্সের ধরন ও শিক্ষক">
                <div className="grid gap-3 sm:grid-cols-2">
                  <MetaCard label="কোর্সের ধরন" value="হাইব্রিড (রেকর্ডেড + লাইভ প্র্যাকটিস)" />
                  <MetaCard label="মূল শিক্ষক" value={course.instructor} />
                  <MetaCard label="মোট লেসন" value={`${fmtBn(course.lessons)} টি`} />
                  <MetaCard label="কোর্স মেয়াদ" value={course.duration} />
                </div>
              </Section>

              <Section title="পরীক্ষা ও মূল্যায়ন">
                <ul className="space-y-2.5 text-[15px]">
                  {[
                    "প্রতিটি ক্লাস শেষে MCQ টেস্ট",
                    "মিডটার্ম পরীক্ষা (Zoom Viva)",
                    "ফাইনাল পরীক্ষা (Zoom Viva)",
                  ].map((t) => (
                    <li key={t} className="flex gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> {t}
                    </li>
                  ))}
                </ul>
              </Section>
            </div>

            {/* Right sidebar meta */}
            <aside className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h4 className="text-sm font-bold">কোর্স তথ্য</h4>
                <dl className="mt-4 space-y-3 text-sm">
                  <Row k="ক্যাটাগরি" v={course.category} />
                  <Row k="লেভেল" v={course.level} />
                  <Row k="মেয়াদ" v={course.duration} />
                  <Row k="লেসন" v={`${fmtBn(course.lessons)} টি`} />
                  <Row k="ভাষা" v="বাংলা" />
                  <Row k="সার্টিফিকেট" v="হ্যাঁ" />
                </dl>
              </div>
            </aside>
          </div>
        )}

        {tab === "batch" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {[8, 9].map((n, i) => (
              <div key={n} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold">Batch — {fmtBn(n)}</h4>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
                    {i === 0 ? `${fmtBn(10)} সিট বাকি` : `${fmtBn(1)} সিট বাকি`}
                  </span>
                </div>
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" /> শুরু {fmtBn(5)} জুন, {fmtBn(2026)}
                </p>
                <button className="mt-4 w-full rounded-xl gradient-primary py-2.5 text-sm font-semibold text-primary-foreground shadow">
                  এই ব্যাচে ভর্তি হন
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === "modules" && (
          <div className="space-y-3">
            {modules.map((m, i) => (
              <details key={m} className="group rounded-2xl border border-border bg-card p-5 open:shadow-md">
                <summary className="flex cursor-pointer items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-sm font-bold text-primary">{fmtBn(i + 1)}</span>
                    <h4 className="font-semibold">{m}</h4>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <ul className="mt-4 space-y-2 pl-12 text-sm text-muted-foreground">
                  <li>ভিডিও ক্লাস · {fmtBn(6)} টি</li>
                  <li>কুইজ · {fmtBn(2)} টি</li>
                  <li>PDF নোট · {fmtBn(1)} টি</li>
                </ul>
              </details>
            ))}
          </div>
        )}

        {tab === "teacher" && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl bg-primary/10 text-3xl font-bold text-primary">
                {course.instructor.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold">{course.instructor}</h3>
                <p className="mt-1 text-sm text-muted-foreground">Uniteacademy — অভিজ্ঞ ফ্যাকাল্টি</p>
                <p className="mt-3 text-[15px] leading-loose text-foreground/80">
                  ইসলামী জ্ঞানচর্চা ও শিক্ষাদানে দীর্ঘ অভিজ্ঞতাসম্পন্ন। বিশুদ্ধ আকীদা ও প্রামাণিক দলিলের ভিত্তিতে সহজবোধ্যভাবে বিষয়টি উপস্থাপন করেন।
                </p>
              </div>
            </div>
          </div>
        )}

        {tab === "reviews" && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <div className="text-4xl">⭐</div>
            <p className="mt-3 text-lg font-semibold">{course.rating} / ৫</p>
            <p className="mt-1 text-sm text-muted-foreground">এখনো কোনো লিখিত রিভিউ নেই। আপনি প্রথম হতে পারেন।</p>
          </div>
        )}
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-border bg-muted/30 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold">সম্পর্কিত কোর্স</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => <CourseCard key={c.slug} course={c} />)}
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0 last:pb-0">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-semibold">{v}</dd>
    </div>
  );
}
