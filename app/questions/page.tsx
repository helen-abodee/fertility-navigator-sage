"use client";

import { useEffect, useState } from "react";
import type { Answers, QuestionId } from "../../lib/types";
import { nextQuestion, prevQuestion, questionSequence, sectionOf } from "../../lib/flow";
import { questions } from "../../lib/questions";
import { regimensFor } from "../../lib/crisp";
import { buildResults } from "../../lib/results";
import { assessRisk } from "../../lib/risk";
import { appContent } from "../../content/app/content";
import clinicsData from "../../data/clinics.json";
import type { Clinic } from "../../lib/types";
import { eraseEverything, loadProgress, saveProgress } from "../../lib/storage";
import { track } from "../../lib/analytics";
import QuestionScreen from "../../components/QuestionScreen";
import ProfileNudge from "../../components/ProfileNudge";
import { profilesEnabled } from "../../lib/profile";
import Milestone from "../../components/Milestone";
import ReflectionFlow from "../../components/ReflectionFlow";
import RiskReveal from "../../components/RiskReveal";
import ResultsView from "../../components/ResultsView";

type Screen = QuestionId | "milestone_2" | "milestone_3" | "reflection" | "risk_reveal"
  | "save_gate" | "results";

export default function QuestionsPage() {
  const [answers, setAnswers] = useState<Answers>({});
  const [current, setCurrent] = useState<Screen>("entry");
  const [saveOptIn, setSaveOptIn] = useState(false);
  const [resumeOffer, setResumeOffer] = useState<{ answers: Answers; current: string } | null>(null);

  useEffect(() => {
    const saved = loadProgress();
    if (saved) setResumeOffer(saved);
    track("app_open");
    track("survey_start");
  }, []);

  useEffect(() => {
    if (saveOptIn) saveProgress(answers, current);
  }, [answers, current, saveOptIn]);

  function startOver() {
    eraseEverything();
    setAnswers({});
    setSaveOptIn(false);
    setCurrent("entry");
  }

  function advance(nextAnswers: Answers, from: QuestionId) {
    // "I'm not sure" about children: offer the thinking-it-through path first.
    if (from === "feelings" && (nextAnswers.feelings === "not_sure" || nextAnswers.feelings === "maybe")) {
      track("reflection_start");
      setCurrent("reflection");
      return;
    }
    const next = nextQuestion(nextAnswers, from);
    if (next === "results") {
      // "Just learning" browses the hub directly, skipping the risk screen.
      track("survey_complete");
      if (nextAnswers.entry !== "exploring") track("risk_viewed");
      setCurrent(nextAnswers.entry === "exploring" ? "results" : profilesEnabled ? "save_gate" : "risk_reveal");
      return;
    }
    // A breath between sections.
    const fromSection = sectionOf(from);
    const toSection = sectionOf(next);
    if (toSection === 2 && fromSection === 1) {
      setCurrent("milestone_2");
      return;
    }
    if (toSection === 3 && fromSection === 2) {
      setCurrent("milestone_3");
      return;
    }
    setCurrent(next);
  }

  if (resumeOffer) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 px-6 py-12">
        <h1 className="text-2xl">Pick up where you left off?</h1>
        <button
          type="button"
          className="bg-accent text-accent-contrast min-h-14 rounded-xl px-4 py-4 text-lg font-bold"
          onClick={() => {
            setAnswers(resumeOffer.answers);
            setCurrent(resumeOffer.current as Screen);
            setSaveOptIn(true);
            setResumeOffer(null);
          }}
        >
          Continue
        </button>
        <button
          type="button"
          className="border-line bg-card min-h-12 rounded-xl border px-4 py-3 font-bold"
          onClick={() => {
            eraseEverything();
            setResumeOffer(null);
          }}
        >
          Start fresh and erase the saved answers
        </button>
      </main>
    );
  }

  if (current === "milestone_2") {
    return (
      <div data-survey-section="2" className="bg-paper min-h-dvh">
        <Milestone
          icon="sprout"
          eyebrow="The medical part is done"
          onBack={() => {
            const qs = questionSequence(answers).filter((q) => sectionOf(q) === 1);
            if (qs.length) setCurrent(qs[qs.length - 1]);
          }}
          heading="Now the part that's about you"
          body="One question, and there is no wrong answer to it."
          cta="Keep going"
          onContinue={() => {
            const seq = questionSequence(answers);
            const next = seq.find((q) => sectionOf(q) === 2);
            setCurrent(next ?? "risk_reveal");
          }}
        />
      </div>
    );
  }

  if (current === "milestone_3") {
    return (
      <div data-survey-section="3" className="bg-paper min-h-dvh">
        <Milestone
          icon="dollar"
          eyebrow="Almost there"
          onBack={() => {
            const qs = questionSequence(answers).filter((q) => sectionOf(q) === 2);
            if (qs.length) setCurrent(qs[qs.length - 1]);
            else setCurrent("milestone_2");
          }}
          heading="Last stretch: the practical side"
          body="Insurance and location, so the results can talk money and places. Still skippable."
          cta="Finish up"
          onContinue={() => {
            const seq = questionSequence(answers);
            const next = seq.find((q) => sectionOf(q) === 3);
            setCurrent(next ?? "risk_reveal");
          }}
        />
      </div>
    );
  }

  if (current === "reflection") {
    return (
      <div data-survey-section="2" className="bg-paper min-h-dvh">
        <ReflectionFlow
          onDone={() => {
            const next = nextQuestion(answers, "feelings");
            if (next === "results") setCurrent("risk_reveal");
            else setCurrent("milestone_3");
          }}
        />
      </div>
    );
  }

  if (current === "save_gate") {
    return (
      <main className="wash mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-5 px-6 py-12">
        <h1 className="font-myth text-3xl">Before your results</h1>
        <p className="text-muted -mt-3 text-sm">Save them to your email and pick up on any device. Optional, always.</p>
        <ProfileNudge answers={answers} onSaved={() => setCurrent("risk_reveal")} />
        <button
          type="button"
          onClick={() => setCurrent("risk_reveal")}
          className="border-line bg-card min-h-12 rounded-xl border px-4 font-bold"
        >
          Not now, show my results
        </button>
      </main>
    );
  }

  if (current === "risk_reveal") {
    return (
      <RiskReveal
        risk={assessRisk(answers)}
        answers={answers}
        onContinue={() => setCurrent("results")}
        onBack={() => {
          const qs = questionSequence(answers);
          if (qs.length) setCurrent(qs[qs.length - 1]);
        }}
      />
    );
  }

  if (current === "results") {
    return (
      <ResultsView
        results={buildResults(answers, appContent)}
        risk={assessRisk(answers)}
        clinics={clinicsData as unknown as Clinic[]}
        insurance={answers.insurance}
        stage={answers.stage}
        feelings={answers.feelings}
        fertilityPosition={answers.fertilityPosition}
        familySize={answers.familySize}
        age={answers.age}
        anatomy={answers.anatomy}
        zip={answers.zip}
        browsing={answers.entry === "exploring"}
        onStartOver={startOver}
      />
    );
  }

  const baseDef = questions[current];
  const def =
    current === "fertility_position" && answers.entry === "finished"
      ? {
          ...baseDef,
          options: [
            (baseDef.options ?? [])[0],
            { value: "preserved", label: "Already preserved (eggs, sperm, or embryos)", icon: "snowflake" },
            { value: "family_building", label: "Thinking about building a family", icon: "sprout" },
            (baseDef.options ?? [])[1],
          ],
        }
      : current === "chemo_regimen"
      ? {
          ...baseDef,
          options: [
            ...regimensFor(answers.cancerType).map((r) => ({ value: r, label: r })),
            { value: "not_sure", label: "I don't know the name", notSure: true },
          ],
        }
      : baseDef;
  const seq = questionSequence(answers);
  const section = sectionOf(current);
  const currentIdx = Math.max(0, seq.indexOf(current as QuestionId));
  // How far through each section this person is, for the rail's filling bars.
  const sectionFill = [1, 2, 3].map((n) => {
    const idxs = seq.map((q, i) => ({ q, i })).filter((x) => sectionOf(x.q) === n);
    if (idxs.length === 0) return section > n ? 1 : 0;
    if (section > n) return 1;
    if (section < n) return 0;
    const done = idxs.filter((x) => x.i < currentIdx).length;
    return done / idxs.length;
  });

  function answer(value: unknown) {
    const nextAnswers = { ...answers, [def.field]: value } as Answers;
    // Entry triage implies the treatment stage.
    if (def.id === "entry") {
      if (value === "plan_no") nextAnswers.stage = "not_started";
      if (value === "finished") nextAnswers.stage = "finished";
      if (value === "plan_yes") nextAnswers.stage = "in_treatment";
    }
    setAnswers(nextAnswers);
    advance(nextAnswers, current as QuestionId);
  }

  return (
    <div data-survey-section={section} className="bg-paper min-h-dvh">
      <QuestionScreen
        def={def}
        stepIndex={Math.max(0, seq.indexOf(current as QuestionId))}
        stepCount={seq.length}
        section={section}
        sectionFill={sectionFill}
        onJumpSection={(n) => {
          if (n > section) return;
          const q = seq.find((x) => sectionOf(x) === n);
          if (q) setCurrent(q);
        }}
        initialValue={answers[def.field]}
        onAnswer={answer}
        onSkip={def.skippable ? () => answer(def.kind === "number" ? undefined : null) : undefined}
        onBack={
          prevQuestion(answers, current as QuestionId)
            ? () => setCurrent(prevQuestion(answers, current as QuestionId)!)
            : null
        }
      />
      <div className="mx-auto max-w-md px-6 pb-8">
        <label className="text-muted flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={saveOptIn}
            onChange={(e) => {
              setSaveOptIn(e.target.checked);
              if (!e.target.checked) eraseEverything();
            }}
          />
          Save my progress on this device only
        </label>
      </div>
    </div>
  );
}
