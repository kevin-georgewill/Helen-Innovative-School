-- ============================================================
-- HIS — Row Level Security (idempotent)
-- Uses DO blocks to skip policies that already exist.
-- Run order: 2
-- ============================================================

alter table if exists profiles               enable row level security;
alter table if exists faculties              enable row level security;
alter table if exists courses                enable row level security;
alter table if exists modules                enable row level security;
alter table if exists lessons                enable row level security;
alter table if exists enrollments            enable row level security;
alter table if exists lesson_progress        enable row level security;
alter table if exists assessments            enable row level security;
alter table if exists questions              enable row level security;
alter table if exists submissions            enable row level security;
alter table if exists certificates           enable row level security;
alter table if exists events                 enable row level security;
alter table if exists event_registrations    enable row level security;
alter table if exists community_posts        enable row level security;
alter table if exists community_replies      enable row level security;
alter table if exists innovation_challenges  enable row level security;
alter table if exists challenge_submissions  enable row level security;
alter table if exists blog_posts             enable row level security;
alter table if exists notifications          enable row level security;

-- Helper: create policy only if it doesn't exist
do $$ begin

  -- Public: faculties
  if not exists (select 1 from pg_policies where tablename='faculties' and policyname='public read faculties') then
    create policy "public read faculties" on faculties for select using (true);
  end if;

  -- Public: published courses
  if not exists (select 1 from pg_policies where tablename='courses' and policyname='public read published courses') then
    create policy "public read published courses" on courses for select using (is_published = true);
  end if;

  -- Public: modules for published courses
  if not exists (select 1 from pg_policies where tablename='modules' and policyname='public read modules for published courses') then
    create policy "public read modules for published courses" on modules for select using (
      exists (select 1 from courses c where c.id = modules.course_id and c.is_published = true)
    );
  end if;

  -- Public: lessons for published courses
  if not exists (select 1 from pg_policies where tablename='lessons' and policyname='public read lessons for published courses') then
    create policy "public read lessons for published courses" on lessons for select using (
      exists (select 1 from courses c where c.id = lessons.course_id and c.is_published = true)
    );
  end if;

  -- Public: published events
  if not exists (select 1 from pg_policies where tablename='events' and policyname='public read published events') then
    create policy "public read published events" on events for select using (is_published = true);
  end if;

  -- Public: active challenges
  if not exists (select 1 from pg_policies where tablename='innovation_challenges' and policyname='public read active challenges') then
    create policy "public read active challenges" on innovation_challenges for select using (is_active = true);
  end if;

  -- Public: published blog posts
  if not exists (select 1 from pg_policies where tablename='blog_posts' and policyname='public read published blog posts') then
    create policy "public read published blog posts" on blog_posts for select using (is_published = true);
  end if;

  -- Public: certificates (for QR verification)
  if not exists (select 1 from pg_policies where tablename='certificates' and policyname='public read certificates') then
    create policy "public read certificates" on certificates for select using (true);
  end if;

  -- Profiles: own row
  if not exists (select 1 from pg_policies where tablename='profiles' and policyname='users read own profile') then
    create policy "users read own profile" on profiles for select using (auth.uid() = id);
  end if;

  if not exists (select 1 from pg_policies where tablename='profiles' and policyname='users update own profile') then
    create policy "users update own profile" on profiles for update using (auth.uid() = id);
  end if;

  -- Enrollments: own
  if not exists (select 1 from pg_policies where tablename='enrollments' and policyname='students read own enrollments') then
    create policy "students read own enrollments" on enrollments for select using (auth.uid() = student_id);
  end if;

  -- Lesson progress: own
  if not exists (select 1 from pg_policies where tablename='lesson_progress' and policyname='students read own progress') then
    create policy "students read own progress" on lesson_progress for select using (auth.uid() = student_id);
  end if;

  -- Assessments + questions: authenticated read
  if not exists (select 1 from pg_policies where tablename='assessments' and policyname='authenticated read assessments') then
    create policy "authenticated read assessments" on assessments for select using (auth.role() = 'authenticated');
  end if;

  if not exists (select 1 from pg_policies where tablename='questions' and policyname='authenticated read questions') then
    create policy "authenticated read questions" on questions for select using (auth.role() = 'authenticated');
  end if;

  -- Submissions: own
  if not exists (select 1 from pg_policies where tablename='submissions' and policyname='students read own submissions') then
    create policy "students read own submissions" on submissions for select using (auth.uid() = student_id);
  end if;

  -- Certificates: own
  if not exists (select 1 from pg_policies where tablename='certificates' and policyname='students read own certificates') then
    create policy "students read own certificates" on certificates for select using (auth.uid() = student_id);
  end if;

  -- Event registrations: own
  if not exists (select 1 from pg_policies where tablename='event_registrations' and policyname='students read own event registrations') then
    create policy "students read own event registrations" on event_registrations for select using (auth.uid() = student_id);
  end if;

  -- Community: authenticated read (used by Realtime)
  if not exists (select 1 from pg_policies where tablename='community_posts' and policyname='authenticated read community posts') then
    create policy "authenticated read community posts" on community_posts for select using (auth.role() = 'authenticated');
  end if;

  if not exists (select 1 from pg_policies where tablename='community_replies' and policyname='authenticated read community replies') then
    create policy "authenticated read community replies" on community_replies for select using (auth.role() = 'authenticated');
  end if;

  -- Challenge submissions: own
  if not exists (select 1 from pg_policies where tablename='challenge_submissions' and policyname='students read own challenge submissions') then
    create policy "students read own challenge submissions" on challenge_submissions for select using (auth.uid() = student_id);
  end if;

  -- Notifications: own (used by Realtime for notification bell)
  if not exists (select 1 from pg_policies where tablename='notifications' and policyname='users read own notifications') then
    create policy "users read own notifications" on notifications for select using (auth.uid() = user_id);
  end if;

end $$;
