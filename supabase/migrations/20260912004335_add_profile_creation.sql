-- Create a Driftline profile whenever Supabase Auth creates a new user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
    insert into public.profiles (id, display_name)
    values (
        new.id,
        new.raw_user_meta_data ->> 'display_name'
    );

    return new;
end;
$$;

-- Run the profile creation function after a new Auth user is inserted
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Authenticated users may read profiles
-- Later supports the display of incident authors and teammates
create policy "Authenticated users can read profiles"
on public.profiles
for select
to authenticated
using (true);

-- Users may only update their own profile
create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);