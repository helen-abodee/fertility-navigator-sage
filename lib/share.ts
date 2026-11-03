import type { Journey, JourneyStageId, JourneyOutcome } from "./journey";
import { journeyStages } from "./journey";

/**
 * Progress share codes: the patient-controlled bridge to the care team.
 * A code contains ONLY the journey checklist (stage ids, outcome, date) and an
 * optional nickname the patient typed. Never answers, never diagnosis, never
 * risk inputs. The patient sends it through their own channel (text, email);
 * the clinician's board decodes it locally. No server anywhere.
 */

const PREFIX = "FPN1.";

function b64urlEncode(s: string): string {
  if (typeof window === "undefined") return Buffer.from(s).toString("base64url");
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s: string): string | null {
  try {
    if (typeof window === "undefined") return Buffer.from(s, "base64url").toString();
    return atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  } catch {
    return null;
  }
}

export function encodeShareCode(journey: Journey, nickname?: string): string {
  const payload = {
    n: nickname ?? "",
    d: journey.done,
    o: journey.outcome,
    u: journey.updated,
  };
  return PREFIX + b64urlEncode(JSON.stringify(payload));
}

const validStages = new Set(journeyStages.map((s) => s.id));

export function decodeShareCode(code: string): { nickname: string; journey: Journey } | null {
  const trimmed = code.trim();
  if (!trimmed.startsWith(PREFIX)) return null;
  const raw = b64urlDecode(trimmed.slice(PREFIX.length));
  if (!raw) return null;
  try {
    const p = JSON.parse(raw);
    if (!Array.isArray(p.d) || !("o" in p) || typeof p.u !== "string") return null;
    const done = p.d.filter((x: unknown): x is JourneyStageId => validStages.has(x as JourneyStageId));
    const outcome: JourneyOutcome =
      p.o === "completed" || p.o === "decided_not_to" || p.o === "still_deciding" ? p.o : null;
    return {
      nickname: typeof p.n === "string" ? p.n.slice(0, 40) : "",
      journey: { done, outcome, updated: p.u.slice(0, 10) },
    };
  } catch {
    return null;
  }
}

/** A clinician board entry: what one shared code became, labeled locally. */
export interface TeamEntry {
  label: string;
  journey: Journey;
  addedAt: string;
}

/**
 * Follow-up order: people still deciding come first, least-recently-updated
 * first (the stalled ones are the ones to call). Finished journeys, either
 * outcome, sink to the bottom with equal dignity.
 */
export function prioritize(entries: TeamEntry[]): TeamEntry[] {
  return [...entries].sort((a, b) => {
    const aDone = a.journey.outcome !== null;
    const bDone = b.journey.outcome !== null;
    if (aDone !== bDone) return aDone ? 1 : -1;
    return a.journey.updated.localeCompare(b.journey.updated);
  });
}
