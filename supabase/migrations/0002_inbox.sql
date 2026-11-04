-- Inbox routing: a patient who picked their care-team member sends into that
-- member's inbox, so the clinician enters ONE code (their own) instead of one
-- per patient. Same pilot posture as 0001.
alter table public.journey_sync
  add column if not exists inbox text
  check (inbox is null or inbox ~ '^[A-Z2-9]{3}-[A-Z2-9]{3}$');
create index if not exists journey_sync_inbox_idx on public.journey_sync (inbox);
