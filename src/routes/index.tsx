import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight, BookOpen, GraduationCap, Award, PlayCircle, Sparkles, CheckCircle2,
  Users, Video, FileText, MessageCircle, Clock, ShieldCheck, Globe2, Star,
  Quote, ChevronDown, Radio, FileCheck2, Headphones, Trophy, Heart, Zap,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CourseCard } from "@/components/course-card";
import { courses, categories, fmtBn } from "@/lib/courses";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Uniteacademy — ইসলামী জ্ঞানের অনলাইন একাডেমি" },
      { name: "description", content: "কুরআন, হাদীস, ফিকহ, সীরাত ও ইসলামী স্টাডিজ শিখুন অভিজ্ঞ উস্তাদদের কাছ থেকে — ঘরে বসে, নিজের সময়ে।" },
      { property: "og:title", content: "Uniteacademy — ইসলামী জ্ঞানের অনলাইন একাডেমি" },
      { property: "og:description", content: "কুরআন, হাদীস, ফিকহ ও সীরাত শিখুন বিশ্বমানের অনলাইন কোর্সে।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const featured = courses.slice(0, 6);
  const diplomas = courses.filter((c) => c.category === "ডিপ্লোমা" || /diploma/i.test(c.title_en)).slice(0, 3);
  const spotlight = courses[0];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Hero />
      <TrustLogos />
      <FeaturedSpotlight course={spotlight} />
      <StatsStrip />
      <CategoryBrowser />
      <PopularCourses courses={featured} />
      <BenefitsGrid />
      <DiplomaPrograms diplomas={diplomas.length ? diplomas : courses.slice(0, 3)} />
      <HowItWorks />
      <InstructorsRow />
      <Testimonials />
      <FaqSection />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden gradient-hero">
      <div className="absolute inset-0 -z-10 opacity-40 [background:radial-gradient(60%_50%_at_50%_0%,hsl(var(--primary)/0.25),transparent_70%)]" />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:py-24 lg:px-8 lg:py-32">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            নতুন ব্যাচ শুরু হয়েছে — এখনই যুক্ত হোন
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            ইসলামী জ্ঞানে <br />
            <span className="text-gradient">নিজেকে সমৃদ্ধ করুন</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            কুরআন, হাদীস, ফিকহ ও সীরাতের গভীর জ্ঞান — অভিজ্ঞ উস্তাদদের কাছ থেকে,
            বাংলা মাধ্যমে, বিশ্বমানের অনলাইন কোর্সে। ঘরে বসে, নিজের সময়ে।
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/courses" className="inline-flex items-center justify-center gap-2 rounded-xl gradient-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-transform hover:scale-[1.02]">
              কোর্স ব্রাউজ করুন <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#diploma" className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
              <PlayCircle className="h-4 w-4" /> ডিপ্লোমা প্রোগ্রাম দেখুন
            </a>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
            {[
              { n: "১৫,০০০+", l: "শিক্ষার্থী" },
              { n: "৫০+", l: "কোর্স" },
              { n: "২৫+", l: "উস্তাদ" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl font-bold text-foreground">{s.n}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero visual */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 -z-10 blur-3xl opacity-40 gradient-primary rounded-full" />
          <div className="relative w-full max-w-md">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-2xl shadow-primary/10">
              <div className="aspect-[4/5] rounded-2xl gradient-primary p-8 text-primary-foreground">
                <div className="flex h-full flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="text-6xl">🕌</div>
                    <span className="rounded-full bg-white/20 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Featured</span>
                  </div>
                  <div>
                    <div className="text-xs font-medium opacity-80">চলমান কোর্স</div>
                    <div className="mt-2 text-2xl font-bold leading-tight">
                      ডিপ্লোমা ইন ইসলামিক স্টাডিজ
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs">
                      <span className="opacity-80">অগ্রগতি</span>
                      <span className="font-bold">৮৪%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/20 overflow-hidden">
                      <div className="h-full w-[84%] rounded-full bg-accent" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                {[
                  { i: BookOpen, n: fmtBn(11), l: "কোর্স" },
                  { i: PlayCircle, n: fmtBn(135), l: "কুইজ" },
                  { i: Award, n: fmtBn(3), l: "সার্টিফিকেট" },
                ].map((x, i) => (
                  <div key={i} className="rounded-xl bg-muted p-3">
                    <x.i className="mx-auto h-4 w-4 text-primary" />
                    <div className="mt-1.5 font-bold">{x.n}</div>
                    <div className="text-[10px] text-muted-foreground">{x.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 rounded-2xl border border-border bg-card p-4 shadow-lg animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-accent/20 text-accent">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold">সার্টিফায়েড</div>
                  <div className="text-[10px] text-muted-foreground">স্বীকৃত সনদ</div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 rounded-2xl border border-border bg-card p-3 shadow-lg animate-fade-in">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["🧑🏻‍🎓","👨🏽‍🎓","👩🏻‍🎓"].map((e,i)=>(
                    <div key={i} className="grid h-8 w-8 place-items-center rounded-full border-2 border-card bg-muted text-sm">{e}</div>
                  ))}
                </div>
                <div className="text-xs">
                  <div className="font-bold">১৫,০০০+</div>
                  <div className="text-[10px] text-muted-foreground">শিক্ষার্থী</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Trust strip ---------------- */
function TrustLogos() {
  const items = ["সহীহ আকীদাহ", "বাংলা মাধ্যম", "লাইফটাইম অ্যাক্সেস", "যাচাইযোগ্য সনদ", "মোবাইল ফ্রেন্ডলি", "লাইভ + রেকর্ডেড"];
  return (
    <section className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium text-muted-foreground">
          {items.map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Featured spotlight (diploma banner) ---------------- */
function FeaturedSpotlight({ course }: { course: typeof courses[number] }) {
  return (
    <section id="diploma" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-xl shadow-primary/5">
          <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${course.cover} opacity-95`} />
          <div className="grid gap-8 p-8 text-primary-foreground md:grid-cols-[1.3fr_1fr] md:p-14">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" /> এক্সক্লুসিভ ফ্ল্যাগশিপ প্রোগ্রাম
              </span>
              <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                {course.title_bn}
              </h2>
              <p className="mt-4 max-w-xl text-primary-foreground/85">
                আল্লাহ সুবহানাহু ওয়া তা‘আলা আমাদের জন্য জ্ঞান অর্জন ফরয করেছেন।
                ইসলামের মৌলিক জ্ঞান অর্জনের জন্য পূর্ণাঙ্গ ১২ মাসের অনলাইন প্রোগ্রাম —
                কুরআন, হাদীস, ফিকহ, আকীদাহ, সীরাত ও ইসলামী ইতিহাস।
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  { i: Video, t: `${fmtBn(course.lessons)}+ লেসন` },
                  { i: Clock, t: course.duration },
                  { i: Users, t: `${fmtBn(course.students)}+ শিক্ষার্থী` },
                  { i: Award, t: "সনদ প্রদান" },
                ].map((x) => (
                  <span key={x.t} className="inline-flex items-center gap-2 rounded-lg bg-white/10 backdrop-blur px-3 py-2 text-sm font-medium">
                    <x.i className="h-4 w-4" /> {x.t}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/courses" className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground shadow-lg transition-transform hover:scale-[1.02]">
                  ভর্তি হোন <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/courses" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/20">
                  বিস্তারিত দেখুন
                </Link>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-3">
              {[
                "৬টি প্রধান বিষয়ের সমন্বয়ে গঠিত পূর্ণাঙ্গ সিলেবাস",
                "প্রতি মডিউলে কুইজ, অ্যাসাইনমেন্ট ও ফাইনাল পরীক্ষা",
                "লাইভ ক্লাস + রেকর্ডেড ভিডিও + PDF নোট",
                "টেলিগ্রাম গ্রুপে ২৪/৭ উস্তাদ সাপোর্ট",
                "কোর্স শেষে ডিজিটাল ভেরিফাইড সার্টিফিকেট",
              ].map((t) => (
                <div key={t} className="flex items-start gap-3 rounded-xl bg-white/10 backdrop-blur px-4 py-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
                  <span className="text-sm font-medium">{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Stats strip ---------------- */
function StatsStrip() {
  const stats = [
    { i: BookOpen, n: "৫০+", l: "কোর্স ও কনটেন্ট" },
    { i: Users, n: "১৫,০০০+", l: "সক্রিয় শিক্ষার্থী" },
    { i: GraduationCap, n: "২৫+", l: "শিক্ষক ও স্কলার" },
    { i: FileText, n: "৪০০+", l: "শিক্ষার উপকরণ" },
  ];
  return (
    <section className="bg-secondary/60 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gradient-primary text-primary-foreground">
                <s.i className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="text-2xl font-bold leading-tight">{s.n}</div>
                <div className="truncate text-xs text-muted-foreground">{s.l}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Category browser ---------------- */
function CategoryBrowser() {
  const catMeta: Record<string, { emoji: string; desc: string }> = {
    "ডিপ্লোমা": { emoji: "🎓", desc: "পূর্ণাঙ্গ প্রোগ্রাম" },
    "কুরআন": { emoji: "📗", desc: "তিলাওয়াত ও তাফসীর" },
    "সীরাত": { emoji: "🕋", desc: "রাসূল ﷺ এর জীবন" },
    "ফিকহ": { emoji: "⚖️", desc: "বিধি-বিধান" },
    "আকীদাহ": { emoji: "🌱", desc: "বিশ্বাসের ভিত্তি" },
    "আদাব": { emoji: "🤲", desc: "ইসলামী শিষ্টাচার" },
    "স্কিল": { emoji: "✍️", desc: "জীবন দক্ষতা" },
  };
  const list = categories.filter((c) => c !== "সবগুলো");
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="ক্যাটাগরি অনুযায়ী শিখুন"
          title="যে বিষয়ে আগ্রহ, সেখান থেকে শুরু করুন"
          desc="আপনার প্রয়োজন অনুযায়ী বেছে নিন — শুরু করুন আজই।"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {list.map((c) => {
            const m = catMeta[c] || { emoji: "📘", desc: "" };
            const count = courses.filter((x) => x.category === c).length;
            return (
              <Link
                key={c}
                to="/courses"
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="text-3xl">{m.emoji}</div>
                <div className="mt-3 font-semibold">{c}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{m.desc}</div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{fmtBn(count)} কোর্স</span>
                  <ArrowRight className="h-4 w-4 text-primary opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                </div>
                <div className="pointer-events-none absolute inset-x-0 -bottom-1 h-1 gradient-primary opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Popular courses ---------------- */
function PopularCourses({ courses: list }: { courses: typeof courses }) {
  return (
    <section className="border-y border-border bg-muted/30 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionHead eyebrow="জনপ্রিয় কোর্স" title="যা এখন শিখছেন হাজারো শিক্ষার্থী" desc="সবচেয়ে বেশি এনরোল হওয়া কোর্সগুলো একনজরে।" align="left" />
          </div>
          <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2 transition-all">
            সব কোর্স দেখুন <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => <CourseCard key={c.slug} course={c} />)}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Benefits grid ---------------- */
function BenefitsGrid() {
  const items = [
    { i: Globe2, t: "যেকোনো স্থান থেকে", d: "ইন্টারনেট থাকলেই বাড়ি, অফিস বা যাত্রাপথে শিখুন।" },
    { i: GraduationCap, t: "অভিজ্ঞ উস্তাদ", d: "দেশ-বিদেশের প্রখ্যাত ইসলামী স্কলার ও শিক্ষকমণ্ডলী।" },
    { i: Radio, t: "লাইভ + রেকর্ডেড", d: "লাইভ ক্লাসের সাথে রেকর্ডিং — মিস হলেও পিছিয়ে পড়বেন না।" },
    { i: FileCheck2, t: "কুইজ ও পরীক্ষা", d: "প্রতি মডিউলে মূল্যায়ন — আপনার শেখা যাচাই করুন।" },
    { i: MessageCircle, t: "টেলিগ্রাম সাপোর্ট", d: "উস্তাদ ও সহপাঠীদের সাথে প্রশ্নোত্তরের প্ল্যাটফর্ম।" },
    { i: Award, t: "যাচাইযোগ্য সনদ", d: "কোর্স সম্পন্ন হলে পাবেন ডিজিটাল ভেরিফাইড সার্টিফিকেট।" },
  ];
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="আমাদের কোর্সের সুবিধা"
          title="কেন Uniteacademy?"
          desc="ইসলামী শিক্ষার আধুনিক অভিজ্ঞতা — যেখানে ঐতিহ্য মিলেছে প্রযুক্তির সাথে।"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <div key={f.t} className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
              <div className="grid h-12 w-12 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-lg shadow-primary/25">
                <f.i className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{f.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Diploma programs ---------------- */
function DiplomaPrograms({ diplomas }: { diplomas: typeof courses }) {
  const items = [
    { title: "Diploma in Arabic Language", desc: "দৈনন্দিন জীবনে আরবী কথোপকথন, লিখন ও বোঝার দক্ষতা — সাজানো দারসের মাধ্যমে।", tag: "১২ মাস", emoji: "🅰️", cover: "from-blue-600 to-indigo-700" },
    { title: "Diploma in Islamic Studies", desc: "কুরআন, হাদীস, ফিকহ, আকীদাহ ও সীরাতের পূর্ণাঙ্গ প্রোগ্রাম।", tag: "১২ মাস", emoji: "🕌", cover: "from-indigo-600 to-violet-700" },
    { title: "Diploma in Quran Studies", desc: "তিলাওয়াত, তাজবীদ ও তাফসীরের গভীর অধ্যয়ন।", tag: "১০ মাস", emoji: "📗", cover: "from-emerald-600 to-teal-700" },
  ];
  return (
    <section className="bg-secondary/50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="এক্সক্লুসিভ ডিপ্লোমা"
          title="ডিপ্লোমা কোর্স সমূহ"
          desc="আমাদের ডিপ্লোমা প্রোগ্রামগুলোর মাধ্যমে আরবী ভাষা ও ইসলামের মৌলিক প্রজ্ঞায় নিজেকে সমৃদ্ধ করুন।"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((d) => (
            <div key={d.title} className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-md transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
              <div className={`relative aspect-[16/10] bg-gradient-to-br ${d.cover} p-6 text-primary-foreground`}>
                <div className="flex items-start justify-between">
                  <span className="rounded-full bg-white/20 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Diploma</span>
                  <span className="rounded-full bg-white/20 backdrop-blur px-3 py-1 text-xs font-semibold">{d.tag}</span>
                </div>
                <div className="absolute bottom-6 left-6 text-5xl">{d.emoji}</div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold leading-snug">{d.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{d.desc}</p>
                <Link to="/courses" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all hover:gap-2">
                  বিস্তারিত <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- How it works ---------------- */
function HowItWorks() {
  const steps = [
    { n: "০১", i: Users, t: "অ্যাকাউন্ট তৈরি করুন", d: "মাত্র ১ মিনিটে ফ্রি সাইনআপ — ইমেইল বা Google দিয়ে।" },
    { n: "০২", i: BookOpen, t: "কোর্স বেছে নিন", d: "৫০+ কোর্স থেকে আপনার প্রয়োজন মতো কোর্সে এনরোল করুন।" },
    { n: "০৩", i: Video, t: "শিখুন নিজের সময়ে", d: "লাইভ + রেকর্ডেড ক্লাস, PDF ও কুইজের মাধ্যমে অধ্যয়ন করুন।" },
    { n: "০৪", i: Trophy, t: "সনদ অর্জন করুন", d: "কোর্স সম্পন্ন হলে পাবেন যাচাইযোগ্য ডিজিটাল সার্টিফিকেট।" },
  ];
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="কীভাবে শুরু করবেন"
          title="৪টি সহজ ধাপে শুরু হোক আপনার ইলমী সফর"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.n} className="relative rounded-2xl border border-border bg-card p-6">
              <div className="text-4xl font-bold text-gradient">{s.n}</div>
              <div className="mt-4 grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <s.i className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{s.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.d}</p>
              {i < steps.length - 1 && (
                <div className="pointer-events-none absolute -right-3 top-10 hidden lg:block">
                  <ArrowRight className="h-5 w-5 text-primary/40" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Instructors ---------------- */
function InstructorsRow() {
  const people = [
    { name: "ড. মোহাম্মাদ মানজুর ইলাহী", title: "ইসলামী স্কলার, PhD (মদীনা)", emoji: "🧕🏻", tag: "ফিকহ ও আকীদাহ" },
    { name: "ড. ইমাম হোসেন", title: "মুফাসসির, PhD", emoji: "🧔🏻", tag: "কুরআন ও তাফসীর" },
    { name: "মুফতি আব্দুল্লাহ", title: "ইসলামিক রিসার্চার", emoji: "🧔🏽", tag: "ফিকহ ও ফতোয়া" },
    { name: "ড. আব্দুল্লাহি কাফী", title: "সীরাত বিশেষজ্ঞ", emoji: "🧔🏾", tag: "সীরাত ও ইতিহাস" },
  ];
  return (
    <section className="border-y border-border bg-muted/30 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead eyebrow="আমাদের উস্তাদগণ" title="বিশ্বস্ত ও অভিজ্ঞ শিক্ষকমণ্ডলী" desc="দেশ ও বিদেশের প্রখ্যাত আলেম, স্কলার ও গবেষকদের কাছ থেকে শিখুন।" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {people.map((p) => (
            <div key={p.name} className="rounded-2xl border border-border bg-card p-6 text-center transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
              <div className="mx-auto grid h-24 w-24 place-items-center rounded-full gradient-primary text-5xl">
                {p.emoji}
              </div>
              <h3 className="mt-4 font-semibold">{p.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{p.title}</p>
              <span className="mt-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">{p.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */
function Testimonials() {
  const items = [
    { name: "মোহাম্মাদ মোস্তাফা", role: "শিক্ষার্থী, ঢাকা", text: "আলহামদুলিল্লাহ, Uniteacademy আমার জীবনের মোড় ঘুরিয়ে দিয়েছে। ঘরে বসে আলিমদের কাছ থেকে শেখা এত সহজ হবে ভাবিনি।", stars: 5 },
    { name: "সালমা খাতুন", role: "গৃহিণী, চট্টগ্রাম", text: "রান্নাবান্না ও সংসারের ফাঁকে ফাঁকে শিখতে পারছি — লাইভ মিস হলে রেকর্ডিং তো আছেই। উস্তাদদের সাপোর্টও অসাধারণ।", stars: 5 },
    { name: "আমির ফয়সাল", role: "শিক্ষার্থী, সিলেট", text: "ডিপ্লোমা ইন ইসলামিক স্টাডিজে ভর্তি হয়ে দ্বীনের প্রতি ভালোবাসা বহুগুণে বেড়েছে। রিকমেন্ড করব সবাইকে।", stars: 5 },
  ];
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="শিক্ষার্থীদের কথা"
          title="সাফল্যের প্রতিফলন"
          desc="আমাদের শিক্ষার্থীরা কীভাবে দ্বীনের বিশুদ্ধ জ্ঞানে সমৃদ্ধ হচ্ছেন।"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <figure key={t.name} className="relative rounded-2xl border border-border bg-card p-6 shadow-sm">
              <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/15" />
              <div className="flex gap-1 text-accent">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground/90">
                “{t.text}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <div className="grid h-10 w-10 place-items-center rounded-full gradient-primary text-primary-foreground font-bold">
                  {t.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{t.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function FaqSection() {
  const faqs = [
    { q: "কোর্সে ভর্তি হওয়ার নিয়ম কী?", a: "ফ্রি সাইনআপ করে পছন্দের কোর্স নির্বাচন করুন, পেমেন্ট সম্পন্ন করলেই কোর্স ড্যাশবোর্ডে অ্যাক্সেস পাবেন।" },
    { q: "লাইভ ক্লাস মিস হলে কী হবে?", a: "প্রতিটি লাইভ ক্লাসের রেকর্ডিং ২৪ ঘণ্টার মধ্যে আপনার ড্যাশবোর্ডে আপলোড হয় — যতবার ইচ্ছা দেখতে পারবেন।" },
    { q: "কোর্স ফি ফেরত পাওয়া যাবে কি?", a: "শর্তসাপেক্ষে ৭ দিনের মধ্যে পূর্ণ ফি ফেরতের সুযোগ রয়েছে। বিস্তারিত রিফান্ড পলিসি পেজে দেখুন।" },
    { q: "সার্টিফিকেট কি স্বীকৃত?", a: "আমাদের সব ডিজিটাল সার্টিফিকেট Uniteacademy-এর নিজস্ব যাচাইযোগ্য সনদ — QR কোডের মাধ্যমে যেকোনো সময় ভেরিফাই করা যায়।" },
    { q: "মোবাইল থেকে ক্লাস করা যাবে?", a: "হ্যাঁ, আমাদের প্ল্যাটফর্ম সম্পূর্ণ মোবাইল-ফ্রেন্ডলি — যেকোনো ডিভাইস থেকে সহজেই ক্লাস, কুইজ ও পরীক্ষা দেওয়া যাবে।" },
    { q: "উস্তাদদের সাথে প্রশ্ন করার সুযোগ কি আছে?", a: "প্রতিটি কোর্সের ডেডিকেটেড টেলিগ্রাম গ্রুপে উস্তাদ ও টিএগণ প্রশ্নের উত্তর দেন।" },
  ];
  return (
    <section className="bg-secondary/50 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHead eyebrow="প্রায়শই জিজ্ঞাসিত প্রশ্ন" title="আপনার প্রশ্নের উত্তর" />
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <FaqItem key={i} q={f.q} a={f.a} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
function FaqItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-border bg-card">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold">{q}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-primary transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground animate-fade-in">
          {a}
        </div>
      )}
    </div>
  );
}

/* ---------------- Final CTA ---------------- */
function FinalCta() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 text-primary-foreground sm:p-14">
          <div className="relative z-10 grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl">আজই শুরু করুন আপনার ইলমী সফর</h2>
              <p className="mt-3 text-primary-foreground/85">১৫,০০০+ শিক্ষার্থীর সাথে যোগ দিন — শিখুন, বেড়ে উঠুন, ছড়িয়ে দিন।</p>
            </div>
            <div className="space-y-3">
              {["ফ্রি ট্রায়াল লেসন", "লাইফটাইম কোর্স অ্যাক্সেস", "যেকোনো ডিভাইসে শিখুন"].map((t) => (
                <div key={t} className="flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-sm px-4 py-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                  <span className="text-sm font-medium">{t}</span>
                </div>
              ))}
              <Link to="/courses" className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground shadow-lg transition-transform hover:scale-[1.02]">
                ফ্রি সাইনআপ করুন <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Shared section header ---------------- */
function SectionHead({
  eyebrow, title, desc, align = "center",
}: { eyebrow?: string; title: string; desc?: string; align?: "center" | "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <div className={`inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary ${align === "center" ? "" : ""}`}>
          <Zap className="h-3.5 w-3.5" /> {eyebrow}
        </div>
      )}
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {desc && <p className="mt-3 text-muted-foreground">{desc}</p>}
    </div>
  );
}
