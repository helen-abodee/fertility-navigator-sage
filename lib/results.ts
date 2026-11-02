import type { Answers } from "./types";
import type {
  AidOrg,
  AppContent,
  Audience,
  DoctorQuestion,
  GuidanceSection,
  HealthNote,
  PreservationOption,
} from "./content-schema";

/**
 * Audience matching, anti-anxiety rule: a missing, skipped, or "not sure"
 * answer NEVER hides content. Restrictions only apply when the person gave a
 * definite answer that falls outside the audience.
 */
export function matchesAudience(audience: Audience, answers: Answers): boolean {
  if (audience.anatomy && answers.anatomy && answers.anatomy !== "prefer_not_to_say" && answers.anatomy !== "self_describe") {
    if (!audience.anatomy.includes(answers.anatomy)) return false;
  }
  if (audience.stages && answers.stage && answers.stage !== "not_sure") {
    if (!audience.stages.includes(answers.stage)) return false;
  }
  if (audience.treatments && answers.treatments && answers.treatments.length > 0 && !answers.treatments.includes("not_sure")) {
    if (!audience.treatments.some((t) => answers.treatments!.includes(t))) return false;
  }
  if (audience.insurance && answers.insurance && answers.insurance !== "unknown") {
    if (!audience.insurance.includes(answers.insurance)) return false;
  }
  if (audience.partnered !== undefined && answers.whoFor) {
    const partnered = answers.whoFor === "me_and_partner";
    if (audience.partnered !== partnered) return false;
  }
  return true;
}

export interface Results {
  options: PreservationOption[];
  guidance: GuidanceSection[];
  aid: AidOrg[];
  doctorQuestions: DoctorQuestion[];
  health: HealthNote[];
  /** finished treatment: results lead with testing and current options */
  survivorSpine: boolean;
  lastReviewed: string;
}

export function buildResults(answers: Answers, content: AppContent): Results {
  return {
    options: content.options.filter((o) => matchesAudience(o.audience, answers)),
    guidance: content.guidance.filter((g) => matchesAudience(g.audience, answers)),
    aid: content.aid.filter((a) => matchesAudience(a.audience, answers)),
    doctorQuestions: content.doctorQuestions.filter((q) => matchesAudience(q.audience, answers)),
    health: content.health.filter((h) => matchesAudience(h.audience, answers)),
    survivorSpine: answers.stage === "finished",
    lastReviewed: content.lastReviewed,
  };
}
