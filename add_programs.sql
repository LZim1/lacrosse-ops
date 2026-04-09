-- Programs refactor migration
-- Run this in the Supabase SQL Editor

-- 1. Programs table (Yeti, East Ave, TI National, etc.)
create table if not exists programs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- 2. Program members — maps users to programs with a role
create table if not exists program_members (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references programs(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  role text not null default 'staff' check (role in ('director', 'staff')),
  created_at timestamptz default now(),
  unique(program_id, user_id)
);

-- 3. Scope task instances to a program
alter table task_instances add column if not exists program_id uuid references programs(id);

-- 4. Company-wide super admin flag on profiles
alter table profiles add column if not exists is_super_admin boolean not null default false;

-- 5. Seed initial programs
insert into programs (id, name) values
  ('e1000000-0000-0000-0000-000000000001', 'Team Illinois'),
  ('e1000000-0000-0000-0000-000000000002', 'East Ave'),
  ('e1000000-0000-0000-0000-000000000003', 'Yeti')
on conflict (id) do nothing;

-- 6. Mark the existing director user as super admin
update profiles set is_super_admin = true where role = 'director';

-- 7. Add that user to Team Illinois as director
insert into program_members (program_id, user_id, role)
select 'e1000000-0000-0000-0000-000000000001', id, 'director'
from profiles where is_super_admin = true
on conflict do nothing;

-- 8. Assign all existing task instances to Team Illinois
update task_instances
set program_id = 'e1000000-0000-0000-0000-000000000001'
where program_id is null;

-- 9. Update auto-profile trigger to include new column
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, role, is_super_admin)
  values (new.id, new.email, 'staff', false)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;
