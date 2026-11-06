-- Lane-1 engagement analytics: anonymous usage events, never health data.
-- Event names are an enforced allowlist; nothing about answers, diagnosis,
-- anatomy, or which option/step was involved can be stored.
create table if not exists public.app_events (
  id bigint generated always as identity primary key,
  event text not null check (event in (
    'app_open','survey_start','survey_complete','risk_viewed',
    'tab_viewed','option_opened','clinic_detail_opened','compare_used',
    'coverage_checked','reflection_start','reflection_complete',
    'journey_step_toggled','send_progress','reach_out_opened','summary_downloaded'
  )),
  session text not null check (session ~ '^[a-z0-9]{8}$'),
  ts timestamptz not null default now()
);

alter table public.app_events enable row level security;

-- Write-only for the app: events go in, nothing can be read back by clients.
create policy "anon can insert events" on public.app_events
  for insert to anon with check (true);
