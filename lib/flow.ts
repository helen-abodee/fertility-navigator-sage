import type { Answers, QuestionId } from "./types";

/**
 * The ordered list of questions for the current answers.
 * Conditional questions appear only once their gate answer is present:
 * - time_since: only after stage === "finished"
 * - partner_insurance: only when whoFor === "me_and_partner"
 * Every question is skippable; the sequence never depends on a question
 * having been answered, only on the answers that gate branches.
 */
export function questionSequence(answers: Answers): QuestionId[] {
  const seq: QuestionId[] = ["who_for", "stage"];
  if (answers.stage === "finished") seq.push("time_since");
  seq.push("age", "anatomy", "cancer_type", "treatments", "feelings", "insurance");
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
