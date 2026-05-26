-- Run this in Supabase → SQL Editor (once per project).
-- Inserts use the service role from /api/signup only (never expose that key).

create table if not exists public.signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  signup_type text not null check (signup_type in ('individual', 'company')),
  email text,
  payload jsonb not null default '{}'::jsonb
);

create index if not exists signups_created_at_idx on public.signups (created_at desc);
create index if not exists signups_type_idx on public.signups (signup_type);
create index if not exists signups_email_idx on public.signups (email);

alter table public.signups enable row level security;

-- No GRANT to anon/authenticated for insert/select — only service_role (API route) can access.

comment on table public.signups is 'VietDoc marketing signups from /api/signup';
