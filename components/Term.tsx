import { useState, type ReactNode } from "react";

/** Medical words get a tap-to-explain, right in the sentence. */
const GLOSSARY: Record<string, string> = {
  amenorrhea: "When monthly periods stop. It can be temporary or permanent.",
  azoospermia: "When there is no sperm in the semen.",
  iatrogenic: "Caused by a medical treatment.",
  oncofertility: "Fertility care for people with cancer.",
};

function Term({ word }: { word: string }) {
  const [open, setOpen] = useState(false);
  const key = word.toLowerCase().replace(/[^a-z]/g, "");
  return (
    <span className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="text-accent-ink cursor-pointer underline decoration-dotted underline-offset-2"
      >
        {word}
      </button>
      {open && (
        <span className="border-line bg-card absolute bottom-full left-0 z-10 mb-1 block w-56 rounded-lg border p-2 text-sm shadow-[var(--shadow)]">
          {GLOSSARY[key]}
        </span>
      )}
    </span>
  );
}

/** Splits a sentence and wraps any glossary word in a tappable Term. */
export function withGlossary(text: string): ReactNode {
  const words = Object.keys(GLOSSARY).join("|");
  const parts = text.split(new RegExp(`(${words})`, "gi"));
  if (parts.length === 1) return text;
  return parts.map((p, i) =>
    GLOSSARY[p.toLowerCase().replace(/[^a-z]/g, "")] ? <Term key={i} word={p} /> : p,
  );
}
