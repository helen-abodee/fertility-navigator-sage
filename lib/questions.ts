import type { Answers, QuestionId } from "./types";

/**
 * UI copy for the click-through. Kept deliberately spare: the question and the
 * answers, nothing else. "Not sure" is a first-class answer. Optional
 * questions are marked optional and skippable, not explained at length.
 */

export type QuestionKind = "single" | "multi" | "number" | "text";

export interface QuestionOption {
  value: string;
  label: string;
  notSure?: boolean;
  /** icon key from components/icons */
  icon?: string;
}

export interface QuestionDef {
  id: QuestionId;
  field: keyof Answers;
  kind: QuestionKind;
  heading: string;
  optional?: boolean;
  options?: QuestionOption[];
  skippable?: boolean;
  placeholder?: string;
  inputMode?: "numeric" | "text";
  /** the keyword the heading highlights, Headway-style */
  accent?: string;
  /** one honest sentence behind a "Why we ask" tap */
  why?: string;
}

export const questions: Record<QuestionId, QuestionDef> = {
  goal: {
    id: "goal",
    accent: "brings you here",
    field: "goal",
    kind: "single",
    heading: "Hi. What brings you here today?",
    options: [
      { value: "options", label: "Understanding my fertility options", icon: "egg" },
      { value: "costs", label: "What preserving would cost me", icon: "dollar" },
      { value: "children", label: "Thinking through whether I want children", icon: "compass" },
      { value: "browse", label: "Just looking around", icon: "door", notSure: true },
    ],
  },
  entry: {
    id: "entry",
    accent: "cancer treatment",
    field: "entry",
    kind: "single",
    heading: "Where are you right now with cancer treatment?",
    options: [
      { value: "plan_no", label: "Before treatment starts", icon: "calendar" },
      { value: "plan_yes", label: "In treatment now", icon: "clipboard" },
      { value: "finished", label: "Finished treatment", icon: "sprout" },
      { value: "exploring", label: "Just learning for now", icon: "compass", notSure: true },
    ],
  },
  has_plan: {
    id: "has_plan",
    accent: "treatment plan",
    field: "hasPlan",
    kind: "single",
    skippable: true,
    heading: "Do you have a treatment plan yet?",
    options: [
      { value: "yes", label: "Yes, I have a plan", icon: "clipboard" },
      { value: "no", label: "Not yet", icon: "calendar" },
    ],
  },
  fertility_position: {
    id: "fertility_position",
    accent: "fertility preservation",
    field: "fertilityPosition",
    kind: "single",
    heading: "And where are you with fertility preservation?",
    options: [
      { value: "deciding", label: "Haven't decided yet", icon: "compass" },
      { value: "not_pursuing", label: "Decided not to pursue it", icon: "shield" },
    ],
  },
  who_for: {
    id: "who_for",
    field: "whoFor",
    kind: "single",
    heading: "Who is this for?",
    options: [
      { value: "me", label: "Just me" },
      { value: "me_and_partner", label: "Me and my partner" },
    ],
  },
  stage: {
    id: "stage",
    field: "stage",
    kind: "single",
    heading: "Have you started treatment?",
    options: [
      { value: "not_started", label: "Not yet" },
      { value: "in_treatment", label: "I'm in treatment now" },
    ],
  },
  time_since: {
    id: "time_since",
    field: "timeSince",
    kind: "single",
    heading: "How long ago did you finish cancer treatment?",
    options: [
      { value: "under_1_year", label: "Less than a year ago" },
      { value: "one_to_five_years", label: "1 to 5 years ago" },
      { value: "over_5_years", label: "More than 5 years ago" },
      { value: "not_sure", label: "I'm not sure", notSure: true },
    ],
  },
  age: {
    id: "age",
    accent: "age",
    why: "Age is the single biggest factor in every fertility guideline, so it shapes your risk group and your options.",
    field: "age",
    kind: "number",
    heading: "How old are you?",
    skippable: true,
    placeholder: "Your age",
    inputMode: "numeric",
  },
  anatomy: {
    id: "anatomy",
    why: "Options differ by body, not identity. This one answer decides which options we show.",
    field: "anatomy",
    kind: "single",
    heading: "Which describes your body?",
    options: [
      { value: "ovaries_uterus", label: "I have ovaries, a uterus, or both", icon: "egg" },
      { value: "testes", label: "I have testes", icon: "sperm" },
      { value: "self_describe", label: "I'd describe it differently" },
      { value: "prefer_not_to_say", label: "I'd rather not say", notSure: true },
    ],
  },
  cancer_type: {
    id: "cancer_type",
    accent: "diagnosis",
    why: "Risk groups in the research are organized by diagnosis and treatment plan.",
    field: "cancerType",
    kind: "single",
    heading: "What is your diagnosis?",
    skippable: true,
    options: [
      { value: "breast", label: "Breast cancer" },
      { value: "hodgkin", label: "Hodgkin lymphoma" },
      { value: "non_hodgkin", label: "Non-Hodgkin lymphoma" },
      { value: "leukemia", label: "Leukemia" },
      { value: "testicular", label: "Testicular cancer" },
      { value: "thyroid", label: "Thyroid cancer" },
      { value: "sarcoma", label: "Sarcoma (bone or soft tissue)" },
      { value: "brain_cns", label: "Brain or spinal cord tumor" },
      { value: "cervical", label: "Cervical cancer" },
      { value: "ovarian", label: "Ovarian cancer" },
      { value: "uterine", label: "Uterine cancer" },
      { value: "gastrointestinal", label: "Stomach, intestinal, or colorectal cancer" },
      { value: "germ_cell", label: "Germ cell tumor" },
      { value: "melanoma", label: "Melanoma" },
      { value: "other", label: "Something else" },
      { value: "not_sure", label: "I'm not sure", notSure: true },
    ],
  },
  treatments: {
    id: "treatments",
    field: "treatments",
    kind: "multi",
    heading: "What cancer treatment is planned, or what did you have?",
    options: [
      { value: "chemo", label: "Chemotherapy", icon: "syringe" },
      { value: "radiation", label: "Radiation", icon: "radiation" },
      { value: "surgery", label: "Surgery", icon: "scalpel" },
      { value: "transplant", label: "Stem cell or bone marrow transplant", icon: "flask" },
      { value: "not_sure", label: "I'm not sure yet", notSure: true },
    ],
  },
  chemo_drugs: {
    id: "chemo_drugs",
    field: "chemoAgents",
    kind: "multi",
    heading: "Do you know which chemo medicines?",
    options: [
      { value: "cyclophosphamide", label: "Cyclophosphamide (Cytoxan)" },
      { value: "ifosfamide", label: "Ifosfamide" },
      { value: "busulfan", label: "Busulfan" },
      { value: "melphalan", label: "Melphalan" },
      { value: "procarbazine", label: "Procarbazine" },
      { value: "carmustine_lomustine", label: "Carmustine or lomustine" },
      { value: "cisplatin", label: "Cisplatin" },
      { value: "carboplatin", label: "Carboplatin" },
      { value: "other", label: "Different ones" },
      { value: "not_sure", label: "I don't know the names", notSure: true },
    ],
  },
  chemo_regimen: {
    id: "chemo_regimen",
    field: "chemoRegimen",
    kind: "single",
    heading: "Do you know the name of your chemo plan?",
    // options are filled at runtime from the CRISP list for the chosen diagnosis
    options: [],
  },
  radiation_area: {
    id: "radiation_area",
    field: "radiationArea",
    kind: "single",
    heading: "Where is the radiation aimed?",
    options: [
      { value: "head", label: "Head or brain" },
      { value: "chest", label: "Chest" },
      { value: "abdomen_pelvis", label: "Belly or pelvis" },
      { value: "arms_legs", label: "Arms or legs" },
      { value: "other", label: "Somewhere else, or my whole body" },
      { value: "not_sure", label: "I'm not sure", notSure: true },
    ],
  },
  feelings: {
    id: "feelings",
    accent: "children someday",
    field: "feelings",
    kind: "single",
    heading: "How do you feel about having children someday?",
    options: [
      { value: "yes", label: "Yes, I want to", icon: "sprout" },
      { value: "maybe", label: "Maybe", icon: "compass" },
      { value: "not_sure", label: "I'm not sure", notSure: true, icon: "door" },
      { value: "no", label: "No", icon: "shield" },
    ],
  },
  have_kids: {
    id: "have_kids",
    accent: "already have children",
    field: "kidsAlready",
    kind: "single",
    optional: true,
    skippable: true,
    heading: "Do you already have children?",
    options: [
      { value: "none", label: "Not yet" },
      { value: "one", label: "One" },
      { value: "two_plus", label: "Two or more" },
    ],
  },
  family_size: {
    id: "family_size",
    accent: "(more) children",
    why: "Family size sets how many eggs, embryos, or samples a specialist plans for.",
    field: "familySize",
    kind: "single",
    optional: true,
    skippable: true,
    heading: "How many (more) children do you hope for?",
    options: [
      { value: "one", label: "One" },
      { value: "two", label: "Two" },
      { value: "three_plus", label: "Three or more" },
      { value: "not_sure", label: "I'm not sure", notSure: true },
    ],
  },
  family_timeline: {
    id: "family_timeline",
    accent: "When",
    why: "Timeline plus age is how specialists decide how urgent preserving is for you.",
    field: "familyTimeline",
    kind: "single",
    optional: true,
    skippable: true,
    heading: "When would you want to have (more) children?",
    options: [
      { value: "within_year", label: "Within a year" },
      { value: "one_to_two", label: "In 1 to 2 years" },
      { value: "three_to_five", label: "In 3 to 5 years" },
      { value: "five_plus", label: "In more than 5 years" },
      { value: "not_sure", label: "No idea yet", notSure: true },
    ],
  },
  insurance: {
    id: "insurance",
    accent: "insurance",
    why: "Coverage laws differ by plan type; this routes you to the right one.",
    field: "insurance",
    kind: "single",
    heading: "What health insurance do you have?",
    options: [
      { value: "ca_commercial", label: "A job-based or private plan in California" },
      { value: "medi_cal", label: "Medi-Cal" },
      { value: "other", label: "Another plan, or out of state" },
      { value: "none", label: "No insurance right now" },
      { value: "unknown", label: "I don't know", notSure: true },
    ],
  },
  partner_insurance: {
    id: "partner_insurance",
    field: "partnerInsurance",
    kind: "single",
    heading: "Does your partner have insurance through work?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "not_sure", label: "I'm not sure", notSure: true },
    ],
  },
  zip: {
    id: "zip",
    why: "Only used on this device to measure distance to clinics. Never sent anywhere.",
    field: "zip",
    kind: "text",
    heading: "Your ZIP code",
    optional: true,
    skippable: true,
    placeholder: "5-digit ZIP",
    inputMode: "numeric",
  },
};
