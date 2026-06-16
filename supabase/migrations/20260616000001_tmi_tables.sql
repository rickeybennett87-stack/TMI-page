create table if not exists public.profiles (
  id uuid default gen_random_uuid() primary key,
  auth0_sub text unique not null,
  display_name text,
  email text,
  avatar_url text,
  discord_username text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.cert_progress (
  id uuid default gen_random_uuid() primary key,
  auth0_sub text not null,
  pathway_id text not null,
  status text default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now(),
  unique(auth0_sub, pathway_id)
);

create table if not exists public.applications (
  id uuid default gen_random_uuid() primary key,
  auth0_sub text,
  name text not null,
  email text not null,
  phone text,
  message text,
  pathway_interest text,
  submitted_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.cert_progress enable row level security;
alter table public.applications enable row level security;

create policy "Public profiles access" on public.profiles for all using (true) with check (true);
create policy "Public cert progress access" on public.cert_progress for all using (true) with check (true);
create policy "Anyone can apply" on public.applications for insert with check (true);
create policy "Service role reads applications" on public.applications for select using (auth.role() = 'service_role');
