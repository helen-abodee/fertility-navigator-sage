import type { Anatomy, Clinic } from "./types";

/**
 * Anatomy-aware clinic relevance: a sperm bank is noise for someone with
 * ovaries, and vice versa. Derived from each clinic's own published services
 * list, with explicit overrides where the text is misleading. Unknown or
 * skipped anatomy never hides anything (house rule).
 */

/** Overrides by clinic id, when the services text would mislead.
 *  california-cryobank lists "sperm/egg banking" but its patient-facing
 *  preservation services are sperm banking and donor sperm (its egg side is
 *  a donor-egg bank for recipients), so it is testes-only here per the
 *  2026-11-22 product decision. */
const ANATOMY_OVERRIDES: Record<string, Anatomy[]> = {
  "california-cryobank": ["testes"],
};

function servicesText(clinic: Clinic): string {
  const sv = (clinic as unknown as { services?: { value?: string[] | string } }).services;
  const v = sv?.value;
  if (Array.isArray(v)) return v.join(" ").toLowerCase();
  return typeof v === "string" ? v.toLowerCase() : "";
}

export function clinicFitsAnatomy(clinic: Clinic, anatomy?: Anatomy): boolean {
  if (!anatomy) return true;
  const override = ANATOMY_OVERRIDES[clinic.id];
  if (override) return override.includes(anatomy);
  const txt = servicesText(clinic);
  // Resources, education hubs, and clinics with unpublished services stay
  // visible to everyone; this gate is only for clearly single-sided clinics.
  if (!txt || txt.includes("not a clinic") || txt.includes("not_published")) return true;
  const spermSide = /sperm|male|tese|testicular/.test(txt);
  // IVF/embryo clinics treat couples, so they serve testes users too.
  const servesTestes = spermSide || /ivf|embryo|fertility preservation/.test(txt);
  const ovarySide = /egg|oocyte|ovar|ivf|embryo|iui|uter/.test(txt);
  if (anatomy === "ovaries_uterus") return ovarySide;
  if (anatomy === "testes") return servesTestes;
  return true;
}
