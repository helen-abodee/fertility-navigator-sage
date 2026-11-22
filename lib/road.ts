import type { Answers } from "./types";
import type { Journey } from "./journey";

/**
 * The winding road: not a checklist, a landscape. Places are computed from
 * where the person stands on both journeys. Nothing is locked, nothing
 * expires, and minds are allowed to change (the outcome place says so).
 */

export type RoadGo =
  | { kind: "tab"; tab: string }
  | { kind: "reach" }
  | { kind: "progress" }
  | { kind: "reflect" }
  | { kind: "checkin" }
  | { kind: "none" };

export interface Place {
  id: string;
  label: string;
  sub: string;
  state: "done" | "here" | "open" | "far";
  go: RoadGo;
  /** side places sit off the road: optional, never sequential */
  side?: boolean;
}

export interface RoadNow {
  heading: string;
  body: string;
  cta: string;
  go: RoadGo;
}

export function buildRoad(
  answers: Answers,
  journey: Journey | null,
  riskLabel?: string,
): { places: Place[]; now: RoadNow } {
  const stage = answers.stage;
  const fert = answers.fertilityPosition ?? undefined;
  const outcome = journey?.outcome ?? null;
  const preserved = fert === "preserved" || outcome === "completed";
  const notPursuing = fert === "not_pursuing" || outcome === "decided_not_to";
  const after = stage === "finished";
  const during = stage === "in_treatment";

  const places: Place[] = [];

  if (after) {
    places.push({ id: "behind", label: "Treatment, behind you", sub: "the hardest road already walked", state: "done", go: { kind: "none" } });
    if (preserved) {
      places.push({ id: "preserved", label: "Preserved", sub: "your frozen chances, waiting", state: "done", go: { kind: "tab", tab: "options" } });
    } else {
      places.push({
        id: "specialist", label: "A specialist, first", sub: "one visit runs every test; urgent slots exist",
        state: fert === "family_building" ? "done" : "here", go: { kind: "reach" },
      });
    }
    places.push({
      id: "family", label: "Family building", sub: "six paths, none ranked",
      state: fert === "family_building" ? "here" : "open", go: { kind: "tab", tab: "parenthood" },
    });
    places.push({ id: "money", label: "The money part", sub: "coverage, aid, real prices", state: "open", go: { kind: "tab", tab: "money" } });
    places.push({
      id: "outcome", label: "Whatever you choose", sub: "three real answers, and minds change",
      state: notPursuing ? "here" : "far", go: { kind: "progress" },
    });
  } else {
    places.push({ id: "start", label: "Where you started", sub: "the facts are in", state: "done", go: { kind: "none" } });
    places.push({
      id: "risk", label: "Your risk group", sub: riskLabel ? riskLabel : "a guideline group, not a prediction",
      state: riskLabel ? "done" : "open", go: { kind: "progress" },
    });
    places.push({
      id: "decide", label: "The decision", sub: "options, side by side, honestly priced",
      state: preserved || notPursuing ? "done" : during ? "open" : "here", go: { kind: "tab", tab: "options" },
    });
    if (answers.feelings !== "no") {
      places.push({ id: "money", label: "The money part", sub: "coverage, aid, real prices", state: "open", go: { kind: "tab", tab: "money" } });
    }
    places.push({
      id: "clinic", label: "A clinic, if you choose", sub: "the first message is already written",
      state: preserved ? "done" : "open", go: { kind: "reach" },
    });
    places.push({
      id: "treatment", label: "Treatment", sub: during
        ? "your only job right now; this road waits"
        : "when it starts, this road waits with you",
      state: during ? "here" : "far", go: { kind: "checkin" },
    });
    places.push({ id: "after", label: "After", sub: "a specialist first, then every path to a family", state: "far", go: { kind: "none" } });
  }

  // Side places: never sequential, always open.
  places.push({ id: "reflect", label: "Children, someday?", sub: "a quiet walk through the question", state: "open", go: { kind: "reflect" }, side: true });
  places.push({ id: "support", label: "Company", sub: "how you're carrying it", state: "open", go: { kind: "checkin" }, side: true });

  // The "right now" card.
  let now: RoadNow;
  if (during) {
    now = {
      heading: "Your only job right now is treatment",
      body: "Fertility can still be thought about in quiet minutes, one small question at a time, so the decision is ready when you are.",
      cta: "One small question",
      go: { kind: "reflect" },
    };
  } else if (after && !preserved && fert !== "family_building") {
    now = {
      heading: "One referral starts everything",
      body: "Ask your care team for a fertility specialist referral. They run all the tests in one visit, and many clinics hold urgent slots for cancer patients.",
      cta: "Get the message ready",
      go: { kind: "reach" },
    };
  } else if (after) {
    now = {
      heading: "Six paths to a family",
      body: "Using what you froze, trying, donors, a carrier, adoption, or a full life without children. None ranked above another.",
      cta: "See the paths",
      go: { kind: "tab", tab: "parenthood" },
    };
  } else if (notPursuing) {
    now = {
      heading: "You've answered it, for now",
      body: "Not preserving is a real answer, and this road runs both ways if anything shifts.",
      cta: "Where I landed",
      go: { kind: "progress" },
    };
  } else {
    now = {
      heading: "See what your options really are",
      body: "Seven methods, every fact cited, none pushed on you.",
      cta: "Open the options",
      go: { kind: "tab", tab: "options" },
    };
  }

  return { places, now };
}
