import { describe, it, expect } from "vitest";
import { writeFileSync } from "node:fs";
import { appContent } from "../content/app/content";
import { compare } from "../content/app/compare";
import { reflectionSteps } from "../content/app/reflection";
import { riskRules } from "../lib/risk/rules";
import { parenthoodPaths } from "../content/app/parenthood";
import type { Citation } from "../lib/types";

/**
 * Generates content/SOURCE-MAP.csv for stakeholder review when
 * WRITE_SOURCE_MAP=1. Always verifies every content item carries sources.
 */

const esc = (s: string) => '"' + s.replace(/"/g, '""') + '"';
const srcs = (cs: Citation[]) =>
  Array.from(new Set(cs.map((c) => c.sourceName + (c.sourceDate ? ` (${c.sourceDate})` : "")))).join(" | ");

function buildRows(): string[][] {
  const rows: string[][] = [["Area", "Item", "What the patient sees or answers", "Source(s)", "Last checked"]];
  const latest = (cs: Citation[]) => cs.map((c) => c.retrieved).sort().slice(-1)[0] ?? "";

  rows.push(["Survey", "All questions and branching", "10 to 13 questions, one per screen; branch logic from entry triage", "Product design; regimen lists from UCSD CRISP tool; insurance options from UCSD/AFP toolkit", "2026-11-02"]);
  rows.push(["Risk screen", "CRISP regimen rule", "UCSD band for exact diagnosis + regimen + age, with the underlying study", "UCSD CRISP tool (oncofertilityrisk.com) + per-regimen study references", "2026-11-02"]);
  for (const r of riskRules) {
    if (typeof r.result === "function") continue;
    rows.push(["Risk screen", r.id, r.result.headline, srcs(r.result.citations), latest(r.result.citations)]);
  }
  for (const o of appContent.options) {
    const all = [...o.citations, ...o.stepsCitations, ...o.expectationsCitations, ...o.costs.flatMap((c) => c.citations)];
    rows.push(["Options", o.name, o.shortDescription, srcs(all), latest(all)]);
  }
  for (const g of appContent.guidance) {
    const all = [...g.paragraphs.flatMap((p) => p.citations), ...(g.actions ?? []).flatMap((a) => a.citations)];
    rows.push(["Financing / guidance", g.heading, g.paragraphs[0]?.text.slice(0, 90) ?? "", srcs(all), latest(all)]);
  }
  for (const a of appContent.aid) {
    rows.push(["Financial aid", a.name, `${a.what} ${a.cap !== "not published" ? "Cap: " + a.cap : ""}`.trim(), srcs(a.citations), latest(a.citations)]);
  }
  for (const h of appContent.health) {
    rows.push(["Health", h.fact, h.mechanism ?? "", srcs(h.citations), latest(h.citations)]);
  }
  for (const pp of parenthoodPaths) {
    rows.push(["Family building", pp.name, pp.short, srcs(pp.paragraphs.flatMap((x) => x.citations)), latest(pp.paragraphs.flatMap((x) => x.citations))]);
  }
  for (const e of compare) {
    rows.push(["Compare", e.optionId, e.summary, srcs(e.citations), latest(e.citations)]);
  }
  for (const r of reflectionSteps) {
    rows.push(["Thinking it through", r.heading, r.body.slice(0, 90), srcs(r.citations), latest(r.citations)]);
  }
  rows.push(["Clinics", "17 clinic records", "Names/quotes from the source flyer; services, prices, contacts from each clinic's own site; 'not published' when absent", "Fertility Resources flyer (D1) + each clinic website (provenance: content/sources/clinics-provenance.md)", "2026-10-30"]);
  rows.push(["Coverage checker", "All verdicts", "Likely-coverage verdicts and next steps by plan type", "UCSD/AFP toolkit (2025-07-31) + SB 600/SB 729 statute research", "2026-10-30"]);
  return rows;
}

describe("source map", () => {
  it("every patient-facing content item carries at least one source", () => {
    for (const o of appContent.options) expect(o.citations.length).toBeGreaterThan(0);
    for (const g of appContent.guidance.filter((g) => g.id !== "lgbtq_coverage")) {
      expect(g.paragraphs.some((p) => p.citations.length > 0)).toBe(true);
    }
    for (const a of appContent.aid) expect(a.citations.length).toBeGreaterThan(0);
    for (const h of appContent.health) expect(h.citations.length).toBeGreaterThan(0);
    for (const e of compare) expect(e.citations.length).toBeGreaterThan(0);
    for (const r of reflectionSteps) expect(r.citations.length).toBeGreaterThan(0);
  });

  it("writes the stakeholder CSV when asked", () => {
    if (process.env.WRITE_SOURCE_MAP !== "1") return;
    const rows = buildRows();
    writeFileSync("content/SOURCE-MAP.csv", rows.map((r) => r.map(esc).join(",")).join("\n"));
    expect(rows.length).toBeGreaterThan(40);
  });
});
