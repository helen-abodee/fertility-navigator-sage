import type {
  Anatomy,
  Citation,
  InsuranceType,
  TreatmentStage,
  TreatmentType,
} from "./types";

/**
 * Content schema. Every medical, cost, or insurance fact shown in the app is a
 * value conforming to these types, written in content/app/*, reviewed as files.
 * Citations are mandatory wherever a claim could be asked "says who?".
 * Copy rules: 6th-8th grade reading level, no urgency language beyond what is
 * medically true, no pressure toward preserving or not preserving, no em dashes.
 */

export interface Step {
  title: string;
  body: string;
  /** e.g. "about 10 to 14 days" - only when the source supports it */
  duration?: string;
}

export interface CostLine {
  label: string;
  /** transparent range as published, or "not published" */
  range: string;
  note?: string;
  citations: Citation[];
}

/** Conditions are data, matched by the results engine. Empty array = any. */
export interface Audience {
  anatomy?: Anatomy[];
  stages?: TreatmentStage[];
  treatments?: TreatmentType[];
  insurance?: InsuranceType[];
  partnered?: boolean;
}

export type OptionId =
  | "egg_freezing"
  | "embryo_freezing"
  | "sperm_banking"
  | "testicular_sperm_extraction"
  | "ovarian_tissue_freezing"
  | "ovarian_suppression"
  | "ovarian_transposition";

export interface PreservationOption {
  id: OptionId;
  name: string;
  /** one calm sentence of what it is */
  shortDescription: string;
  status: "established" | "investigational" | "adjunct";
  /** required when status is not "established": what that means for the reader */
  statusNote?: string;
  citations: Citation[];
  /** who this option can apply to; engine shows it only when audience matches */
  audience: Audience;
  audienceCitations: Citation[];
  steps: Step[];
  stepsCitations: Citation[];
  /** e.g. "From first visit to freezing: usually about 2 weeks." */
  timeline?: string;
  /** honest expectations: results vary, storage continues yearly, etc. */
  expectations: string;
  expectationsCitations: Citation[];
  costs: CostLine[];
}

export interface GuidanceAction {
  label: string;
  detail: string;
  citations: Citation[];
}

/** A results-page section (insurance branch, survivor testing, etc.) */
export interface GuidanceSection {
  id: string;
  audience: Audience;
  heading: string;
  paragraphs: { text: string; citations: Citation[] }[];
  actions?: GuidanceAction[];
}

export interface AidOrg {
  id: string;
  name: string;
  what: string;
  eligibility: string;
  /** dollar cap or coverage description; "not published" when unknown */
  cap: string;
  /** true when the org reimburses after upfront payment */
  payUpfront?: boolean;
  url: string;
  audience: Audience;
  citations: Citation[];
}

export interface DoctorQuestion {
  id: string;
  text: string;
  audience: Audience;
  citations?: Citation[];
}

export interface AppContent {
  options: PreservationOption[];
  guidance: GuidanceSection[];
  aid: AidOrg[];
  doctorQuestions: DoctorQuestion[];
  /** shown on every page */
  lastReviewed: string; // ISO date
}
