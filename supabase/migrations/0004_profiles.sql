-- Lane-2 profiles (PILOT, flag-gated). Operated under the founder's LLC.
-- CMIA-shaped from day one: per-user isolation, explicit authorization
-- recorded, self-service deletion, no third-party sharing anywhere.

create table if not exists public.profile_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  answers jsonb,
  journey jsonb,
  consent_version text not null,
  consent_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profile_data enable row level security;

create policy "own row select" on public.profile_data
  for select to authenticated using (auth.uid() = user_id);
create policy "own row insert" on public.profile_data
  for insert to authenticated with check (auth.uid() = user_id);
create policy "own row update" on public.profile_data
  for update to authenticated using (auth.uid() = user_id);
create policy "own row delete" on public.profile_data
  for delete to authenticated using (auth.uid() = user_id);

-- Self-service account deletion: removes the auth user (cascades to data).
create or replace function public.delete_me()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from auth.users where id = auth.uid();
$$;

revoke all on function public.delete_me() from public;
grant execute on function public.delete_me() to authenticated;
