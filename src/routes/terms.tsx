import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileText,
  ShieldCheck,
  ScrollText,
  UserCheck,
  CreditCard,
  Ban,
  Scale,
  Mail,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "শর্তাবলি — Uniteacademy" },
      {
        name: "description",
        content:
          "Uniteacademy ব্যবহারের শর্তাবলি — অ্যাকাউন্ট, কোর্স অ্যাক্সেস, পেমেন্ট, বৌদ্ধিক সম্পত্তি ও দায়বদ্ধতা সংক্রান্ত বিস্তারিত।",
      },
      { property: "og:title", content: "শর্তাবলি — Uniteacademy" },
      {
        property: "og:description",
        content: "Uniteacademy ব্যবহারের শর্তাবলি ও নিয়মকানুন।",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermsPage,
});

const sections = [
  {
    id: "acceptance",
    icon: UserCheck,
    title: "১. শর্ত গ্রহণ",
    body: [
      "Uniteacademy-তে অ্যাকাউন্ট তৈরি করে অথবা আমাদের সেবা ব্যবহার করে আপনি এই শর্তাবলির সাথে সম্মত হচ্ছেন।",
      "আপনি যদি এই শর্তগুলোর কোনো অংশে দ্বিমত পোষণ করেন, তবে অনুগ্রহ করে সেবা ব্যবহার থেকে বিরত থাকুন।",
    ],
  },
  {
    id: "account",
    icon: ShieldCheck,
    title: "২. অ্যাকাউন্ট ও নিরাপত্তা",
    body: [
      "সঠিক ও হালনাগাদ তথ্য প্রদান করা আপনার দায়িত্ব।",
      "আপনার পাসওয়ার্ড ও লগইন তথ্যের গোপনীয়তা রক্ষা করা এবং যেকোনো অননুমোদিত ব্যবহারের বিষয়ে অবহিত করা আপনার দায়িত্ব।",
      "একটি অ্যাকাউন্ট শুধুমাত্র একজন ব্যক্তির জন্য — শেয়ার করা নিষিদ্ধ।",
    ],
  },
  {
    id: "content",
    icon: ScrollText,
    title: "৩. কোর্স ও কনটেন্ট",
    body: [
      "সব কোর্স, ভিডিও, নোট, PDF ও অন্যান্য শিক্ষা উপকরণ Uniteacademy বা এর উস্তাদগণের মেধাসম্পত্তি।",
      "শুধু ব্যক্তিগত পড়াশোনার জন্য অ্যাক্সেস প্রদান করা হয় — পুনঃবিতরণ, ডাউনলোড করে বিক্রি বা পুনঃপ্রকাশ কঠোরভাবে নিষিদ্ধ।",
    ],
  },
  {
    id: "payment",
    icon: CreditCard,
    title: "৪. পেমেন্ট ও রিফান্ড",
    body: [
      "কোর্স মূল্য ওয়েবসাইটে প্রদর্শিত অনুযায়ী প্রযোজ্য এবং পূর্ব ঘোষণা ছাড়া পরিবর্তনযোগ্য।",
      "রিফান্ড আমাদের রিফান্ড পলিসি অনুযায়ী নির্দিষ্ট সময়সীমার মধ্যে গ্রহণযোগ্য হবে।",
    ],
  },
  {
    id: "prohibited",
    icon: Ban,
    title: "৫. নিষিদ্ধ কার্যক্রম",
    body: [
      "প্ল্যাটফর্মে ইসলাম-বিরোধী, আপত্তিকর বা অসম্মানজনক কন্টেন্ট শেয়ার করা যাবে না।",
      "অন্য ব্যবহারকারীর অ্যাকাউন্ট, তথ্য বা কোর্সে অননুমোদিত অ্যাক্সেসের চেষ্টা নিষিদ্ধ।",
      "স্বয়ংক্রিয় স্ক্রেপিং, বট বা রিভার্স ইঞ্জিনিয়ারিং অনুমোদিত নয়।",
    ],
  },
  {
    id: "liability",
    icon: Scale,
    title: "৬. দায়বদ্ধতা",
    body: [
      "Uniteacademy সর্বোচ্চ চেষ্টা করে সঠিক ও নির্ভরযোগ্য তথ্য প্রদান করতে, তবে সেবা “as-is” ভিত্তিতে সরবরাহ করা হয়।",
      "সেবা ব্যবহারের ফলে সংঘটিত পরোক্ষ বা আনুষঙ্গিক ক্ষতির জন্য আমরা দায়ী নই।",
    ],
  },
];

function TermsPage() {
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
                <FileText className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                Legal • Terms of Service
              </div>
            </div>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              শর্তাবলি
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Uniteacademy-তে স্বাগতম। আমাদের সেবা ব্যবহারের পূর্বে অনুগ্রহ করে
              নিচের শর্তাবলি ভালোভাবে পড়ুন। এগুলো আপনার এবং আমাদের অধিকার ও
              দায়িত্ব সংজ্ঞায়িত করে।
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3.5 py-1.5 text-xs font-medium text-foreground/80 backdrop-blur">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              সর্বশেষ হালনাগাদ: ৭ জুলাই, ২০২৬
            </div>
          </div>
        </section>

        {/* Body — TOC + sections */}
        <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            {/* TOC */}
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

            {/* Sections */}
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

              {/* Contact card */}
              <article className="relative overflow-hidden rounded-2xl p-6 sm:p-8">
                <div aria-hidden className="absolute inset-0 gradient-primary opacity-95" />
                <div className="relative text-primary-foreground">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
                      <Mail className="h-5 w-5" strokeWidth={2.3} />
                    </span>
                    <h2 className="text-xl font-bold sm:text-2xl">প্রশ্ন আছে?</h2>
                  </div>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/90 sm:text-base">
                    এই শর্তাবলি সম্পর্কে কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন।
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
