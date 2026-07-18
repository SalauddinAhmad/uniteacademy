import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ROUNDS = Number(process.env.BCRYPT_ROUNDS ?? 10);
const CDN = process.env.PUBLIC_UPLOAD_URL ?? "http://localhost:4000/uploads";

type SeedCourse = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  cover: string;
  level: "beginner" | "intermediate" | "advanced";
  durationWeeks: number;
  totalLessons: number;
  priceCents: number;
  originalPriceCents?: number;
  rating: number;
  ratingsCount: number;
  featured?: boolean;
  instructorName: string;
};

const courses: SeedCourse[] = [
  { slug: "diploma-islamic-studies", title: "ডিপ্লোমা ইন ইসলামিক স্টাডিজ", subtitle: "Diploma in Islamic Studies", description: "কুরআন, হাদীস, ফিকহ ও ইসলামী ইতিহাসের পূর্ণাঙ্গ ১২ মাসের ডিপ্লোমা প্রোগ্রাম।", cover: "diploma-islamic-studies.jpg", level: "intermediate", durationWeeks: 52, totalLessons: 240, priceCents: 1200000, originalPriceCents: 1800000, rating: 4.9, ratingsCount: 3420, featured: true, instructorName: "ড. ইমাম হোসেন" },
  { slug: "rasul-shikkhadan-poddhoti", title: "রাসূল (সাঃ) এর শিক্ষাদান পদ্ধতি", subtitle: "The Prophet's Teaching Methods", description: "রাসূলুল্লাহ (সাঃ) কীভাবে সাহাবীদের শিক্ষা দিতেন — ১২টি মডিউলে বিস্তারিত।", cover: "rasul-shikkhadan-poddhoti.jpg", level: "beginner", durationWeeks: 8, totalLessons: 42, priceCents: 150000, rating: 4.8, ratingsCount: 1820, instructorName: "ড. ইমাম হোসেন" },
  { slug: "fiqh-taharat", title: "ফিকহুত তাহারাত", subtitle: "Fiqh of Purification", description: "পবিত্রতা ও অজু-গোসল সংক্রান্ত ফিকহের বিস্তারিত পাঠ।", cover: "fiqh-taharat.jpg", level: "beginner", durationWeeks: 6, totalLessons: 28, priceCents: 80000, rating: 4.7, ratingsCount: 2140, instructorName: "মুফতি আব্দুল্লাহ" },
  { slug: "fiqh-siyam", title: "ফিকহুস সিয়াম", subtitle: "Fiqh of Fasting", description: "রমাদান ও সিয়ামের ফিকহি বিধিবিধান — বাস্তব উদাহরণসহ।", cover: "fiqh-siyam.jpg", level: "intermediate", durationWeeks: 4, totalLessons: 22, priceCents: 70000, rating: 4.9, ratingsCount: 1560, instructorName: "ড. মুহাম্মাদ সাইফুল্লাহ" },
  { slug: "sirat-makki", title: "সীরাতে রাসূল (সাঃ) — মাক্কী যুগ", subtitle: "Seerah — Meccan Era", description: "মক্কার ১৩ বছরের রাসূল (সাঃ) এর জীবন — গভীর বিশ্লেষণ।", cover: "sirat-makki.jpg", level: "beginner", durationWeeks: 10, totalLessons: 55, priceCents: 120000, rating: 4.9, ratingsCount: 2890, instructorName: "ড. আব্দুল্লাহি কাফী" },
  { slug: "quran-bujhar-mulniti", title: "কুরআন বুঝার মূলনীতি", subtitle: "Principles of Understanding Quran", description: "উলূমুল কুরআন — কুরআন বুঝতে হলে যে মূলনীতি জানা জরুরি।", cover: "quran-bujhar-mulniti.jpg", level: "intermediate", durationWeeks: 12, totalLessons: 60, priceCents: 180000, rating: 4.8, ratingsCount: 1240, instructorName: "ড. ইমাম হোসেন" },
  { slug: "fiqh-salat", title: "ফিকহুস সালাত", subtitle: "Fiqh of Prayer", description: "সালাতের সম্পূর্ণ ফিকহ — নিয়ম, ভুল ও সমাধান।", cover: "fiqh-salat.jpg", level: "beginner", durationWeeks: 8, totalLessons: 40, priceCents: 100000, rating: 4.9, ratingsCount: 3210, instructorName: "ড. মুহাম্মাদ মানজুর ইলাহী" },
  { slug: "islami-akidar-porichoy", title: "ইসলামী আকীদার পরিচয়", subtitle: "Introduction to Islamic Creed", description: "সহীহ আকীদার ভিত্তি ও তার বাস্তব প্রয়োগ।", cover: "islami-akidar-porichoy.jpg", level: "beginner", durationWeeks: 6, totalLessons: 30, priceCents: 90000, rating: 4.8, ratingsCount: 1980, instructorName: "ড. মোহাম্মাদ মানজুর ইলাহী" },
  { slug: "ilm-orjoner-adob", title: "ইলম অর্জনের আদব", subtitle: "Etiquettes of Seeking Knowledge", description: "একজন তালিবুল ইলমের চরিত্র, আচরণ ও প্রস্তুতি।", cover: "ilm-orjoner-adob.jpg", level: "beginner", durationWeeks: 4, totalLessons: 18, priceCents: 50000, rating: 4.7, ratingsCount: 4210, instructorName: "শায়খ আহমাদ" },
  { slug: "study-skills", title: "অধ্যয়ন দক্ষতা (Study Skills)", subtitle: "Study Skills", description: "কার্যকর পড়াশোনা, নোট নেওয়া ও সময় ব্যবস্থাপনা।", cover: "study-skills.jpg", level: "beginner", durationWeeks: 5, totalLessons: 25, priceCents: 60000, rating: 4.6, ratingsCount: 1120, instructorName: "মুহাম্মাদ জুনায়েদ যুনির" },
  { slug: "talimul-quran-primary", title: "তা'লীমুল কুরআন (Primary Level)", subtitle: "Talimul Quran — Primary", description: "শুদ্ধভাবে কুরআন পড়া শেখার প্রাথমিক কোর্স।", cover: "talimul-quran-primary.jpg", level: "beginner", durationWeeks: 24, totalLessons: 90, priceCents: 250000, originalPriceCents: 350000, rating: 4.9, ratingsCount: 5340, instructorName: "ক্বারী আব্দুর রহমান" },
];

async function ensureUser(email: string, fullName: string, role: "student" | "teacher" | "admin", password: string) {
  const passwordHash = await bcrypt.hash(password, ROUNDS);
  return prisma.user.upsert({
    where: { email },
    update: { fullName, role },
    create: { email, fullName, role, passwordHash, emailVerified: true },
  });
}

async function main() {
  console.log("🌱 Seeding Uniteacademy database...\n");

  // 1. Admin + demo student
  const admin = await ensureUser("admin@uniteacademy.com", "Admin", "admin", "Admin@12345");
  const student = await ensureUser("student@uniteacademy.com", "ডেমো ছাত্র", "student", "Student@12345");
  console.log(`✅ admin: ${admin.email} / Admin@12345`);
  console.log(`✅ student: ${student.email} / Student@12345`);

  // 2. Instructors (unique names from courses list)
  const instructorMap = new Map<string, string>();
  const instructorNames = Array.from(new Set(courses.map((c) => c.instructorName)));
  for (const name of instructorNames) {
    const email = `${name.replace(/\s+/g, ".").toLowerCase()}@uniteacademy.com`;
    const teacher = await ensureUser(email, name, "teacher", "Teacher@12345");
    instructorMap.set(name, teacher.id);
  }
  console.log(`✅ ${instructorNames.length} teachers`);

  // 3. DIS program
  const dis = await prisma.program.upsert({
    where: { slug: "dis-batch-11" },
    update: {},
    create: {
      slug: "dis-batch-11",
      title: "ডিপ্লোমা ইন ইসলামিক স্টাডিজ — ব্যাচ ১১",
      description: "১২ মাসের ফ্ল্যাগশিপ প্রোগ্রাম।",
      coverUrl: `${CDN}/course-covers/diploma-islamic-studies.jpg`,
    },
  });
  console.log(`✅ program: ${dis.slug}`);

  // 4. Courses
  for (const c of courses) {
    await prisma.course.upsert({
      where: { slug: c.slug },
      update: {
        title: c.title,
        subtitle: c.subtitle,
        description: c.description,
        coverUrl: `${CDN}/course-covers/${c.cover}`,
        level: c.level,
        durationWeeks: c.durationWeeks,
        totalLessons: c.totalLessons,
        priceCents: c.priceCents,
        originalPriceCents: c.originalPriceCents ?? null,
        rating: c.rating,
        ratingsCount: c.ratingsCount,
        isFeatured: c.featured ?? false,
        isPublished: true,
        instructorId: instructorMap.get(c.instructorName)!,
      },
      create: {
        slug: c.slug,
        title: c.title,
        subtitle: c.subtitle,
        description: c.description,
        coverUrl: `${CDN}/course-covers/${c.cover}`,
        level: c.level,
        durationWeeks: c.durationWeeks,
        totalLessons: c.totalLessons,
        priceCents: c.priceCents,
        originalPriceCents: c.originalPriceCents ?? null,
        rating: c.rating,
        ratingsCount: c.ratingsCount,
        isFeatured: c.featured ?? false,
        isPublished: true,
        instructorId: instructorMap.get(c.instructorName)!,
      },
    });
  }
  console.log(`✅ ${courses.length} courses`);

  // 5. Auto-enroll demo student into DIS
  await prisma.enrollment.upsert({
    where: { userId_programId: { userId: student.id, programId: dis.id } },
    update: {},
    create: { userId: student.id, programId: dis.id, isBehind: true },
  });
  console.log(`✅ demo student enrolled in DIS\n`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
