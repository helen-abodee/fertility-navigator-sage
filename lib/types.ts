/**
 * Shared types for the fertility preservation navigator.
 * Privacy rule: values of these types live in browser memory (optionally
 * localStorage behind an explicit opt-in) and must never be sent anywhere.
 */

export type WhoFor = "me" | "me_and_partner";

export type TreatmentStage = "not_started" | "in_treatment" | "finished" | "not_sure";

export type TimeSinceTreatment =
  | "under_1_year"
  | "one_to_five_years"
  | "over_5_years"
  | "not_sure";

export type Anatomy = "ovaries_uterus" | "testes" | "self_describe" | "prefer_not_to_say";

export type TreatmentType = "chemo" | "radiation" | "surgery" | "transplant" | "not_sure";

export type RadiationArea = "head" | "chest" | "abdomen_pelvis" | "arms_legs" | "other" | "not_sure";

/** Common gonadotoxicity-relevant chemo agents a patient may know by name. */
export type ChemoAgent =
  | "cyclophosphamide"
  | "ifosfamide"
  | "busulfan"
  | "melphalan"
  | "procarbazine"
  | "carmustine_lomustine"
  | "cisplatin_carboplatin"
  | "other"
  | "not_sure";

export type FeelingsAboutChildren = "yes" | "maybe" | "not_sure" | "no";

export type InsuranceType = "ca_commercial" | "medi_cal" | "other" | "none" | "unknown";

export type YesNoUnsure = "yes" | "no" | "not_sure";

/** Every field optional: every question can be skipped or answered "not sure". */
export interface Answers {
  whoFor?: WhoFor;
  stage?: TreatmentStage;
  timeSince?: TimeSinceTreatment;
  age?: number;
  anatomy?: Anatomy;
  /** undefined = not reached, null = skipped */
  cancerType?: string | null;
  treatments?: TreatmentType[];
  chemoAgents?: ChemoAgent[];
  radiationArea?: RadiationArea;
  feelings?: FeelingsAboutChildren;
  insurance?: InsuranceType;
  partnerInsurance?: YesNoUnsure;
  /** undefined = not reached, null = skipped. Used only for clinic distance, on device. */
  zip?: string | null;
}

export type QuestionId =
  | "who_for"
  | "stage"
  | "time_since"
  | "age"
  | "anatomy"
  | "cancer_type"
  | "treatments"
  | "chemo_drugs"
  | "radiation_area"
  | "feelings"
  | "insurance"
  | "partner_insurance"
  | "zip";

/** A citation attached to every medical, cost, or insurance fact shown in the app. */
export interface Citation {
  /** e.g. "D4" for a source-docs document, or "asco-2025" for an extracted source file */
  sourceId: string;
  /** human-readable source name shown in the UI */
  sourceName: string;
  page?: number;
  url?: string;
  /** ISO date the source was published or last updated, shown as part of the citation */
  sourceDate?: string;
  /** ISO date we retrieved/verified it */
  retrieved: string;
}

export interface SourcedFact<T = string> {
  value: T;
  citations: Citation[];
}

/** Clinic dataset schema (workstream D). Every field that came from the web is sourced. */
export interface SourcedField<T> {
  value: T | "not_published";
  sourceUrl: string;
  retrieved: string; // ISO date
}

export interface ClinicLocation {
  label: string;
  address: string;
  lat: number;
  lng: number;
}

export interface Clinic {
  id: string;
  name: string;
  website: string;
  phone?: string;
  /** exact language from the recommending source document, with citation */
  recommendedBy?: SourcedFact;
  locations: ClinicLocation[];
  services: SourcedField<string[]>;
  oncofertility: SourcedField<boolean>;
  ovarianTissueFreezing?: SourcedField<boolean>;
  spermBanking?: SourcedField<boolean>;
  publishedPrices?: SourcedField<string[]>;
  consultCost?: SourcedField<string>;
  insuranceAccepted?: SourcedField<string[]>;
  financing?: SourcedField<string>;
}
