"use client";

import { useEffect, useState } from "react";
import type { Answers, QuestionId } from "../../lib/types";
import { nextQuestion, prevQuestion, questionSequence } from "../../lib/flow";
import { questions } from "../../lib/questions";
import { buildResults } from "../../lib/results";
import { appContent } from "../../content/app/content";
import { eraseEverything, loadProgress, saveProgress } from "../../lib/storage";
import QuestionScreen from "../../components/QuestionScreen";
import ResultsView from "../../components/ResultsView";

export default function QuestionsPage() {
  const [answers, setAnswers] = useState<Answers>({});
  const [current, setCurrent] = useState<QuestionId | "results">("who_for");
  const [saveOptIn, setSaveOptIn] = useState(false);
  const [resumeOffer, setResumeOffer] = useState<{ answers: Answers; current: string } | null>(null);

  useEffect(() => {
    const saved = loadProgress();
    if (saved) setResumeOffer(saved);
  }, []);

  useEffect(() => {
    if (saveOptIn) saveProgress(answers, current);
  }, [answers, current, saveOptIn]);

  function startOver() {
    eraseEverything();
    setAnswers({});
    setSaveOptIn(false);
    setCurrent("who_for");
  }

  if (resumeOffer) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-6 py-12">
        <h1 className="text-2xl">Pick up where you left off?</h1>
        <p className="text-muted">You saved your progress on this device earlier.</p>
        <button
          type="button"
          className="bg-accent text-accent-contrast min-h-14 rounded-xl px-4 py-4 text-lg font-bold"
          onClick={() => {
            setAnswers(resumeOffer.answers);
            setCurrent(resumeOffer.current as QuestionId | "results");
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

  if (current === "results") {
    return <ResultsView results={buildResults(answers, appContent)} onStartOver={startOver} />;
  }

  const def = questions[current];
  const seq = questionSequence(answers);

  function answer(value: unknown) {
    const nextAnswers = { ...answers, [def.field]: value } as Answers;
    setAnswers(nextAnswers);
    setCurrent(nextQuestion(nextAnswers, current as QuestionId));
  }

  return (
    <>
      <QuestionScreen
        def={def}
        stepIndex={Math.max(0, seq.indexOf(current))}
        stepCount={seq.length}
        initialValue={answers[def.field]}
        onAnswer={answer}
        onSkip={def.skippable ? () => answer(def.kind === "number" ? undefined : null) : undefined}
        onBack={
          prevQuestion(answers, current)
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
    </>
  );
}
