-- Lock down the sync table (response to pilot security review):
-- 1. The old "anon can read" policy allowed SELECT with no filter, so the
--    whole table could be dumped. Reads now go ONLY through functions that
--    require the exact code, so there is no way to list rows.
-- 2. New link codes are 8 characters (31^8, about 850 billion), making
--    guessing impractical; old 6-character codes keep working for reads.
-- 3. Blind updates still require knowing a code; with 8-character codes that
--    is the capability model (same as an unguessable share link).

-- Allow both the old ABC-123 and the new ABCD-EFGH code shapes.
alter table public.journey_sync drop constraint if exists journey_sync_code_check;
alter table public.journey_sync
  add constraint journey_sync_code_check
  check (code ~ '^[A-Z2-9]{3,4}-[A-Z2-9]{3,4}$');

-- No more open reads: drop the listing policy.
drop policy if exists "anon can read by code" on public.journey_sync;

-- Exact-code read, one row, no listing possible.
create or replace function public.get_journey(p_code text)
returns table (payload text, updated_at timestamptz)
language sql
security definer
set search_path = ''
stable
as $$
  select payload, updated_at from public.journey_sync
  where code = upper(trim(p_code));
$$;

-- A care-team inbox read: requires the exact inbox code.
create or replace function public.get_inbox(p_inbox text)
returns table (code text, payload text, updated_at timestamptz)
language sql
security definer
set search_path = ''
stable
as $$
  select code, payload, updated_at from public.journey_sync
  where inbox = upper(trim(p_inbox));
$$;

revoke all on function public.get_journey(text) from public;
revoke all on function public.get_inbox(text) from public;
grant execute on function public.get_journey(text) to anon, authenticated;
grant execute on function public.get_inbox(text) to anon, authenticated;
