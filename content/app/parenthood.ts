import type { Audience } from "../../lib/content-schema";
import type { Citation } from "../../lib/types";
import {
  acsFamilyBuilding,
  reiConsult,
  acsPregnancyAfter,
  afpPostTreatment,
  asco,
  mskAfterTreatment,
  mskBuildingFamily,
  positiveTrial,
} from "./citations";

/**
 * Paths to Parenthood: the after-treatment family-building paths, modeled on
 * Benedict's Roadmap to Parenthood decision aid (see
 * content/sources/benedict-roadmap.md and after-treatment-family-building.md).
 * Same rules as everything else: cited facts only, no path ranked above
 * another, and not parenting is a path, not a failure state.
 */

export interface ParenthoodPath {
  id: string;
  icon: string;
  name: string;
  short: string;
  paragraphs: { text: string; citations: Citation[] }[];
  audience: Audience;
}

export const parenthoodIntro = {
  text: "There is more than one way to a family after cancer, and none of them is the consolation prize. Start with the fertility check under Health, then read the paths that fit. Your care team and a fertility specialist help you pick.",
  citations: [asco("4.3"), mskAfterTreatment()],
};

export const parenthoodPaths: ParenthoodPath[] = [
  {
    id: "using_banked",
    icon: "snowflake",
    name: "Using what you froze",
    short: "Frozen eggs, sperm, or embryos go back to work through lab treatments.",
    audience: {},
    paragraphs: [
      {
        text: "Frozen embryos are thawed and placed in the uterus at the right point in a cycle. Frozen eggs are combined with sperm in the lab (IVF), sometimes by injecting a single sperm into an egg (ICSI). Banked sperm can be used for IVF or placed in a partner's uterus with a thin tube (IUI).",
        citations: [acsFamilyBuilding()],
      },
      {
        text: "Thawing and treatment are billed separately from the yearly storage you have been paying. Prices vary widely and are rarely published; fertility doctors consulted for this tool put a typical full IVF cycle near $30,000 all-in, so ask the clinic for an itemized list before you start.",
        citations: [acsFamilyBuilding(), mskBuildingFamily(), reiConsult()],
      },
    ],
  },
  {
    id: "trying_again",
    icon: "sprout",
    name: "Trying for pregnancy",
    short: "Often possible after treatment. The timeline is set with your oncologist.",
    audience: {},
    paragraphs: [
      {
        text: "Start with the fertility check. On timing, advice differs: some providers suggest waiting at least about 6 months after chemotherapy, others about 2 to 5 years, depending on your cancer, treatment, and age. Your oncologist sets the timeline that fits your situation.",
        citations: [acsPregnancyAfter()],
      },
      {
        text: "In general, pregnancy has not been shown to make cancer more likely to come back. For hormone-positive breast cancer there is direct evidence: in a trial of 516 young women who paused their endocrine therapy to try for pregnancy, about 74% became pregnant, and after 3 years their cancer outcomes matched similar women who had not paused.",
        citations: [acsPregnancyAfter(), positiveTrial()],
      },
      {
        text: "If you had radiation to the pelvis, the uterus can be affected in ways that raise the chance of miscarriage, early birth, and low birth weight. That does not close the door, but it belongs in the conversation with your care team before trying.",
        citations: [acsPregnancyAfter()],
      },
    ],
  },
  {
    id: "donor",
    icon: "heart",
    name: "Donor eggs, sperm, or embryos",
    short: "A screened donor supplies what treatment took away.",
    audience: {},
    paragraphs: [
      {
        text: "Donors are screened for infections and genetic conditions. Donor eggs are fertilized in the lab and the embryo is placed in your uterus, so you can carry and give birth even when your own eggs cannot be used. Donor sperm is quarantined for about 180 days, retested, and usually used with IUI. Donor embryos come from couples who finished IVF with embryos to spare.",
        citations: [afpPostTreatment(), acsFamilyBuilding()],
      },
      {
        text: "Counseling is recommended before using donors, including how you might one day explain it to a child, and a lawyer should review your state's parentage rules.",
        citations: [afpPostTreatment()],
      },
    ],
  },
  {
    id: "surrogacy",
    icon: "shield",
    name: "A gestational carrier",
    short: "Someone else carries the pregnancy, often using your embryo.",
    audience: {},
    paragraphs: [
      {
        text: "A gestational carrier carries an embryo made from your eggs or sperm (or donors'), so the child can be genetically yours even when pregnancy is not safe or possible for you, including after radiation that affected the uterus. Carriers go through medical and psychological evaluation.",
        citations: [afpPostTreatment(), acsFamilyBuilding()],
      },
      {
        text: "It is one of the most expensive paths, and the law differs state by state, so a lawyer is essential, not optional. Agencies can match you with a carrier, or some people ask a friend or family member.",
        citations: [afpPostTreatment(), acsFamilyBuilding()],
      },
    ],
  },
  {
    id: "adoption",
    icon: "door",
    name: "Adoption and fostering",
    short: "A full path to parenthood, with some cancer-specific paperwork.",
    audience: {},
    paragraphs: [
      {
        text: "Some adoption agencies have real experience with cancer survivors. Expect health questions in the process: agencies commonly ask for medical documentation and a letter from your doctor about your health status. The Americans with Disabilities Act protects survivors against discrimination in adoption.",
        citations: [acsFamilyBuilding()],
      },
      {
        text: "Published cost ranges run from about $6,000 through public foster-care adoption to about $20,000 to $50,000 for private or international adoption. Fostering is the lowest-cost route and has its own path to adopting.",
        citations: [acsFamilyBuilding()],
      },
    ],
  },
  {
    id: "childfree",
    icon: "compass",
    name: "A full life without children",
    short: "A real path, chosen by many people with and without a cancer history.",
    audience: {},
    paragraphs: [
      {
        text: "Plenty of people decide not to parent, cancer or no cancer. If you and a partner land in different places on this, counseling has a track record of helping couples work through it. The journey tracker here treats this outcome exactly like the others, because it is one.",
        citations: [acsFamilyBuilding()],
      },
    ],
  },
];
