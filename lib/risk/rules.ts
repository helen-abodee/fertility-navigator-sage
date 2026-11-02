import type { Answers } from "../types";
import type { RiskAssessment } from "./index";
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
  result: Omit<RiskAssessment, "citations"> & { citations: RiskAssessment["citations"] };
}

const helpers = {
  treatments: (a: Answers) => a.treatments ?? [],
  agents: (a: Answers) => a.chemoAgents ?? [],
  hasAlkylator: (a: Answers) => (a.chemoAgents ?? []).some((x) => ALKYLATORS.includes(x)),
  female: (a: Answers) => a.anatomy === "ovaries_uterus",
  male: (a: Answers) => a.anatomy === "testes",
  pelvicRT: (a: Answers) => (a.treatments ?? []).includes("radiation") && a.radiationArea === "abdomen_pelvis",
};

export const riskRules: RiskRule[] = [
  {
    id: "transplant_conditioning",
    applies: (a) => helpers.treatments(a).includes("transplant"),
    result: {
      category: "high",
      label: "Higher risk group",
      headline: "Cancer treatments like yours are in the higher risk group",
      body:
        "The strong chemotherapy and radiation used to prepare the body for a stem cell or bone marrow transplant are placed in the highest risk group for affecting fertility by every published guideline we cite.",
      askTeam:
        "Ask your care team: given my conditioning plan, what is my fertility risk, and is there time to preserve before it starts? " + CONFIRM,
      citations: [citations.livestrongWomen, citations.livestrongMen, citations.esmo2020],
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
        "Getting an alkylating chemotherapy medicine (like the one you named) together with radiation aimed at the belly or pelvis is placed in the highest risk group for affecting fertility.",
      askTeam:
        "Ask your care team: what do my chemo dose and radiation dose mean for my fertility, and is there time to preserve first? " + CONFIRM,
      citations: [citations.livestrongWomen, citations.livestrongMen],
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
        "Breast cancer treatment plans that include cyclophosphamide are placed in the lower risk group for women under 30. Lower risk is not no risk: these treatments can still bring menopause earlier in life.",
      askTeam:
        "Ask your care team: how many cycles and what total dose am I getting, and does that change my group? " + CONFIRM,
      citations: [citations.livestrongWomen, citations.esmo2020],
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
        "Treatment plans that contain cisplatin are placed in the intermediate risk group for affecting the ovaries. Roughly, that means fertility is affected for some people and not others.",
      askTeam: "Ask your care team: what is my total cisplatin dose, and what does it mean for my ovaries? " + CONFIRM,
      citations: [citations.livestrongWomen],
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
        "You named an alkylating chemotherapy medicine. This is the group of chemo medicines that does the most damage to fertility, and how much depends on the total amount you receive over the whole treatment, which this tool cannot know.",
      askTeam:
        "Ask your care team: what is my total planned dose (they may call it the cyclophosphamide equivalent dose, or CED), and which risk group does it put me in? " + CONFIRM,
      citations: [citations.livestrongMenLive, citations.cogLtfu],
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
        "Cisplatin and carboplatin can affect sperm production, and published guidelines place them in a risk group based on the total dose and number of cycles, which this tool cannot know.",
      askTeam: "Ask your care team: what is my total planned dose, and which risk group does it put me in? " + CONFIRM,
      citations: [citations.livestrongMen, citations.esmo2020],
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
        "Radiation aimed at the belly, pelvis, or head, and radiation to the whole body, can affect fertility. How much depends on the dose, which this tool cannot know. Fields away from the pelvis and head carry less risk to reproductive organs, but scatter can matter.",
      askTeam: "Ask your care team: what dose will reach my ovaries or testes, and which risk group does that put me in? " + CONFIRM,
      citations: [citations.livestrongWomen, citations.livestrongMen, citations.cogLtfu],
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
        "Chemotherapy medicines differ a lot in how they affect fertility, from very little to a great deal, and the total dose matters. Without the medicine names and doses, no published guideline places a plan in a group.",
      askTeam:
        "Ask your care team: which of my medicines can affect fertility, and which risk group does my plan put me in? " + CONFIRM,
      citations: [citations.esmo2020, citations.livestrongMenLive],
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
        "Surgery affects fertility when it removes or works near reproductive organs. Removing both ovaries or both testes ends natural fertility; other operations range from no effect to meaningful effects.",
      askTeam: "Ask your care team: will my surgery remove or affect my reproductive organs, and what are my options before it? " + CONFIRM,
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
        "That is okay. Risk depends on the specific cancer treatments, medicines, and doses, and it is common not to know them yet. The options below still apply, and your care team can tell you your risk group when the plan is set.",
      askTeam: "Ask your care team: will my cancer treatment plan affect my fertility, and when will we know enough to say? " + CONFIRM,
      citations: [citations.esmo2020],
    },
  },
];
