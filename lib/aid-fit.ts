import type { Answers } from "./types";
import type { AidOrg } from "./content-schema";

/**
 * A soft eligibility check against each aid program's published rules.
 * Same anti-anxiety contract as everything else: an unknown answer never
 * excludes, and "unlikely" always says why, because the final word belongs to
 * the program and the social worker, not to us.
 */
export interface AidFitResult {
  fit: "may_fit" | "unlikely";
  reasons: string[];
}

export function aidFit(org: AidOrg, answers: Answers): AidFitResult {
  const f = org.fit;
  if (!f) return { fit: "may_fit", reasons: [] };
  const reasons: string[] = [];

  if (answers.age !== undefined && (f.minAge !== undefined || f.maxAge !== undefined)) {
    const lo = f.minAge ?? 0;
    const hi = f.maxAge ?? 200;
    if (answers.age < lo || answers.age > hi) {
      reasons.push(`this program is for ages ${f.minAge ?? "any"} to ${f.maxAge ?? "any"}`);
    }
  }
  if (f.stage && answers.stage && answers.stage !== "not_sure") {
    if (f.stage === "finished" && answers.stage !== "finished") {
      reasons.push("it is for people who have finished treatment");
    }
    if (f.stage === "not_started" && answers.stage === "finished") {
      reasons.push("it is for before or during treatment");
    }
  }
  if (
    f.anatomy &&
    answers.anatomy &&
    answers.anatomy !== "prefer_not_to_say" &&
    answers.anatomy !== "self_describe" &&
    !f.anatomy.includes(answers.anatomy)
  ) {
    reasons.push("its coverage is for a different body");
  }
  if (f.note) reasons.push(f.note);

  return reasons.length > 0 ? { fit: "unlikely", reasons } : { fit: "may_fit", reasons: [] };
}
