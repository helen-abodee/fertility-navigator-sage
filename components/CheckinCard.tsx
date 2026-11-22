import { useState } from "react";
import { guidance } from "../content/app/guidance";
import { saveCheckin, type CheckinWord } from "../lib/checkin";
import Cite from "./Cite";

const COPY: Record<CheckinWord, { h: string; p: string }> = {
  steady: {
    h: "Good. Nothing needed from you.",
    p: "The road is where you left it. Come back whenever.",
  },
  wobbly: {
    h: "Wobbly is the honest answer most days.",
    p: "One small thing is written and waiting if you want it. Closing the app changes nothing.",
  },
  rough: {
    h: "Then today is not a fertility day.",
    p: "Being stuck is a phase, not a failure. The people below do this for a living.",
  },
};

/**
 * Three words, no scores, no history shown. The latest word is kept on the
 * device so the app can offer the right thing, and it rides along to the
 * care team only if the person set up sharing.
 */
export default function CheckinCard({ onReachOut }: { onReachOut: () => void }) {
  const [word, setWord] = useState<CheckinWord | null>(null);
  const stepBack = guidance.find((g) => g.id === "ok_to_step_back");

  return (
    <section className="border-line bg-card rounded-2xl border p-5">
      <h2 className="font-myth text-xl leading-tight">How are you carrying this?</h2>
      <p className="text-muted mt-1 text-sm">Only the latest answer is kept, on this device, and it changes what we offer, not a score.</p>
      <div className="mt-3 flex flex-col gap-2">
        {(["steady", "wobbly", "rough"] as const).map((w) => (
          <button
            key={w}
            type="button"
            aria-pressed={word === w}
            onClick={() => {
              setWord(w);
              saveCheckin(w);
            }}
            className={`min-h-12 rounded-xl border-[1.5px] px-4 text-left font-bold ${
              word === w ? "border-accent bg-accent-tint" : "border-line bg-card"
            }`}
          >
            {w === "steady" ? "Steady enough" : w === "wobbly" ? "Wobbly" : "Rough. This is a lot."}
          </button>
        ))}
      </div>
      {word && (
        <div className="mt-4">
          <p className="font-bold">{COPY[word].h}</p>
          <p className="text-muted mt-1 text-sm">{COPY[word].p}</p>
          {word === "rough" && stepBack && (
            <div className="mt-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={onReachOut}
                className="bg-accent text-accent-contrast min-h-12 rounded-xl px-4 font-bold"
              >
                Who can help, and how to reach them
              </button>
              <details className="border-line rounded-lg border px-4 py-3">
                <summary className="cursor-pointer list-none text-sm font-bold">
                  {stepBack.heading} <span className="text-accent-ink float-right">+</span>
                </summary>
                {stepBack.paragraphs.map((p, i) => (
                  <p key={i} className="mt-2 text-sm">{p.text}</p>
                ))}
                <Cite citations={stepBack.paragraphs.flatMap((p) => p.citations)} />
              </details>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
