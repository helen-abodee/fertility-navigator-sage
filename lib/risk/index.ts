import type { Anatomy, ChemoAgent, TreatmentType } from "../types";

/**
 * Risk assessment module - PLACEHOLDER.
 *
 * The clinical logic (cumulative alkylating-agent dosing / cyclophosphamide
 * equivalent dose, radiation) arrives as a document from the survivorship NP
 * into source-docs/risk-assessment/. Until it is implemented against that
 * document, this module returns "coming soon" for every input.
 *
 * Hard rules when it IS implemented:
 * - output is a risk CATEGORY tied to published guidelines, plus a prompt to
 *   discuss with the care team
 * - never a personal probability, never a recommendation to do or not do a
 *   procedure
 */

export interface RiskInput {
  treatments?: TreatmentType[];
  chemoAgents?: ChemoAgent[];
  age?: number;
  anatomy?: Anatomy;
}

export interface RiskResult {
  status: "coming_soon";
}

export function assessRisk(_input: RiskInput): RiskResult {
  return { status: "coming_soon" };
}
