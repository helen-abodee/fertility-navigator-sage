/**
 * Converts the CRISP enumeration (content/sources/crisp/enumeration*.json)
 * into the app's generated female risk table: content/app/crisp.generated.json.
 * Prefers the fine (per-year ages) file when present. Re-run after any
 * re-enumeration: node scripts/build-crisp-rules.mjs
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";

const FINE = "content/sources/crisp/enumeration-fine.json";
const COARSE = "content/sources/crisp/enumeration.json";
const src = existsSync(FINE) ? FINE : COARSE;
const data = JSON.parse(readFileSync(src, "utf8"));

// CRISP cancer id -> our cancer_type value(s). Merged ids share one picker list.
const CANCER_MAP = {
  "breast-en": "breast",
  "hodgkins_lymphoma-en": "hodgkin",
  "non-hodgkins-lymphoma-en": "non_hodgkin",
  "leukemia-en": "leukemia",
  "sarcoma-en": "sarcoma",
  "brain-en": "brain_cns",
  "medulloblastoma-en": "brain_cns",
  "cervical-en": "cervical",
  "ovarian-en": "ovarian",
  "uterine-en": "uterine",
  "intestinal-en": "gastrointestinal",
  "appendiceal-en": "gastrointestinal",
  "germ_cell-en": "germ_cell",
};

const out = {
  generatedFrom: src,
  retrieved: data.retrieved,
  source: data.source,
  sampledAges: data.ages,
  cancers: {},
};

for (const row of data.rows) {
  const our = CANCER_MAP[row.cancerId];
  if (!our) continue;
  const ages = Object.keys(row.results)
    .map(Number)
    .sort((a, b) => a - b);
  if (ages.length === 0) continue;

  // Collapse consecutive ages with identical (band, pct) into bands.
  const bands = [];
  for (const age of ages) {
    const r = row.results[age];
    if (!r || !r.band) continue;
    const last = bands[bands.length - 1];
    if (last && last.band === r.band && last.pct === r.pct) {
      last.maxAge = age;
    } else {
      bands.push({
        minAge: age,
        maxAge: age,
        band: r.band,
        pct: r.pct,
        outcome: r.outcome,
        refs: r.refs,
      });
    }
  }
  if (bands.length === 0) continue;
  // Open the ends: first band covers everyone younger, last everyone older.
  bands[0].minAge = 0;
  bands[bands.length - 1].maxAge = 120;

  out.cancers[our] ??= {};
  // Merged cancers can collide on treatment names; first write wins, which is
  // fine because names are regimen-specific.
  out.cancers[our][row.treatment] ??= {
    exposure: row.exposure,
    crispCancer: row.cancer,
    bands,
  };
}

writeFileSync("content/app/crisp.generated.json", JSON.stringify(out, null, 1));
const nCancers = Object.keys(out.cancers).length;
const nTreat = Object.values(out.cancers).reduce((a, c) => a + Object.keys(c).length, 0);
console.log(`built from ${src}: ${nCancers} cancers, ${nTreat} treatments`);
