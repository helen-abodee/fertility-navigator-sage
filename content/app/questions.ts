import type { DoctorQuestion } from "../../lib/content-schema";
import { asco, cogTesticular, d4, mskAfterTreatment } from "./citations";

/**
 * Questions to bring to the care team, generated from the ASCO 2025
 * counseling recommendations and the D4 benefit verification guide.
 * Audience gates keep each question on the paths where it makes sense.
 */
export const doctorQuestions: DoctorQuestion[] = [
  {
    id: "q_treatment_fertility_risk",
    text: "How could my treatment plan affect my ability to have children later?",
    audience: {},
    citations: [asco("1.1"), asco("6.1")],
  },
  {
    id: "q_timing_adjustment",
    text: "Could my treatment plan be adjusted or timed to allow fertility preservation first?",
    audience: { stages: ["not_started", "not_sure"] },
    citations: [asco("1.1")],
  },
  {
    id: "q_referral_even_if_unsure",
    text: "I'm not sure yet what I want. Can you still refer me to a fertility specialist?",
    audience: {},
    citations: [asco("1.2")],
  },
  {
    id: "q_which_options_fit",
    text: "Which preservation options fit my body, my diagnosis, and my treatment plan?",
    audience: { stages: ["not_started", "not_sure"] },
    citations: [asco("2.1")],
  },
  {
    id: "q_how_much_time",
    text: "How much time does each option take, and how soon would I need to start?",
    audience: { stages: ["not_started", "not_sure"] },
    citations: [asco("4.2"), asco("1.1")],
  },
  {
    id: "q_urgent_chemo_tissue",
    text: "If my chemotherapy cannot wait, is ovarian tissue freezing an option for me?",
    audience: { anatomy: ["ovaries_uterus"], stages: ["not_started"], treatments: ["chemo"] },
    citations: [asco("4.10")],
  },
  {
    id: "q_hormone_stimulation_safety",
    text: "Is hormone stimulation safe with my type of cancer?",
    audience: { anatomy: ["ovaries_uterus"], stages: ["not_started"] },
    citations: [asco("4.2")],
  },
  {
    id: "q_transposition_radiation",
    text: "I will have radiation near my pelvis. Would surgery to move my ovaries out of the radiation field make sense for me?",
    audience: {
      anatomy: ["ovaries_uterus"],
      stages: ["not_started"],
      treatments: ["radiation"],
    },
    citations: [asco("4.5")],
  },
  {
    id: "q_no_semen_sample",
    text: "What if I can't give a semen sample? Are there other ways to collect sperm?",
    audience: { anatomy: ["testes"], stages: ["not_started"] },
    citations: [asco("3.2")],
  },
  {
    id: "q_survivor_tests",
    text: "Which tests would tell us about my fertility now?",
    audience: { stages: ["finished"] },
    citations: [asco("4.3"), cogTesticular(), mskAfterTreatment()],
  },
  {
    id: "q_survivor_wait_how_long",
    text: "How long should I wait after treatment before having my fertility checked?",
    audience: { stages: ["finished"] },
    citations: [mskAfterTreatment(), asco("4.3")],
  },
  {
    id: "q_survivor_freeze_now",
    text: "Is freezing eggs or embryos still possible for me now that treatment is over?",
    audience: { anatomy: ["ovaries_uterus"], stages: ["finished"] },
    citations: [asco("4.3")],
  },
  {
    id: "q_icd10_cpt_codes",
    text: "Can your office give me my diagnosis code (ICD-10) and the list of procedure codes (CPT) so I can check my insurance coverage?",
    audience: { insurance: ["unknown", "none", "ca_commercial", "other"] },
    citations: [d4(20), d4(22)],
  },
  {
    id: "q_medical_necessity_letter",
    text: "If my insurance says no, would you submit an appeal saying fertility preservation is medically necessary for me?",
    audience: { insurance: ["ca_commercial", "unknown", "other"] },
    citations: [d4(35), d4(36)],
  },
  {
    id: "q_team_cost_help",
    text: "Who on the team can help me with costs and insurance, like a social worker or financial counselor?",
    audience: {},
    citations: [asco("GPS 6.4")],
  },
  {
    id: "q_talk_it_through",
    text: "Can I talk this through with a counselor before deciding?",
    audience: {},
    citations: [asco("GPS 6.4"), asco("1.3")],
  },
];
