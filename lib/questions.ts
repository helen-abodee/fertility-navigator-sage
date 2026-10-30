import type { Answers, QuestionId } from "./types";

/**
 * UI copy for the click-through. Copy rules: plain language, no pressure,
 * "not sure" is a first-class answer, optional questions say why we ask.
 */

export type QuestionKind = "single" | "multi" | "number" | "text";

export interface QuestionOption {
  value: string;
  label: string;
  sub?: string;
  notSure?: boolean;
}

export interface QuestionDef {
  id: QuestionId;
  field: keyof Answers;
  kind: QuestionKind;
  heading: string;
  help?: string;
  options?: QuestionOption[];
  skippable?: boolean;
  placeholder?: string;
  inputMode?: "numeric" | "text";
}

export const questions: Record<QuestionId, QuestionDef> = {
  who_for: {
    id: "who_for",
    field: "whoFor",
    kind: "single",
    heading: "Who is this for?",
    help: "Either answer works. Many people here are going through this on their own.",
    options: [
      { value: "me", label: "Just me" },
      { value: "me_and_partner", label: "Me and my partner" },
    ],
  },
  stage: {
    id: "stage",
    field: "stage",
    kind: "single",
    heading: "Where are you with treatment?",
    help: "This helps us show only what applies to you right now.",
    options: [
      { value: "not_started", label: "I haven't started treatment yet" },
      { value: "in_treatment", label: "I'm in treatment now" },
      { value: "finished", label: "I finished treatment", sub: "We'll ask how long ago" },
      { value: "not_sure", label: "I'm not sure", notSure: true },
    ],
  },
  time_since: {
    id: "time_since",
    field: "timeSince",
    kind: "single",
    heading: "How long ago did you finish treatment?",
    options: [
      { value: "under_1_year", label: "Less than a year ago" },
      { value: "one_to_five_years", label: "1 to 5 years ago" },
      { value: "over_5_years", label: "More than 5 years ago" },
      { value: "not_sure", label: "I'm not sure", notSure: true },
    ],
  },
  age: {
    id: "age",
    field: "age",
    kind: "number",
    heading: "How old are you?",
    help: "Age changes which options fit and which financial help you may qualify for.",
    skippable: true,
    placeholder: "Your age",
    inputMode: "numeric",
  },
  anatomy: {
    id: "anatomy",
    field: "anatomy",
    kind: "single",
    heading: "Which describes your body?",
    help: "Fertility options depend on the organs involved, not on identity. We ask so we only show what applies to you.",
    options: [
      { value: "ovaries_uterus", label: "I have ovaries, a uterus, or both" },
      { value: "testes", label: "I have testes" },
      { value: "self_describe", label: "I'd describe it differently", sub: "We'll show information for every body" },
      { value: "prefer_not_to_say", label: "I'd rather not say", sub: "We'll show information for every body", notSure: true },
    ],
  },
  cancer_type: {
    id: "cancer_type",
    field: "cancerType",
    kind: "text",
    heading: "What type of cancer?",
    help: "Optional. Only used to tailor the questions you might ask your doctor.",
    skippable: true,
    placeholder: "For example: breast cancer, Hodgkin lymphoma",
    inputMode: "text",
  },
  treatments: {
    id: "treatments",
    field: "treatments",
    kind: "multi",
    heading: "What treatment is planned, or what did you have?",
    help: "Choose everything that applies. It's okay not to know yet.",
    options: [
      { value: "chemo", label: "Chemotherapy" },
      { value: "radiation", label: "Radiation" },
      { value: "surgery", label: "Surgery" },
      { value: "transplant", label: "Stem cell or bone marrow transplant" },
      { value: "not_sure", label: "I'm not sure yet", notSure: true },
    ],
  },
  feelings: {
    id: "feelings",
    field: "feelings",
    kind: "single",
    heading: "How do you feel about having children someday?",
    help: "There is no right answer, and feelings can change.",
    options: [
      { value: "yes", label: "Yes, I want to" },
      { value: "maybe", label: "Maybe" },
      { value: "not_sure", label: "I'm not sure", notSure: true },
      { value: "no", label: "No" },
    ],
  },
  insurance: {
    id: "insurance",
    field: "insurance",
    kind: "single",
    heading: "What health insurance do you have?",
    help: "We never ask for your member ID, policy number, or plan name.",
    options: [
      { value: "ca_commercial", label: "A plan through a job, or a private plan, based in California" },
      { value: "medi_cal", label: "Medi-Cal" },
      { value: "other", label: "A different plan, or a plan from another state" },
      { value: "none", label: "No insurance right now" },
      { value: "unknown", label: "I don't know", sub: "We'll show you how to find out", notSure: true },
    ],
  },
  partner_insurance: {
    id: "partner_insurance",
    field: "partnerInsurance",
    kind: "single",
    heading: "Does your partner have insurance through work?",
    help: "A partner's plan can sometimes cover fertility care.",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "not_sure", label: "I'm not sure", notSure: true },
    ],
  },
  zip: {
    id: "zip",
    field: "zip",
    kind: "text",
    heading: "Your ZIP code",
    help: "Optional. Used only to measure distance to clinics, on this device. It never leaves your phone.",
    skippable: true,
    placeholder: "5-digit ZIP",
    inputMode: "numeric",
  },
};
