import type { Answers, QuestionId } from "./types";
import { regimensFor } from "./crisp";

/**
 * The ordered list of questions for the current answers.
 * Conditional questions appear only once their gate answer is present:
 * - time_since: only after stage === "finished"
 * - chemo_drugs: only when treatments include chemo
 * - chemo_regimen: only when chemo is selected, the diagnosis has regimens in
 *   the CRISP table, and the person did not answer testes (the table is
 *   female-outcome only)
 * - radiation_area: only when treatments include radiation
 * - partner_insurance: only when whoFor === "me_and_partner"
 * Every question is skippable; the sequence never depends on a question
 * having been answered, only on the answers that gate branches.
 */
export function questionSequence(answers: Answers): QuestionId[] {
  const seq: QuestionId[] = ["entry"];
  if (answers.entry === "exploring") return seq;
  seq.push("who_for");
  if (answers.entry === "plan_yes") seq.push("stage");
  if (answers.entry === "finished") seq.push("time_since");
  seq.push("age", "anatomy", "cancer_type");
  // No treatment plan yet: skip every treatment-detail question.
  const knowsTreatment = answers.entry === "plan_yes" || answers.entry === "finished";
  if (knowsTreatment) {
    seq.push("treatments");
    if (answers.treatments?.includes("chemo")) {
      seq.push("chemo_drugs");
      if (answers.anatomy !== "testes" && regimensFor(answers.cancerType).length > 0) {
        seq.push("chemo_regimen");
      }
    }
    if (answers.treatments?.includes("radiation")) seq.push("radiation_area");
  }
  seq.push("feelings");
  // The practical section only matters when children are (or may be) wanted.
  if (answers.feelings !== "no") {
    seq.push("insurance");
    if (answers.whoFor === "me_and_partner") seq.push("partner_insurance");
    seq.push("zip");
  }
  return seq;
}

/** Survey sections: 1 = you and your treatment, 2 = children someday, 3 = practical. */
export function sectionOf(q: QuestionId): 1 | 2 | 3 {
  if (q === "feelings") return 2;
  if (q === "insurance" || q === "partner_insurance" || q === "zip") return 3;
  return 1;
}

export function nextQuestion(answers: Answers, current: QuestionId): QuestionId | "results" {
  const seq = questionSequence(answers);
  const i = seq.indexOf(current);
  if (i === -1 || i === seq.length - 1) return "results";
  return seq[i + 1];
}

export function prevQuestion(answers: Answers, current: QuestionId): QuestionId | null {
  const seq = questionSequence(answers);
  const i = seq.indexOf(current);
  if (i <= 0) return null;
  return seq[i - 1];
}

/** 0 at the first question, strictly below 1 everywhere (results = done). */
export function progress(answers: Answers, current: QuestionId): number {
  const seq = questionSequence(answers);
  const i = seq.indexOf(current);
  if (i <= 0) return 0;
  return i / seq.length;
}
