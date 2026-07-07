import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CourseCard } from "@/components/course-card";
import { categories, courses, fmtBn } from "@/lib/courses";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "কোর্সসমূহ — Uniteacademy" },
      { name: "description", content: "Uniteacademy-এর সব ইসলামী কোর্স — কুরআন, হাদীস, ফিকহ, সীরাত, আকীদাহ ও আরও অনেক।" },
      { property: "og:title", content: "কোর্সসমূহ — Uniteacademy" },
      { property: "og:description", content: "অভিজ্ঞ উস্তাদদের কাছ থেকে ইসলামী জ্ঞান অর্জনের সেরা কোর্সগুলো।" },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("সবগুলো");
  const [level, setLevel] = useState<string>("all");

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (cat !== "সবগুলো" && c.category !== cat) return false;
      if (level !== "all" && c.level !== level) return false;
      if (query && !(`${c.title_bn} ${c.title_en} ${c.instructor}`.toLowerCase().includes(query.toLowerCase()))) return false;
      return true;
    });
  }, [query, cat, level]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="border-b border-border gradient-hero">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              {fmtBn(courses.length)}+ কোর্স উপলব্ধ
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">সব কোর্স ব্রাউজ করুন</h1>
            <p className="mt-3 text-muted-foreground">আপনার আগ্রহ ও স্তর অনুযায়ী সেরা কোর্সটি বেছে নিন।</p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="কোর্স, উস্তাদ বা বিষয় খুঁজুন..."
                className="w-full rounded-xl border border-border bg-card py-3.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="appearance-none rounded-xl border border-border bg-card py-3.5 pl-11 pr-10 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">সব স্তর</option>
                <option value="beginner">বিগিনার</option>
                <option value="intermediate">ইন্টারমিডিয়েট</option>
                <option value="advanced">অ্যাডভান্সড</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  cat === c
                    ? "gradient-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "border border-border bg-card text-foreground/70 hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{fmtBn(filtered.length)}</span> টি কোর্স পাওয়া গেছে
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-20 text-center">
              <div className="text-4xl">🔍</div>
              <p className="mt-4 font-semibold">কোনো কোর্স পাওয়া যায়নি</p>
              <p className="mt-1 text-sm text-muted-foreground">অন্য ফিল্টার বা সার্চ চেষ্টা করুন</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c) => <CourseCard key={c.slug} course={c} />)}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
