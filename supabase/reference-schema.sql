-- Reference/content tables used by the student records report.
-- Run this before running reference-seed.sql.

create table if not exists public.competencies (
  competency_id bigint primary key,
  competency_name text not null,
  sector text not null,
  qualification text not null,
  status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.modules (
  module_id bigint primary key,
  competency_id bigint not null references public.competencies(competency_id),
  module_name text not null,
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lessons (
  lesson_id bigint primary key,
  module_id bigint not null references public.modules(module_id),
  lesson_name text not null,
  order_number integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lesson_content (
  lesson_content_id bigint primary key,
  lesson_id bigint not null references public.lessons(lesson_id),
  content_name text not null,
  objectives text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_info (
  content_info_id bigint primary key,
  lesson_content_id bigint not null references public.lesson_content(lesson_content_id),
  label text not null,
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.question_instruct (
  instruct_id bigint primary key,
  lesson_content_id bigint not null references public.lesson_content(lesson_content_id),
  question_instruction text not null,
  question_title text not null,
  question_label text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.question_content (
  question_id bigint primary key,
  lesson_content_id bigint not null references public.lesson_content(lesson_content_id),
  question text not null,
  question_type text not null,
  question_order integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.question_choice (
  choice_id bigint primary key,
  question_id bigint not null references public.question_content(question_id),
  choice_label text not null,
  choice_text text not null,
  is_correct text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_sheet (
  job_id bigint primary key,
  lesson_content_id bigint not null references public.lesson_content(lesson_content_id),
  job_title text not null,
  job_objectives text not null,
  job_materials text not null,
  job_steps text not null,
  job_assesment_method text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.performance_checklist (
  performance_id bigint primary key,
  lesson_content_id bigint not null references public.lesson_content(lesson_content_id),
  performance_question text not null,
  performance_order integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.module_achievement (
  module_achievement_id bigint primary key,
  -- NULL identifies the badge awarded after completing every module.
  module_id bigint references public.modules(module_id),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lesson_achievement (
  lesson_achievement_id bigint primary key,
  lesson_id bigint not null references public.lessons(lesson_id),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
