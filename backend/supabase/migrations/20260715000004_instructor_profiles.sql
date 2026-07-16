create table if not exists instructor_profiles (
    id uuid primary key references profiles(id) on delete cascade,

    professional_title text not null,

    expertise text not null,

    years_of_experience integer,

    bio text,

    linkedin text,

    website text,

    status text not null default 'pending'
      check (status in ('pending','approved','rejected')),

    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create trigger trg_instructor_profiles_updated_at
before update on instructor_profiles
for each row
execute function set_updated_at();