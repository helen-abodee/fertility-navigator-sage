/**
 * Patient-held journey tracker. Lives on the device like everything else; the
 * only way it reaches a care team is the patient sharing their own summary.
 * Anti-anxiety rules: no scores, no percentages, no streaks, no "incomplete";
 * deciding not to preserve (or to wait) is a finished, respected endpoint.
 *
 * The stage model is also the shared vocabulary for any future care-team
 * dashboard (see docs/DATA-ARCHITECTURE.md); keep ids stable.
 */

export type JourneyStageId =
  | "learned_risk"
  | "talked_care_team"
  | "checked_coverage"
  | "contacted_clinic"
  | "had_consult"
  | "started_preservation";

export type JourneyOutcome = "completed" | "decided_not_to" | null;

export interface Journey {
  done: JourneyStageId[];
  outcome: JourneyOutcome;
  /** ISO date of last change, for the patient's own record */
  updated: string;
}

export const journeyStages: { id: JourneyStageId; label: string }[] = [
  { id: "learned_risk", label: "Learned my risk group" },
  { id: "talked_care_team", label: "Talked with my care team" },
  { id: "checked_coverage", label: "Checked my insurance coverage" },
  { id: "contacted_clinic", label: "Contacted a clinic" },
  { id: "had_consult", label: "Had a consult" },
  { id: "started_preservation", label: "Started preservation" },
];

export const journeyOutcomes: { id: Exclude<JourneyOutcome, null>; label: string }[] = [
  { id: "completed", label: "I completed preservation" },
  { id: "decided_not_to", label: "I decided not to preserve" },
];

export function emptyJourney(): Journey {
  return { done: [], outcome: null, updated: new Date().toISOString().slice(0, 10) };
}

export function toggleStage(j: Journey, id: JourneyStageId): Journey {
  const done = j.done.includes(id) ? j.done.filter((x) => x !== id) : [...j.done, id];
  return { ...j, done, updated: new Date().toISOString().slice(0, 10) };
}

export function setOutcome(j: Journey, outcome: Exclude<JourneyOutcome, null>): Journey {
  return {
    ...j,
    outcome: j.outcome === outcome ? null : outcome,
    updated: new Date().toISOString().slice(0, 10),
  };
}

/** Plain lines for the printed summary a patient can hand to their care team. */
export function summaryLines(j: Journey): string[] {
  const lines: string[] = [];
  for (const s of journeyStages) {
    if (j.done.includes(s.id)) lines.push(`Done: ${s.label}`);
  }
  if (j.outcome === "completed") lines.push("Where I landed: I completed fertility preservation.");
  if (j.outcome === "decided_not_to")
    lines.push("Where I landed: I decided not to preserve. This was my decision to make.");
  if (lines.length > 0) lines.push(`As of ${j.updated}.`);
  return lines;
}
