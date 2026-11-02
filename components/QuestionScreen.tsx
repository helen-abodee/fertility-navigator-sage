"use client";

import { useEffect, useState } from "react";
import type { QuestionDef } from "../lib/questions";
import Icon from "./icons";

interface Props {
  def: QuestionDef;
  stepIndex: number;
  stepCount: number;
  initialValue?: unknown;
  onAnswer: (value: unknown) => void;
  onSkip?: () => void;
  onBack: (() => void) | null;
}

export default function QuestionScreen({
  def,
  stepIndex,
  stepCount,
  initialValue,
  onAnswer,
  onSkip,
  onBack,
}: Props) {
  const [text, setText] = useState<string>(
    typeof initialValue === "string" || typeof initialValue === "number" ? String(initialValue) : "",
  );
  const [multi, setMulti] = useState<string[]>(Array.isArray(initialValue) ? (initialValue as string[]) : []);

  useEffect(() => {
    setText(typeof initialValue === "string" || typeof initialValue === "number" ? String(initialValue) : "");
    setMulti(Array.isArray(initialValue) ? (initialValue as string[]) : []);
  }, [def.id, initialValue]);

  function toggleMulti(value: string) {
    setMulti((prev) => {
      // "not sure" clears specific picks, and picking something clears "not sure"
      if (value === "not_sure") return prev.includes("not_sure") ? [] : ["not_sure"];
      const without = prev.filter((v) => v !== value && v !== "not_sure");
      return prev.includes(value) ? without : [...without, value];
    });
  }

  function submitText() {
    if (def.kind === "number") {
      const n = parseInt(text, 10);
      onAnswer(Number.isFinite(n) ? n : undefined);
    } else {
      onAnswer(text.trim() === "" ? null : text.trim());
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 py-8">
      <div className="mb-5 flex items-center justify-between">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="text-accent-ink -ml-2 rounded-lg px-2 py-2 text-sm font-bold"
          >
            &larr; Back
          </button>
        ) : (
          <span />
        )}
        <div className="flex gap-1.5" aria-label={`Question ${stepIndex + 1} of ${stepCount}`}>
          {Array.from({ length: stepCount }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${i <= stepIndex ? "bg-accent" : "bg-line"}`}
            />
          ))}
        </div>
      </div>

      <h1 className="text-2xl">
        {def.heading}
        {def.optional && <span className="text-muted ml-2 align-middle text-sm font-normal">optional</span>}
      </h1>

      <div className="mt-6 flex flex-col gap-3">
        {def.kind === "single" &&
          def.options?.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onAnswer(opt.value)}
              className={`flex min-h-14 items-center gap-3 rounded-xl border-[1.5px] px-4 py-4 text-left text-[1.02rem] font-bold ${
                initialValue === opt.value
                  ? "border-accent bg-accent-tint"
                  : "border-line bg-card"
              } ${opt.notSure ? "border-dashed font-normal" : ""}`}
            >
              {opt.icon && (
                <span className="bg-accent-tint text-accent-ink flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                  <Icon name={opt.icon} size={20} />
                </span>
              )}
              <span>{opt.label}</span>
            </button>
          ))}

        {def.kind === "multi" && (
          <>
            {def.options?.map((opt) => {
              const on = multi.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleMulti(opt.value)}
                  className={`flex min-h-14 items-center gap-3 rounded-xl border-[1.5px] px-4 py-4 text-left text-[1.02rem] font-bold ${
                    on ? "border-accent bg-accent-tint" : "border-line bg-card"
                  } ${opt.notSure ? "border-dashed font-normal" : ""}`}
                >
                  {opt.icon && (
                    <span className="bg-accent-tint text-accent-ink flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                      <Icon name={opt.icon} size={20} />
                    </span>
                  )}
                  <span>
                    {on ? "✓ " : ""}
                    {opt.label}
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => onAnswer(multi)}
              className="bg-accent text-accent-contrast mt-2 min-h-14 rounded-xl px-4 py-4 text-lg font-bold"
            >
              Continue
            </button>
          </>
        )}

        {(def.kind === "number" || def.kind === "text") && (
          <>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitText()}
              inputMode={def.inputMode}
              placeholder={def.placeholder}
              aria-label={def.heading}
              className="border-line bg-card min-h-14 rounded-xl border-[1.5px] px-4 py-4 text-[1.1rem]"
            />
            <button
              type="button"
              onClick={submitText}
              className="bg-accent text-accent-contrast min-h-14 rounded-xl px-4 py-4 text-lg font-bold"
            >
              Continue
            </button>
          </>
        )}

        {def.skippable && onSkip && (
          <button type="button" onClick={onSkip} className="text-muted mt-1 py-2 text-sm underline">
            Skip this question
          </button>
        )}
      </div>

    </div>
  );
}
