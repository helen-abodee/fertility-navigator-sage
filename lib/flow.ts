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
  const seq: QuestionId[] = ["who_for", "stage"];
  if (answers.stage === "finished") seq.push("time_since");
  seq.push("age", "anatomy", "cancer_type", "treatments");
  if (answers.treatments?.includes("chemo")) {
    seq.push("chemo_drugs");
    if (answers.anatomy !== "testes" && regimensFor(answers.cancerType).length > 0) {
      seq.push("chemo_regimen");
    }
  }
  if (answers.treatments?.includes("radiation")) seq.push("radiation_area");
  seq.push("feelings", "insurance");
  if (answers.whoFor === "me_and_partner") seq.push("partner_insurance");
  seq.push("zip");
  return seq;
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
