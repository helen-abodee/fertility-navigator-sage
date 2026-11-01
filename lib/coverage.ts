import type { Citation, TreatmentStage } from "./types";
import { d4, sb729 } from "../content/app/citations";

/**
 * Coverage checker: maps granular insurance answers to a likely-coverage
 * verdict and personalized next steps, built entirely from the UCSD/AFP
 * toolkit (D4) and the verified SB 600 / SB 729 research. Verdicts always say
 * "likely" and always include verifying with the plan; plan-specific numbers
 * (deductibles, copays) are unknowable here and never invented.
 */

export type Channel =
  | "job"
  | "parent"
  | "spouse"
  | "self_bought"
  | "covered_ca"
  | "medi_cal"
  | "medicare"
  | "military_active"
  | "military_dependent"
  | "federal"
  | "none"
  | "unknown";

export interface CoverageInput {
  channel?: Channel;
  /** for employer plans */
  funding?: "fully_insured" | "self_funded" | "unknown";
  /** matters for SB 729 (survivors) */
  employerSize?: "small" | "large" | "unknown";
  basedInCalifornia?: "yes" | "no" | "unknown";
  stage?: TreatmentStage;
}

export interface CoverageStep {
  label: string;
  detail?: string;
}

export interface CoverageVerdict {
  verdict: "likely_covered" | "likely_not_covered" | "depends";
  headline: string;
  body: string;
  steps: CoverageStep[];
  citations: Citation[];
}

const sb729Text = () =>
  sb729(
    "SB 729 chaptered text (2024), via CalMatters Digital Democracy",
    "https://calmatters.digitaldemocracy.org/bills/ca_202320240sb729",
  );
const sb600Text = () =>
  sb729(
    "SB 600 (2019), via CalMatters Digital Democracy",
    "https://calmatters.digitaldemocracy.org/bills/ca_201920200sb600",
  );

const CALL_SCRIPT: CoverageStep = {
  label: "Call member services with the magic words",
  detail:
    'Use the number on your insurance card. Say: "I am calling to verify coverage for medically indicated fertility preservation, also known as iatrogenic infertility. This is not the same as general infertility benefits."',
};
const WRITE_IT_DOWN: CoverageStep = {
  label: "Write down the call",
  detail: "Agent's name, reference number, date. You will want these if you appeal.",
};
const URGENT_APPEAL: CoverageStep = {
  label: "If they say no, appeal as urgent",
  detail:
    "Your doctor can file it for you. Urgent appeals are decided in about 4 days. If the plan still says no, contact the DMHC, California's plan regulator.",
};
const AID: CoverageStep = {
  label: "Use the financial aid programs",
  detail: "The aid list on your results page exists for exactly this. Many clinics also have payment plans and cash-price programs; ask.",
};

export function assessCoverage(input: CoverageInput): CoverageVerdict {
  const survivor = input.stage === "finished";

  switch (input.channel) {
    case "medi_cal":
      return {
        verdict: "likely_not_covered",
        headline: "Medi-Cal does not cover this right now",
        body: "Medi-Cal is excluded from both California coverage laws (SB 600 and SB 729), so fertility preservation is not a covered Medi-Cal benefit as of November 2026.",
        steps: [
          AID,
          { label: "Ask the clinic about cash prices", detail: "Some clinics have reduced cash programs for medically indicated preservation." },
        ],
        citations: [d4(33), sb729Text()],
      };
    case "medicare":
      return {
        verdict: "likely_not_covered",
        headline: "Medicare does not cover this",
        body: "Medicare is not subject to state coverage laws and does not cover fertility preservation.",
        steps: [AID],
        citations: [d4(8)],
      };
    case "military_dependent":
      return {
        verdict: "likely_not_covered",
        headline: "Military plans cover members, not dependents",
        body: "Military health plans cover fertility preservation for active service members, but dependents and family members are not eligible.",
        steps: [AID, CALL_SCRIPT],
        citations: [d4(8), d4(21)],
      };
    case "military_active":
      return {
        verdict: "likely_covered",
        headline: "Covered for active service members",
        body: "Military health plans cover fertility preservation for active service members. Verify the details with your plan before scheduling.",
        steps: [CALL_SCRIPT, WRITE_IT_DOWN],
        citations: [d4(8)],
      };
    case "federal":
      return {
        verdict: "likely_covered",
        headline: "Federal employee plans must include this",
        body: "Federal employee health plans are required by federal statute to include fertility preservation benefits. If yours doesn't show it, you can appeal.",
        steps: [CALL_SCRIPT, WRITE_IT_DOWN],
        citations: [d4(8)],
      };
    case "none":
      return {
        verdict: "likely_not_covered",
        headline: "Without insurance, plan around the listed prices",
        body: "The published prices in each option are what to plan around. Financial aid and clinic cash programs can bring them down.",
        steps: [AID, { label: "Ask about payment plans", detail: "Some clinics defer payment or split it; asking costs nothing." }],
        citations: [d4(10)],
      };
    case "unknown":
    case undefined:
      return {
        verdict: "depends",
        headline: "First, find out what plan you have",
        body: "Your insurance card says who runs your plan. If you got it through a job (yours, a parent's, or a spouse's), HR can answer the questions below in one email.",
        steps: [
          { label: "Find your card or plan name", detail: "The member services number on the back is the one you'll call." },
          CALL_SCRIPT,
          WRITE_IT_DOWN,
        ],
        citations: [d4(20), d4(21)],
      };
  }

  // Employer or self-bought commercial plans from here.
  if (input.basedInCalifornia === "no") {
    return {
      verdict: "depends",
      headline: "Depends on your plan's state",
      body: "Coverage laws are state by state: 20 states and DC require some fertility preservation coverage. What matters is the state your plan is based in, not where you live.",
      steps: [
        { label: "Ask what state your plan is based in", detail: "Then check that state on the Alliance for Fertility Preservation's law map (allianceforfertilitypreservation.org)." },
        CALL_SCRIPT,
        WRITE_IT_DOWN,
      ],
      citations: [d4(4), d4(33)],
    };
  }

  // Covered California marketplace plans are subject to state mandates; the
  // self-funded question only exists for employer plans.
  const marketplace = input.channel === "covered_ca" || input.channel === "self_bought";

  if (!marketplace && input.funding === "self_funded") {
    return {
      verdict: "likely_not_covered",
      headline: "Self-funded plans don't have to follow the California law",
      body: "When an employer pays claims itself (self-funded), state coverage laws don't apply, and appeals rarely succeed. Some employers still choose to include the benefit, so it is worth one call.",
      steps: [
        { label: "Still ask", detail: "Some self-funded employers include fertility benefits voluntarily. Ask HR or the plan." },
        AID,
      ],
      citations: [d4(8), d4(23)],
    };
  }

  if (!marketplace && (input.funding === "unknown" || input.funding === undefined)) {
    return {
      verdict: "depends",
      headline: "One question decides it",
      body: "California's laws apply to fully insured plans but not self-funded ones. Most people don't know which they have, and one question answers it.",
      steps: [
        { label: 'Ask HR or your plan: "Is my plan self-funded or fully insured?"', detail: "HR answers this routinely. Then come back and run this check again." },
        CALL_SCRIPT,
      ],
      citations: [d4(8), d4(23)],
    };
  }

  // Fully insured (or Covered California) California plan.
  if (survivor) {
    if (input.employerSize === "large") {
      return {
        verdict: "likely_covered",
        headline: "SB 729 likely covers your fertility treatment",
        body: "For plan years starting on or after January 1, 2026, SB 729 makes large-group California plans cover infertility treatment including IVF: up to 3 egg retrievals and unlimited embryo transfers. If your plan renewed before that date, the benefit starts at renewal.",
        steps: [
          { label: "Ask when your plan year renews", detail: "The benefit applies from your first renewal on or after January 1, 2026." },
          CALL_SCRIPT,
          WRITE_IT_DOWN,
          URGENT_APPEAL,
        ],
        citations: [sb729Text(), d4(22)],
      };
    }
    if (input.employerSize === "small") {
      return {
        verdict: "depends",
        headline: "Small-group plans only have to offer it",
        body: "Under SB 729, small employers must be offered infertility coverage, but each employer chooses whether to buy it. Yours may or may not have.",
        steps: [
          { label: "Ask HR whether the plan includes infertility/IVF coverage", detail: "If not, ask whether it can be added at renewal." },
          CALL_SCRIPT,
          AID,
        ],
        citations: [sb729Text()],
      };
    }
    return {
      verdict: "depends",
      headline: "Likely depends on your employer's size",
      body: "SB 729 requires large-group California plans to cover infertility treatment including IVF (from plan years starting January 1, 2026). Small-group plans only have to be offered it. HR can tell you in one question whether the plan is large group or small group.",
      steps: [
        { label: "Ask HR: is our plan large group or small group?" },
        CALL_SCRIPT,
        WRITE_IT_DOWN,
      ],
      citations: [sb729Text()],
    };
  }

  return {
    verdict: "likely_covered",
    headline: "California law is on your side (SB 600)",
    body: "Since 2019, SB 600 makes fertility preservation a covered basic benefit on state-regulated California plans when treatment could cause infertility. Your cost becomes your plan's usual share, not the full price. Verify it with one call before scheduling.",
    steps: [CALL_SCRIPT, WRITE_IT_DOWN, { label: "Ask about storage", detail: "Ask whether storage is covered and for how many years." }, URGENT_APPEAL],
    citations: [d4(36), sb600Text(), d4(22), d4(35)],
  };
}
