import generated from "../content/app/crisp.generated.json";
import type { RiskCategory } from "./risk";

/**
 * Access to the CRISP table recovered from UCSD's public tool
 * (oncofertilityrisk.com) via scripts/enumerate-crisp.mjs and
 * scripts/build-crisp-rules.mjs. Female outcomes only (amenorrhea, ovarian
 * failure); methodology notes in content/sources/crisp-methodology.md.
 * Attribution/permission conversation scheduled with UCSD (Nov 11).
 */

export interface CrispBand {
  minAge: number;
  maxAge: number;
  band: "LOW" | "MODERATE" | "HIGH" | "UNKNOWN";
  pct: string | null;
  outcome: string | null;
  refs: string | null;
}

interface CrispTable {
  retrieved: string;
  source: string;
  cancers: Record<string, Record<string, { exposure: string; crispCancer: string; bands: CrispBand[] }>>;
}

const table = generated as unknown as CrispTable;

export const crispMeta = { source: table.source, retrieved: table.retrieved };

export function regimensFor(cancerType: string | null | undefined): string[] {
  if (!cancerType) return [];
  const entry = table.cancers[cancerType];
  return entry ? Object.keys(entry) : [];
}

/**
 * Band for cancer + regimen + age. Coarse enumerations leave gaps between
 * sampled ages; an age in a gap resolves to the nearest sampled band so we
 * never invent a value between two published ones.
 */
export function crispLookup(
  cancerType: string | null | undefined,
  regimen: string | null | undefined,
  age: number | undefined,
): (CrispBand & { crispCancer: string }) | null {
  if (!cancerType || !regimen || age === undefined) return null;
  const entry = table.cancers[cancerType]?.[regimen];
  if (!entry) return null;
  let best: CrispBand | null = null;
  let bestDist = Infinity;
  for (const b of entry.bands) {
    if (age >= b.minAge && age <= b.maxAge) {
      best = b;
      bestDist = 0;
      break;
    }
    const dist = age < b.minAge ? b.minAge - age : age - b.maxAge;
    if (dist < bestDist) {
      bestDist = dist;
      best = b;
    }
  }
  return best ? { ...best, crispCancer: entry.crispCancer } : null;
}

export function crispBandToCategory(band: CrispBand["band"]): RiskCategory {
  switch (band) {
    case "LOW":
      return "lower";
    case "MODERATE":
      return "intermediate";
    case "HIGH":
      return "high";
    default:
      return "variable";
  }
}
