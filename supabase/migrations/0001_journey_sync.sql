-- One-tap progress sync (PILOT; see docs/HIPAA-BRIEF.md before real-patient use).
-- The payload is the app's share-code string: journey stages, outcome, date,
-- optional patient-typed nickname. Nothing else is accepted by the client.
create table if not exists public.journey_sync (
  code text primary key check (code ~ '^[A-Z2-9]{3}-[A-Z2-9]{3}$'),
  payload text not null check (length(payload) < 2000),
  updated_at timestamptz not null default now()
);

alter table public.journey_sync enable row level security;

-- Pilot threat model: a random 6-character code is the capability to read or
-- update that one row. Tighten before any production use.
create policy "anon can upsert own code" on public.journey_sync
  for insert to anon with check (true);
create policy "anon can update own code" on public.journey_sync
  for update to anon using (true);
create policy "anon can read by code" on public.journey_sync
  for select to anon using (true);
