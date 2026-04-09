-- Team setup: auto-profile creation trigger
-- Run this in the Supabase SQL Editor

-- When a new user signs up, automatically create their profile
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, role)
  values (new.id, new.email, 'staff')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Drop the trigger if it exists, then recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
