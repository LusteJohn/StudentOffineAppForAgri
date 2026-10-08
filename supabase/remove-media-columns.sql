-- Run this once if the reference tables were created before media columns
-- were removed from reference-schema.sql.

alter table if exists public.modules
  drop column if exists module_pdf,
  drop column if exists thumbnail;

alter table if exists public.content_info
  drop column if exists images;

alter table if exists public.module_achievement
  alter column module_id drop not null;

alter table if exists public.module_achievement
  drop column if exists badge_image;

alter table if exists public.lesson_achievement
  drop column if exists badge_image;
