import { Link } from "@tanstack/react-router";
import { Clock, PlayCircle, Star, Users } from "lucide-react";
import { fmtBn, type Course } from "@/lib/courses";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      to="/courses"
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
    >
      <div className={`relative aspect-[16/10] bg-gradient-to-br ${course.cover} overflow-hidden`}>
        <div className="absolute inset-0 grid place-items-center text-7xl opacity-90 transition-transform group-hover:scale-110">
          {course.emoji}
        </div>
        <div className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-primary shadow-sm">
          {course.category}
        </div>
        {course.originalPrice && (
          <div className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-accent-foreground shadow-sm">
            {Math.round((1 - course.price / course.originalPrice) * 100)}% ছাড়
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground group-hover:text-primary">
          {course.title_bn}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">{course.instructor}</p>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {course.duration}</span>
          <span className="inline-flex items-center gap-1"><PlayCircle className="h-3 w-3" /> {fmtBn(course.lessons)} লেসন</span>
          <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {fmtBn(course.students)}</span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="font-semibold">{course.rating}</span>
          </div>
          <div className="text-right">
            {course.originalPrice && (
              <span className="mr-1.5 text-xs text-muted-foreground line-through">৳{fmtBn(course.originalPrice)}</span>
            )}
            <span className="text-lg font-bold text-primary">৳{fmtBn(course.price)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
