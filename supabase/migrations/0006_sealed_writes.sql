-- Seal the table completely: no direct reads OR writes. Everything goes
-- through three exact-code functions (get_journey, get_inbox, put_journey),
-- so policy drift in the dashboard can never reopen or break the table.
drop policy if exists "anon can upsert own code" on public.journey_sync;
drop policy if exists "anon can update own code" on public.journey_sync;
drop policy if exists "anon can read by code" on public.journey_sync;

create or replace function public.put_journey(p_code text, p_payload text, p_inbox text default null)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.journey_sync (code, payload, inbox, updated_at)
  values (upper(trim(p_code)), p_payload, nullif(upper(trim(p_inbox)), ''), now())
  on conflict (code) do update
    set payload = excluded.payload,
        inbox = coalesce(excluded.inbox, public.journey_sync.inbox),
        updated_at = now();
$$;

revoke all on function public.put_journey(text, text, text) from public;
grant execute on function public.put_journey(text, text, text) to anon, authenticated;
