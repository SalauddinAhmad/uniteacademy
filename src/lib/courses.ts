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

export type Course = {
  slug: string;
  title_bn: string;
  title_en: string;
  instructor: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: string;
  lessons: number;
  price: number;
  originalPrice?: number;
  rating: number;
  students: number;
  cover: string; // gradient token (fallback tint)
  emoji: string;
  thumbnail: string; // book cover image
  description: string;
};

export const courses: Course[] = [
  {
    slug: "diploma-islamic-studies",
    title_bn: "ডিপ্লোমা ইন ইসলামিক স্টাডিজ",
    title_en: "Diploma in Islamic Studies",
    instructor: "ড. ইমাম হোসেন",
    category: "ডিপ্লোমা",
    level: "intermediate",
    duration: "১২ মাস",
    lessons: 240,
    price: 12000,
    originalPrice: 18000,
    rating: 4.9,
    students: 3420,
    cover: "from-indigo-600 to-violet-700",
    emoji: "🕌",
    thumbnail: diplomaCover,
    description: "কুরআন, হাদীস, ফিকহ ও ইসলামী ইতিহাসের পূর্ণাঙ্গ ১২ মাসের ডিপ্লোমা প্রোগ্রাম।",
  },
  {
    slug: "rasul-shikkhadan-poddhoti",
    title_bn: "রাসূল (সাঃ) এর শিক্ষাদান পদ্ধতি",
    title_en: "The Prophet's Teaching Methods",
    instructor: "ড. ইমাম হোসেন",
    category: "সীরাত",
    level: "beginner",
    duration: "৮ সপ্তাহ",
    lessons: 42,
    price: 1500,
    rating: 4.8,
    students: 1820,
    cover: "from-blue-600 to-indigo-700",
    emoji: "📖",
    thumbnail: rasulCover,
    description: "রাসূলুল্লাহ (সাঃ) কীভাবে সাহাবীদের শিক্ষা দিতেন — ১২টি মডিউলে বিস্তারিত।",
  },
  {
    slug: "fiqh-taharat",
    title_bn: "ফিকহুত তাহারাত",
    title_en: "Fiqh of Purification",
    instructor: "মুফতি আব্দুল্লাহ",
    category: "ফিকহ",
    level: "beginner",
    duration: "৬ সপ্তাহ",
    lessons: 28,
    price: 800,
    rating: 4.7,
    students: 2140,
    cover: "from-cyan-600 to-blue-700",
    emoji: "💧",
    thumbnail: taharatCover,
    description: "পবিত্রতা ও অজু-গোসল সংক্রান্ত ফিকহের বিস্তারিত পাঠ।",
  },
  {
    slug: "fiqh-siyam",
    title_bn: "ফিকহুস সিয়াম",
    title_en: "Fiqh of Fasting",
    instructor: "ড. মুহাম্মাদ সাইফুল্লাহ",
    category: "ফিকহ",
    level: "intermediate",
    duration: "৪ সপ্তাহ",
    lessons: 22,
    price: 700,
    rating: 4.9,
    students: 1560,
    cover: "from-amber-500 to-orange-600",
    emoji: "🌙",
    thumbnail: siyamCover,
    description: "রমাদান ও সিয়ামের ফিকহি বিধিবিধান — বাস্তব উদাহরণসহ।",
  },
  {
    slug: "sirat-makki",
    title_bn: "সীরাতে রাসূল (সাঃ) — মাক্কী যুগ",
    title_en: "Seerah — Meccan Era",
    instructor: "ড. আব্দুল্লাহি কাফী",
    category: "সীরাত",
    level: "beginner",
    duration: "১০ সপ্তাহ",
    lessons: 55,
    price: 1200,
    rating: 4.9,
    students: 2890,
    cover: "from-emerald-600 to-teal-700",
    emoji: "🕋",
    thumbnail: siratCover,
    description: "মক্কার ১৩ বছরের রাসূল (সাঃ) এর জীবন — গভীর বিশ্লেষণ।",
  },
  {
    slug: "quran-bujhar-mulniti",
    title_bn: "কুরআন বুঝার মূলনীতি",
    title_en: "Principles of Understanding Quran",
    instructor: "ড. ইমাম হোসেন",
    category: "কুরআন",
    level: "intermediate",
    duration: "১২ সপ্তাহ",
    lessons: 60,
    price: 1800,
    rating: 4.8,
    students: 1240,
    cover: "from-violet-600 to-purple-700",
    emoji: "📗",
    thumbnail: quranMulnitiCover,
    description: "উলূমুল কুরআন — কুরআন বুঝতে হলে যে মূলনীতি জানা জরুরি।",
  },
  {
    slug: "fiqh-salat",
    title_bn: "ফিকহুস সালাত",
    title_en: "Fiqh of Prayer",
    instructor: "ড. মুহাম্মাদ মানজুর ইলাহী",
    category: "ফিকহ",
    level: "beginner",
    duration: "৮ সপ্তাহ",
    lessons: 40,
    price: 1000,
    rating: 4.9,
    students: 3210,
    cover: "from-rose-500 to-pink-700",
    emoji: "🤲",
    thumbnail: salatCover,
    description: "সালাতের সম্পূর্ণ ফিকহ — নিয়ম, ভুল ও সমাধান।",
  },
  {
    slug: "islami-akidar-porichoy",
    title_bn: "ইসলামী আকীদার পরিচয়",
    title_en: "Introduction to Islamic Creed",
    instructor: "ড. মোহাম্মাদ মানজুর ইলাহী",
    category: "আকীদাহ",
    level: "beginner",
    duration: "৬ সপ্তাহ",
    lessons: 30,
    price: 900,
    rating: 4.8,
    students: 1980,
    cover: "from-green-600 to-emerald-700",
    emoji: "🌱",
    thumbnail: akidaCover,
    description: "সহীহ আকীদার ভিত্তি ও তার বাস্তব প্রয়োগ।",
  },
  {
    slug: "ilm-orjoner-adob",
    title_bn: "ইলম অর্জনের আদব",
    title_en: "Etiquettes of Seeking Knowledge",
    instructor: "শায়খ আহমাদ",
    category: "আদাব",
    level: "beginner",
    duration: "৪ সপ্তাহ",
    lessons: 18,
    price: 500,
    rating: 4.7,
    students: 4210,
    cover: "from-amber-600 to-yellow-700",
    emoji: "📚",
    thumbnail: ilmAdobCover,
    description: "একজন তালিবুল ইলমের চরিত্র, আচরণ ও প্রস্তুতি।",
  },
  {
    slug: "study-skills",
    title_bn: "অধ্যয়ন দক্ষতা (Study Skills)",
    title_en: "Study Skills",
    instructor: "মুহাম্মাদ জুনায়েদ যুনির",
    category: "স্কিল",
    level: "beginner",
    duration: "৫ সপ্তাহ",
    lessons: 25,
    price: 600,
    rating: 4.6,
    students: 1120,
    cover: "from-sky-500 to-cyan-700",
    emoji: "✍️",
    thumbnail: studyCover,
    description: "কার্যকর পড়াশোনা, নোট নেওয়া ও সময় ব্যবস্থাপনা।",
  },
  {
    slug: "talimul-quran-primary",
    title_bn: "তা'লীমুল কুরআন (Primary Level)",
    title_en: "Talimul Quran — Primary",
    instructor: "ক্বারী আব্দুর রহমান",
    category: "কুরআন",
    level: "beginner",
    duration: "৬ মাস",
    lessons: 90,
    price: 2500,
    originalPrice: 3500,
    rating: 4.9,
    students: 5340,
    cover: "from-teal-600 to-emerald-700",
    emoji: "🕊️",
    thumbnail: talimulCover,
    description: "শুদ্ধভাবে কুরআন পড়া শেখার প্রাথমিক কোর্স।",
  },
];

export const categories = [
  "সবগুলো", "ডিপ্লোমা", "কুরআন", "সীরাত", "ফিকহ", "আকীদাহ", "আদাব", "স্কিল",
];

export function fmtBn(n: number): string {
  const bn = "০১২৩৪৫৬৭৮৯";
  return n.toString().replace(/\d/g, (d) => bn[+d]);
}
