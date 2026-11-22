import type { Journey } from "./journey";
import type { CheckinWord } from "./checkin";

/**
 * The care-team portal data layer. Patients write through unguessable-key
 * functions (no account needed); clinicians read their own patients through
 * their signed-in session. Payloads stay coarse on purpose: journey stages,
 * the latest check-in word, tab names visited, optional risk label. Never
 * survey answers, age, ZIP, or diagnosis.
 */

const URL_ = process.env.NEXT_PUBLIC_SYNC_URL;
const KEY = process.env.NEXT_PUBLIC_SYNC_ANON_KEY;
export const careEnabled = Boolean(URL_ && KEY);

const PATIENT_KEY = "fpn.carekey";
const LINKED = "fpn.careclinician";

function headers(): Record<string, string> {
  return { apikey: KEY!, Authorization: `Bearer ${KEY!}`, "Content-Type": "application/json" };
}

async function rpc(name: string, body: unknown): Promise<Response | null> {
  if (!careEnabled) return null;
  try {
    return await fetch(`${URL_}/rest/v1/rpc/${name}`, { method: "POST", headers: headers(), body: JSON.stringify(body) });
  } catch {
    return null;
  }
}

export interface ClinicianListing {
  id: string;
  display_name: string;
  org_label: string;
}

export async function listClinicians(): Promise<ClinicianListing[]> {
  const res = await rpc("list_clinicians", {});
  if (!res || !res.ok) return [];
  const rows = await res.json();
  return Array.isArray(rows) ? rows : [];
}

export function patientKey(): string {
  try {
    let k = localStorage.getItem(PATIENT_KEY);
    if (!k) {
      const bytes = new Uint8Array(18);
      crypto.getRandomValues(bytes);
      k = Array.from(bytes, (b) => "ABCDEFGHJKMNPQRSTUVWXYZ23456789"[b % 31]).join("");
      localStorage.setItem(PATIENT_KEY, k);
    }
    return k;
  } catch {
    return "";
  }
}

export function linkedClinician(): ClinicianListing | null {
  try {
    const raw = localStorage.getItem(LINKED);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function rememberClinician(c: ClinicianListing | null): void {
  try {
    if (c) localStorage.setItem(LINKED, JSON.stringify(c));
    else localStorage.removeItem(LINKED);
  } catch {
    /* fine */
  }
}

export async function sendCareShare(input: {
  clinicianId: string;
  nickname: string;
  journey: Journey;
  checkin: { word: CheckinWord; date: string } | null;
  topics: string[];
  riskLabel?: string;
}): Promise<boolean> {
  const key = patientKey();
  if (!key) return false;
  const res = await rpc("upsert_care_share", {
    p_patient_key: key,
    p_clinician: input.clinicianId,
    p_nickname: input.nickname.slice(0, 40),
    p_journey: { done: input.journey.done, outcome: input.journey.outcome },
    p_checkin: input.checkin?.word ?? null,
    p_checkin_date: input.checkin?.date ?? null,
    p_topics: input.topics.slice(0, 12),
    p_risk: input.riskLabel ?? null,
  });
  return Boolean(res && res.ok);
}

export async function stopCareShare(): Promise<void> {
  const key = patientKey();
  if (key) await rpc("delete_care_share", { p_patient_key: key });
  rememberClinician(null);
}
