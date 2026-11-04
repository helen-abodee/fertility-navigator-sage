import type { Journey } from "./journey";
import { decodeShareCode, encodeShareCode } from "./share";

/**
 * One-tap progress sync, no SMS anywhere (so no A2P verification, ever).
 * The patient taps "Send"; the payload (checklist stages only, the same
 * share-code content) lands in a table keyed by a short link code; the care
 * team's board reads it by that code. First connection still exchanges the
 * short code once, out loud or in person, because without accounts that is
 * the identity bootstrap.
 *
 * PILOT GATE: this makes us a business associate the moment real patients use
 * it with the care team (see docs/HIPAA-BRIEF.md). It ships disabled and turns
 * on only when NEXT_PUBLIC_SYNC_URL and NEXT_PUBLIC_SYNC_ANON_KEY are set on a
 * dedicated project, and should carry a BAA before real use.
 */

const SYNC_URL = process.env.NEXT_PUBLIC_SYNC_URL;
const SYNC_KEY = process.env.NEXT_PUBLIC_SYNC_ANON_KEY;

export const syncEnabled = Boolean(SYNC_URL && SYNC_KEY);

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O/1/I/L

/** Short, say-outloud-able link code like "MKT-4R7". */
export function newLinkCode(rng: () => number = Math.random): string {
  const pick = () => ALPHABET[Math.floor(rng() * ALPHABET.length)];
  return `${pick()}${pick()}${pick()}-${pick()}${pick()}${pick()}`;
}

export function isLinkCode(s: string): boolean {
  return /^[A-Z2-9]{3}-[A-Z2-9]{3}$/.test(s.trim().toUpperCase());
}

/** The wire payload is exactly the share code: stages, outcome, date, plus
 * only the extras the patient toggled on at share time. */
export function syncPayload(journey: Journey, nickname?: string, extras?: { riskLabel?: string }): string {
  return encodeShareCode(journey, nickname, extras);
}

export async function pushJourney(
  code: string,
  journey: Journey,
  nickname?: string,
  inbox?: string,
  extras?: { riskLabel?: string },
): Promise<boolean> {
  if (!syncEnabled) return false;
  try {
    const row = {
      code: code.toUpperCase(),
      payload: syncPayload(journey, nickname, extras),
      updated_at: new Date().toISOString(),
      inbox: inbox && isLinkCode(inbox) ? inbox.toUpperCase() : null,
    };
    const res = await fetch(`${SYNC_URL}/rest/v1/journey_sync?on_conflict=code`, {
      method: "POST",
      headers: {
        apikey: SYNC_KEY!,
        Authorization: `Bearer ${SYNC_KEY!}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify(row),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Everything patients sent into one care-team member's inbox. */
export async function fetchInbox(
  inbox: string,
): Promise<{ code: string; nickname: string; journey: Journey; riskLabel?: string; updatedAt: string }[]> {
  if (!syncEnabled) return [];
  try {
    const res = await fetch(
      `${SYNC_URL}/rest/v1/journey_sync?inbox=eq.${encodeURIComponent(inbox.toUpperCase())}&select=code,payload,updated_at`,
      { headers: { apikey: SYNC_KEY!, Authorization: `Bearer ${SYNC_KEY!}` } },
    );
    if (!res.ok) return [];
    const rows = await res.json();
    if (!Array.isArray(rows)) return [];
    const out = [];
    for (const r of rows) {
      const decoded = decodeShareCode(r.payload);
      if (decoded) {
        out.push({ code: String(r.code), ...decoded, updatedAt: String(r.updated_at ?? "").slice(0, 10) });
      }
    }
    return out;
  } catch {
    return [];
  }
}

export async function fetchJourney(code: string): Promise<{ nickname: string; journey: Journey; updatedAt: string } | null> {
  if (!syncEnabled) return null;
  try {
    const res = await fetch(
      `${SYNC_URL}/rest/v1/journey_sync?code=eq.${encodeURIComponent(code.toUpperCase())}&select=payload,updated_at`,
      { headers: { apikey: SYNC_KEY!, Authorization: `Bearer ${SYNC_KEY!}` } },
    );
    if (!res.ok) return null;
    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) return null;
    const decoded = decodeShareCode(rows[0].payload);
    if (!decoded) return null;
    return { ...decoded, updatedAt: String(rows[0].updated_at ?? "").slice(0, 10) };
  } catch {
    return null;
  }
}
