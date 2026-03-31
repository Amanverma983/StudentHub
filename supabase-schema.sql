-- StudentHub Database Schema
-- Run this in your Supabase SQL editor

-- ─── Extensions ───────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Profiles ────────────────────────────────────────────────
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  name text not null,
  role text not null check (role in ('writer', 'customer')),
  avatar_url text,
  bio text,
  university text,
  location text,
  skills text[] default '{}',
  rating decimal(3,2) default 0,
  completed_gigs integer default 0,
  total_earnings integer default 0,
  total_spent integer default 0,
  active_orders integer default 0,
  linkedin_url text,
  github_url text,
  website_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── Gigs ─────────────────────────────────────────────────────
create table public.gigs (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  subject text not null,
  description text not null,
  pages integer not null check (pages > 0),
  price integer not null check (price > 0),
  deadline timestamptz not null,
  urgency text not null check (urgency in ('standard', 'urgent', 'express')),
  status text not null default 'open' check (status in ('open', 'in-progress', 'completed', 'cancelled')),
  customer_id uuid references public.profiles(id) on delete cascade not null,
  assigned_to uuid references public.profiles(id),
  tags text[] default '{}',
  question text,
  attachment_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── Gig Applications ─────────────────────────────────────────
create table public.gig_applications (
  id uuid default uuid_generate_v4() primary key,
  gig_id uuid references public.gigs(id) on delete cascade not null,
  writer_id uuid references public.profiles(id) on delete cascade not null,
  message text,
  status text default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz default now(),
  unique(gig_id, writer_id)
);

-- ─── Resumes ──────────────────────────────────────────────────
create table public.resumes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null default 'My Resume',
  template text not null default 'modern',
  data jsonb not null default '{}',
  is_active boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── Portfolios ───────────────────────────────────────────────
create table public.portfolios (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  theme text not null default 'glassmorphism',
  data jsonb not null default '{}',
  slug text unique,
  is_published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── Reviews ──────────────────────────────────────────────────
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  gig_id uuid references public.gigs(id) on delete cascade not null,
  reviewer_id uuid references public.profiles(id) on delete cascade not null,
  reviewee_id uuid references public.profiles(id) on delete cascade not null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

-- ─── Row Level Security ───────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.gigs enable row level security;
alter table public.gig_applications enable row level security;
alter table public.resumes enable row level security;
alter table public.portfolios enable row level security;
alter table public.reviews enable row level security;

-- Profiles: public read, own write
create policy "Profiles are publicly readable" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Gigs: public read, customer write
create policy "Gigs are publicly readable" on public.gigs for select using (true);
create policy "Customers can post gigs" on public.gigs for insert with check (
  auth.uid() = customer_id and exists (
    select 1 from public.profiles where id = auth.uid() and role = 'customer'
  )
);
create policy "Customers can update own gigs" on public.gigs for update using (auth.uid() = customer_id);

-- Applications: writers can apply
create policy "Writers can view own applications" on public.gig_applications for select using (auth.uid() = writer_id);
create policy "Writers can apply to gigs" on public.gig_applications for insert with check (auth.uid() = writer_id);

-- Resumes: own access only
create policy "Users can manage own resumes" on public.resumes for all using (auth.uid() = user_id);

-- Portfolios: public read if published, own write
create policy "Published portfolios are public" on public.portfolios for select using (is_published = true or auth.uid() = user_id);
create policy "Users can manage own portfolio" on public.portfolios for all using (auth.uid() = user_id);

-- ─── Functions ────────────────────────────────────────────────

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_profiles_updated_at before update on public.profiles for each row execute procedure public.handle_updated_at();
create trigger handle_gigs_updated_at before update on public.gigs for each row execute procedure public.handle_updated_at();
create trigger handle_resumes_updated_at before update on public.resumes for each row execute procedure public.handle_updated_at();
create trigger handle_portfolios_updated_at before update on public.portfolios for each row execute procedure public.handle_updated_at();

-- ─── Indexes ──────────────────────────────────────────────────
create index idx_gigs_status on public.gigs(status);
create index idx_gigs_subject on public.gigs(subject);
create index idx_gigs_customer_id on public.gigs(customer_id);
create index idx_gigs_created_at on public.gigs(created_at desc);
create index idx_portfolios_slug on public.portfolios(slug) where slug is not null;
