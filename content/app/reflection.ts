import type { Citation } from "../../lib/types";

/**
 * "Thinking it through": the optional reflection path for people who answered
 * "I'm not sure" about children someday. Structure and prompts are adapted,
 * with attribution, from published decision aids (see
 * content/sources/parenthood-decision-aids.md). Values clarification only:
 * nothing is scored, nothing is saved, no direction is pushed, and "unsure"
 * is a finished answer.
 */

const retrieved = "2026-11-02";

const opdg: Citation = {
  sourceId: "opdg",
  sourceName: "Ottawa Personal Decision Guide (Ottawa Hospital Research Institute)",
  url: "https://decisionaid.ohri.ca/docs/das/OPDG.pdf",
  sourceDate: "2025",
  retrieved,
};
const cdcRlp: Citation = {
  sourceId: "cdc-rlp",
  sourceName: "CDC Reproductive Life Plan",
  url: "https://beforeandbeyond.org/toolkit/reproductive-life-plan-assessment/",
  retrieved,
};
const beforeAid: Citation = {
  sourceId: "before-aid",
  sourceName: "BEFORE fertility decision aid (Speller et al., BMC Med Inform Decis Mak 2019)",
  url: "https://fertilityaid.rethinkbreastcancer.com/",
  sourceDate: "2019",
  retrieved,
};
const cfm: Citation = {
  sourceId: "cfm",
  sourceName: "Cancer, Fertility and Me (Jones et al., Frontiers in Oncology 2022)",
  url: "https://eprints.leedsbeckett.ac.uk/id/eprint/8691/7/CancerFertilityAndMePV-JONES.pdf",
  sourceDate: "2022",
  retrieved,
};

export interface ReflectionStep {
  id: string;
  heading: string;
  body: string;
  /** open prompts to sit with; never scored */
  prompts?: string[];
  /** 0-5 "how much does this matter to you" items, local state only */
  scale?: string[];
  /** quick self-location chips, local state only */
  chips?: string[];
  citations: Citation[];
}

export const reflectionIntro = {
  heading: "Not sure? That's worth taking seriously.",
  body: "A few short screens to think it through. No right answers, nothing saved, and unsure is a real place to land.",
  accept: "Walk me through it",
  decline: "Skip for now",
};

export const reflectionSteps: ReflectionStep[] = [
  {
    id: "two_clocks",
    heading: "This is two decisions, not one",
    body: "Whether to preserve fertility now is a decision with a clock, set by your treatment schedule. Whether to become a parent someday has no clock. You can answer the first without answering the second.",
    citations: [opdg, beforeAid],
  },
  {
    id: "locate",
    heading: "Where are you, honestly?",
    body: "Tap the one that fits today. Every square on this board is a fine place to stand.",
    chips: ["Leaning toward yes", "Leaning toward no", "Truly torn", "Haven't let myself think about it"],
    citations: [opdg, beforeAid],
  },
  {
    id: "meaning",
    heading: "What could being a parent mean to you?",
    body: "People mean different things by it. Sitting with these for a minute is the work.",
    prompts: [
      "Raising a child, with everything that involves",
      "A biological connection, a child related to you",
      "How a child fits the life and people you picture around you",
      "Worries about health, yours or a future child's",
    ],
    citations: [cfm, cdcRlp],
  },
  {
    id: "plans_change",
    heading: "Plans are allowed to change",
    body: "Public health guidance on reproductive life planning is built on one observation: people's plans change. What you feel during cancer treatment does not have to be your final answer, in either direction.",
    citations: [cdcRlp],
  },
  {
    id: "honest_promise",
    heading: "What preserving does, and doesn't, promise",
    body: "Preserving keeps a possibility open. It does not guarantee a child later, and storage costs continue each year. Deciding with that honest picture beats deciding with a hopeful blur.",
    citations: [beforeAid, cfm],
  },
  {
    id: "many_roads",
    heading: "There is more than one road to parenthood",
    body: "Donor eggs or sperm, surrogacy, adoption, fostering. Preserving your own eggs or sperm is one road, not the only one. Some people find this the single most relieving fact on these screens.",
    citations: [beforeAid, cfm],
  },
  {
    id: "what_matters",
    heading: "What matters most to you?",
    body: "Slide each one. There is no score and nothing is saved; the point is noticing which sliders you push hard.",
    scale: [
      "Having a child biologically related to me",
      "Not delaying my cancer treatment",
      "What preservation costs",
      "Avoiding extra medical procedures right now",
    ],
    citations: [opdg, cfm, beforeAid],
  },
  {
    id: "talk_and_time",
    heading: "Who to talk with, and the pressure check",
    body: "A partner, a parent, a close friend, a counselor, your care team. One more question worth asking yourself, from the Ottawa guide: is anyone pressuring you? Your answer belongs to you. And deciding later is itself a decision you are allowed to make: waiting keeps survivor options and aid programs open, while some pre-treatment options need time before treatment starts. Your care team can tell you how much time you actually have.",
    citations: [opdg, beforeAid],
  },
];

export const reflectionAttribution =
  "Adapted with attribution from the Ottawa Personal Decision Guide (O'Connor, Stacey, Jacobsen), the CDC reproductive life plan, and published oncofertility decision aids.";
