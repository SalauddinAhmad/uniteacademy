import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  BookOpen,
  GraduationCap,
  Users,
  Globe2,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Target,
  Compass,
  Star,
  ArrowRight,
} from "lucide-react";
import { fmtBn } from "@/lib/courses";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "আমাদের সম্পর্কে — Uniteacademy" },
      {
        name: "description",
        content:
          "Uniteacademy একটি প্রিমিয়াম ইসলামী অনলাইন একাডেমি — কুরআন, হাদীস, ফিকহ, সীরাত ও আকীদাহ শেখানোর মাধ্যমে দ্বীন-দুনিয়ার আলো ছড়িয়ে দিচ্ছি।",
      },
      { property: "og:title", content: "আমাদের সম্পর্কে — Uniteacademy" },
      {
        property: "og:description",
        content:
          "আমাদের লক্ষ্য, দৃষ্টিভঙ্গি এবং অভিজ্ঞ উস্তাদদের গল্প — Uniteacademy সম্পর্কে জানুন।",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AboutPage,
});

const stats = [
  { value: "১১", label: "মানসম্পন্ন কোর্স", icon: BookOpen },
  { value: "১২+", label: "অভিজ্ঞ উস্তাদ", icon: GraduationCap },
  { value: "৫,০০০+", label: "সক্রিয় শিক্ষার্থী", icon: Users },
  { value: "৩০+", label: "দেশে পৌঁছেছি", icon: Globe2 },
];

const values = [
  {
    icon: ShieldCheck,
    title: "বিশুদ্ধ ইলম",
    desc: "কুরআন ও সহীহ সুন্নাহর আলোকে, নির্ভরযোগ্য উৎস থেকে সংকলিত পাঠ্যক্রম।",
  },
  {
    icon: HeartHandshake,
    title: "আন্তরিক সঙ্গ",
    desc: "প্রতিটি শিক্ষার্থীর যত্ন — প্রশ্ন, পরামর্শ ও ব্যক্তিগত ফিডব্যাক সবসময়।",
  },
  {
    icon: Sparkles,
    title: "প্রিমিয়াম অভিজ্ঞতা",
    desc: "HD ভিডিও, স্পষ্ট বাংলা ব্যাখ্যা, সাজানো নোট ও ইন্টারেক্টিভ কুইজ।",
  },
  {
    icon: Compass,
    title: "জীবন-নির্ভর শিক্ষা",
    desc: "শুধু তথ্য নয় — আমল, আখলাক ও চিন্তার রূপান্তর ঘটানোই আমাদের লক্ষ্য।",
  },
];

const journey = [
  {
    year: "২০২৩",
    title: "স্বপ্নের সূচনা",
    desc: "মাত্র ২ জন উস্তাদ ও ১টি কোর্স দিয়ে Uniteacademy-এর যাত্রা শুরু।",
  },
  {
    year: "২০২৪",
    title: "কমিউনিটি গঠন",
    desc: "বাংলাদেশ, ভারত, মালয়েশিয়া ও মধ্যপ্রাচ্যে ২,০০০+ শিক্ষার্থীর পরিবার।",
  },
  {
    year: "২০২৫",
    title: "পূর্ণাঙ্গ একাডেমি",
    desc: "১১টি কোর্স, লাইভ সেশন, ইজাযাহ প্রোগ্রাম ও ছাত্র ড্যাশবোর্ড চালু।",
  },
  {
    year: "২০২৬",
    title: "বৈশ্বিক প্ল্যাটফর্ম",
    desc: "ইংরেজি-বাংলা দ্বিভাষিক অভিজ্ঞতা, মোবাইল অ্যাপ ও ইজাযাহ সনদায়ন।",
  },
];

const testimonials = [
  {
    quote:
      "Uniteacademy আমার কুরআন শেখার যাত্রাকে সহজ ও আনন্দময় করে দিয়েছে। উস্তাদদের ব্যাখ্যা অসাধারণ।",
    name: "ফাতিমা রহমান",
    role: "শিক্ষার্থী, ঢাকা",
  },
  {
    quote:
      "প্রবাসে থেকেও দ্বীনের গভীর ইলম অর্জনের এত সুন্দর প্ল্যাটফর্ম পাবো ভাবিনি। জাযাকাল্লাহু খাইরান।",
    name: "আব্দুল্লাহ আল-মামুন",
    role: "শিক্ষার্থী, দুবাই",
  },
  {
    quote:
      "কোর্স স্ট্রাকচার, নোট আর কুইজ — সব মিলিয়ে একটা কমপ্লিট ইলমী সফর। আলহামদুলিল্লাহ।",
    name: "উম্মে হাবিবা",
    role: "শিক্ষার্থী, কুয়ালালামপুর",
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 gradient-hero opacity-70" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              আমাদের সম্পর্কে
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              ইলমের আলোয় আলোকিত{" "}
              <span className="text-gradient">প্রতিটি হৃদয়</span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Uniteacademy একটি প্রিমিয়াম ইসলামী অনলাইন একাডেমি — যেখানে কুরআন,
              হাদীস, ফিকহ, সীরাত ও আকীদাহ শেখানো হয় অভিজ্ঞ উস্তাদদের কাছ থেকে,
              বাংলা ভাষায়, আপনার সুবিধামতো সময়ে।
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-xl gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02]"
              >
                কোর্স দেখুন <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                যোগাযোগ করুন
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="glass rounded-2xl p-6 text-center transition-transform hover:-translate-y-1"
              >
                <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-md shadow-primary/25">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 text-3xl font-bold tracking-tight">
                  {s.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass relative overflow-hidden rounded-3xl p-8 lg:p-10">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
              <div className="relative">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary text-primary-foreground shadow-lg shadow-primary/25">
                  <Target className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-2xl font-bold sm:text-3xl">
                  আমাদের লক্ষ্য
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  বাংলা ভাষাভাষী প্রতিটি মুসলিমের কাছে বিশুদ্ধ ইসলামী জ্ঞান
                  সহজলভ্য করে দেওয়া — যাতে তারা কুরআন-সুন্নাহর আলোকে আত্মবিশ্বাসের
                  সাথে দ্বীন-দুনিয়ার জীবন পরিচালনা করতে পারেন।
                </p>
              </div>
            </div>

            <div className="glass relative overflow-hidden rounded-3xl p-8 lg:p-10">
              <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
              <div className="relative">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-lg">
                  <Compass className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-2xl font-bold sm:text-3xl">
                  আমাদের দৃষ্টিভঙ্গি
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  একটি বৈশ্বিক ইসলামী শিক্ষা প্ল্যাটফর্ম গড়ে তোলা — যেখানে
                  প্রযুক্তি, শিক্ষা ও আধ্যাত্মিকতার সমন্বয়ে জন্ম নেবে একটি
                  জ্ঞানপিপাসু, চরিত্রবান ও দায়িত্বশীল প্রজন্ম।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              আমাদের মূল্যবোধ
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              যে নীতিতে আমরা চলি
            </h2>
            <p className="mt-3 text-muted-foreground">
              প্রতিটি কোর্স, প্রতিটি ক্লাস, প্রতিটি ইন্টারঅ্যাকশনের পেছনে থাকে এই চারটি
              মূলনীতি।
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="group glass rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl gradient-primary text-primary-foreground shadow-md shadow-primary/25 transition-transform group-hover:scale-110">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey / Timeline */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              আমাদের যাত্রা
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              স্বপ্ন থেকে বাস্তবতায়
            </h2>
          </div>

          <div className="relative mt-12">
            <div className="pointer-events-none absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent md:left-1/2 md:-translate-x-1/2" />
            <div className="space-y-8">
              {journey.map((j, i) => (
                <div
                  key={j.year}
                  className={`relative flex flex-col gap-4 md:flex-row md:items-center ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="hidden flex-1 md:block" />
                  <div className="absolute left-4 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full gradient-primary text-xs font-bold text-primary-foreground shadow-lg shadow-primary/30 md:left-1/2">
                    <Star className="h-3.5 w-3.5" />
                  </div>
                  <div className="ml-12 flex-1 md:ml-0">
                    <div className="glass rounded-2xl p-6">
                      <div className="text-xs font-semibold text-primary">
                        {j.year}
                      </div>
                      <h3 className="mt-1 text-lg font-bold">{j.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {j.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              শিক্ষার্থীদের কথা
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              যারা আমাদের সাথে আছেন
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="glass flex flex-col rounded-2xl p-6"
              >
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-5 border-t border-border pt-4">
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="glass relative overflow-hidden rounded-3xl p-10 text-center lg:p-16">
            <div className="pointer-events-none absolute inset-0 gradient-hero opacity-60" />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                আজই আপনার ইলমী সফর শুরু করুন
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                {fmtBn(11)}টি প্রিমিয়াম কোর্স, অভিজ্ঞ উস্তাদ এবং একটি আন্তরিক
                কমিউনিটি — সবই অপেক্ষা করছে আপনার জন্য।
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/auth/signup"
                  className="inline-flex items-center gap-2 rounded-xl gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02]"
                >
                  বিনামূল্যে শুরু করুন <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/courses"
                  className="inline-flex items-center rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  সব কোর্স দেখুন
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
