import type { Answers } from "./types";

/**
 * Optional "save my progress", local storage only, behind an explicit opt-in.
 * Every access is guarded: storage can be unavailable or blocked, and the app
 * must work identically without it.
 */

const KEY = "navigator.progress.v1";

export function saveProgress(answers: Answers, current: string): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ answers, current }));
  } catch {
    /* storage unavailable: silently keep working in memory */
  }
}

export function loadProgress(): { answers: Answers; current: string } | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !parsed.answers) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function eraseEverything(): void {
  try {
    localStorage.removeItem(KEY);
    localStorage.clear();
  } catch {
    /* nothing stored anywhere else; in-memory state is cleared by the caller */
  }
}

export function hasSavedProgress(): boolean {
  return loadProgress() !== null;
}
