import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, GraduationCap, Users, Award, PlayCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CourseCard } from "@/components/course-card";
import { courses, fmtBn } from "@/lib/courses";

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

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24 lg:px-8 lg:py-32">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              নতুন ব্যাচ শুরু হয়েছে — এখনই যুক্ত হোন
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              ইসলামী জ্ঞান শিখুন <br />
              <span className="text-gradient">ঘরে বসে, নিজের সময়ে</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              কুরআন, হাদীস, ফিকহ ও সীরাতের গভীর জ্ঞান — অভিজ্ঞ উস্তাদদের কাছ থেকে,
              বাংলা মাধ্যমে, বিশ্বমানের কোর্সে।
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/courses"
                className="inline-flex items-center justify-center gap-2 rounded-xl gradient-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-transform hover:scale-[1.02]"
              >
                কোর্স দেখুন <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/auth/signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <PlayCircle className="h-4 w-4" /> ফ্রি ট্রায়াল
              </Link>
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
                    <div className="text-6xl">🕌</div>
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
              <div className="absolute -bottom-6 -left-6 rounded-2xl border border-border bg-card p-4 shadow-lg">
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
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">কেন Uniteacademy?</h2>
            <p className="mt-3 text-muted-foreground">
              ইসলামী শিক্ষার আধুনিক অভিজ্ঞতা — যেখানে ঐতিহ্য মিলেছে প্রযুক্তির সাথে।
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { i: GraduationCap, t: "অভিজ্ঞ উস্তাদ", d: "দেশ ও বিদেশের প্রখ্যাত ইসলামী স্কলার ও শিক্ষকমণ্ডলী।" },
              { i: BookOpen, t: "স্ট্রাকচার্ড কারিকুলাম", d: "মডিউল ভিত্তিক পাঠদান, ভিডিও, পিডিএফ, কুইজ ও পরীক্ষা।" },
              { i: Award, t: "স্বীকৃত সনদ", d: "কোর্স সম্পন্ন হলে পাবেন যাচাইযোগ্য ডিজিটাল সার্টিফিকেট।" },
            ].map((f) => (
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

      {/* Featured courses */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">জনপ্রিয় কোর্সসমূহ</h2>
              <p className="mt-2 text-muted-foreground">এই মুহূর্তে যা শিখছেন হাজার হাজার শিক্ষার্থী</p>
            </div>
            <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2 transition-all">
              সব কোর্স দেখুন <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => <CourseCard key={c.slug} course={c} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 text-primary-foreground sm:p-14">
            <div className="relative z-10 grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-3xl font-bold leading-tight sm:text-4xl">আজই শুরু করুন আপনার ইলমী সফর</h2>
                <p className="mt-3 text-primary-foreground/85">১৫,০০০+ শিক্ষার্থীর সাথে যোগ দিন — শিখুন, বেড়ে উঠুন।</p>
              </div>
              <div className="space-y-3">
                {["ফ্রি ট্রায়াল লেসন", "লাইফটাইম কোর্স অ্যাক্সেস", "যেকোনো ডিভাইসে শিখুন"].map((t) => (
                  <div key={t} className="flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-sm px-4 py-3">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                    <span className="text-sm font-medium">{t}</span>
                  </div>
                ))}
                <Link to="/auth/signup" className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground shadow-lg transition-transform hover:scale-[1.02]">
                  ফ্রি সাইনআপ করুন <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
