"use client";

import { useEffect, useState } from "react";
import type { Journey } from "../lib/journey";
import {
  emptyJourney,
  journeyOutcomes,
  journeyStages,
  setOutcome,
  summaryLines,
  toggleStage,
} from "../lib/journey";
import { loadJourney, saveJourney } from "../lib/storage";

const CONTACT_KEY = "navigator.team-contact.v1";

function loadContact(): string {
  try {
    return localStorage.getItem(CONTACT_KEY) ?? "";
  } catch {
    return "";
  }
}

function saveContact(v: string) {
  try {
    localStorage.setItem(CONTACT_KEY, v);
  } catch {
    /* in-memory only */
  }
}

/** sms: for phone-looking contacts, mailto: otherwise. Patient-initiated,
 * through their own messenger; nothing routes through us. */
function contactHref(contact: string, body: string): string {
  const isPhone = /^[+\d][\d\s().-]{6,}$/.test(contact.trim());
  if (isPhone) return `sms:${contact.replace(/[^+\d]/g, "")}?&body=${encodeURIComponent(body)}`;
  return `mailto:${contact.trim()}?subject=${encodeURIComponent("A question about fertility preservation")}&body=${encodeURIComponent(body)}`;
}

/**
 * "Where I am with this": a patient-held checklist. Saved on the device only;
 * shows up in the printed summary so the patient can hand their status to a
 * social worker or care team if they choose to.
 */
export default function JourneySection() {
  const [journey, setJourney] = useState<Journey>(emptyJourney());
  const [contact, setContact] = useState("");
  const [editingContact, setEditingContact] = useState(false);

  useEffect(() => {
    const saved = loadJourney<Journey>();
    if (saved && Array.isArray(saved.done)) setJourney(saved);
    setContact(loadContact());
  }, []);

  function update(next: Journey) {
    setJourney(next);
    saveJourney(next);
  }

  return (
    <section className="border-line bg-card rounded-2xl border p-5">
      <h2 className="text-xl">Where I am with this</h2>
      <p className="text-muted mt-1 text-sm">
        For you. Saved on this device, printed with your summary if you want your care team to see
        it.
      </p>

      <div className="mt-3 flex flex-col gap-2 print:hidden">
        {journeyStages.map((s) => {
          const on = journey.done.includes(s.id);
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={on}
              onClick={() => update(toggleStage(journey, s.id))}
              className={`min-h-12 rounded-xl border-[1.5px] px-4 py-3 text-left text-[0.98rem] font-bold ${
                on ? "border-accent bg-accent-tint" : "border-line bg-card"
              }`}
            >
              {on ? "✓ " : ""}
              {s.label}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm font-bold print:hidden">Where did you land?</p>
      <p className="text-muted text-xs print:hidden">Both answers are real endings. Tap again to clear.</p>
      <div className="mt-2 flex flex-wrap gap-2 print:hidden">
        {journeyOutcomes.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={journey.outcome === o.id}
            onClick={() => update(setOutcome(journey, o.id))}
            className={`rounded-full border-[1.5px] px-4 py-2.5 text-sm font-bold ${
              journey.outcome === o.id ? "border-accent bg-accent-tint" : "border-line bg-card"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="border-line mt-4 border-t pt-4 print:hidden">
        {contact && !editingContact ? (
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={contactHref(
                contact,
                `Hi, I'm using the fertility navigator. I'm at the step "${
                  journeyStages.find((s) => !journey.done.includes(s.id))?.label ?? "finishing up"
                }" and I have a question.`,
              )}
              className="bg-accent text-accent-contrast rounded-xl px-4 py-2.5 text-sm font-bold"
            >
              Message my care team
            </a>
            <button
              type="button"
              onClick={() => setEditingContact(true)}
              className="text-muted text-xs underline"
            >
              change contact
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm font-bold">Stuck on a step? Your social worker can help.</p>
            <p className="text-muted text-xs">
              Add their number or email (kept on this device) and this becomes a one-tap message.
            </p>
            <div className="mt-2 flex gap-2">
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Phone or email"
                aria-label="Care team contact"
                className="border-line bg-paper min-h-10 flex-1 rounded-lg border px-3 text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  saveContact(contact);
                  setEditingContact(false);
                }}
                className="border-accent text-accent-ink rounded-lg border-[1.5px] px-3 text-sm font-bold"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Printed version: plain status lines for the care team */}
      <div className="hidden print:block">
        {summaryLines(journey).map((line, i) => (
          <p key={i} className="text-sm">
            {line}
          </p>
        ))}
      </div>
    </section>
  );
}
