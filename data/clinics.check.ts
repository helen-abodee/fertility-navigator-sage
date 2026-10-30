/**
 * Typecheck harness for data/clinics.json (workstream D).
 *
 * `npx tsc --noEmit` must stay clean. TypeScript widens string literals in
 * imported JSON to `string`, so the literal `"not_published"` cannot be
 * checked directly against `T | "not_published"` when T is `string[]` or
 * `boolean`. We therefore check the JSON against `JsonClinic`, a mirror of
 * `Clinic` from lib/types.ts that is identical except that every
 * SourcedField value also admits `string` (which is what `"not_published"`
 * widens to). Everything else — field names, optionality, sourceUrl /
 * retrieved on every sourced field, location shape with numeric lat/lng,
 * citation shape on recommendedBy — is enforced exactly.
 *
 * Keep JsonClinic in sync with Clinic. The final export asserts the data as
 * Clinic[] for any consumer that imports from here.
 */
import type { Citation, Clinic } from "../lib/types";
import clinicsJson from "./clinics.json";

interface JsonSourcedField<T> {
  value: T | "not_published" | string;
  sourceUrl: string;
  retrieved: string;
}

interface JsonSourcedFact {
  value: string;
  citations: Citation[];
}

interface JsonClinicLocation {
  label: string;
  address: string;
  lat: number;
  lng: number;
}

interface JsonClinic {
  id: string;
  name: string;
  website: string;
  phone?: string;
  recommendedBy?: JsonSourcedFact;
  locations: JsonClinicLocation[];
  services: JsonSourcedField<string[]>;
  oncofertility: JsonSourcedField<boolean>;
  ovarianTissueFreezing?: JsonSourcedField<boolean>;
  spermBanking?: JsonSourcedField<boolean>;
  publishedPrices?: JsonSourcedField<string[]>;
  consultCost?: JsonSourcedField<string>;
  insuranceAccepted?: JsonSourcedField<string[]>;
  financing?: JsonSourcedField<string>;
}

// Compile-time structural check of the JSON against the schema.
const checked: JsonClinic[] = clinicsJson;

/** The clinic dataset, typed. */
export const clinics: Clinic[] = checked as Clinic[];
