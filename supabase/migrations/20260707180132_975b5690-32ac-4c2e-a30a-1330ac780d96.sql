
-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'student');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  phone text,
  locale text NOT NULL DEFAULT 'bn',
  joined_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles select own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles update own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles insert own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- PROGRAMS / SEMESTERS
CREATE TABLE public.programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title_bn text NOT NULL,
  title_en text,
  batch_label text,
  cover_url text,
  starts_at date,
  ends_at date,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.programs TO authenticated, anon;
GRANT ALL ON public.programs TO service_role;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "programs view" ON public.programs FOR SELECT USING (is_published = true);
CREATE POLICY "programs admin" ON public.programs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.semesters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  label text NOT NULL,
  sort int NOT NULL DEFAULT 0,
  starts_on date,
  ends_on date,
  is_locked boolean NOT NULL DEFAULT false
);
GRANT SELECT ON public.semesters TO authenticated, anon;
GRANT ALL ON public.semesters TO service_role;
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "semesters view" ON public.semesters FOR SELECT USING (true);
CREATE POLICY "semesters admin" ON public.semesters FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- COURSES
CREATE TYPE public.course_category AS ENUM ('diploma', 'talimul_quran', 'free', 'teacher_training');
CREATE TYPE public.course_type AS ENUM ('live', 'recorded');

CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title_bn text NOT NULL,
  title_en text,
  description text,
  cover_url text,
  category public.course_category NOT NULL DEFAULT 'free',
  type public.course_type NOT NULL DEFAULT 'recorded',
  duration_minutes int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.courses TO authenticated, anon;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "courses view" ON public.courses FOR SELECT USING (is_published = true);
CREATE POLICY "courses admin" ON public.courses FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.course_teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  name text NOT NULL,
  initials text NOT NULL,
  avatar_url text,
  sort int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.course_teachers TO authenticated, anon;
GRANT ALL ON public.course_teachers TO service_role;
ALTER TABLE public.course_teachers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "teachers view" ON public.course_teachers FOR SELECT USING (true);
CREATE POLICY "teachers admin" ON public.course_teachers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.program_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  semester_id uuid NOT NULL REFERENCES public.semesters(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  sort int NOT NULL DEFAULT 0,
  UNIQUE (program_id, course_id)
);
GRANT SELECT ON public.program_courses TO authenticated, anon;
GRANT ALL ON public.program_courses TO service_role;
ALTER TABLE public.program_courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pc view" ON public.program_courses FOR SELECT USING (true);
CREATE POLICY "pc admin" ON public.program_courses FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ENROLLMENTS (must exist before lessons/assignments policies)
CREATE TABLE public.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id uuid REFERENCES public.programs(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  is_behind boolean NOT NULL DEFAULT false,
  CHECK (program_id IS NOT NULL OR course_id IS NOT NULL)
);
GRANT SELECT, INSERT, DELETE ON public.enrollments TO authenticated;
GRANT ALL ON public.enrollments TO service_role;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "enroll view own" ON public.enrollments FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "enroll insert own" ON public.enrollments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "enroll admin" ON public.enrollments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- LESSONS
CREATE TABLE public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title_bn text NOT NULL,
  sort int NOT NULL DEFAULT 0,
  duration_minutes int NOT NULL DEFAULT 0,
  video_url text
);
GRANT SELECT ON public.lessons TO authenticated;
GRANT ALL ON public.lessons TO service_role;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lessons view enrolled" ON public.lessons FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.enrollments e
    LEFT JOIN public.program_courses pc ON pc.course_id = lessons.course_id
    WHERE e.user_id = auth.uid()
      AND (e.course_id = lessons.course_id OR e.program_id = pc.program_id)
  )
);
CREATE POLICY "lessons admin" ON public.lessons FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed boolean NOT NULL DEFAULT false,
  watched_seconds int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
GRANT SELECT, INSERT, UPDATE ON public.lesson_progress TO authenticated;
GRANT ALL ON public.lesson_progress TO service_role;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "progress own" ON public.lesson_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  score int NOT NULL DEFAULT 0,
  total int NOT NULL DEFAULT 0,
  completed_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.quiz_attempts TO authenticated;
GRANT ALL ON public.quiz_attempts TO service_role;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quiz view own" ON public.quiz_attempts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "quiz insert own" ON public.quiz_attempts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  due_at timestamptz,
  published_at timestamptz NOT NULL DEFAULT now(),
  is_published boolean NOT NULL DEFAULT true
);
GRANT SELECT ON public.assignments TO authenticated;
GRANT ALL ON public.assignments TO service_role;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "asg view enrolled" ON public.assignments FOR SELECT TO authenticated USING (
  is_published = true AND EXISTS (
    SELECT 1 FROM public.enrollments e
    LEFT JOIN public.program_courses pc ON pc.course_id = assignments.course_id
    WHERE e.user_id = auth.uid()
      AND (e.course_id = assignments.course_id OR e.program_id = pc.program_id)
  )
);
CREATE POLICY "asg admin" ON public.assignments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE dis_program_id uuid;
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student') ON CONFLICT DO NOTHING;

  SELECT id INTO dis_program_id FROM public.programs WHERE slug = 'dis-batch-11' LIMIT 1;
  IF dis_program_id IS NOT NULL THEN
    INSERT INTO public.enrollments (user_id, program_id, is_behind) VALUES (NEW.id, dis_program_id, true) ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- SEED
INSERT INTO public.programs (slug, title_bn, title_en, batch_label, starts_at, ends_at)
VALUES ('dis-batch-11', 'ডিপ্লোমা ইন ইসলামিক স্টাডিজ', 'Diploma in Islamic Studies', 'DIS Batch-11', '2026-05-31', '2027-01-04');

INSERT INTO public.semesters (program_id, label, sort, starts_on, ends_on, is_locked)
SELECT id, 'Semester 1', 1, '2026-05-31', '2027-01-04', false FROM public.programs WHERE slug = 'dis-batch-11';
INSERT INTO public.semesters (program_id, label, sort, starts_on, ends_on, is_locked)
SELECT id, 'Semester 2', 2, '2025-12-31', '2026-12-31', true FROM public.programs WHERE slug = 'dis-batch-11';

INSERT INTO public.courses (slug, title_bn, title_en, description, category, type, duration_minutes) VALUES
  ('islami-aqidar-porichoy', 'ইসলামী আকীদার পরিচয়', 'Introduction to Islamic Aqeedah', 'ঈমানকে বিশুদ্ধ রাখতে ও আল্লাহর সন্তুষ্টি অর্জনে বিশুদ্ধ আকীদা শেখা আবশ্যক।', 'diploma', 'recorded', 480),
  ('ilm-orjoner-adob', 'ইলম অর্জনের আদব', 'Manners of Acquiring Knowledge', 'ইলম অর্জনের সঠিক পদ্ধতি ও আদব সম্পর্কে বিস্তারিত।', 'diploma', 'recorded', 360),
  ('quran-bujhar-mulniti', 'কুরআন বুঝার মূলনীতি', 'Principles of Understanding Quran', 'কুরআনের মূল বার্তা বোঝার মূলনীতি।', 'diploma', 'recorded', 420),
  ('fiqhus-salat', 'ফিকহুস সালাত', 'Fiqh of Salah', 'সালাতের মাসায়েল সহীহ দলীলের আলোকে।', 'diploma', 'recorded', 540),
  ('fiqhut-taharat', 'ফিকহুত তাহারাত', 'Fiqh of Purification', 'তাহারাত সংক্রান্ত মাসায়েল।', 'diploma', 'recorded', 300),
  ('fiqhus-siyam', 'ফিকহুস সিয়াম', 'Fiqh of Fasting', 'সহীহ দলীলের আলোকে সিয়াম রাখার সঠিক মাসায়েলগুলো।', 'diploma', 'recorded', 360),
  ('sirate-rasul-makki', 'সীরাতে রাসূল ﷺ (মাক্কী যুগ)', 'Seerah — Meccan Period', 'রাসূল ﷺ এর মাক্কী জীবনের ইতিহাস।', 'diploma', 'recorded', 480),
  ('adhyayan-dokkhota', 'অধ্যয়ন দক্ষতা (Study Skills)', 'Study Skills', 'কার্যকর অধ্যয়নের কৌশল।', 'diploma', 'recorded', 240),
  ('talimul-quran-primary', 'তা''লীমুল কুরআন (Primary Level)', 'Talimul Quran (Primary Level)', 'সহীহভাবে কুরআন পড়ার প্রাথমিক কোর্স।', 'talimul_quran', 'recorded', 900),
  ('talimul-quran-advanced', 'Talimul Quran (Advanced Level)', 'Talimul Quran (Advanced Level)', 'আল-কুরআন শুধু তিলাওয়াতের জন্য নয়, বরং তা সহীহভাবে পড়া, বুঝা ও জীবনে ধারণ করার জন্য।', 'talimul_quran', 'live', 1200),
  ('rasul-sikkhadan-poddhoti', 'রাসূল (সাঃ) এর শিক্ষাদান পদ্ধতি', 'Prophetic Teaching Methods', 'রাসূল ﷺ এর শিক্ষাদান পদ্ধতির উপর কোর্স।', 'diploma', 'recorded', 300),
  ('fiqhul-udhiya', 'ফিকহুল উদহিয়াহ', 'Fiqh of Udhiyah', 'কুরবানীর মাসায়েল।', 'free', 'recorded', 120),
  ('fiqhul-hajj', 'ফিকহুল হজ্জ (Non-Diploma)', 'Fiqh of Hajj', 'হজ্জ ও উমরার সঠিক নিয়ম ও উদ্দেশ্য সহজে রপ্ত করুন।', 'free', 'recorded', 180),
  ('teacher-success', 'কীভাবে সফল শিক্ষক হবেন?', 'How to Become a Successful Teacher', 'সফল শিক্ষক হওয়ার গুণাবলি ও কৌশল শেখার দিকনির্দেশনা।', 'teacher_training', 'recorded', 240),
  ('islami-aqidar-porichoy-nd', 'ইসলামী আকীদার পরিচয় (Non-Diploma)', 'Introduction to Aqeedah (Non-Diploma)', 'ঈমানকে বিশুদ্ধ রাখতে বিশুদ্ধ আকীদা শেখা আবশ্যক।', 'free', 'recorded', 300);

INSERT INTO public.program_courses (program_id, semester_id, course_id, sort)
SELECT p.id, s.id, c.id, ord.sort
FROM public.programs p
JOIN public.semesters s ON s.program_id = p.id AND s.sort = 1
JOIN (VALUES
  ('islami-aqidar-porichoy', 1),('ilm-orjoner-adob', 2),('quran-bujhar-mulniti', 3),
  ('fiqhus-salat', 4),('fiqhut-taharat', 5),('fiqhus-siyam', 6),
  ('sirate-rasul-makki', 7),('adhyayan-dokkhota', 8)
) AS ord(slug, sort) ON true
JOIN public.courses c ON c.slug = ord.slug
WHERE p.slug = 'dis-batch-11';

INSERT INTO public.course_teachers (course_id, name, initials, sort)
SELECT c.id, t.name, t.initials, t.sort FROM public.courses c
JOIN (VALUES
  ('islami-aqidar-porichoy','Professor Dr. Mohammad Monzur E Elahi','PD',1),
  ('islami-aqidar-porichoy','Dr. Muhammad Saifullah','DM',2),
  ('ilm-orjoner-adob','Professor Dr. Abubakar Muhammad Zakaria','PD',1),
  ('ilm-orjoner-adob','Dr. Abdullahil Kafi','DA',2),
  ('quran-bujhar-mulniti','Dr. Mohammad Imam Hossain','DM',1),
  ('fiqhus-salat','Shaikh Mohammad Harun Hossain','SM',1),
  ('fiqhut-taharat','Junayad Munir','JM',1),
  ('fiqhus-siyam','Sharif Ahmed','SA',1),
  ('sirate-rasul-makki','Professor Dr. Mohammad Monzur E Elahi','PD',1),
  ('adhyayan-dokkhota','Dr. Muhammad Saifullah','DM',1)
) AS t(slug, name, initials, sort) ON t.slug = c.slug;

INSERT INTO public.lessons (course_id, title_bn, sort, duration_minutes)
SELECT c.id, l.title, l.sort, l.dur FROM public.courses c
JOIN (VALUES
  ('islami-aqidar-porichoy', 'আকীদা কী ও কেন', 1, 22),
  ('islami-aqidar-porichoy', 'তাওহীদের প্রকারভেদ', 2, 28),
  ('islami-aqidar-porichoy', 'শিরকের ভয়াবহতা', 3, 26),
  ('islami-aqidar-porichoy', 'ঈমানের রুকন', 4, 30),
  ('islami-aqidar-porichoy', 'সালাফদের আকীদা', 5, 24),
  ('ilm-orjoner-adob', 'ইলম অর্জনের ফযীলত', 1, 20),
  ('ilm-orjoner-adob', 'শিক্ষকের হক', 2, 22),
  ('ilm-orjoner-adob', 'ছাত্রের আদব', 3, 25),
  ('ilm-orjoner-adob', 'সময় ব্যবস্থাপনা', 4, 18),
  ('quran-bujhar-mulniti', 'কুরআনের মূলনীতি', 1, 24),
  ('quran-bujhar-mulniti', 'তাফসীরের ইতিহাস', 2, 26),
  ('fiqhus-salat', 'সালাতের গুরুত্ব', 1, 20),
  ('fiqhus-salat', 'ওযুর মাসায়েল', 2, 22),
  ('fiqhus-salat', 'সালাতের পদ্ধতি', 3, 30)
) AS l(slug, title, sort, dur) ON l.slug = c.slug;
