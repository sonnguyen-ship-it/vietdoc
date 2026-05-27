-- Workflow (work TikTok) — run in the same Supabase project as VietDoc.
-- Public read on feed tables; writes go through API routes (service role) later.

create table if not exists public.workflow_profiles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  handle text not null unique,
  display_name text not null,
  avatar_url text,
  role_title text,
  bio text
);

create table if not exists public.workflow_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  author_id uuid not null references public.workflow_profiles (id) on delete cascade,
  caption text not null default '',
  media_type text not null default 'text'
    check (media_type in ('video', 'image', 'text')),
  media_url text,
  poster_url text,
  like_count integer not null default 0 check (like_count >= 0),
  comment_count integer not null default 0 check (comment_count >= 0),
  share_count integer not null default 0 check (share_count >= 0),
  tags text[] not null default '{}'::text[]
);

create index if not exists workflow_posts_created_at_idx
  on public.workflow_posts (created_at desc);

create index if not exists workflow_posts_author_idx
  on public.workflow_posts (author_id);

alter table public.workflow_profiles enable row level security;
alter table public.workflow_posts enable row level security;

drop policy if exists workflow_profiles_public_read on public.workflow_profiles;
create policy workflow_profiles_public_read
  on public.workflow_profiles
  for select
  to anon, authenticated
  using (true);

drop policy if exists workflow_posts_public_read on public.workflow_posts;
create policy workflow_posts_public_read
  on public.workflow_posts
  for select
  to anon, authenticated
  using (true);

comment on table public.workflow_profiles is 'Workflow app — creator profiles (VietDoc Supabase project)';
comment on table public.workflow_posts is 'Workflow app — vertical feed posts';

-- Todos (temporary v1 persistence)
create table if not exists public.workflow_todos (
  id text primary key,
  created_at timestamptz not null default now(),
  device_id text not null,
  title text not null,
  status text not null default 'open' check (status in ('open','in_progress','done')),
  assignee_id text not null,
  source text not null default 'note' check (source in ('post','note')),
  source_label text,
  post_id text
);

create index if not exists workflow_todos_device_idx
  on public.workflow_todos (device_id, created_at);

alter table public.workflow_todos enable row level security;

drop policy if exists workflow_todos_public_rw on public.workflow_todos;
create policy workflow_todos_public_rw
  on public.workflow_todos
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- Optional seed (safe to re-run with ON CONFLICT)
insert into public.workflow_profiles (id, handle, display_name, role_title)
values
  ('00000000-0000-4000-8000-000000000001', 'linh.pm', 'Linh Nguyễn', 'Product Lead'),
  ('00000000-0000-4000-8000-000000000002', 'minh.ops', 'Minh Trần', 'Operations')
on conflict (handle) do nothing;

insert into public.workflow_posts (author_id, caption, media_type, tags, like_count, comment_count, share_count)
select
  p.id,
  'Welcome to Workflow — short updates built for work, not entertainment.',
  'text',
  array['workflow', 'launch']::text[],
  42,
  3,
  1
from public.workflow_profiles p
where p.handle = 'linh.pm'
  and not exists (
    select 1 from public.workflow_posts wp
    where wp.caption like 'Welcome to Workflow%'
  );
