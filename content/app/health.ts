import type { Citation } from "../../lib/types";
import type { HealthNote } from "../../lib/content-schema";

/**
 * Everyday egg and sperm health: the recommended fact set from
 * content/sources/fertility-health-source-notes.md. Information only, with the
 * mechanism, never a goal or a promise. Written knowing some readers are in
 * treatment and frail.
 */

const retrieved = "2026-11-02";

const asrmSheet = (name: string, slug: string, year: string): Citation => ({
  sourceId: `asrm-${slug}`,
  sourceName: `ASRM ReproductiveFacts.org: ${name}`,
  url: `https://www.reproductivefacts.org/news-and-publications/fact-sheets-and-infographics/${slug}/`,
  sourceDate: year,
  retrieved,
});
const asrmOpinion: Citation = {
  sourceId: "asrm-tobacco-marijuana-2024",
  sourceName: "ASRM Practice Committee: Tobacco or Marijuana Use and Infertility",
  url: "https://www.asrm.org/practice-guidance/practice-committee-documents/tobacco-or-marijuana-use/",
  sourceDate: "2024",
  retrieved,
};
const ccDrugs: Citation = {
  sourceId: "cc-drugs-sperm",
  sourceName: "Cleveland Clinic: Can Drugs Lower Your Sperm Count?",
  url: "https://health.clevelandclinic.org/can-drugs-lower-sperm-count",
  sourceDate: "2022-11-10",
  retrieved,
};
const ccRepro: Citation = {
  sourceId: "cc-male-repro",
  sourceName: "Cleveland Clinic: Male Reproductive System",
  url: "https://my.clevelandclinic.org/health/body/9117-male-reproductive-system",
  sourceDate: "2023-05-08",
  retrieved,
};

const smoking = asrmSheet("Smoking and Infertility", "smoking-and-infertility", "2023");
const optimizingMale = asrmSheet("Optimizing Male Fertility", "optimizing-male-fertility-factsheet", "2023");
const optimizingNatural = asrmSheet("Optimizing Natural Fertility", "optimizing-natural-fertility", "2023");
const testosteroneUse = asrmSheet("Testosterone Use and Male Infertility", "testosterone-use-and-male-infertility", "2021");
const ageSheet = asrmSheet("Does My Age Affect My Fertility?", "does-my-age-affect-my-fertility", "2023");

export const health: HealthNote[] = [
  {
    id: "sperm_cycle",
    icon: "calendar",
    readMore: [{ label: "ASRM: Optimizing male fertility", url: "https://www.reproductivefacts.org/news-and-publications/fact-sheets-and-infographics/optimizing-male-fertility-factsheet/" }],
    group: "prep",
    fact: "Sperm take about 2 and a half months to develop.",
    mechanism:
      "A sperm cell takes over 70 days to grow and mature. So anything that harms sperm, or stops harming them, takes about 3 months to show up in a sample.",
    audience: { anatomy: ["testes"] },
    citations: [optimizingMale],
  },
  {
    id: "heat",
    icon: "radiation",
    readMore: [{ label: "ASRM: Optimizing male fertility", url: "https://www.reproductivefacts.org/news-and-publications/fact-sheets-and-infographics/optimizing-male-fertility-factsheet/" }],
    group: "prep",
    fact: "Heat lowers sperm production.",
    mechanism:
      "The testicles hang outside the body to stay a few degrees cooler than the rest of you, because sperm develop best at 97 to 99 degrees. Hot tubs, saunas, and a laptop resting on the lap all add heat.",
    audience: { anatomy: ["testes"] },
    citations: [ccRepro, optimizingMale],
  },
  {
    id: "testosterone",
    icon: "syringe",
    readMore: [{ label: "ASRM: Testosterone and male fertility", url: "https://www.reproductivefacts.org/news-and-publications/fact-sheets-and-infographics/testosterone-use-and-male-infertility/" }],
    group: "prep",
    fact: "Taking testosterone or anabolic steroids shuts down sperm production.",
    mechanism:
      "Outside testosterone switches off the brain signals that tell the testicles to make sperm, often driving counts very low or to zero. Production usually returns over about 3 to 12 months after stopping.",
    audience: { anatomy: ["testes"] },
    citations: [testosteroneUse, ccDrugs],
  },
  {
    id: "cannabis",
    icon: "flask",
    readMore: [{ label: "Cleveland Clinic: Drugs and sperm count", url: "https://health.clevelandclinic.org/can-drugs-lower-sperm-count" }],
    group: "prep",
    fact: "Cannabis can lower sperm count.",
    mechanism: "THC can interfere with testosterone production, which sperm making depends on.",
    caveat:
      "Studies in the general population link marijuana use to lower semen quality; studies in fertility clinics are mixed.",
    audience: { anatomy: ["testes"] },
    citations: [ccDrugs, asrmOpinion],
  },
  {
    id: "smoking_eggs",
    icon: "shield",
    readMore: [{ label: "ASRM: Smoking and fertility", url: "https://www.reproductivefacts.org/news-and-publications/fact-sheets-and-infographics/smoking-and-infertility/" }],
    group: "prep",
    fact: "Smoking speeds up the loss of eggs, and lost eggs do not come back.",
    mechanism:
      "Chemicals in cigarette smoke, including nicotine, cyanide, and carbon monoxide, speed up the rate eggs are lost. Menopause comes 1 to 4 years earlier in people who smoke.",
    audience: { anatomy: ["ovaries_uterus"] },
    citations: [smoking],
  },
  {
    id: "smoking_sperm",
    icon: "shield",
    readMore: [{ label: "ASRM: Smoking and fertility", url: "https://www.reproductivefacts.org/news-and-publications/fact-sheets-and-infographics/smoking-and-infertility/" }],
    group: "prep",
    fact: "Smoking lowers sperm count and movement.",
    mechanism:
      "Smoke chemicals can damage sperm DNA and increase the share of abnormally shaped sperm.",
    audience: { anatomy: ["testes"] },
    citations: [smoking, asrmOpinion],
  },
  {
    id: "eggs_fixed",
    icon: "egg",
    readMore: [{ label: "ASRM: Age and fertility", url: "https://www.reproductivefacts.org/news-and-publications/fact-sheets-and-infographics/does-my-age-affect-my-fertility/" }],
    group: "general",
    fact: "Egg supply is set at birth; age and egg count are not things anyone can change.",
    mechanism:
      "A person is born with all the eggs they will ever have. No treatment grows new ones. Of the everyday factors, smoking is the clearly proven harm to avoid.",
    audience: { anatomy: ["ovaries_uterus"] },
    citations: [ageSheet, smoking],
  },
  {
    id: "opioids",
    icon: "clipboard",
    readMore: [{ label: "Cleveland Clinic: Drugs and sperm count", url: "https://health.clevelandclinic.org/can-drugs-lower-sperm-count" }],
    group: "general",
    fact: "Long-term opioid use can lower sperm quantity and quality.",
    mechanism: "Opioids disrupt the brain signals that control testosterone.",
    audience: { anatomy: ["testes"] },
    citations: [ccDrugs],
  },
  {
    id: "alcohol",
    icon: "door",
    readMore: [{ label: "ASRM: Optimizing natural fertility", url: "https://www.reproductivefacts.org/news-and-publications/fact-sheets-and-infographics/optimizing-natural-fertility/" }],
    group: "prep",
    fact: "Heavy drinking is linked to reduced fertility.",
    mechanism:
      "ASRM defines heavy as more than 2 drinks a day. In men, heavy alcohol use can lower testosterone, which sperm production depends on.",
    audience: {},
    citations: [optimizingNatural, ccDrugs],
  },
  {
    id: "debunks",
    icon: "compass",
    readMore: [{ label: "ASRM: Optimizing natural fertility", url: "https://www.reproductivefacts.org/news-and-publications/fact-sheets-and-infographics/optimizing-natural-fertility/" }],
    group: "general",
    fact: "Some popular advice has no evidence behind it.",
    mechanism:
      "There is no proof that fertility supplements work, and position or lying down after sex does not change the odds of conception. Skipping those saves money and worry.",
    audience: {},
    citations: [optimizingNatural],
  },
];
