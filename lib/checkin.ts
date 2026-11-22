import { track } from "./analytics";

/**
 * The check-in: three words, no scores, no history. The latest word is kept
 * on the device so (a) the app can offer the right thing next time and
 * (b) it can ride along to a care team member the patient chose to share
 * with. Nothing leaves the device otherwise.
 */

export type CheckinWord = "steady" | "wobbly" | "rough";

const KEY = "fpn.checkin";

export function saveCheckin(word: CheckinWord): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ word, date: new Date().toISOString().slice(0, 10) }));
  } catch {
    /* private mode: the check-in still works, it just isn't remembered */
  }
  track("checkin_answered");
}

export function loadCheckin(): { word: CheckinWord; date: string } | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (p && ["steady", "wobbly", "rough"].includes(p.word)) return p;
    return null;
  } catch {
    return null;
  }
}

/** Coarse topic trail (tab names only), for the optional care-team share. */
const TOPICS_KEY = "fpn.topics";

export function noteTopic(tab: string): void {
  try {
    const cur: string[] = JSON.parse(localStorage.getItem(TOPICS_KEY) ?? "[]");
    if (!cur.includes(tab)) {
      cur.push(tab);
      localStorage.setItem(TOPICS_KEY, JSON.stringify(cur.slice(0, 12)));
    }
  } catch {
    /* fine */
  }
}

export function loadTopics(): string[] {
  try {
    return JSON.parse(localStorage.getItem(TOPICS_KEY) ?? "[]");
  } catch {
    return [];
  }
}
