/**
 * Lane-1 engagement analytics (see docs/PROFILES-LAW-BRIEF.md): anonymous
 * usage events with a random session id. The allowlist is the privacy
 * mechanism: no event can carry answers, diagnosis, anatomy, or which
 * option/step/tab content was involved. The database enforces the same list
 * and is write-only for clients. Off entirely unless sync env is configured.
 */

const SYNC_URL = process.env.NEXT_PUBLIC_SYNC_URL;
const SYNC_KEY = process.env.NEXT_PUBLIC_SYNC_ANON_KEY;

export const ALLOWED_EVENTS = [
  "app_open",
  "survey_start",
  "survey_complete",
  "risk_viewed",
  "tab_viewed",
  "option_opened",
  "clinic_detail_opened",
  "compare_used",
  "coverage_checked",
  "reflection_start",
  "reflection_complete",
  "journey_step_toggled",
  "send_progress",
  "reach_out_opened",
  "summary_downloaded",
] as const;

export type AppEvent = (typeof ALLOWED_EVENTS)[number];

export const analyticsEnabled = Boolean(SYNC_URL && SYNC_KEY);

export function sessionId(): string {
  try {
    const existing = localStorage.getItem("navigator.session.v1");
    if (existing && /^[a-z0-9]{8}$/.test(existing)) return existing;
    const fresh = Array.from({ length: 8 }, () => "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]).join("");
    localStorage.setItem("navigator.session.v1", fresh);
    return fresh;
  } catch {
    return "ephemeral";
  }
}

const recent = new Map<string, number>();

export function track(event: AppEvent): void {
  if (!analyticsEnabled) return;
  if (!ALLOWED_EVENTS.includes(event)) return;
  const now = Date.now();
  const last = recent.get(event) ?? 0;
  if (now - last < 5000) return; // same event within 5s: once is enough
  recent.set(event, now);
  const session = sessionId();
  if (session === "ephemeral") return;
  try {
    void fetch(`${SYNC_URL}/rest/v1/app_events`, {
      method: "POST",
      headers: {
        apikey: SYNC_KEY!,
        Authorization: `Bearer ${SYNC_KEY!}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event, session }),
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    /* analytics must never break the app */
  }
}
