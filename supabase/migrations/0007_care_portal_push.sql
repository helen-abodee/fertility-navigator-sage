-- Care-team portal (clinician logins replace patient codes) + gentle nudges.
-- Same pilot posture as everything else: counsel review before real patients.

-- 1. Clinician accounts: a profile row on top of Supabase auth.
create table if not exists public.clinicians (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (length(display_name) between 2 and 60),
  org_label text not null default '' check (length(org_label) <= 80),
  listed boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.clinicians enable row level security;
create policy "clinician self select" on public.clinicians
  for select to authenticated using (user_id = auth.uid());
create policy "clinician self insert" on public.clinicians
  for insert to authenticated with check (user_id = auth.uid());
create policy "clinician self update" on public.clinicians
  for update to authenticated using (user_id = auth.uid());

-- Patients pick their care-team member from this listing (no codes).
create or replace function public.list_clinicians()
returns table (id uuid, display_name text, org_label text)
language sql security definer set search_path = '' stable
as $$
  select user_id, display_name, org_label from public.clinicians
  where listed order by display_name;
$$;
revoke all on function public.list_clinicians() from public;
grant execute on function public.list_clinicians() to anon, authenticated;

-- 2. Shares: written by the patient's device via an unguessable key,
--    readable only by the chosen clinician's signed-in account.
create table if not exists public.care_shares (
  id uuid primary key default gen_random_uuid(),
  clinician_id uuid not null references public.clinicians (user_id) on delete cascade,
  patient_key text not null unique check (length(patient_key) between 16 and 64),
  nickname text not null default '' check (length(nickname) <= 40),
  journey jsonb,
  checkin text check (checkin is null or checkin in ('steady','wobbly','rough')),
  checkin_date date,
  topics text[] not null default '{}',
  risk_label text check (risk_label is null or length(risk_label) <= 40),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.care_shares enable row level security;
create policy "clinician reads own patients" on public.care_shares
  for select to authenticated using (clinician_id = auth.uid());

create or replace function public.upsert_care_share(
  p_patient_key text, p_clinician uuid, p_nickname text,
  p_journey jsonb, p_checkin text, p_checkin_date date,
  p_topics text[], p_risk text
) returns void
language sql security definer set search_path = ''
as $$
  insert into public.care_shares
    (patient_key, clinician_id, nickname, journey, checkin, checkin_date, topics, risk_label, updated_at)
  values
    (p_patient_key, p_clinician, coalesce(p_nickname,''), p_journey, p_checkin, p_checkin_date,
     coalesce(p_topics,'{}'), p_risk, now())
  on conflict (patient_key) do update set
    clinician_id = excluded.clinician_id,
    nickname = excluded.nickname,
    journey = excluded.journey,
    checkin = excluded.checkin,
    checkin_date = excluded.checkin_date,
    topics = excluded.topics,
    risk_label = excluded.risk_label,
    updated_at = now();
$$;
create or replace function public.delete_care_share(p_patient_key text)
returns void language sql security definer set search_path = ''
as $$ delete from public.care_shares where patient_key = p_patient_key; $$;
revoke all on function public.upsert_care_share(text,uuid,text,jsonb,text,date,text[],text) from public;
revoke all on function public.delete_care_share(text) from public;
grant execute on function public.upsert_care_share(text,uuid,text,jsonb,text,date,text[],text) to anon, authenticated;
grant execute on function public.delete_care_share(text) to anon, authenticated;

-- 3. Gentle nudges: web-push subscriptions, sealed table, functions only.
create table if not exists public.push_subs (
  id uuid primary key default gen_random_uuid(),
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  mode text not null default 'deciding' check (mode in ('deciding','during','after','waiting')),
  next_at timestamptz not null default now() + interval '3 days',
  created_at timestamptz not null default now()
);
alter table public.push_subs enable row level security;

create or replace function public.save_push_sub(p_endpoint text, p_p256dh text, p_auth text, p_mode text)
returns void language sql security definer set search_path = ''
as $$
  insert into public.push_subs (endpoint, p256dh, auth, mode, next_at)
  values (p_endpoint, p_p256dh, p_auth, p_mode,
          now() + case p_mode when 'during' then interval '7 days'
                              when 'waiting' then interval '21 days'
                              when 'after' then interval '10 days'
                              else interval '3 days' end)
  on conflict (endpoint) do update set mode = excluded.mode;
$$;
create or replace function public.delete_push_sub(p_endpoint text)
returns void language sql security definer set search_path = ''
as $$ delete from public.push_subs where endpoint = p_endpoint; $$;
revoke all on function public.save_push_sub(text,text,text,text) from public;
revoke all on function public.delete_push_sub(text) from public;
grant execute on function public.save_push_sub(text,text,text,text) to anon, authenticated;
grant execute on function public.delete_push_sub(text) to anon, authenticated;
