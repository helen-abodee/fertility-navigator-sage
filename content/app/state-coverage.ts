import type { Citation } from "../../lib/types";

/**
 * State fertility preservation insurance laws OUTSIDE California, extracted
 * from the Alliance for Fertility Preservation's coverage map data on
 * 2026-11-10 (see content/sources/afp-coverage.md for the extraction record
 * and the term taxonomy). California is handled by the dedicated SB 600 /
 * SB 729 logic in lib/coverage.ts and is deliberately not in this list.
 * FEHB and VHA are federal programs, not states.
 * The categories below are AFP's own filter taxonomy, reproduced as data,
 * never reinterpreted; bill numbers live on the linked AFP state pages.
 */

export type PlanKind = "large_group" | "small_group" | "individual" | "state_employee" | "medicaid";
export type ServiceKind = "sperm" | "egg" | "embryo" | "ovarian_tissue" | "storage";
export type CoverageNote = "cancer_only" | "cancer_and_specific" | "religious_exemption" | "no_prior_auth" | "large_group_only";

export interface StateCoverage {
  abb: string;
  name: string;
  plans: PlanKind[];
  services: ServiceKind[];
  notes: CoverageNote[];
  afpPath: string;
}

export const AFP_BASE = "https://www.allianceforfertilitypreservation.org";

export function afpCite(label: string, path: string): Citation {
  return {
    sourceId: "afp-coverage-map",
    sourceName: label,
    url: AFP_BASE + path,
    sourceDate: "2026-11-10",
    retrieved: "2026-11-10",
  };
}

export const stateCoverage: StateCoverage[] = [
  { abb: "CO", name: "Colorado", plans: ["large_group"], services: ["egg", "embryo", "ovarian_tissue", "sperm"], notes: ["large_group_only", "religious_exemption"], afpPath: "/states/colorado/" },
  { abb: "CT", name: "Connecticut", plans: ["individual", "large_group", "small_group"], services: ["egg", "embryo", "ovarian_tissue", "sperm"], notes: ["religious_exemption"], afpPath: "/states/connecticut/" },
  { abb: "DC", name: "District of Columbia", plans: ["individual", "large_group", "small_group"], services: ["egg", "embryo", "ovarian_tissue", "sperm", "storage"], notes: [], afpPath: "/states/district-of-columbia/" },
  { abb: "DE", name: "Delaware", plans: ["individual", "large_group", "small_group", "state_employee"], services: ["egg", "embryo", "ovarian_tissue", "sperm", "storage"], notes: ["religious_exemption"], afpPath: "/states/delaware/" },
  { abb: "FEHB", name: "Federal Employees Health Benefits", plans: [], services: ["egg", "sperm", "storage"], notes: [], afpPath: "/states/fehb/" },
  { abb: "FL", name: "Florida", plans: ["state_employee"], services: ["egg", "ovarian_tissue", "sperm", "storage"], notes: ["cancer_only", "no_prior_auth"], afpPath: "/states/florida/" },
  { abb: "GA", name: "Georgia", plans: ["individual", "large_group", "small_group"], services: ["egg", "embryo", "ovarian_tissue", "sperm", "storage"], notes: ["cancer_and_specific"], afpPath: "/states/georgia/" },
  { abb: "IL", name: "Illinois", plans: ["individual", "large_group", "medicaid", "small_group", "state_employee"], services: ["egg", "embryo", "ovarian_tissue", "sperm"], notes: [], afpPath: "/states/illinois/" },
  { abb: "KY", name: "Kentucky", plans: ["individual", "large_group", "small_group", "state_employee"], services: ["egg", "sperm", "storage"], notes: ["religious_exemption"], afpPath: "/states/kentucky/" },
  { abb: "LA", name: "Louisiana", plans: ["individual", "large_group", "small_group", "state_employee"], services: ["egg", "sperm", "storage"], notes: ["cancer_only", "no_prior_auth", "religious_exemption"], afpPath: "/states/louisiana/" },
  { abb: "MA", name: "Massachusetts", plans: ["individual", "large_group", "small_group", "state_employee"], services: ["egg", "embryo", "ovarian_tissue", "sperm", "storage"], notes: [], afpPath: "/states/massachusetts/" },
  { abb: "MD", name: "Maryland", plans: ["large_group", "medicaid"], services: ["egg", "ovarian_tissue", "sperm"], notes: ["large_group_only", "religious_exemption"], afpPath: "/states/maryland/" },
  { abb: "ME", name: "Maine", plans: ["individual", "large_group", "small_group", "state_employee"], services: ["egg", "embryo", "ovarian_tissue", "sperm", "storage"], notes: [], afpPath: "/states/maine/" },
  { abb: "MT", name: "Montana", plans: ["individual", "large_group", "medicaid", "small_group", "state_employee"], services: ["egg", "embryo", "ovarian_tissue", "sperm"], notes: ["cancer_only"], afpPath: "/states/montana/" },
  { abb: "NH", name: "New Hampshire", plans: ["large_group", "small_group"], services: ["egg", "embryo", "ovarian_tissue", "sperm", "storage"], notes: [], afpPath: "/states/new-hampshire/" },
  { abb: "NJ", name: "New Jersey", plans: ["large_group", "small_group", "state_employee"], services: ["egg", "embryo", "ovarian_tissue", "sperm"], notes: ["religious_exemption"], afpPath: "/states/new-jersey/" },
  { abb: "NV", name: "Nevada", plans: ["individual", "large_group", "medicaid", "small_group", "state_employee"], services: ["egg", "embryo", "ovarian_tissue", "sperm"], notes: ["cancer_only", "religious_exemption"], afpPath: "/states/nevada/" },
  { abb: "NY", name: "New York", plans: ["individual", "large_group", "medicaid", "small_group", "state_employee"], services: ["egg", "embryo", "ovarian_tissue", "sperm", "storage"], notes: [], afpPath: "/states/new-york/" },
  { abb: "OK", name: "Oklahoma", plans: ["individual", "large_group", "small_group", "state_employee"], services: ["egg", "ovarian_tissue", "sperm"], notes: ["cancer_only", "no_prior_auth", "religious_exemption"], afpPath: "/states/oklahoma/" },
  { abb: "RI", name: "Rhode Island", plans: ["individual", "large_group", "small_group"], services: ["egg", "embryo", "ovarian_tissue", "sperm"], notes: ["religious_exemption"], afpPath: "/states/rhode-island/" },
  { abb: "TX", name: "Texas", plans: ["large_group", "small_group"], services: ["egg", "ovarian_tissue", "sperm"], notes: ["cancer_only"], afpPath: "/states/texas/" },
  { abb: "UT", name: "Utah", plans: ["medicaid", "state_employee"], services: ["egg", "embryo", "ovarian_tissue", "sperm", "storage"], notes: ["cancer_and_specific", "cancer_only"], afpPath: "/states/utah/" },
  { abb: "VHA", name: "Veterans Health Administration", plans: [], services: ["egg", "ovarian_tissue", "sperm", "storage"], notes: [], afpPath: "/states/vha/" },
];

export function coverageForState(abb: string): StateCoverage | undefined {
  return stateCoverage.find((s) => s.abb === abb);
}

export const SERVICE_LABELS: Record<ServiceKind, string> = {
  sperm: "sperm banking",
  egg: "egg freezing",
  embryo: "embryo freezing",
  ovarian_tissue: "ovarian tissue freezing",
  storage: "storage",
};

export const PLAN_LABELS: Record<PlanKind, string> = {
  large_group: "large employer plans",
  small_group: "small employer plans",
  individual: "individual plans",
  state_employee: "state employee plans",
  medicaid: "that state's Medicaid program",
};

/** All US states + DC for the picker; coverage lookup decides what to say. */
export const US_STATES: { abb: string; name: string }[] = [
  { abb: "AL", name: "Alabama" },
  { abb: "AK", name: "Alaska" },
  { abb: "AZ", name: "Arizona" },
  { abb: "AR", name: "Arkansas" },
  { abb: "CO", name: "Colorado" },
  { abb: "CT", name: "Connecticut" },
  { abb: "DE", name: "Delaware" },
  { abb: "DC", name: "District of Columbia" },
  { abb: "FL", name: "Florida" },
  { abb: "GA", name: "Georgia" },
  { abb: "HI", name: "Hawaii" },
  { abb: "ID", name: "Idaho" },
  { abb: "IL", name: "Illinois" },
  { abb: "IN", name: "Indiana" },
  { abb: "IA", name: "Iowa" },
  { abb: "KS", name: "Kansas" },
  { abb: "KY", name: "Kentucky" },
  { abb: "LA", name: "Louisiana" },
  { abb: "ME", name: "Maine" },
  { abb: "MD", name: "Maryland" },
  { abb: "MA", name: "Massachusetts" },
  { abb: "MI", name: "Michigan" },
  { abb: "MN", name: "Minnesota" },
  { abb: "MS", name: "Mississippi" },
  { abb: "MO", name: "Missouri" },
  { abb: "MT", name: "Montana" },
  { abb: "NE", name: "Nebraska" },
  { abb: "NV", name: "Nevada" },
  { abb: "NH", name: "New Hampshire" },
  { abb: "NJ", name: "New Jersey" },
  { abb: "NM", name: "New Mexico" },
  { abb: "NY", name: "New York" },
  { abb: "NC", name: "North Carolina" },
  { abb: "ND", name: "North Dakota" },
  { abb: "OH", name: "Ohio" },
  { abb: "OK", name: "Oklahoma" },
  { abb: "OR", name: "Oregon" },
  { abb: "PA", name: "Pennsylvania" },
  { abb: "RI", name: "Rhode Island" },
  { abb: "SC", name: "South Carolina" },
  { abb: "SD", name: "South Dakota" },
  { abb: "TN", name: "Tennessee" },
  { abb: "TX", name: "Texas" },
  { abb: "UT", name: "Utah" },
  { abb: "VT", name: "Vermont" },
  { abb: "VA", name: "Virginia" },
  { abb: "WA", name: "Washington" },
  { abb: "WV", name: "West Virginia" },
  { abb: "WI", name: "Wisconsin" },
  { abb: "WY", name: "Wyoming" },
];
