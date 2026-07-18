// UI-only enrichment per course slug: category label, gradient cover,
// emoji, English title, and the bundled thumbnail image. These are merged
// with API-fetched course data so the design stays intact even if the
// backend does not carry these presentational fields.

import diplomaCover from "@/assets/courses/diploma-islamic-studies.jpg";
import rasulCover from "@/assets/courses/rasul-shikkhadan-poddhoti.jpg";
import taharatCover from "@/assets/courses/fiqh-taharat.jpg";
import siyamCover from "@/assets/courses/fiqh-siyam.jpg";
import siratCover from "@/assets/courses/sirat-makki.jpg";
import quranMulnitiCover from "@/assets/courses/quran-bujhar-mulniti.jpg";
import salatCover from "@/assets/courses/fiqh-salat.jpg";
import akidaCover from "@/assets/courses/islami-akidar-porichoy.jpg";
import ilmAdobCover from "@/assets/courses/ilm-orjoner-adob.jpg";
import studyCover from "@/assets/courses/study-skills.jpg";
import talimulCover from "@/assets/courses/talimul-quran-primary.jpg";

export type CourseMeta = {
  category: string;
  cover: string; // tailwind gradient tokens
  emoji: string;
  title_en: string;
  thumbnail: string;
};

export const COURSE_META: Record<string, CourseMeta> = {
  "diploma-islamic-studies": {
    category: "ডিপ্লোমা", cover: "from-indigo-600 to-violet-700", emoji: "🕌",
    title_en: "Diploma in Islamic Studies", thumbnail: diplomaCover,
  },
  "rasul-shikkhadan-poddhoti": {
    category: "সীরাত", cover: "from-blue-600 to-indigo-700", emoji: "📖",
    title_en: "The Prophet's Teaching Methods", thumbnail: rasulCover,
  },
  "fiqh-taharat": {
    category: "ফিকহ", cover: "from-cyan-600 to-blue-700", emoji: "💧",
    title_en: "Fiqh of Purification", thumbnail: taharatCover,
  },
  "fiqh-siyam": {
    category: "ফিকহ", cover: "from-amber-500 to-orange-600", emoji: "🌙",
    title_en: "Fiqh of Fasting", thumbnail: siyamCover,
  },
  "sirat-makki": {
    category: "সীরাত", cover: "from-emerald-600 to-teal-700", emoji: "🕋",
    title_en: "Seerah — Meccan Era", thumbnail: siratCover,
  },
  "quran-bujhar-mulniti": {
    category: "কুরআন", cover: "from-violet-600 to-purple-700", emoji: "📗",
    title_en: "Principles of Understanding Quran", thumbnail: quranMulnitiCover,
  },
  "fiqh-salat": {
    category: "ফিকহ", cover: "from-rose-500 to-pink-700", emoji: "🤲",
    title_en: "Fiqh of Prayer", thumbnail: salatCover,
  },
  "islami-akidar-porichoy": {
    category: "আকীদাহ", cover: "from-green-600 to-emerald-700", emoji: "🌱",
    title_en: "Introduction to Islamic Creed", thumbnail: akidaCover,
  },
  "ilm-orjoner-adob": {
    category: "আদাব", cover: "from-amber-600 to-yellow-700", emoji: "📚",
    title_en: "Etiquettes of Seeking Knowledge", thumbnail: ilmAdobCover,
  },
  "study-skills": {
    category: "স্কিল", cover: "from-sky-500 to-cyan-700", emoji: "✍️",
    title_en: "Study Skills", thumbnail: studyCover,
  },
  "talimul-quran-primary": {
    category: "কুরআন", cover: "from-teal-600 to-emerald-700", emoji: "🕊️",
    title_en: "Talimul Quran — Primary", thumbnail: talimulCover,
  },
};

export const FALLBACK_META: CourseMeta = {
  category: "কোর্স",
  cover: "from-indigo-600 to-violet-700",
  emoji: "📘",
  title_en: "",
  thumbnail: diplomaCover,
};

export function getCourseMeta(slug: string): CourseMeta {
  return COURSE_META[slug] ?? FALLBACK_META;
}
