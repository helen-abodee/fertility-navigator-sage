"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-8 px-6 py-12">
      <h1 className="text-4xl">Future fertility, on your terms</h1>

      <button
        type="button"
        disabled={!agreed}
        onClick={() => router.push("/questions")}
        className={`rounded-xl px-6 py-4 text-center text-lg font-bold ${
          agreed
            ? "bg-accent text-accent-contrast"
            : "bg-line text-muted cursor-not-allowed"
        }`}
      >
        Start
      </button>

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 h-5 w-5 accent-[var(--accent)]"
        />
        <span>
          I've read the{" "}
          <a href="/privacy" target="_blank" className="text-accent-ink font-bold underline">
            privacy policy
          </a>
        </span>
      </label>
    </main>
  );
}
