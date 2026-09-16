-- Tasks table for the Telegram Todo Mini App
-- Run this in your Supabase SQL Editor

create table tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  completed boolean default false,
  user_id bigint not null,
  created_at timestamptz default now()
);

-- Index for fast lookups by user
create index idx_tasks_user_id on tasks (user_id);
