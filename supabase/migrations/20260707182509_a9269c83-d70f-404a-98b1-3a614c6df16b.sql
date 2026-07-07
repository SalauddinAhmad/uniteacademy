-- Add teacher role
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'teacher';

-- Allow admins to read all profiles
CREATE POLICY "profiles admin read all" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to read all roles
CREATE POLICY "user_roles admin read all" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to insert/delete roles (assign/revoke)
CREATE POLICY "user_roles admin manage" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to see all enrollments (for admin analytics)
CREATE POLICY "enrollments admin read" ON public.enrollments FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to see unpublished courses too (existing policy uses is_published=true)
CREATE POLICY "courses admin view all" ON public.courses FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- course_teachers admin manage
CREATE POLICY "course_teachers admin manage" ON public.course_teachers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- semesters admin manage
CREATE POLICY "semesters admin manage" ON public.semesters FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- programs admin manage
CREATE POLICY "programs admin manage" ON public.programs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));