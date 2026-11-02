import type { Answers, Citation } from "../types";
import { riskRules } from "./rules";

/**
 * Risk assessment: maps what a patient actually knows to a risk CATEGORY from
 * published frameworks, never a probability or a recommendation.
 *
 * The clinical mapping lives entirely in ./rules.ts, built to be REPLACED when
 * the cancer center's own guidance arrives (source-docs/risk-assessment/):
 * edit the rules, run the tests, done. Sources and conflict notes:
 * content/sources/risk-framework.md.
 */

export type RiskCategory = "high" | "intermediate" | "lower" | "variable" | "unknown";

export interface RiskAssessment {
  category: RiskCategory;
  /** short label for the category chip, patient language */
  label: string;
  headline: string;
  body: string;
  /** always present: what to ask the care team */
  askTeam: string;
  citations: Citation[];
}

export function assessRisk(answers: Answers): RiskAssessment {
  for (const rule of riskRules) {
    if (rule.applies(answers)) {
      return typeof rule.result === "function" ? rule.result(answers) : rule.result;
    }
  }
  // riskRules ends with a catch-all; this line is unreachable.
  throw new Error("risk rules must end with a catch-all rule");
}
