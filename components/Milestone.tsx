"use client";

import Icon from "./icons";

/**
 * A breath between survey sections: marks the part just finished, names the
 * next one, carries the next section's palette. Celebration without confetti.
 */
export default function Milestone({
  icon,
  eyebrow,
  heading,
  body,
  cta,
  onContinue,
}: {
  icon: string;
  eyebrow: string;
  heading: string;
  body: string;
  cta: string;
  onContinue: () => void;
}) {
  return (
    <main className="wash mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-5 px-6 py-12">
      <span className="bg-accent-tint text-accent-ink animate-pop flex h-16 w-16 items-center justify-center rounded-full">
        <Icon name={icon} size={34} />
      </span>
      <p className="text-accent-ink text-xs font-bold tracking-widest uppercase">{eyebrow}</p>
      <h1 className="text-3xl">{heading}</h1>
      <p className="text-muted">{body}</p>
      <button
        type="button"
        onClick={onContinue}
        className="bg-accent text-accent-contrast mt-2 min-h-14 rounded-xl px-6 py-4 text-lg font-bold"
      >
        {cta}
      </button>
    </main>
  );
}
