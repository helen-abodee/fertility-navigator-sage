import type { Answers } from "../types";
import type { RiskAssessment } from "./index";
import { crispBandToCategory, crispLookup, crispMeta } from "../crisp";
import {
  ALKYLATORS,
  citations,
  CONFIRM,
} from "./sources";

/**
 * THE SWAP FILE. When the cancer center's own risk document arrives
 * (source-docs/risk-assessment/), replace or edit the rules below to match it,
 * run the tests, and the app follows. Rules are evaluated top to bottom;
 * the first match wins; the last rule always matches.
 * Source extraction and conflicts: content/sources/risk-framework.md.
 */

export interface RiskRule {
  id: string;
  applies: (answers: Answers) => boolean;
  result: RiskAssessment | ((answers: Answers) => RiskAssessment);
}

const helpers = {
  treatments: (a: Answers) => a.treatments ?? [],
  agents: (a: Answers) => a.chemoAgents ?? [],
  hasAlkylator: (a: Answers) => (a.chemoAgents ?? []).some((x) => ALKYLATORS.includes(x)),
  female: (a: Answers) => a.anatomy === "ovaries_uterus",
  male: (a: Answers) => a.anatomy === "testes",
  pelvicRT: (a: Answers) => (a.treatments ?? []).includes("radiation") && a.radiationArea === "abdomen_pelvis",
};

const crispCitation = () => ({
  sourceId: "crisp",
  sourceName: "UCSD Cancer-Related Infertility Score Predictor (CRISP), the tool used in oncofertility counseling",
  url: crispMeta.source,
  retrieved: crispMeta.retrieved,
});

const bandLabel: Record<string, string> = {
  LOW: "Lower risk group",
  MODERATE: "In-between risk group",
  HIGH: "Higher risk group",
  UNKNOWN: "Not enough data",
};
const bandHeadline: Record<string, string> = {
  LOW: "Your treatment plan is in the lower risk group",
  MODERATE: "Your treatment plan is in the in-between risk group",
  HIGH: "Your treatment plan is in the higher risk group",
  UNKNOWN: "There isn't enough published data for your exact plan",
};

export const riskRules: RiskRule[] = [
  {
    // The most specific rule: the person named their exact regimen and the
    // CRISP table (the tool City of Hope's team counsels with) covers it.
    id: "crisp_regimen",
    applies: (a) =>
      a.anatomy === "ovaries_uterus" &&
      !!a.chemoRegimen &&
      a.chemoRegimen !== "not_sure" &&
      crispLookup(a.cancerType, a.chemoRegimen, a.age) !== null,
    result: (a) => {
      const hit = crispLookup(a.cancerType, a.chemoRegimen, a.age)!;
      const statLine =
        hit.band !== "UNKNOWN" && hit.pct && hit.outcome
          ? ` In the studies behind this tool, ${hit.pct} of women your age developed ${hit.outcome.toLowerCase()} after this treatment plan.`
          : "";
      const body =
        hit.band === "UNKNOWN"
          ? `The counseling tool your care team uses does not have enough published data to place ${a.chemoRegimen} for ${hit.crispCancer.toLowerCase()} cancer in a risk group. That is a fact about the research, not about you.`
          : `This comes from the same tool many cancer-center teams use to counsel patients, matched to your diagnosis, your treatment plan, and your age.${statLine}`;
      const citations: RiskAssessment["citations"] = [crispCitation()];
      if (hit.refs) {
        citations.push({
          sourceId: "crisp-ref",
          sourceName: `Study behind this estimate: ${hit.refs}`,
          retrieved: crispMeta.retrieved,
        });
      }
      return {
        category: crispBandToCategory(hit.band),
        label: bandLabel[hit.band],
        headline: bandHeadline[hit.band],
        body,
        askTeam:
          "Does this match the risk counseling for my plan? " + CONFIRM,
        citations,
      };
    },
  },
  {
    id: "transplant_conditioning",
    applies: (a) => helpers.treatments(a).includes("transplant"),
    // Vetted language only: CRISP's own transplant output for ovaries,
    // the COG/ESMO high-risk classification for testes. (Livestrong was
    // retired from the evidence set 2026-11-22.)
    result: (a) => {
      if (a.anatomy === "ovaries_uterus") {
        return {
          category: "high" as const,
          label: "Higher risk group",
          headline: "Your treatment plan is in the higher risk group",
          body:
            "This comes from the same tool many cancer-center teams use to counsel patients. In the studies behind it, conditioning treatment for a transplant carried an 80 to 90% risk of amenorrhea at 1 to 2 years post-transplant.",
          askTeam: "Is there time to preserve before conditioning starts? " + CONFIRM,
          citations: [
            crispCitation(),
            {
              sourceId: "crisp-ref-transplant",
              sourceName:
                "Studies behind this estimate: Rotz et al. 2024, Transplant Cell Ther; Bormann-Staudt et al. 2012, Bone Marrow Transplant",
              retrieved: crispMeta.retrieved,
            },
          ],
        };
      }
      return {
        category: "high" as const,
        label: "Higher risk group",
        headline: "Your treatment plan is in the higher risk group",
        body:
          "Guideline groups place transplant conditioning in the highest risk group for sperm production: long-lasting or permanent loss is common after this treatment.",
        askTeam: "Is there time to preserve before conditioning starts? " + CONFIRM,
        citations: [citations.cogLtfu, citations.esmo2020],
      };
    },
  },
  {
    id: "alkylator_plus_pelvic_rt",
    applies: (a) => helpers.hasAlkylator(a) && helpers.pelvicRT(a),
    result: {
      category: "high",
      label: "Higher risk group",
      headline: "Cancer treatments like yours are in the higher risk group",
      body:
        "An alkylating chemo medicine plus radiation to the belly or pelvis sits in the highest risk group.",
      askTeam:
        "What do my doses mean for my fertility, and is there time to preserve first? " + CONFIRM,
      citations: [citations.cogLtfu, citations.esmo2020],
    },
  },
  {
    id: "breast_cyclophosphamide_under_30",
    applies: (a) =>
      helpers.female(a) &&
      a.cancerType === "breast" &&
      helpers.agents(a).includes("cyclophosphamide") &&
      a.age !== undefined &&
      a.age < 30,
    result: {
      category: "lower",
      label: "Lower risk group",
      headline: "Cancer treatments like yours are often in the lower risk group",
      body:
        "Cyclophosphamide breast cancer plans sit in the lower risk group under age 30. Lower is not zero: earlier menopause is still possible.",
      askTeam:
        "Does my cycle count or dose change my group? " + CONFIRM,
      citations: [citations.esmo2020],
    },
  },
  {
    id: "cisplatin_ovaries",
    applies: (a) => helpers.female(a) && helpers.treatments(a).includes("chemo") && helpers.agents(a).includes("cisplatin"),
    result: {
      category: "intermediate",
      label: "In-between risk group",
      headline: "Cancer treatments like yours are in the in-between risk group",
      body:
        "Cisplatin plans sit in the intermediate group for the ovaries: affected for some people, not others.",
      askTeam: "What does my cisplatin dose mean for my ovaries? " + CONFIRM,
      citations: [citations.esmo2020],
    },
  },
  {
    id: "alkylator_dose_dependent",
    applies: (a) => helpers.hasAlkylator(a),
    result: {
      category: "variable",
      label: "Depends on your dose",
      headline: "Your risk depends on your total dose",
      body:
        "Alkylating medicines do the most damage to fertility, and how much depends on your total dose, which this tool cannot know.",
      askTeam:
        "What is my total dose (the CED), and which group does it put me in? " + CONFIRM,
      citations: [citations.cogLtfu, citations.esmo2020],
    },
  },
  {
    id: "platinum_males_dose_dependent",
    applies: (a) => helpers.male(a) && (helpers.agents(a).includes("cisplatin") || helpers.agents(a).includes("carboplatin")),
    result: {
      category: "variable",
      label: "Depends on your dose",
      headline: "Your risk depends on your total dose",
      body:
        "Cisplatin and carboplatin affect sperm production by dose and cycle count, which this tool cannot know.",
      askTeam: "What is my total dose, and which group does it put me in? " + CONFIRM,
      citations: [citations.esmo2020, citations.cogLtfu],
    },
  },
  {
    id: "radiation_dose_dependent",
    applies: (a) => helpers.treatments(a).includes("radiation"),
    result: {
      category: "variable",
      label: "Depends on the dose",
      headline: "Your risk depends on the radiation dose",
      body:
        "Radiation to the belly, pelvis, head, or whole body can affect fertility; the dose decides how much. Fields farther away carry less risk, though scatter can matter.",
      askTeam: "What dose will reach my ovaries or testes? " + CONFIRM,
      citations: [citations.cogLtfu, citations.esmo2020],
    },
  },
  {
    id: "chemo_unknown_agents",
    applies: (a) => helpers.treatments(a).includes("chemo"),
    result: {
      category: "variable",
      label: "Depends on the medicines",
      headline: "Your risk depends on which medicines and how much",
      body:
        "Chemo medicines range from barely affecting fertility to affecting it a lot. Without names and doses, no guideline can place a plan.",
      askTeam:
        "Which of my medicines can affect fertility? " + CONFIRM,
      citations: [citations.esmo2020],
    },
  },
  {
    id: "surgery_depends",
    applies: (a) => helpers.treatments(a).includes("surgery"),
    result: {
      category: "variable",
      label: "Depends on the surgery",
      headline: "Your risk depends on what the surgery involves",
      body:
        "Surgery matters when it removes or works near reproductive organs. Other operations range from no effect to meaningful effects.",
      askTeam: "Will my surgery affect my reproductive organs? " + CONFIRM,
      citations: [citations.cogLtfu],
    },
  },
  {
    id: "unknown_fallback",
    applies: () => true,
    result: {
      category: "unknown",
      label: "Not enough to say",
      headline: "We can't place your cancer treatment in a risk group yet",
      body:
        "That is okay, and common. Risk depends on treatments and doses you may not know yet. The options still apply, and once you have a treatment plan, this screen can place it.",
      askTeam: "Will my treatment affect my fertility? " + CONFIRM,
      citations: [citations.esmo2020],
    },
  },
];
