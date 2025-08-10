# Vet Roster (Next.js + Supabase)

## Setup (no coding)
1) Create Supabase project → SQL Editor → paste the SQL below → Run.
2) Add Google Auth (Providers → Google). Put your Client ID/Secret and redirect URL.
3) On Vercel: import this repo, set ENV:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
4) Open /login and sign in with Google. Go to /admin to seed & publish the month.

## Seed SQL (run in Supabase after creating tables)
```sql
insert into shift_types (code, name, start_time, end_time, min_staff, max_staff, is_night) values
('ST_OPD','OPD','09:00','17:00',2,12,false),
('ST_IPD','IPD','09:00','18:00',1,2,false),
('ST_SUR','SUR','09:00','18:00',2,2,false),
('ST_NGT','NIGHT','18:00','09:00',2,3,true);

insert into users (email, full_name, short_name, role, doctor_group, is_junior_past_probation, weekly_night_quota)
values ('your-email@example.com','Dr. Admin','ADMIN','admin','senior', true, 3);
```

## Database schema (paste into Supabase → SQL)
```sql
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text not null,
  short_name text not null,
  role text check (role in ('admin','user')) not null default 'user',
  doctor_group text check (doctor_group in ('junior','senior')) not null,
  is_junior_past_probation boolean,
  weekly_night_quota int default 7,
  day_off_1 int,
  day_off_2 int,
  day_off_3 int,
  extra_pool_1 int,
  extra_pool_2 int,
  extra_pool_3 int,
  not_interested_in_sur boolean default false,
  active boolean default true
);
create table shift_types (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  start_time time not null,
  end_time time not null,
  min_staff int not null,
  max_staff int not null,
  is_night boolean not null default false
);
create table shifts (
  id text primary key,
  date date not null,
  shift_type_id uuid references shift_types(id) on delete restrict,
  status text not null check (status in ('draft','published')) default 'draft',
  version int default 1,
  specialty text null
);
create table assignments (
  id uuid primary key default gen_random_uuid(),
  shift_id text references shifts(id) on delete cascade,
  doctor_id uuid references users(id) on delete restrict,
  is_extra boolean default false,
  is_ot boolean default false,
  source text default 'manual'
);
create table requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  doctor_id uuid references users(id),
  type text check (type in ('shift_swap','day_off','conditional')),
  start_date date,
  end_date date,
  payload jsonb,
  status text check (status in ('pending','approved','rejected')) default 'pending'
);
create or replace function publish_month(p_start date, p_end date)
returns void language plpgsql as $$
begin
  update shifts set status = 'published', version = coalesce(version,1)+1
  where date between p_start and p_end;
end;$$;
```
