create table public.story_submissions (
  id uuid primary key default gen_random_uuid(),
  narrator_name text not null check (char_length(narrator_name) between 1 and 120),
  region_text text not null check (char_length(region_text) between 1 and 120),
  title text not null check (char_length(title) between 1 and 200),
  content text not null check (char_length(content) between 1 and 12000),
  status text not null default 'pending' check (status = 'pending'),
  created_at timestamptz not null default now()
);

alter table public.story_submissions enable row level security;

create policy "public submits stories"
on public.story_submissions
for insert
to anon
with check (status = 'pending');
