-- Allow authenticates user to create incidents only as themsleves
-- created_by value must match user id from auth JWT
create policy "Authenticated users can create incidents"
on public.incidents
to authenticated
with check ((select auth.uid()) = created_by);

-- Allow authenticated users to read their created incidents
-- Restrictive for now until team implementation
create policy "Users can read their own incidents"
on public.incidents
to authenticated
using ((select auth.uid()) = created_by)