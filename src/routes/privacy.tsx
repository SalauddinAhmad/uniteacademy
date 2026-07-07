import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Database,
  Cookie,
  Share2,
  Lock,
  UserCog,
  Baby,
  Mail,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "প্রাইভেসি পলিসি — Uniteacademy" },
      {
        name: "description",
        content:
          "আপনার ব্যক্তিগত তথ্য কীভাবে সংগ্রহ, ব্যবহার ও সুরক্ষিত রাখা হয় — Uniteacademy-র প্রাইভেসি পলিসি।",
      },
      { property: "og:title", content: "প্রাইভেসি পলিসি — Uniteacademy" },
      {
        property: "og:description",
        content: "আপনার তথ্যের গোপনীয়তা ও সুরক্ষা কীভাবে নিশ্চিত করা হয়।",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

const sections = [
  {
    id: "collect",
    icon: Database,
    title: "১. আমরা যে তথ্য সংগ্রহ করি",
    body: [
      "নাম, ইমেইল ও অ্যাকাউন্ট সংক্রান্ত তথ্য যা আপনি সাইনআপের সময় প্রদান করেন।",
      "কোর্স অগ্রগতি, কুইজ ফলাফল ও শেখার কার্যক্রম সংক্রান্ত ডেটা।",
      "ডিভাইস, ব্রাউজার ও অ্যাক্সেসের ধরন সংক্রান্ত সাধারণ প্রযুক্তিগত তথ্য।",
    ],
  },
  {
    id: "use",
    icon: UserCog,
    title: "২. তথ্যের ব্যবহার",
    body: [
      "আপনার শেখার অভিজ্ঞতা উন্নত ও ব্যক্তিগতকৃত করতে।",
      "কোর্স আপডেট, নোটিফিকেশন ও গুরুত্বপূর্ণ ঘোষণা পাঠাতে।",
      "সেবা উন্নয়ন, নিরাপত্তা ও প্রতারণা প্রতিরোধ নিশ্চিত করতে।",
    ],
  },
  {
    id: "cookies",
    icon: Cookie,
    title: "৩. কুকিজ ও ট্র্যাকিং",
    body: [
      "সেশন বজায় রাখতে ও ব্যবহারকারীর পছন্দ মনে রাখতে আমরা কুকিজ ব্যবহার করি।",
      "আপনি ব্রাউজার সেটিং থেকে কুকিজ নিয়ন্ত্রণ করতে পারেন — তবে এতে কিছু ফিচার সীমিত হতে পারে।",
    ],
  },
  {
    id: "share",
    icon: Share2,
    title: "৪. তথ্য শেয়ারিং",
    body: [
      "আমরা আপনার ব্যক্তিগত তথ্য কখনোই তৃতীয় পক্ষের কাছে বিক্রি করি না।",
      "শুধুমাত্র সেবা পরিচালনার জন্য প্রয়োজনীয় বিশ্বস্ত সেবা প্রদানকারী (হোস্টিং, পেমেন্ট, ইমেইল) এর সাথে সীমিত তথ্য শেয়ার করা হয়।",
      "আইনগত বাধ্যবাধকতার ক্ষেত্রে প্রাসঙ্গিক কর্তৃপক্ষকে তথ্য প্রদান করা হতে পারে।",
    ],
  },
  {
    id: "security",
    icon: Lock,
    title: "৫. তথ্য সুরক্ষা",
    body: [
      "সব সংবেদনশীল ডেটা এনক্রিপশনসহ সংরক্ষণ ও ট্রান্সমিট করা হয়।",
      "নিয়মিত নিরাপত্তা যাচাই ও অ্যাক্সেস নিয়ন্ত্রণের মাধ্যমে ডেটা সুরক্ষা নিশ্চিত করা হয়।",
    ],
  },
  {
    id: "rights",
    icon: ShieldCheck,
    title: "৬. আপনার অধিকার",
    body: [
      "আপনার তথ্য অ্যাক্সেস, সংশোধন বা মুছে ফেলার অনুরোধ করতে পারেন।",
      "যেকোনো সময় অ্যাকাউন্ট মুছে ফেলার মাধ্যমে সম্পূর্ণ ডেটা অপসারণের অধিকার আপনার রয়েছে।",
    ],
  },
  {
    id: "children",
    icon: Baby,
    title: "৭. শিশুদের গোপনীয়তা",
    body: [
      "১৩ বছরের কম বয়সী শিশুদের কাছ থেকে আমরা ইচ্ছাকৃতভাবে ব্যক্তিগত তথ্য সংগ্রহ করি না।",
      "অভিভাবকীয় তত্ত্বাবধানে অপ্রাপ্তবয়স্ক শিক্ষার্থীরা সেবা ব্যবহার করতে পারে।",
    ],
  },
];

function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="relative flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 gradient-hero opacity-70" />
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> হোমে ফিরুন
            </Link>

            <div className="mt-6 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-lg shadow-primary/25">
                <ShieldCheck className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                Legal • Privacy Policy
              </div>
            </div>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              প্রাইভেসি পলিসি
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              আপনার গোপনীয়তা আমাদের কাছে গুরুত্বপূর্ণ। এই পলিসিতে ব্যাখ্যা করা
              হয়েছে আমরা কী ধরনের তথ্য সংগ্রহ করি, কীভাবে ব্যবহার করি এবং
              কীভাবে সুরক্ষিত রাখি।
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3.5 py-1.5 text-xs font-medium text-foreground/80 backdrop-blur">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              সর্বশেষ হালনাগাদ: ৭ জুলাই, ২০২৬
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="glass rounded-2xl p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  বিষয়সূচি
                </p>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="block rounded-lg px-2.5 py-1.5 text-foreground/75 hover:bg-muted hover:text-foreground"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            <div className="space-y-5">
              {sections.map((s) => (
                <article
                  key={s.id}
                  id={s.id}
                  className="glass scroll-mt-24 rounded-2xl p-6 sm:p-8"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                      <s.icon className="h-5 w-5" strokeWidth={2.3} />
                    </span>
                    <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                      {s.title}
                    </h2>
                  </div>
                  <div className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/85 sm:text-base">
                    {s.body.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </article>
              ))}

              <article className="relative overflow-hidden rounded-2xl p-6 sm:p-8">
                <div aria-hidden className="absolute inset-0 gradient-primary opacity-95" />
                <div className="relative text-primary-foreground">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
                      <Mail className="h-5 w-5" strokeWidth={2.3} />
                    </span>
                    <h2 className="text-xl font-bold sm:text-2xl">
                      প্রাইভেসি সম্পর্কিত প্রশ্ন?
                    </h2>
                  </div>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/90 sm:text-base">
                    আপনার তথ্য সংক্রান্ত যেকোনো প্রশ্ন বা অনুরোধের জন্য আমাদের সাথে যোগাযোগ করুন।
                  </p>
                  <Link
                    to="/contact"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 text-sm font-semibold text-primary shadow-lg hover:bg-white"
                  >
                    যোগাযোগ করুন
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
