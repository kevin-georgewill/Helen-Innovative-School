-- ============================================================
-- HIS — Initial Schema (idempotent)
-- Uses IF NOT EXISTS throughout — safe to run on an existing DB.
-- Run order: 1
-- ============================================================

create extension if not exists "pgcrypto";

-- ──────────────────────────────────────────────────────────
-- Utility trigger function
-- ──────────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ──────────────────────────────────────────────────────────
-- PROFILES
-- ──────────────────────────────────────────────────────────
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  avatar_url  text,
  role        text not null default 'student'
                check (role in ('student', 'instructor', 'admin')),
  bio         text,
  phone       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists trg_profiles_updated_at on profiles;
create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- ──────────────────────────────────────────────────────────
-- FACULTIES
-- ──────────────────────────────────────────────────────────
create table if not exists faculties (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  icon        text,
  created_at  timestamptz not null default now()
);

-- ──────────────────────────────────────────────────────────
-- COURSES
-- ──────────────────────────────────────────────────────────
create table if not exists courses (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique,
  description   text,
  thumbnail_url text,
  faculty_id    uuid not null references faculties(id) on delete restrict,
  instructor_id uuid not null references profiles(id) on delete restrict,
  price         numeric(12,2) not null default 0,
  level         text not null default 'beginner'
                  check (level in ('beginner', 'intermediate', 'advanced')),
  program_type  text not null default 'express'
                  check (program_type in ('express', 'certificate', 'diploma')),
  duration      text,
  is_published  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_courses_faculty    on courses(faculty_id);
create index if not exists idx_courses_instructor on courses(instructor_id);
create index if not exists idx_courses_published  on courses(is_published);

drop trigger if exists trg_courses_updated_at on courses;
create trigger trg_courses_updated_at
  before update on courses
  for each row execute function set_updated_at();

-- ──────────────────────────────────────────────────────────
-- MODULES
-- ──────────────────────────────────────────────────────────
create table if not exists modules (
  id         uuid primary key default gen_random_uuid(),
  course_id  uuid not null references courses(id) on delete cascade,
  title      text not null,
  position   int  not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_modules_course on modules(course_id);

-- ──────────────────────────────────────────────────────────
-- LESSONS
-- ──────────────────────────────────────────────────────────
create table if not exists lessons (
  id              uuid primary key default gen_random_uuid(),
  module_id       uuid not null references modules(id) on delete cascade,
  course_id       uuid not null references courses(id) on delete cascade,
  title           text not null,
  content_type    text not null check (content_type in ('video', 'pdf', 'text')),
  content_url     text,
  content_text    text,
  duration_min    int,
  position        int not null default 0,
  is_free_preview boolean not null default false,
  created_at      timestamptz not null default now()
);

create index if not exists idx_lessons_module on lessons(module_id);
create index if not exists idx_lessons_course on lessons(course_id);

-- ──────────────────────────────────────────────────────────
-- ENROLLMENTS
-- ──────────────────────────────────────────────────────────
create table if not exists enrollments (
  id               uuid primary key default gen_random_uuid(),
  student_id       uuid not null references profiles(id) on delete cascade,
  course_id        uuid not null references courses(id) on delete cascade,
  status           text not null default 'pending'
                     check (status in ('pending', 'active', 'completed', 'suspended')),
  payment_ref      text,
  payment_provider text check (payment_provider in ('paystack', 'stripe')),
  enrolled_at      timestamptz not null default now(),
  unique(student_id, course_id)
);

create index if not exists idx_enrollments_student on enrollments(student_id);
create index if not exists idx_enrollments_course  on enrollments(course_id);

-- ──────────────────────────────────────────────────────────
-- LESSON PROGRESS
-- ──────────────────────────────────────────────────────────
create table if not exists lesson_progress (
  id           uuid primary key default gen_random_uuid(),
  student_id   uuid not null references profiles(id) on delete cascade,
  lesson_id    uuid not null references lessons(id) on delete cascade,
  course_id    uuid not null references courses(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique(student_id, lesson_id)
);

create index if not exists idx_lesson_progress_student on lesson_progress(student_id);
create index if not exists idx_lesson_progress_course  on lesson_progress(course_id);

-- ──────────────────────────────────────────────────────────
-- ASSESSMENTS
-- ──────────────────────────────────────────────────────────
create table if not exists assessments (
  id         uuid primary key default gen_random_uuid(),
  course_id  uuid not null references courses(id) on delete cascade,
  title      text not null,
  pass_score int not null default 70,
  created_at timestamptz not null default now()
);

create index if not exists idx_assessments_course on assessments(course_id);

-- ──────────────────────────────────────────────────────────
-- QUESTIONS
-- ──────────────────────────────────────────────────────────
create table if not exists questions (
  id            uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references assessments(id) on delete cascade,
  body          text not null,
  options       jsonb not null default '[]'::jsonb,
  position      int  not null default 0
);

create index if not exists idx_questions_assessment on questions(assessment_id);

-- ──────────────────────────────────────────────────────────
-- SUBMISSIONS
-- Quiz: answers JSONB populated, content_url null.
-- Assignment upload: content_url populated, answers null.
-- ──────────────────────────────────────────────────────────
create table if not exists submissions (
  id            uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references assessments(id) on delete cascade,
  student_id    uuid not null references profiles(id) on delete cascade,
  answers       jsonb default '[]'::jsonb,
  content_url   text,
  score         int  not null default 0,
  passed        boolean not null default false,
  submitted_at  timestamptz not null default now()
);

create index if not exists idx_submissions_assessment on submissions(assessment_id);
create index if not exists idx_submissions_student    on submissions(student_id);

-- ──────────────────────────────────────────────────────────
-- CERTIFICATES
-- ──────────────────────────────────────────────────────────
create table if not exists certificates (
  id             uuid primary key default gen_random_uuid(),
  student_id     uuid not null references profiles(id) on delete cascade,
  course_id      uuid not null references courses(id) on delete cascade,
  certificate_no text not null unique,
  pdf_url        text,
  qr_code_url    text,
  approved_by    uuid references profiles(id),
  issued_at      timestamptz not null default now()
);

create index if not exists idx_certificates_student on certificates(student_id);
create index if not exists idx_certificates_course  on certificates(course_id);

-- ──────────────────────────────────────────────────────────
-- EVENTS
-- ──────────────────────────────────────────────────────────
create table if not exists events (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  event_type    text not null
                  check (event_type in ('webinar', 'workshop', 'competition', 'challenge')),
  starts_at     timestamptz not null,
  ends_at       timestamptz,
  location      text,
  thumbnail_url text,
  is_published  boolean not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists idx_events_starts_at on events(starts_at);

-- ──────────────────────────────────────────────────────────
-- EVENT REGISTRATIONS
-- ──────────────────────────────────────────────────────────
create table if not exists event_registrations (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references profiles(id) on delete cascade,
  event_id      uuid not null references events(id) on delete cascade,
  registered_at timestamptz not null default now(),
  unique(student_id, event_id)
);

create index if not exists idx_event_registrations_event on event_registrations(event_id);

-- ──────────────────────────────────────────────────────────
-- COMMUNITY POSTS
-- ──────────────────────────────────────────────────────────
create table if not exists community_posts (
  id         uuid primary key default gen_random_uuid(),
  author_id  uuid not null references profiles(id) on delete cascade,
  course_id  uuid references courses(id) on delete cascade,
  title      text,
  body       text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_community_posts_author on community_posts(author_id);
create index if not exists idx_community_posts_course on community_posts(course_id);

drop trigger if exists trg_community_posts_updated_at on community_posts;
create trigger trg_community_posts_updated_at
  before update on community_posts
  for each row execute function set_updated_at();

-- ──────────────────────────────────────────────────────────
-- COMMUNITY REPLIES
-- ──────────────────────────────────────────────────────────
create table if not exists community_replies (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references community_posts(id) on delete cascade,
  author_id  uuid not null references profiles(id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_community_replies_post on community_replies(post_id);

-- ──────────────────────────────────────────────────────────
-- INNOVATION CHALLENGES
-- ──────────────────────────────────────────────────────────
create table if not exists innovation_challenges (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  deadline      timestamptz not null,
  thumbnail_url text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

create index if not exists idx_innovation_challenges_deadline on innovation_challenges(deadline);

-- ──────────────────────────────────────────────────────────
-- CHALLENGE SUBMISSIONS
-- ──────────────────────────────────────────────────────────
create table if not exists challenge_submissions (
  id           uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references innovation_challenges(id) on delete cascade,
  student_id   uuid not null references profiles(id) on delete cascade,
  content_type text check (content_type in ('text', 'pdf', 'video')),
  content_text text,
  file_url     text,
  submitted_at timestamptz not null default now()
);

create index if not exists idx_challenge_submissions_challenge on challenge_submissions(challenge_id);
create index if not exists idx_challenge_submissions_student   on challenge_submissions(student_id);

-- ──────────────────────────────────────────────────────────
-- BLOG POSTS
-- ──────────────────────────────────────────────────────────
create table if not exists blog_posts (
  id            uuid primary key default gen_random_uuid(),
  author_id     uuid not null references profiles(id) on delete restrict,
  title         text not null,
  slug          text not null unique,
  excerpt       text,
  body          text not null,
  category      text,
  thumbnail_url text,
  is_published  boolean not null default false,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_blog_posts_author    on blog_posts(author_id);
create index if not exists idx_blog_posts_published on blog_posts(is_published, published_at desc);

drop trigger if exists trg_blog_posts_updated_at on blog_posts;
create trigger trg_blog_posts_updated_at
  before update on blog_posts
  for each row execute function set_updated_at();

-- ──────────────────────────────────────────────────────────
-- NOTIFICATIONS
-- ──────────────────────────────────────────────────────────
create table if not exists notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  title      text not null,
  body       text,
  link       text,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user   on notifications(user_id);
create index if not exists idx_notifications_unread on notifications(user_id, is_read) where is_read = false;

-- ──────────────────────────────────────────────────────────
-- Schema fixes: add missing columns to existing tables
-- ──────────────────────────────────────────────────────────

-- certificates.approved_by (added in architecture revision)
alter table certificates
  add column if not exists approved_by uuid references profiles(id);

-- submissions.content_url (for assignment file uploads)
alter table submissions
  add column if not exists content_url text;

-- courses: rename duration_weeks to duration (text) if old column exists
do $$ begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'courses' and column_name = 'duration_weeks'
  ) then
    alter table courses rename column duration_weeks to duration;
    alter table courses alter column duration type text using duration::text;
  end if;
end $$;

-- lessons: rename duration_seconds to duration_min if old column exists
do $$ begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'lessons' and column_name = 'duration_seconds'
  ) then
    alter table lessons rename column duration_seconds to duration_min;
  end if;
end $$;

-- faculties: rename icon_url to icon if old column exists
do $$ begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'faculties' and column_name = 'icon_url'
  ) then
    alter table faculties rename column icon_url to icon;
  end if;
end $$;

-- courses.program_type: fix constraint (short → express)
do $$ begin
  alter table courses drop constraint if exists courses_program_type_check;
  alter table courses add constraint courses_program_type_check
    check (program_type in ('express', 'certificate', 'diploma'));
exception when others then null;
end $$;

-- enrollments.status: fix constraint (add completed + suspended, remove expired)
do $$ begin
  alter table enrollments drop constraint if exists enrollments_status_check;
  alter table enrollments add constraint enrollments_status_check
    check (status in ('pending', 'active', 'completed', 'suspended'));
exception when others then null;
end $$;

-- events.event_type: add 'challenge' to check constraint
do $$ begin
  alter table events drop constraint if exists events_event_type_check;
  alter table events add constraint events_event_type_check
    check (event_type in ('webinar', 'workshop', 'competition', 'challenge'));
exception when others then null;
end $$;
