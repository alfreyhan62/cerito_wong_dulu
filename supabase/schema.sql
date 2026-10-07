create table public.categories (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique,
  description text
);

create table public.regions (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique,
  description text,
  latitude double precision,
  longitude double precision
);

create table public.stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  content text,
  category_id bigint references public.categories(id),
  region_id bigint references public.regions(id),
  cover_image text,
  moral_message text,
  cultural_values text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.story_submissions (
  id uuid primary key default gen_random_uuid(),
  narrator_name text not null check (char_length(narrator_name) between 1 and 120),
  region_text text not null check (char_length(region_text) between 1 and 120),
  title text not null check (char_length(title) between 1 and 200),
  content text not null check (char_length(content) between 1 and 12000),
  status text not null default 'pending' check (status = 'pending'),
  created_at timestamptz not null default now()
);

create table public.characters (
  id bigint generated always as identity primary key,
  story_id uuid not null references public.stories(id) on delete cascade,
  name text not null,
  description text,
  image_url text
);

create table public.galleries (
  id bigint generated always as identity primary key,
  story_id uuid not null references public.stories(id) on delete cascade,
  image_url text not null,
  caption text
);

create table public.story_locations (
  id bigint generated always as identity primary key,
  story_id uuid not null references public.stories(id) on delete cascade,
  latitude double precision not null,
  longitude double precision not null,
  description text
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  role text not null default 'USER' check (role in ('ADMIN', 'USER'))
);

alter table public.stories enable row level security;
alter table public.story_submissions enable row level security;
alter table public.categories enable row level security;
alter table public.regions enable row level security;
alter table public.characters enable row level security;
alter table public.galleries enable row level security;
alter table public.story_locations enable row level security;
alter table public.profiles enable row level security;

create policy "public reads published stories" on public.stories for select using (status = 'published');
create policy "public submits stories" on public.story_submissions for insert to anon with check (status = 'pending');
create policy "public reads categories" on public.categories for select using (true);
create policy "public reads regions" on public.regions for select using (true);
create policy "public reads characters" on public.characters for select using (true);
create policy "public reads galleries" on public.galleries for select using (true);
create policy "public reads locations" on public.story_locations for select using (true);
