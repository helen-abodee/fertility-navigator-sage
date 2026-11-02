import type { AppContent } from "../../lib/content-schema";
import { aid } from "./aid";
import { guidance } from "./guidance";
import { health } from "./health";
import { options } from "./options";
import { doctorQuestions } from "./questions";

export { aid } from "./aid";
export { guidance } from "./guidance";
export { health } from "./health";
export { options } from "./options";
export { doctorQuestions } from "./questions";

export const appContent: AppContent = {
  options,
  guidance,
  aid,
  doctorQuestions,
  health,
  lastReviewed: "2026-10-30",
};
