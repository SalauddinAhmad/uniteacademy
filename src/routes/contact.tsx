import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Globe,
  Video,
  Sparkles,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "যোগাযোগ — Uniteacademy" },
      {
        name: "description",
        content:
          "Uniteacademy-এর সাথে যোগাযোগ করুন — কোর্স, ভর্তি, সাপোর্ট বা যেকোনো প্রশ্নে আমরা পাশে আছি।",
      },
      { property: "og:title", content: "যোগাযোগ — Uniteacademy" },
      {
        property: "og:description",
        content:
          "প্রশ্ন, পরামর্শ কিংবা সহযোগিতা — আমাদের টিম আপনার জন্য প্রস্তুত।",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ContactPage,
});

const channels = [
  {
    icon: Mail,
    label: "ইমেইল",
    value: "support@uniteacademy.com",
    hint: "২৪ ঘণ্টার মধ্যে উত্তর",
    href: "mailto:support@uniteacademy.com",
  },
  {
    icon: Phone,
    label: "ফোন",
    value: "+৮৮ ০১XXX-XXXXXX",
    hint: "শনি–বৃহঃ, ১০টা–৮টা",
    href: "tel:+8801000000000",
  },
  {
    icon: MessageCircle,
    label: "হোয়াটসঅ্যাপ",
    value: "চ্যাট শুরু করুন",
    hint: "দ্রুততম সাপোর্ট",
    href: "https://wa.me/8801000000000",
  },
  {
    icon: MapPin,
    label: "ঠিকানা",
    value: "ঢাকা, বাংলাদেশ",
    hint: "সাক্ষাৎ অ্যাপয়েন্টমেন্টে",
    href: "#",
  },
];

const faqs = [
  {
    q: "কোর্সে ভর্তি হওয়ার নিয়ম কী?",
    a: "সাইন আপ করে পছন্দের কোর্সটি নির্বাচন করুন, পেমেন্ট সম্পন্ন করলেই ড্যাশবোর্ডে অ্যাক্সেস পেয়ে যাবেন।",
  },
  {
    q: "কোর্সের মেয়াদ কতদিন?",
    a: "সাধারণত আজীবন অ্যাক্সেস — নিজের সুবিধামতো সময়ে দেখুন, বারবার দেখুন।",
  },
  {
    q: "সার্টিফিকেট পাওয়া যাবে?",
    a: "হ্যাঁ, কোর্স সম্পন্ন করলে ডিজিটাল সার্টিফিকেট এবং নির্দিষ্ট কোর্সে ইজাযাহ প্রদান করা হয়।",
  },
  {
    q: "পেমেন্ট মাধ্যম কী কী?",
    a: "বিকাশ, নগদ, রকেট, কার্ড ও ব্যাংক ট্রান্সফার — সবই সাপোর্ট করা হয়।",
  },
];

function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 gradient-hero opacity-70" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              যোগাযোগ
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              আপনার প্রশ্ন, আমাদের{" "}
              <span className="text-gradient">অগ্রাধিকার</span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
              কোর্স, ভর্তি, টেকনিক্যাল সহযোগিতা কিংবা মতামত — যেকোনো বিষয়ে
              আমাদের টিম আপনার জন্য প্রস্তুত। নিচের যেকোনো মাধ্যমে যোগাযোগ করুন।
            </p>
          </div>
        </div>
      </section>

      {/* Channels */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="group glass rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-md shadow-primary/25 transition-transform group-hover:scale-110">
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {c.label}
                </div>
                <div className="mt-1 text-base font-semibold text-foreground">
                  {c.value}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {c.hint}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="glass relative overflow-hidden rounded-3xl p-8 lg:p-10">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
                <div className="relative">
                  <h2 className="text-2xl font-bold sm:text-3xl">
                    আমাদের একটি বার্তা পাঠান
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    ফর্ম পূরণ করুন, আমরা যত দ্রুত সম্ভব আপনার সাথে যোগাযোগ করবো।
                  </p>

                  <form
                    onSubmit={handleSubmit}
                    className="mt-8 grid gap-5 sm:grid-cols-2"
                  >
                    <div className="sm:col-span-1">
                      <label className="text-xs font-semibold text-foreground/80">
                        আপনার নাম
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="পূর্ণ নাম লিখুন"
                        className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="text-xs font-semibold text-foreground/80">
                        ইমেইল
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="you@example.com"
                        className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="text-xs font-semibold text-foreground/80">
                        ফোন নম্বর
                      </label>
                      <input
                        type="tel"
                        placeholder="+৮৮ ০১XXX-XXXXXX"
                        className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="text-xs font-semibold text-foreground/80">
                        বিষয়
                      </label>
                      <select
                        required
                        className="mt-2 w-full appearance-none rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      >
                        <option>কোর্স সংক্রান্ত</option>
                        <option>ভর্তি সহায়তা</option>
                        <option>পেমেন্ট সমস্যা</option>
                        <option>টেকনিক্যাল সাপোর্ট</option>
                        <option>অন্যান্য</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-foreground/80">
                        আপনার বার্তা
                      </label>
                      <textarea
                        required
                        rows={5}
                        placeholder="বিস্তারিত লিখুন..."
                        className="mt-2 w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-4">
                      <p className="text-xs text-muted-foreground">
                        আপনার তথ্য সম্পূর্ণ গোপন রাখা হবে।
                      </p>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-xl gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02]"
                      >
                        {sent ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" /> বার্তা পাঠানো হয়েছে
                          </>
                        ) : (
                          <>
                            বার্তা পাঠান <Send className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Info sidebar */}
            <div className="space-y-5 lg:col-span-2">
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-md shadow-primary/25">
                    <Clock className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">অফিস সময়</h3>
                </div>
                <ul className="mt-4 space-y-2.5 text-sm">
                  <li className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground">শনি – বৃহস্পতি</span>
                    <span className="font-medium">১০:০০ – ৮:০০</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground">শুক্রবার</span>
                    <span className="font-medium">৩:০০ – ৭:০০</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">সাপোর্ট চ্যাট</span>
                    <span className="font-medium text-primary">২৪/৭</span>
                  </li>
                </ul>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold">সোশ্যাল মিডিয়া</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  আমাদের কমিউনিটির সাথে যুক্ত থাকুন।
                </p>
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {[Globe, Video, Send, MessageCircle].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="grid h-11 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-md hover:shadow-primary/25"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="glass relative overflow-hidden rounded-2xl p-6">
                <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-accent/20 blur-3xl" />
                <div className="relative">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground shadow-md">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-lg font-semibold">আমাদের অফিস</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Uniteacademy HQ
                    <br />
                    বাড়ি #০০, রোড #০০, ব্লক-A,
                    <br />
                    মিরপুর, ঢাকা-১২১৬, বাংলাদেশ।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <HelpCircle className="h-3.5 w-3.5" />
              সাধারণ জিজ্ঞাসা
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              আপনার প্রশ্নের উত্তর
            </h2>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group glass rounded-2xl p-5 transition-all hover:shadow-lg"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="grid h-7 w-7 place-items-center rounded-full border border-border text-muted-foreground transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
