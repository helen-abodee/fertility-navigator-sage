"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "../components/icons";
import { completeLinkSignIn } from "../lib/profile";

export default function Home() {
  const [agreed, setAgreed] = useState(false);
  // Probe for the optional artwork after mount: an <img onError> rendered at
  // hydration time can miss the error event entirely and leave a broken frame.
  const [hasArt, setHasArt] = useState(false);
  const router = useRouter();
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    const probe = new window.Image();
    probe.onload = () => setHasArt(true);
    probe.src = "/landing.jpg";
    completeLinkSignIn().then(setSignedIn);
  }, []);

  return (
    <main className="wash mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-10">
      {hasArt && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/landing.jpg" alt="" className="border-line mb-6 h-44 w-full rounded-2xl border object-cover" />
      )}

      {signedIn && (
        <p className="bg-accent-tint text-accent-ink mb-4 rounded-xl px-4 py-3 text-sm font-bold">
          Signed in. Return to your other tab and tap &ldquo;I opened the link&rdquo;, or continue here.
        </p>
      )}
      <p className="text-accent-ink text-xs font-bold tracking-[0.14em] uppercase">
        For young adults facing cancer
      </p>
      <h1 className="mt-2 text-[2.1rem] leading-[1.15]">
        Fertility decisions,
        <br />
        made clearer.
      </h1>
      <p className="text-muted mt-3 text-[1.02rem]">
        What treatment can change, what your options are, and what they cost. About ten minutes,
        at your pace.
      </p>

      <div className="mt-6 flex flex-col gap-2.5">
        {[
          { icon: "shield", text: "Nothing you answer leaves this device" },
          { icon: "clipboard", text: "Every fact cited to published guidelines" },
          { icon: "compass", text: "Never pushes you toward or away from anything" },
        ].map((row) => (
          <div key={row.text} className="flex items-center gap-3">
            <span className="bg-accent-tint text-accent-ink flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
              <Icon name={row.icon} size={16} />
            </span>
            <span className="text-[0.95rem]">{row.text}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        disabled={!agreed}
        onClick={() => router.push("/questions")}
        className={`mt-7 rounded-xl px-6 py-4 text-center text-lg font-bold ${
          agreed ? "bg-accent text-accent-contrast" : "bg-line text-muted cursor-not-allowed"
        }`}
      >
        Start
      </button>

      <label className="mt-4 flex items-center gap-2.5 text-sm">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="h-5 w-5 shrink-0 accent-[var(--accent)]"
        />
        <span className="leading-none">
          I've read the{" "}
          <a href="/privacy" target="_blank" className="text-accent-ink font-bold underline">
            privacy policy
          </a>
        </span>
      </label>
    </main>
  );
}
