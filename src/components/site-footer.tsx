import { Link } from "@tanstack/react-router";
import { BookOpen, Mail, Phone, Send } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground">
                <BookOpen className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold">Uniteacademy</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              ইসলামী জ্ঞানের অনলাইন একাডেমি — কুরআন, হাদীস, ফিকহ ও সীরাত শিখুন
              অভিজ্ঞ উস্তাদদের কাছ থেকে।
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold">কুইক লিংক</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground">হোম</Link></li>
              <li><Link to="/courses" className="hover:text-foreground">কোর্সসমূহ</Link></li>
              <li><Link to="/about" className="hover:text-foreground">আমাদের সম্পর্কে</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">যোগাযোগ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">সাপোর্ট</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>সাহায্য কেন্দ্র</li>
              <li>প্রাইভেসি পলিসি</li>
              <li>শর্তাবলি</li>
              <li>রিফান্ড পলিসি</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">যোগাযোগ</h4>
            <p className="mt-4 text-sm text-muted-foreground">support@uniteacademy.com</p>
            <p className="mt-1 text-sm text-muted-foreground">+৮৮ ০১XXX XXXXXX</p>
            <div className="mt-4 flex gap-2">
              {[Mail, Phone, Send].map((Icon, i) => (
                <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Uniteacademy. সর্বস্বত্ব সংরক্ষিত।</p>
          <p>বাংলাদেশ থেকে ভালোবাসায় তৈরি ❤️</p>
        </div>
      </div>
    </footer>
  );
}
