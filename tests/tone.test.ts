import { describe, it, expect } from "vitest";
import { appContent } from "../content/app/content";
import { questions } from "../lib/questions";
import { riskRules } from "../lib/risk/rules";
import { assessCoverage, type CoverageInput } from "../lib/coverage";
import { journeyStages, journeyOutcomes, emptyJourney, summaryLines, setOutcome } from "../lib/journey";
import { reflectionIntro, reflectionSteps, reflectionAttribution } from "../content/app/reflection";

/**
 * Ported from Dyad's cycle-education tone tests: the copy rules are enforced
 * by CI, not by review. Collects every user-facing string in the app.
 */

function collectAllText(): string {
  const parts: string[] = [];
  for (const o of appContent.options) {
    parts.push(o.name, o.shortDescription, o.statusNote ?? "", o.timeline ?? "", o.expectations);
    for (const s of o.steps) parts.push(s.title, s.body);
    for (const c of o.costs) parts.push(c.label, c.range, c.note ?? "");
    for (const seg of o.plan?.segments ?? []) parts.push(seg.label);
    if (o.plan?.note) parts.push(o.plan.note);
  }
  for (const g of appContent.guidance) {
    parts.push(g.heading);
    for (const p of g.paragraphs) parts.push(p.text);
    for (const a of g.actions ?? []) parts.push(a.label, a.detail);
  }
  for (const a of appContent.aid) parts.push(a.name, a.what, a.eligibility, a.cap);
  for (const q of appContent.doctorQuestions) parts.push(q.text);
  for (const h of appContent.health) parts.push(h.fact, h.mechanism ?? "", h.caveat ?? "");
  for (const def of Object.values(questions)) {
    parts.push(def.heading, def.placeholder ?? "");
    for (const opt of def.options ?? []) parts.push(opt.label);
  }
  const riskSamples = [
    { anatomy: "ovaries_uterus", cancerType: "breast", chemoRegimen: "CMF (Cyclophosphamide, Methotrexate, Fluorouracil)", age: 24, treatments: ["chemo"] },
    { anatomy: "ovaries_uterus", cancerType: "breast", chemoRegimen: "CMF (Cyclophosphamide, Methotrexate, Fluorouracil)", age: 44, treatments: ["chemo"] },
    { anatomy: "ovaries_uterus", cancerType: "breast", chemoRegimen: "KP (TDM-1, pertuzumab)", age: 24, treatments: ["chemo"] },
  ] as const;
  for (const r of riskRules) {
    if (typeof r.result === "function") {
      for (const sample of riskSamples) {
        if (r.applies(sample as never)) {
          const res = r.result(sample as never);
          parts.push(res.label, res.headline, res.body, res.askTeam);
        }
      }
    } else {
      parts.push(r.result.label, r.result.headline, r.result.body, r.result.askTeam);
    }
  }
  // Exercise every coverage branch.
  const coverageInputs: CoverageInput[] = [
    { channel: "medi_cal" },
    { channel: "medicare" },
    { channel: "military_active" },
    { channel: "military_dependent" },
    { channel: "federal" },
    { channel: "none" },
    { channel: "unknown" },
    { channel: "job", basedInCalifornia: "no" },
    { channel: "job", basedInCalifornia: "yes", funding: "self_funded" },
    { channel: "job", basedInCalifornia: "yes", funding: "unknown" },
    { channel: "job", basedInCalifornia: "yes", funding: "fully_insured", stage: "not_started" },
    { channel: "job", basedInCalifornia: "yes", funding: "fully_insured", stage: "finished", employerSize: "large" },
    { channel: "job", basedInCalifornia: "yes", funding: "fully_insured", stage: "finished", employerSize: "small" },
    { channel: "job", basedInCalifornia: "yes", funding: "fully_insured", stage: "finished", employerSize: "unknown" },
    { channel: "covered_ca", basedInCalifornia: "yes", stage: "not_started" },
  ];
  for (const input of coverageInputs) {
    const v = assessCoverage(input);
    parts.push(v.headline, v.body);
    for (const s of v.steps) parts.push(s.label, s.detail ?? "");
  }
  for (const s of journeyStages) parts.push(s.label);
  for (const o of journeyOutcomes) parts.push(o.label);
  parts.push(...summaryLines(setOutcome(emptyJourney(), "decided_not_to")));
  parts.push(reflectionIntro.heading, reflectionIntro.body, reflectionAttribution);
  for (const r of reflectionSteps) {
    parts.push(r.heading, r.body, ...(r.prompts ?? []), ...(r.scale ?? []), ...(r.chips ?? []));
  }
  return parts.join(" ").toLowerCase();
}

const ALL_TEXT = collectAllText();

describe("tone rules (no wellness platitudes)", () => {
  const BANNED = [
    "be gentle",
    "gentle with yourself",
    "self-care",
    "pamper",
    "listen to your body",
    "treat yourself",
    "me time",
    "it's okay to rest",
    "honor your body",
    "stay positive",
    "stay strong",
  ];
  for (const phrase of BANNED) {
    it(`never says "${phrase}"`, () => {
      const re = new RegExp("\\b" + phrase.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&") + "\\b");
      expect(ALL_TEXT).not.toMatch(re);
    });
  }
});

describe("claim discipline", () => {
  const BANNED_CLAIMS = [
    "boost your fertility",
    "improve your fertility",
    "improves fertility",
    "increase your chances",
    "maximize your chances",
    "optimize your fertility",
    "will conceive",
    "will get pregnant",
  ];
  for (const claim of BANNED_CLAIMS) {
    it(`never claims "${claim}"`, () => {
      expect(ALL_TEXT).not.toContain(claim);
    });
  }

  it('uses "guarantee" only to deny one', () => {
    const matches = ALL_TEXT.match(/.{12}guarantee/g) ?? [];
    for (const m of matches) {
      expect(m).toMatch(/not guarantee|no guarantee/);
    }
  });
});

describe("no urgency beyond what is medically true", () => {
  const BANNED_URGENCY = ["act now", "don't wait", "before it's too late", "running out of time", "hurry"];
  for (const phrase of BANNED_URGENCY) {
    it(`never says "${phrase}"`, () => {
      expect(ALL_TEXT).not.toContain(phrase);
    });
  }
});

describe("typography rules", () => {
  it("never uses an em dash or en dash in copy", () => {
    expect(ALL_TEXT).not.toContain("—");
    expect(ALL_TEXT).not.toContain("–");
  });
});
