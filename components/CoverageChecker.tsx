"use client";

import { useState } from "react";
import type { CoverageInput } from "../lib/coverage";
import { assessCoverage } from "../lib/coverage";
import { coverageForState, US_STATES } from "../content/app/state-coverage";
import type { InsuranceType, TreatmentStage } from "../lib/types";
import Cite from "./Cite";
import { track } from "../lib/analytics";

/**
 * Granular coverage walkthrough: a few taps, then a likely-coverage verdict
 * with personalized next steps. Never asks for IDs or plan names.
 */

type Phase = "channel" | "state" | "which_state" | "funding" | "size" | "military" | "verdict";

const chip =
  "border-line bg-card rounded-full border-[1.5px] px-4 py-2.5 text-sm font-bold text-left";

function prefillChannel(insurance?: InsuranceType): CoverageInput["channel"] | undefined {
  if (insurance === "medi_cal") return "medi_cal";
  if (insurance === "none") return "none";
  return undefined;
}

export default function CoverageChecker({
  insurance,
  stage,
}: {
  insurance?: InsuranceType;
  stage?: TreatmentStage;
}) {
  const pre = prefillChannel(insurance);
  const [input, setInput] = useState<CoverageInput>({ stage, channel: pre });
  const [phase, setPhase] = useState<Phase>(pre ? "verdict" : "channel");

  function pickChannel(channel: NonNullable<CoverageInput["channel"]> | "military" | "parent_spouse") {
    if (channel === "military") {
      setPhase("military");
      return;
    }
    const mapped = channel === "parent_spouse" ? "job" : channel;
    const next: CoverageInput = { ...input, channel: mapped };
    setInput(next);
    if (mapped === "job") setPhase("state");
    else if (mapped === "covered_ca" || mapped === "self_bought") setPhase("state");
    else setPhase("verdict");
  }

  function pickState(v: "yes" | "no" | "unknown") {
    const next = { ...input, basedInCalifornia: v };
    setInput(next);
    if (v === "no") setPhase("which_state");
    else if (next.channel === "job") setPhase("funding");
    else setPhase("verdict");
  }

  function pickPlanState(abb: string) {
    const next = { ...input, planState: abb || undefined };
    setInput(next);
    if (next.channel === "job" && abb && coverageForState(abb)) setPhase("funding");
    else setPhase("verdict");
  }

  function pickFunding(v: NonNullable<CoverageInput["funding"]>) {
    const next = { ...input, funding: v };
    setInput(next);
    if (v === "fully_insured" && stage === "finished") setPhase("size");
    else setPhase("verdict");
  }

  function pickSize(v: NonNullable<CoverageInput["employerSize"]>) {
    setInput({ ...input, employerSize: v });
    setPhase("verdict");
  }

  function restart() {
    setInput({ stage });
    setPhase("channel");
  }

  if (phase === "verdict") {
    track("coverage_checked");
    const v = assessCoverage(input);
    const chipStyle =
      v.verdict === "likely_covered"
        ? "bg-accent text-accent-contrast"
        : v.verdict === "depends"
          ? "bg-accent-tint text-accent-ink"
          : "bg-line text-ink";
    return (
      <div>
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${chipStyle}`}>
          {v.verdict === "likely_covered"
            ? "Likely covered"
            : v.verdict === "depends"
              ? "Depends, here's how to find out"
              : "Likely not covered"}
        </span>
        <p className="mt-2 text-lg font-bold">{v.headline}</p>
        <p className="mt-1 text-[0.95rem]">{v.body}</p>
        <ol className="stagger mt-3 flex flex-col gap-2">
          {v.steps.map((s, i) => (
            <li key={i} className="border-line border-l-2 pl-3">
              <p className="text-[0.95rem] font-bold">{s.label}</p>
              {s.detail && <p className="text-muted text-sm">{s.detail}</p>}
            </li>
          ))}
        </ol>
        <Cite citations={v.citations} />
        <button type="button" onClick={restart} className="text-accent-ink mt-3 text-sm font-bold underline">
          Check a different plan
        </button>
      </div>
    );
  }

  return (
    <div>
      {phase === "channel" && (
        <>
          <p className="font-bold">How do you get your insurance?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className={chip} onClick={() => pickChannel("job")}>My job</button>
            <button type="button" className={chip} onClick={() => pickChannel("parent_spouse")}>A parent's or partner's job</button>
            <button type="button" className={chip} onClick={() => pickChannel("covered_ca")}>I bought it, or Covered California</button>
            <button type="button" className={chip} onClick={() => pickChannel("medi_cal")}>Medi-Cal</button>
            <button type="button" className={chip} onClick={() => pickChannel("medicare")}>Medicare</button>
            <button type="button" className={chip} onClick={() => pickChannel("military")}>Military</button>
            <button type="button" className={chip} onClick={() => pickChannel("federal")}>Federal employee plan</button>
            <button type="button" className={chip} onClick={() => pickChannel("none")}>No insurance</button>
            <button type="button" className={chip} onClick={() => pickChannel("unknown")}>I don't know</button>
          </div>
        </>
      )}
      {phase === "military" && (
        <>
          <p className="font-bold">Are you the service member?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className={chip} onClick={() => { setInput({ ...input, channel: "military_active" }); setPhase("verdict"); }}>Yes</button>
            <button type="button" className={chip} onClick={() => { setInput({ ...input, channel: "military_dependent" }); setPhase("verdict"); }}>No, a family member is</button>
          </div>
        </>
      )}
      {phase === "state" && (
        <>
          <p className="font-bold">Is the plan based in California?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className={chip} onClick={() => pickState("yes")}>Yes</button>
            <button type="button" className={chip} onClick={() => pickState("no")}>No, another state</button>
            <button type="button" className={chip} onClick={() => pickState("unknown")}>Not sure</button>
          </div>
        </>
      )}
      {phase === "which_state" && (
        <>
          <p className="font-bold">Which state is the plan based in?</p>
          <p className="text-muted mt-1 text-sm">The state on your insurance card or plan documents, not where you live.</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <select
              aria-label="Plan state"
              defaultValue=""
              onChange={(e) => { if (e.target.value) pickPlanState(e.target.value); }}
              className="border-line bg-card min-h-12 rounded-xl border px-3 text-sm"
            >
              <option value="" disabled>Pick a state</option>
              {US_STATES.map((st) => (
                <option key={st.abb} value={st.abb}>{st.name}</option>
              ))}
            </select>
            <button type="button" className={chip} onClick={() => pickPlanState("")}>I don't know</button>
          </div>
        </>
      )}
      {phase === "funding" && (
        <>
          <p className="font-bold">Is the plan self-funded or fully insured?</p>
          <p className="text-muted mt-1 text-sm">HR answers this routinely. It decides whether the state coverage law applies.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className={chip} onClick={() => pickFunding("fully_insured")}>Fully insured</button>
            <button type="button" className={chip} onClick={() => pickFunding("self_funded")}>Self-funded</button>
            <button type="button" className={chip} onClick={() => pickFunding("unknown")}>I don't know</button>
          </div>
        </>
      )}
      {phase === "size" && (
        <>
          <p className="font-bold">Roughly how big is the employer?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className={chip} onClick={() => pickSize("large")}>Large (HR calls it large group)</button>
            <button type="button" className={chip} onClick={() => pickSize("small")}>Small (small group)</button>
            <button type="button" className={chip} onClick={() => pickSize("unknown")}>I don't know</button>
          </div>
        </>
      )}
    </div>
  );
}
