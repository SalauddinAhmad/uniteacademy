
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS instructor text,
  ADD COLUMN IF NOT EXISTS category_label text,
  ADD COLUMN IF NOT EXISTS level text,
  ADD COLUMN IF NOT EXISTS duration_text text,
  ADD COLUMN IF NOT EXISTS lessons_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS price integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS original_price integer,
  ADD COLUMN IF NOT EXISTS rating numeric(3,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS students integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS long_description text,
  ADD COLUMN IF NOT EXISTS learn_points jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS requirements jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS modules jsonb NOT NULL DEFAULT '[]'::jsonb;
