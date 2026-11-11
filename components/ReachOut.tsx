"use client";

import { useEffect, useState } from "react";
import type { Clinic, TreatmentStage } from "../lib/types";
import type { GuidanceSection } from "../lib/content-schema";
import Cite from "./Cite";
import { contactHref } from "../lib/contact";
import { milesBetween, zipToCoords } from "../lib/distance";
import Icon from "./icons";

/**
 * The outreach hub: message your own care team, or draft the first message to
 * a fertility clinic without hunting for contact info. We prefill; the
 * patient edits and sends from their own phone. Clinic sites rarely publish
 * email, so the clinic path is draft + copy + call + website.
 */
export default function ReachOut({
  clinics,
  zip,
  stage,
  guidance = [],
  onClose,
}: {
  clinics: Clinic[];
  zip?: string | null;
  stage?: TreatmentStage;
  guidance?: GuidanceSection[];
  onClose: () => void;
}) {
  const [contact, setContact] = useState("");
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      setContact(localStorage.getItem("navigator.team-contact.v1") ?? "");
    } catch {
      /* fine */
    }
  }, []);

  const home = zip ? zipToCoords(zip) : null;
  const sorted = [...clinics].sort((a, b) => {
    const da = home && a.locations[0] ? milesBetween(home, a.locations[0]) : Infinity;
    const db = home && b.locations[0] ? milesBetween(home, b.locations[0]) : Infinity;
    return da - db;
  });

  // Tailored to the treatment stage from the survey, so the first message is
  // never wrong about where they are.
  function templateFor(c: Clinic): string {
    if (stage === "finished") {
      return `Hello, I finished cancer treatment and am interested in discussing fertility options. I would like to schedule a consultation at ${c.name}. Please let me know your next available appointments and what records I should bring. Thank you.`;
    }
    if (stage === "in_treatment") {
      return `Hello, I am currently in cancer treatment and would like to discuss fertility preservation options with a specialist. I would like to schedule an oncofertility consultation at ${c.name}. Please let me know your earliest availability. Thank you.`;
    }
    if (stage === "not_started") {
      return `Hello, I was recently diagnosed with cancer and my care team has advised discussing fertility preservation before treatment begins, so timing matters. I would like to schedule a new patient oncofertility consultation at ${c.name} as soon as possible. Please let me know your earliest availability. Thank you.`;
    }
    return `Hello, I am a cancer patient interested in fertility preservation. I would like to schedule an oncofertility consultation at ${c.name}. Please let me know your next available appointments. Thank you.`;
  }

  return (
    <div className="bg-paper fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Reach out">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 py-6">
        <button type="button" onClick={onClose} className="text-accent-ink -ml-2 self-start rounded-lg px-2 py-2 text-sm font-bold">
          &larr; Back
        </button>

        <div className="mt-2 flex items-center gap-3">
          <span className="bg-accent-tint text-accent-ink flex h-12 w-12 items-center justify-center rounded-full">
            <Icon name="heart" size={24} />
          </span>
          <h1 className="text-2xl">Reach out</h1>
        </div>

        <section className="border-line bg-card mt-5 rounded-2xl border p-4">
          <h2 className="text-lg">My care team</h2>
          {contact ? (
            <a
              href={contactHref(contact, "Hi, I'm using the fertility navigator and I have a question.")}
              className="bg-accent text-accent-contrast mt-2 block rounded-xl px-4 py-3 text-center font-bold"
            >
              Message my care team
            </a>
          ) : (
            <p className="text-muted mt-1 text-sm">
              Pick your care team member under My progress first, and this becomes a one-tap
              message.
            </p>
          )}
        </section>

        <section className="border-line bg-card mt-4 rounded-2xl border p-4">
          <h2 className="text-lg">A fertility clinic</h2>
          <p className="text-muted mt-1 text-sm">
            Pick one and we draft the first message, so the hardest part is already typed.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {sorted.slice(0, 6).map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={clinic?.id === c.id}
                onClick={() => {
                  setClinic(c);
                  setDraft(templateFor(c));
                }}
                className={`rounded-xl border-[1.5px] px-3 py-2.5 text-left text-sm font-bold ${
                  clinic?.id === c.id ? "border-accent bg-accent-tint" : "border-line bg-card"
                }`}
              >
                {c.name}
                {home && c.locations[0] && (
                  <span className="text-muted font-normal"> · {Math.round(milesBetween(home, c.locations[0]))} mi</span>
                )}
              </button>
            ))}
          </div>

          {clinic && (
            <div className="mt-4">
              <label className="text-muted text-xs font-bold tracking-widest uppercase">
                Your message, edit anything
              </label>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={6}
                className="border-line bg-paper mt-1 w-full rounded-xl border-[1.5px] p-3 text-[0.95rem]"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(draft);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    } catch {
                      /* visible to copy by hand */
                    }
                  }}
                  className="bg-accent text-accent-contrast rounded-xl px-4 py-2.5 text-sm font-bold"
                >
                  {copied ? "Copied ✓" : "Copy message"}
                </button>
                {clinic.phone && (
                  <a href={`tel:${clinic.phone.replace(/[^+\d]/g, "")}`} className="border-accent text-accent-ink rounded-xl border-[1.5px] px-4 py-2.5 text-sm font-bold">
                    Call {clinic.phone}
                  </a>
                )}
                <a href={clinic.website} target="_blank" rel="noreferrer" className="border-line bg-card rounded-xl border px-4 py-2.5 text-sm font-bold">
                  Their website
                </a>
              </div>
              <p className="text-muted mt-2 text-xs">
                Most clinics book by phone or a website form; paste your message there, or read it
                off when you call. Clinics rarely publish an email address, which is why we can't
                open one for you.
              </p>
            </div>
          )}
        </section>

        {guidance.length > 0 && (
          <section className="mt-5">
            <h2 className="text-lg">Common questions</h2>
            <div className="mt-2 flex flex-col gap-2">
              {guidance.map((g) => (
                <details key={g.id} className="border-line bg-card rounded-xl border px-4 py-3">
                  <summary className="cursor-pointer list-none font-bold">
                    {g.heading}
                    <span className="text-accent-ink float-right" aria-hidden="true">+</span>
                  </summary>
                  {g.paragraphs.map((p, i) => (
                    <div key={i} className="mt-2">
                      <p className="text-[0.95rem]">{p.text}</p>
                      <Cite citations={p.citations} />
                    </div>
                  ))}
                  {g.actions?.map((a, i) => (
                    <div key={i} className="border-line mt-3 border-t pt-3">
                      <p className="text-sm font-bold">{a.label}</p>
                      <p className="text-[0.9rem]">{a.detail}</p>
                      <Cite citations={a.citations} />
                    </div>
                  ))}
                </details>
              ))}
            </div>
          </section>
        )}

        <button type="button" onClick={onClose} className="border-line bg-card mt-6 min-h-12 rounded-xl border px-4 py-3 font-bold">
          Back
        </button>
      </div>
    </div>
  );
}
