-- ============================================================
-- DengueGuard AI: Supabase Database Schema
-- Run this in your Supabase SQL Editor to set up tables & RLS
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Community Reports Table
create table if not exists public.community_reports (
  id text primary key default ('rep-' || extract(epoch from now())::bigint),
  title text not null,
  description text not null,
  location_name text not null,
  latitude double precision not null default 28.6139,
  longitude double precision not null default 77.2090,
  severity text not null check (severity in ('low', 'medium', 'high', 'critical')),
  status text not null default 'pending' check (status in ('pending', 'verified', 'investigating', 'resolved')),
  image_url text,
  reporter_name text default 'Anonymous Citizen',
  upvotes integer default 1,
  admin_notes text default 'Pending field assessment',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Reminders Table
create table if not exists public.user_reminders (
  id text primary key default ('rem-' || extract(epoch from now())::bigint),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  category text not null check (category in ('water_cooler', 'flower_pots', 'repellent', 'water_storage', 'cleanup', 'custom')),
  frequency text not null default 'weekly' check (frequency in ('daily', 'weekly', 'biweekly')),
  scheduled_time text not null default '09:00',
  day_of_week integer default 0,
  enabled boolean default true,
  last_done text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Educational Articles & Content
create table if not exists public.educational_content (
  id text primary key,
  title_en text not null,
  title_hi text not null,
  category text not null,
  read_time text not null,
  summary_en text not null,
  summary_hi text not null,
  content_en text not null,
  content_hi text not null,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable Row Level Security (RLS)
alter table public.community_reports enable row level security;
alter table public.user_reminders enable row level security;
alter table public.educational_content enable row level security;

-- Policies for community_reports: Public can read, anyone can insert
create policy "Allow public read access to community reports"
  on public.community_reports for select
  using (true);

create policy "Allow anyone to submit reports"
  on public.community_reports for insert
  with check (true);

create policy "Allow authenticated users to update report status"
  on public.community_reports for update
  using (true);

-- Policies for educational_content: Public read access
create policy "Allow public read for educational content"
  on public.educational_content for select
  using (true);
