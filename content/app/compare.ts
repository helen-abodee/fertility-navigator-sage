import type { Citation } from "../../lib/types";
import type { OptionId } from "../../lib/content-schema";
import { asco, d4 } from "./citations";

/**
 * The at-a-glance comparison matrix. Every cell carries words, not just color,
 * and grades summarize facts that live, cited, in each option's own page.
 * "tough" is honest, not scary: cost and involvement, stated plainly.
 */

export type Grade = "good" | "mid" | "tough" | "unknown";

export const considerations = [
  { id: "time_needed", label: "Time before treatment" },
  { id: "what_it_involves", label: "What it involves" },
  { id: "upfront_cost", label: "Upfront cost (published)" },
  { id: "ongoing_cost", label: "Ongoing cost" },
  { id: "evidence", label: "Evidence status" },
  { id: "decisions_now", label: "Decisions needed now" },
] as const;

export type ConsiderationId = (typeof considerations)[number]["id"];

export interface CompareCell {
  grade: Grade;
  note: string;
}

export interface CompareEntry {
  optionId: OptionId;
  cells: Record<ConsiderationId, CompareCell>;
  summary: string;
  citations: Citation[];
}

export const compare: CompareEntry[] = [
  {
    optionId: "egg_freezing",
    cells: {
      time_needed: { grade: "mid", note: "About 2 to 3 weeks once started" },
      what_it_involves: { grade: "mid", note: "Daily shots, then retrieval while asleep" },
      upfront_cost: { grade: "tough", note: "Higher: $12,400 plus about $5,000 medicines" },
      ongoing_cost: { grade: "mid", note: "$200 to $500 per year storage" },
      evidence: { grade: "good", note: "Established" },
      decisions_now: { grade: "good", note: "No sperm decision needed" },
    },
    summary: "Takes a couple of weeks and real money, keeps every later choice open.",
    citations: [asco("4.2"), d4(3)],
  },
  {
    optionId: "embryo_freezing",
    cells: {
      time_needed: { grade: "mid", note: "About 2 to 3 weeks once started" },
      what_it_involves: { grade: "mid", note: "Daily shots, retrieval, lab fertilization" },
      upfront_cost: { grade: "tough", note: "Higher: $12,400 plus about $5,000 medicines" },
      ongoing_cost: { grade: "mid", note: "$200 to $500 per year storage" },
      evidence: { grade: "good", note: "Established" },
      decisions_now: { grade: "mid", note: "Sperm source decided now" },
    },
    summary: "Same path as egg freezing, plus deciding whose sperm, now.",
    citations: [asco("4.1"), d4(3)],
  },
  {
    optionId: "sperm_banking",
    cells: {
      time_needed: { grade: "good", note: "Days, compressible to 1 or 2" },
      what_it_involves: { grade: "good", note: "Private collection, no procedure" },
      upfront_cost: { grade: "good", note: "Lower: $500 to $1,000" },
      ongoing_cost: { grade: "mid", note: "$200 to $500 per year storage" },
      evidence: { grade: "good", note: "Established" },
      decisions_now: { grade: "good", note: "None beyond doing it" },
    },
    summary: "The fastest, simplest, cheapest option on this list.",
    citations: [asco("3.1"), d4(3)],
  },
  {
    optionId: "testicular_sperm_extraction",
    cells: {
      time_needed: { grade: "good", note: "One procedure visit" },
      what_it_involves: { grade: "mid", note: "A surgeon retrieves sperm directly" },
      upfront_cost: { grade: "unknown", note: "Not published" },
      ongoing_cost: { grade: "mid", note: "$200 to $500 per year storage" },
      evidence: { grade: "good", note: "Established" },
      decisions_now: { grade: "good", note: "None beyond doing it" },
    },
    summary: "The surgical route when a sample isn't possible.",
    citations: [asco("3.2"), d4(9)],
  },
  {
    optionId: "ovarian_tissue_freezing",
    cells: {
      time_needed: { grade: "good", note: "No hormone-shot wait" },
      what_it_involves: { grade: "tough", note: "Surgery under anesthesia" },
      upfront_cost: { grade: "unknown", note: "Not published" },
      ongoing_cost: { grade: "mid", note: "$200 to $500 per year storage" },
      evidence: { grade: "good", note: "Established" },
      decisions_now: { grade: "good", note: "No sperm decision needed" },
    },
    summary: "Fast because it skips stimulation; the trade is surgery.",
    citations: [asco("4.10"), d4(9)],
  },
  {
    optionId: "ovarian_suppression",
    cells: {
      time_needed: { grade: "good", note: "Given during chemo" },
      what_it_involves: { grade: "good", note: "An injection" },
      upfront_cost: { grade: "unknown", note: "Not published" },
      ongoing_cost: { grade: "good", note: "No storage" },
      evidence: { grade: "mid", note: "An add-on, not a replacement" },
      decisions_now: { grade: "good", note: "None" },
    },
    summary: "Easy to add, but guidelines say it never replaces freezing.",
    citations: [asco("4.8")],
  },
  {
    optionId: "ovarian_transposition",
    cells: {
      time_needed: { grade: "mid", note: "Scheduled before radiation" },
      what_it_involves: { grade: "mid", note: "Surgery to move the ovaries" },
      upfront_cost: { grade: "unknown", note: "Not published" },
      ongoing_cost: { grade: "good", note: "No storage" },
      evidence: { grade: "good", note: "Established for pelvic radiation" },
      decisions_now: { grade: "good", note: "None beyond scheduling" },
    },
    summary: "For pelvic radiation specifically: shields rather than stores.",
    citations: [asco("4.5")],
  },
];
