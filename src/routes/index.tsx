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
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-[520px] w-[520px] rounded-full bg-primary/25 blur-[120px]" />
        <div className="absolute top-40 -right-32 h-[420px] w-[420px] rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 md:grid-cols-12 md:py-28 lg:px-8 lg:py-36">
        {/* Left */}
        <div className="md:col-span-7 flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent)]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent" style={{ fontFamily: "Poppins" }}>
              New Semester 2026
            </span>
          </div>

          <h1 className="mt-8 text-5xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            দ্বীন শিক্ষা হোক <br />
            <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
              আধুনিক ও মানসম্মত
            </span>

          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Uniteacademy-এর সাথে আপনার ইসলামিক শিক্ষার যাত্রা শুরু করুন। অভিজ্ঞ
            উস্তাদদের তত্ত্বাবধানে আধুনিক প্রযুক্তির সমন্বয়ে ইলম অর্জন করুন —
            ঘরে বসে, নিজের সময়ে।
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/courses"
              className="inline-flex items-center justify-center gap-2 rounded-xl gradient-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-[0_10px_40px_-10px_var(--color-primary)] transition-transform hover:scale-[1.03]"
            >
              কোর্সগুলো দেখুন <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#diploma"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-8 py-4 text-sm font-semibold text-foreground backdrop-blur-md transition-colors hover:bg-muted"
            >
              <PlayCircle className="h-4 w-4" /> ফ্রি ডেমো ক্লাস
            </a>
          </div>


          <div className="mt-12 flex flex-wrap items-center gap-x-12 gap-y-6 border-t border-border pt-8">
            {[
              { n: "১৫,০০০+", l: "শিক্ষার্থী" },
              { n: "৫০+", l: "কোর্স" },
              { n: "৪.৯/৫", l: "রেটিং" },
            ].map((s, i) => (
              <div key={s.l} className="flex items-center gap-12">
                <div>
                  <div className="text-3xl font-bold text-foreground" style={{ fontFamily: "Poppins" }}>{s.n}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">{s.l}</div>
                </div>
                {i < 2 && <div className="hidden h-10 w-px bg-border sm:block" />}
              </div>
            ))}
          </div>

        </div>

        {/* Right — Featured Card */}
        <div className="md:col-span-5 relative flex items-center">
          <div className="absolute -inset-6 -z-10 rounded-full bg-primary/25 blur-3xl" />
          <div className="relative w-full rounded-3xl border border-border bg-card p-8 shadow-2xl shadow-primary/10 backdrop-blur-2xl">
            <div className="relative aspect-video overflow-hidden rounded-2xl gradient-primary">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
              <div className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                Featured
              </div>
              <div className="absolute bottom-4 left-4 rounded bg-accent px-3 py-1 text-[10px] font-bold uppercase text-accent-foreground" style={{ fontFamily: "Poppins" }}>
                Flagship
              </div>
            </div>
            <h3 className="mt-6 text-2xl font-bold text-foreground">ডিপ্লোমা ইন ইসলামিক স্টাডিজ</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              কুরআন, সুন্নাহ ও সমসাময়িক বিষয়ে পূর্ণাঙ্গ জ্ঞান অর্জনের জন্য
              আমাদের সবচেয়ে জনপ্রিয় ১২ মাসের ফ্ল্যাগশিপ প্রোগ্রাম।
            </p>
            <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
              <div className="flex -space-x-3">
                {["🧕🏻","🧔🏻","🧔🏽"].map((e,i) => (
                  <div key={i} className="grid h-10 w-10 place-items-center rounded-full border-2 border-card bg-primary/20 text-lg">{e}</div>
                ))}
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">কোর্স ফি</div>
                <div className="text-lg font-bold text-primary" style={{ fontFamily: "Poppins" }}>৳ ১২,০০০</div>
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
              <CheckCircle2 className="h-3.5 w-3.5 text-accent" /> {t}
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
    <section id="diploma" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col overflow-hidden rounded-[2rem] border border-border bg-gradient-to-r from-primary/10 via-card to-card shadow-xl shadow-primary/10 backdrop-blur-xl md:flex-row">
          {/* Left: content */}
          <div className="w-full p-10 md:w-1/2 md:p-14">
            <span className="block text-[11px] font-bold uppercase tracking-[0.35em] text-accent" style={{ fontFamily: "Poppins" }}>
              University Standard
            </span>
            <h2 className="mt-5 text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              {course.title_bn}
            </h2>
            <p className="mt-5 max-w-lg text-muted-foreground">
              আল্লাহ সুবহানাহু ওয়া তা'আলা আমাদের জন্য জ্ঞান অর্জন ফরয করেছেন।
              পূর্ণাঙ্গ ১২ মাসের অনলাইন প্রোগ্রাম — কুরআন, হাদীস, ফিকহ, আকীদাহ ও সীরাত।
            </p>

            <ul className="mt-8 space-y-4">
              {[
                "বিশ্বমানের কারিকুলাম ও অভিজ্ঞ ওস্তাদ",
                "লাইভ ক্লাস + রেকর্ডেড ভিডিও + PDF নোট",
                "টেলিগ্রাম গ্রুপে ২৪/৭ উস্তাদ সাপোর্ট",
                "কোর্স শেষে ভেরিফাইড ডিজিটাল সার্টিফিকেট",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-foreground/90">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-sm">{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground shadow-[0_10px_30px_-10px_var(--color-accent)] transition-transform hover:scale-[1.03]"
              >
                ভর্তি হোন <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/courses" className="group inline-flex items-center gap-2 text-sm font-bold text-accent transition-all hover:gap-3">
                বিস্তারিত কারিকুলাম <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right: layered glass certificate visual */}
          <div className="relative flex w-full items-center justify-center overflow-hidden p-10 md:w-1/2 md:min-h-[520px] md:p-14">
            <div className="absolute inset-0 bg-accent/5" />
            <div className="absolute right-10 top-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute bottom-10 left-10 h-40 w-40 rounded-full bg-primary/40 blur-3xl" />

            <div className="relative">
              {/* Back gold card */}
              <div className="absolute inset-0 -m-4 -rotate-6 rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/40 to-transparent backdrop-blur-lg" />
              {/* Front glass card */}
              <div className="relative w-64 rotate-3 rounded-2xl border border-white/20 bg-white/5 p-6 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <Award className="h-6 w-6 text-accent" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "Poppins" }}>Certificate</span>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="h-3 w-3/4 rounded bg-white/15" />
                  <div className="h-3 w-1/2 rounded bg-white/10" />
                </div>
                <div className="mt-6 grid grid-cols-3 gap-2">
                  {[BookOpen, Video, Award].map((I, i) => (
                    <div key={i} className="grid h-14 place-items-center rounded-lg border border-white/10 bg-white/5">
                      <I className="h-4 w-4 text-accent" />
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Verified</div>
                  <ShieldCheck className="h-4 w-4 text-accent" />
                </div>
              </div>
            </div>
          </div>
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
