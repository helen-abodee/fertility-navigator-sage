import type { Answers, ChemoAgent, Citation } from "../types";

/**
 * Risk assessment: maps what a patient actually knows (treatment modality,
 * drug names, radiation area, anatomy, age, diagnosis) to a risk CATEGORY from
 * published frameworks. Full source extraction and conflict notes:
 * content/sources/risk-framework.md. To be reconciled with the cancer center's
 * own document when it arrives (source-docs/risk-assessment/).
 *
 * Hard rules:
 * - a category tied to published guidelines, plus "confirm with your care team"
 * - never a personal probability, never a recommendation
 * - anything every source keys to dose or cycle count falls back to
 *   "variable" (depends on dose) rather than guessing
 * - missing or "not sure" answers can only widen the answer, never fake
 *   precision
 */

const retrieved = "2026-11-01";

const livestrongWomen: Citation = {
  sourceId: "livestrong-women",
  sourceName: "Livestrong Fertility risk chart for women (Fertile Hope)",
  url: "https://web.archive.org/web/20211224025419id_/http://images.livestrong.org/pdfs/livestrong-fertility/LF_FertilityRiskCharts_Women.pdf",
  sourceDate: "2021-12-24",
  retrieved,
};
const livestrongMen: Citation = {
  sourceId: "livestrong-men",
  sourceName: "Livestrong Fertility risk chart for men (Fertile Hope)",
  url: "https://web.archive.org/web/20211224025416id_/http://images.livestrong.org/pdfs/livestrong-fertility/LF_FertilityRiskCharts_Men.pdf",
  sourceDate: "2021-12-24",
  retrieved,
};
const livestrongMenLive: Citation = {
  sourceId: "livestrong-men-live",
  sourceName: "Livestrong: Cancer and fertility risks for men",
  url: "https://livestrong.org/resources/cancer-and-fertility-risks-for-men/",
  retrieved,
};
const esmo2020: Citation = {
  sourceId: "esmo-2020",
  sourceName: "ESMO 2020 fertility preservation guideline (Lambertini et al., Annals of Oncology)",
  url: "https://www.annalsofoncology.org/article/S0923-7534(20)42448-2/fulltext",
  sourceDate: "2020",
  retrieved,
};
const cogLtfu: Citation = {
  sourceId: "cog-ltfu-v6",
  sourceName: "Children's Oncology Group Long-Term Follow-Up Guidelines v6.0",
  url: "https://www.survivorshipguidelines.org/pdf/2023/COG_LTFU_Guidelines_Only_v6.pdf",
  sourceDate: "2023-10",
  retrieved,
};

/** Alkylating agents as listed in the Livestrong high-risk combination rows. */
const ALKYLATORS: ChemoAgent[] = [
  "cyclophosphamide",
  "ifosfamide",
  "busulfan",
  "melphalan",
  "procarbazine",
  "carmustine_lomustine",
];

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

const CONFIRM = "This is a group from published guidelines, not a prediction about you. Your care team can place your exact treatment plan.";

export function assessRisk(answers: Answers): RiskAssessment {
  const treatments = answers.treatments ?? [];
  const agents = answers.chemoAgents ?? [];
  const hasAlkylator = agents.some((a) => ALKYLATORS.includes(a));
  const female = answers.anatomy === "ovaries_uterus";
  const male = answers.anatomy === "testes";
  const pelvicRT = treatments.includes("radiation") && answers.radiationArea === "abdomen_pelvis";

  // High: stem cell transplant conditioning (the most consistent mapping
  // across every source, both sexes).
  if (treatments.includes("transplant")) {
    return {
      category: "high",
      label: "Higher risk group",
      headline: "Treatments like yours are in the higher risk group",
      body:
        "The strong chemotherapy and radiation used to prepare the body for a stem cell or bone marrow transplant are placed in the highest risk group for affecting fertility by every published guideline we cite.",
      askTeam:
        "Ask your care team: given my conditioning plan, what is my fertility risk, and is there time to preserve before it starts? " + CONFIRM,
      citations: [livestrongWomen, livestrongMen, esmo2020],
    };
  }

  // High: any alkylating agent + radiation to the belly or pelvis.
  if (hasAlkylator && pelvicRT) {
    return {
      category: "high",
      label: "Higher risk group",
      headline: "Treatments like yours are in the higher risk group",
      body:
        "Getting an alkylating chemotherapy medicine (like the one you named) together with radiation aimed at the belly or pelvis is placed in the highest risk group for affecting fertility.",
      askTeam:
        "Ask your care team: what do my chemo dose and radiation dose mean for my fertility, and is there time to preserve first? " + CONFIRM,
      citations: [livestrongWomen, livestrongMen],
    };
  }

  // Lower: cyclophosphamide-containing breast cancer treatment, under 30
  // (Livestrong women's chart row, no dose qualifier).
  if (
    female &&
    answers.cancerType === "breast" &&
    agents.includes("cyclophosphamide") &&
    answers.age !== undefined &&
    answers.age < 30
  ) {
    return {
      category: "lower",
      label: "Lower risk group",
      headline: "Treatments like yours are often in the lower risk group",
      body:
        "Breast cancer treatment plans that include cyclophosphamide are placed in the lower risk group for women under 30. Lower risk is not no risk: these treatments can still bring menopause earlier in life.",
      askTeam:
        "Ask your care team: how many cycles and what total dose am I getting, and does that change my group? " + CONFIRM,
      citations: [livestrongWomen, esmo2020],
    };
  }

  // Intermediate: cisplatin-containing treatment, ovaries (Livestrong women
  // bands "protocols containing cisplatin" without a dose qualifier).
  if (female && treatments.includes("chemo") && agents.includes("cisplatin")) {
    return {
      category: "intermediate",
      label: "In-between risk group",
      headline: "Treatments like yours are in the in-between risk group",
      body:
        "Treatment plans that contain cisplatin are placed in the intermediate risk group for affecting the ovaries. Roughly, that means fertility is affected for some people and not others.",
      askTeam: "Ask your care team: what is my total cisplatin dose, and what does it mean for my ovaries? " + CONFIRM,
      citations: [livestrongWomen],
    };
  }

  // Variable: alkylating agent without the combinations above. Every source
  // bands standalone alkylators only by total dose.
  if (hasAlkylator) {
    return {
      category: "variable",
      label: "Depends on your dose",
      headline: "Your risk depends on your total dose",
      body:
        "You named an alkylating chemotherapy medicine. This is the group of chemo medicines that does the most damage to fertility, and how much depends on the total amount you receive over the whole treatment, which this tool cannot know.",
      askTeam:
        "Ask your care team: what is my total planned dose (they may call it the cyclophosphamide equivalent dose, or CED), and which risk group does it put me in? " + CONFIRM,
      citations: [livestrongMenLive, cogLtfu],
    };
  }

  // Variable: platinum agents in males are banded only by dose or cycles.
  if (male && (agents.includes("cisplatin") || agents.includes("carboplatin"))) {
    return {
      category: "variable",
      label: "Depends on your dose",
      headline: "Your risk depends on your total dose",
      body:
        "Cisplatin and carboplatin can affect sperm production, and published guidelines place them in a risk group based on the total dose and number of cycles, which this tool cannot know.",
      askTeam: "Ask your care team: what is my total planned dose, and which risk group does it put me in? " + CONFIRM,
      citations: [livestrongMen, esmo2020],
    };
  }

  // Variable: radiation without a dose. The direction is knowable (the belly,
  // pelvis, and head are the fields every source flags), the magnitude is not.
  if (treatments.includes("radiation")) {
    const area = answers.radiationArea;
    const flagged = area === "abdomen_pelvis" || area === "head" || area === "other";
    return {
      category: "variable",
      label: "Depends on the dose",
      headline: "Your risk depends on the radiation dose",
      body: flagged
        ? "Radiation aimed at the belly, pelvis, or head, and radiation to the whole body, can affect fertility. How much depends on the dose, which this tool cannot know."
        : "Whether radiation affects fertility depends on where it is aimed and the dose. Fields away from the pelvis and head carry less risk to reproductive organs, but scatter can matter.",
      askTeam: "Ask your care team: what dose will reach my ovaries or testes, and which risk group does that put me in? " + CONFIRM,
      citations: [livestrongWomen, livestrongMen, cogLtfu],
    };
  }

  // Variable: chemo with unknown or unlisted medicines.
  if (treatments.includes("chemo")) {
    return {
      category: "variable",
      label: "Depends on the medicines",
      headline: "Your risk depends on which medicines and how much",
      body:
        "Chemotherapy medicines differ a lot in how they affect fertility, from very little to a great deal, and the total dose matters. Without the medicine names and doses, no published guideline places a plan in a group.",
      askTeam:
        "Ask your care team: which of my medicines can affect fertility, and which risk group does my plan put me in? " + CONFIRM,
      citations: [esmo2020, livestrongMenLive],
    };
  }

  // Variable: surgery only. Effects depend entirely on what is removed.
  if (treatments.includes("surgery")) {
    return {
      category: "variable",
      label: "Depends on the surgery",
      headline: "Your risk depends on what the surgery involves",
      body:
        "Surgery affects fertility when it removes or works near reproductive organs. Removing both ovaries or both testes ends natural fertility; other operations range from no effect to meaningful effects.",
      askTeam: "Ask your care team: will my surgery remove or affect my reproductive organs, and what are my options before it? " + CONFIRM,
      citations: [cogLtfu],
    };
  }

  // Unknown: nothing to go on. Say so.
  return {
    category: "unknown",
    label: "Not enough to say",
    headline: "We can't place your treatment in a risk group yet",
    body:
      "That is okay. Risk depends on the specific treatments, medicines, and doses, and it is common not to know them yet. The options below still apply, and your care team can tell you your risk group when the plan is set.",
    askTeam: "Ask your care team: will my treatment plan affect my fertility, and when will we know enough to say? " + CONFIRM,
    citations: [esmo2020],
  };
}
