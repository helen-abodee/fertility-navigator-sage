"use client";

import { useState } from "react";
import { reflectionAttribution, reflectionIntro, reflectionSteps } from "../content/app/reflection";
import Cite from "./Cite";
import Icon from "./icons";

/**
 * The optional "thinking it through" path for "I'm not sure" about children.
 * Values clarification only: chip picks and sliders are local state, never
 * stored, never scored. Lives in the warm section-2 palette.
 */
export default function ReflectionFlow({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(-1); // -1 = offer screen
  const [chip, setChip] = useState<string | null>(null);
  const [scales, setScales] = useState<Record<string, number>>({});
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [ownWords, setOwnWords] = useState<Record<string, string>>({});

  if (step === -1) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-5 px-6 py-12">
        <span className="bg-accent-tint text-accent-ink animate-pop flex h-16 w-16 items-center justify-center rounded-full">
          <Icon name="compass" size={34} />
        </span>
        <h1 className="text-3xl">{reflectionIntro.heading}</h1>
        <p className="text-muted">{reflectionIntro.body}</p>
        <button
          type="button"
          onClick={() => setStep(0)}
          className="bg-accent text-accent-contrast min-h-14 rounded-xl px-6 py-4 text-lg font-bold"
        >
          {reflectionIntro.accept}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="border-line bg-card min-h-12 rounded-xl border px-4 py-3 font-bold"
        >
          {reflectionIntro.decline}
        </button>
      </main>
    );
  }

  const s = reflectionSteps[step];
  const last = step === reflectionSteps.length - 1;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 py-8">
      <div className="mb-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="text-accent-ink -ml-2 rounded-lg px-2 py-2 text-sm font-bold"
        >
          &larr; Back
        </button>
        <div className="flex gap-1.5" aria-label={`Thought ${step + 1} of ${reflectionSteps.length}`}>
          {reflectionSteps.map((_, i) => (
            <span key={i} className={`h-1.5 w-1.5 rounded-full ${i <= step ? "bg-accent" : "bg-line"}`} />
          ))}
        </div>
      </div>

      <p className="text-accent-ink text-xs font-bold tracking-widest uppercase">
        Thinking it through · {step + 1} of {reflectionSteps.length}
      </p>
      <h1 className="mt-1 text-2xl">{s.heading}</h1>
      <p className="mt-2 text-[1.02rem]">{s.body}</p>

      {s.chips && (
        <div className="mt-4 flex flex-col gap-2">
          {s.chips.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={chip === c}
              onClick={() => setChip(chip === c ? null : c)}
              className={`min-h-12 rounded-xl border-[1.5px] px-4 py-3 text-left font-bold ${
                chip === c ? "border-accent bg-accent-tint" : "border-line bg-card"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {s.prompts && (
        <div className="stagger mt-4 flex flex-col gap-3">
          {s.prompts.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={!!picked[p]}
              onClick={() => setPicked({ ...picked, [p]: !picked[p] })}
              className={`rounded-xl border-[1.5px] p-3 text-left text-[0.98rem] ${
                picked[p] ? "border-accent bg-accent-tint font-bold" : "border-line bg-card"
              }`}
            >
              {picked[p] ? "✓ " : ""}
              {p}
            </button>
          ))}
          <p className="text-muted text-xs">Tap the ones that land. Nothing is saved.</p>
        </div>
      )}

      {(s.id === "locate" || s.id === "meaning") && (
        <label className="mt-4 block">
          <span className="text-muted text-sm font-bold">Or put it in your own words</span>
          <textarea
            value={ownWords[s.id] ?? ""}
            onChange={(e) => setOwnWords({ ...ownWords, [s.id]: e.target.value })}
            rows={3}
            placeholder="Just for you. It disappears when you leave."
            className="border-line bg-card mt-1 w-full rounded-xl border-[1.5px] p-3 text-[0.95rem]"
          />
        </label>
      )}

      {s.scale && (
        <div className="mt-4 flex flex-col gap-4">
          {s.scale.map((item) => (
            <label key={item} className="block">
              <span className="text-[0.95rem] font-bold">{item}</span>
              <input
                type="range"
                min={0}
                max={5}
                value={scales[item] ?? 0}
                onChange={(e) => setScales({ ...scales, [item]: parseInt(e.target.value, 10) })}
                className="accent-[var(--accent)] mt-1 w-full"
                aria-label={item}
              />
            </label>
          ))}
          <p className="text-muted text-xs">0 means it barely matters, 5 means it matters a lot. Nothing is saved.</p>
        </div>
      )}

      <div className="mt-auto pt-6">
        <Cite citations={s.citations} />
        <button
          type="button"
          onClick={() => (last ? onDone() : setStep(step + 1))}
          className="bg-accent text-accent-contrast mt-3 min-h-14 w-full rounded-xl px-6 py-4 text-lg font-bold"
        >
          {last ? "I've thought about it, keep going" : "Next thought"}
        </button>
        {last && <p className="text-muted mt-3 text-xs">{reflectionAttribution}</p>}
      </div>
    </main>
  );
}
