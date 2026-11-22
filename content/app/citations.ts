import type { Citation } from "../../lib/types";

/**
 * Citation factories for the approved sources. Every factory stamps the
 * retrieval date the source was read or re-verified for this content
 * (2026-10-30). See content/app/README.md for provenance.
 */

const RETRIEVED = "2026-10-30";

/** D4: UCSD Moores + Alliance for Fertility Preservation toolkit (PDF page numbers). */
export function d4(page: number): Citation {
  return {
    sourceId: "D4",
    sourceName:
      "UC San Diego Moores Cancer Center & Alliance for Fertility Preservation toolkit",
    page,
    sourceDate: "2025-07-31",
    retrieved: RETRIEVED,
  };
}

/**
 * ASCO 2025 guideline update (Su et al., J Clin Oncol 2025), read via the
 * Children's Oncology Group endorsement PDF, which reproduces the
 * recommendations verbatim. `rec` is the ASCO recommendation number
 * (e.g. "4.10") or statement label (e.g. "GPS 6.4").
 */
export function acsFamilyBuilding(): Citation {
  return {
    sourceId: "acs-fertility-assistance",
    sourceName: "American Cancer Society: Fertility Assistance After Cancer",
    url: "https://cancer.org/cancer/managing-cancer/side-effects/fertility/fertility-assistance-after-cancer.html",
    sourceDate: "2025-01-17",
    retrieved: "2026-11-17",
  };
}

export function acsPregnancyAfter(): Citation {
  return {
    sourceId: "acs-pregnancy-after",
    sourceName: "American Cancer Society: Having a Baby After Cancer, Pregnancy",
    url: "https://www.cancer.org/cancer/managing-cancer/side-effects/fertility/pregnancy-after-cancer.html",
    sourceDate: "2024-05-28",
    retrieved: "2026-11-17",
  };
}

export function positiveTrial(): Citation {
  return {
    sourceId: "positive-trial",
    sourceName: "POSITIVE trial (Partridge et al., New England Journal of Medicine 2023)",
    url: "https://pubmed.ncbi.nlm.nih.gov/37133584/",
    sourceDate: "2023-05-04",
    retrieved: "2026-11-17",
  };
}

export function afpPostTreatment(): Citation {
  return {
    sourceId: "afp-post-treatment",
    sourceName: "Alliance for Fertility Preservation: Post-Treatment Family Building",
    url: "https://www.allianceforfertilitypreservation.org/get-informed/post-treatment-family-building/",
    sourceDate: "2026-11-17",
    retrieved: "2026-11-17",
  };
}

export function asrmOvarianReserve(): Citation {
  return {
    sourceId: "asrm-ovarian-reserve-2020",
    sourceName: "ASRM Practice Committee: Testing and interpreting measures of ovarian reserve (Fertil Steril 2020)",
    url: "https://pubmed.ncbi.nlm.nih.gov/33280722/",
    sourceDate: "2020-12-01",
    retrieved: "2026-11-22",
  };
}

export function asrmDefinition2023(): Citation {
  return {
    sourceId: "asrm-definition-2023",
    sourceName: "ASRM Practice Committee: Definition of infertility, a committee opinion (2023)",
    url: "https://www.asrm.org/practice-guidance/practice-committee-documents/definition-of-infertility/",
    sourceDate: "2023-10-15",
    retrieved: "2026-11-22",
  };
}

export function goldmanModel(): Citation {
  return {
    sourceId: "goldman-2017",
    sourceName: "Goldman et al.: Predicting the likelihood of live birth for elective oocyte cryopreservation (Hum Reprod 2017)",
    url: "https://pubmed.ncbi.nlm.nih.gov/28166330/",
    sourceDate: "2017-04-01",
    retrieved: "2026-11-22",
  };
}

export function reiConsult(): Citation {
  return {
    sourceId: "rei-consult-2026",
    sourceName: "Reproductive endocrinology consultation for this tool (Stanford, 2026)",
    sourceDate: "2026-11-21",
    retrieved: "2026-11-21",
  };
}

export function psychConsult(): Citation {
  return {
    sourceId: "psych-consult-2026",
    sourceName: "Fertility psychology consultation for this tool (Stanford, 2026)",
    sourceDate: "2026-11-21",
    retrieved: "2026-11-21",
  };
}

export function swConsult(): Citation {
  return {
    sourceId: "sw-consult-2026",
    sourceName: "Oncology social work consultation for this tool",
    sourceDate: "2026-11-11",
    retrieved: "2026-11-11",
  };
}

export function asco(rec: string): Citation {
  return {
    sourceId: "asco-2025",
    sourceName: `ASCO 2025 Fertility Preservation Guideline, Recommendation ${rec} (via COG endorsement)`,
    url: "https://childrensoncologygroup.org/wp-content/uploads/2026/05/COG_SC_Fertility_Guideline_Document_27AUG2025-new-logo.pdf",
    sourceDate: "2025-03-19",
    retrieved: RETRIEVED,
  };
}

/**
 * An aid organization's own website, read for the 2026-11-02 refresh of the
 * financial aid directory. See content/sources/aid-provenance.md.
 */
export function orgSite(orgId: string, sourceName: string, url: string): Citation {
  return {
    sourceId: `org-${orgId}`,
    sourceName,
    url,
    retrieved: "2026-11-02",
  };
}

/** SB 729 / SB 600 research notes: cite the specific URL that backs the fact. */
export function sb729(sourceName: string, url: string): Citation {
  return {
    sourceId: "sb729",
    sourceName,
    url,
    retrieved: RETRIEVED,
  };
}

/** Memorial Sloan Kettering: Sperm Banking (last updated 2024-02-22). */
export function mskSpermBanking(): Citation {
  return {
    sourceId: "mskcc-sperm-banking",
    sourceName: "Memorial Sloan Kettering: Sperm Banking",
    url: "https://www.mskcc.org/cancer-care/patient-education/sperm-banking",
    sourceDate: "2024-02-22",
    retrieved: RETRIEVED,
  };
}

/** MSKCC: Fertility Preservation Before Cancer Treatment, ovaries and uterus (2019-10-23). */
export function mskPreTreatment(): Citation {
  return {
    sourceId: "mskcc-fp-before-treatment",
    sourceName:
      "Memorial Sloan Kettering: Fertility Preservation Before Cancer Treatment (ovaries and uterus)",
    url: "https://www.mskcc.org/cancer-care/patient-education/fertility-preservation-females-starting-treatment",
    sourceDate: "2019-10-23",
    retrieved: RETRIEVED,
  };
}

/** MSKCC: Fertility Evaluation and Preservation After Cancer Treatment, ovaries and uterus (2019-10-23). */
export function mskAfterTreatment(): Citation {
  return {
    sourceId: "mskcc-fp-after-treatment",
    sourceName:
      "Memorial Sloan Kettering: Fertility Evaluation and Preservation After Cancer Treatment (ovaries and uterus)",
    url: "https://www.mskcc.org/cancer-care/patient-education/fertility-evaluation-and-preservation-options-females-who-have-completed-treatment",
    sourceDate: "2019-10-23",
    retrieved: RETRIEVED,
  };
}

/** MSKCC: Building Your Family After Cancer Treatment, for people born with testicles (2023-06-21). */
export function mskBuildingFamily(): Citation {
  return {
    sourceId: "mskcc-building-family-testicles",
    sourceName:
      "Memorial Sloan Kettering: Building Your Family After Cancer Treatment (people born with testicles)",
    url: "https://www.mskcc.org/cancer-care/patient-education/building-family-born-with-testicles",
    sourceDate: "2023-06-21",
    retrieved: RETRIEVED,
  };
}

/** ASRM ReproductiveFacts.org: Fertility Preservation patient journey (no date shown on page). */
export function asrmJourney(): Citation {
  return {
    sourceId: "asrm-fp-journey",
    sourceName: "ASRM ReproductiveFacts.org: Fertility Preservation Journey",
    url: "https://www.reproductivefacts.org/patient-journeys/fertility-preservation/",
    retrieved: RETRIEVED,
  };
}

/** ASRM ReproductiveFacts.org: Cancer and its impact on sperm fact sheet (revised 2023). */
export function asrmSperm(): Citation {
  return {
    sourceId: "asrm-sperm-factsheet",
    sourceName:
      "ASRM ReproductiveFacts.org: Cancer and its impact on sperm, cryopreservation, and fertility",
    url: "https://www.reproductivefacts.org/news-and-publications/fact-sheets-and-infographics/cancer-and-its-impact-on-sperm/",
    sourceDate: "2023",
    retrieved: RETRIEVED,
  };
}

/** Children's Oncology Group Health Link: Testicular Reproductive Health, v6.0 (Oct 2023). */
export function cogTesticular(): Citation {
  return {
    sourceId: "cog-testicular-v6",
    sourceName:
      "Children's Oncology Group Health Link: Testicular and Reproductive Health after Cancer Treatment, v6.0",
    url: "https://childrensoncologygroup.org/wp-content/uploads/2026/05/30_Testicular_Reproductive_Health_v6-secured.pdf",
    sourceDate: "2023-10",
    retrieved: RETRIEVED,
  };
}

/** Children's Oncology Group Health Link: Ovarian Reproductive Health, v6.0 (Oct 2023). */
export function cogOvarian(): Citation {
  return {
    sourceId: "cog-ovarian-v6",
    sourceName:
      "Children's Oncology Group Health Link: Ovarian and Reproductive Health after Cancer Treatment, v6.0",
    url: "https://childrensoncologygroup.org/wp-content/uploads/2026/05/17_Ovarian_Reproductive_Health_v6-secured.pdf",
    sourceDate: "2023-10",
    retrieved: RETRIEVED,
  };
}

/** American Cancer Society: Preserving Fertility in Children and Teens with Cancer (revised 2025-01-13). */
export function acsTeens(): Citation {
  return {
    sourceId: "acs-children-teens",
    sourceName:
      "American Cancer Society: Preserving Fertility in Children and Teens with Cancer",
    url: "https://www.cancer.org/cancer/managing-cancer/side-effects/fertility/preserving-fertility-in-children-and-teens-with-cancer.html",
    sourceDate: "2025-01-13",
    retrieved: RETRIEVED,
  };
}

/** NCI: Female Fertility and Cancer Treatment (updated 2025-05-14; public domain phrasing). */
export function nciFemale(): Citation {
  return {
    sourceId: "nci-fertility-women",
    sourceName: "National Cancer Institute: Female Fertility and Cancer Treatment",
    url: "https://www.cancer.gov/about-cancer/treatment/side-effects/fertility-women",
    sourceDate: "2025-05-14",
    retrieved: RETRIEVED,
  };
}
