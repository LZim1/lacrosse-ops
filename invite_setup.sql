-- Invite system
-- Run in Supabase SQL Editor

create table if not exists invites (
  id uuid primary key default gen_random_uuid(),
  token text unique not null default encode(gen_random_bytes(16), 'hex'),
  program_id uuid references programs(id) on delete cascade not null,
  role text not null default 'staff' check (role in ('director', 'staff')),
  email text,
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  accepted_at timestamptz
);

-- IMPORTANT: Before using invites, go to Supabase dashboard →
-- Authentication → Settings → disable "Enable email confirmations"
-- Otherwise new users must confirm email before they can log in.
