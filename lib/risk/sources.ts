import type { ChemoAgent, Citation } from "../types";

/** Citations and shared constants for the risk rules. */

const retrieved = "2026-11-01";

export const citations = {
  livestrongWomen: {
    sourceId: "livestrong-women",
    sourceName: "Livestrong Fertility risk chart for women (Fertile Hope)",
    url: "https://web.archive.org/web/20211224025419id_/http://images.livestrong.org/pdfs/livestrong-fertility/LF_FertilityRiskCharts_Women.pdf",
    sourceDate: "2021-12-24",
    retrieved,
  },
  livestrongMen: {
    sourceId: "livestrong-men",
    sourceName: "Livestrong Fertility risk chart for men (Fertile Hope)",
    url: "https://web.archive.org/web/20211224025416id_/http://images.livestrong.org/pdfs/livestrong-fertility/LF_FertilityRiskCharts_Men.pdf",
    sourceDate: "2021-12-24",
    retrieved,
  },
  livestrongMenLive: {
    sourceId: "livestrong-men-live",
    sourceName: "Livestrong: Cancer and fertility risks for men",
    url: "https://livestrong.org/resources/cancer-and-fertility-risks-for-men/",
    retrieved,
  },
  esmo2020: {
    sourceId: "esmo-2020",
    sourceName: "ESMO 2020 fertility preservation guideline (Lambertini et al., Annals of Oncology)",
    url: "https://www.annalsofoncology.org/article/S0923-7534(20)42448-2/fulltext",
    sourceDate: "2020",
    retrieved,
  },
  cogLtfu: {
    sourceId: "cog-ltfu-v6",
    sourceName: "Children's Oncology Group Long-Term Follow-Up Guidelines v6.0",
    url: "https://www.survivorshipguidelines.org/pdf/2023/COG_LTFU_Guidelines_Only_v6.pdf",
    sourceDate: "2023-10",
    retrieved,
  },
} satisfies Record<string, Citation>;

/** Alkylating agents as listed in the Livestrong high-risk combination rows. */
export const ALKYLATORS: ChemoAgent[] = [
  "cyclophosphamide",
  "ifosfamide",
  "busulfan",
  "melphalan",
  "procarbazine",
  "carmustine_lomustine",
];

export const CONFIRM = "A guideline group, not a prediction. Your care team can confirm yours.";
