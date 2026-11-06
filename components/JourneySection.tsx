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
import Icon from "./icons";
import careTeam from "../data/care-team.json";
import { encodeShareCode } from "../lib/share";
import { isLinkCode, newLinkCode, pushJourney, syncEnabled } from "../lib/sync";
import { contactHref } from "../lib/contact";
import { track } from "../lib/analytics";

const INBOX_KEY = "navigator.team-inbox.v1";

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

/**
 * "Where I am with this": a patient-held checklist. Saved on the device only;
 * shows up in the printed summary so the patient can hand their status to a
 * social worker or care team if they choose to.
 */
export default function JourneySection({ riskLabel }: { riskLabel?: string }) {
  const [journey, setJourney] = useState<Journey>(emptyJourney());
  const [contact, setContact] = useState("");
  const [editingContact, setEditingContact] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [linkCode, setLinkCode] = useState("");
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [inbox, setInbox] = useState("");
  const [teamName, setTeamName] = useState("");
  const [shareRisk, setShareRisk] = useState(false);

  useEffect(() => {
    try {
      const existing = localStorage.getItem("navigator.sync-code.v1");
      if (existing && isLinkCode(existing)) setLinkCode(existing);
      const ib = localStorage.getItem(INBOX_KEY);
      if (ib) {
        const parsed = JSON.parse(ib);
        if (parsed?.inbox) setInbox(parsed.inbox);
        if (parsed?.name) setTeamName(parsed.name);
      }
    } catch {
      /* fine */
    }
  }, []);

  async function sendToTeam() {
    let code = linkCode;
    if (!isLinkCode(code)) {
      code = newLinkCode();
      setLinkCode(code);
      try {
        localStorage.setItem("navigator.sync-code.v1", code);
      } catch {
        /* fine */
      }
    }
    setSendState("sending");
    const ok = await pushJourney(code, journey, undefined, inbox || undefined, shareRisk && riskLabel ? { riskLabel } : undefined);
    if (ok) track("send_progress");
    setSendState(ok ? "sent" : "failed");
    setTimeout(() => setSendState("idle"), 4000);
  }

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
              onClick={() => {
                track("journey_step_toggled");
                update(toggleStage(journey, s.id));
              }}
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
      <p className="text-muted text-xs print:hidden">All three are real answers. Tap again to clear.</p>
      <div className="mt-2 grid grid-cols-3 gap-2 print:hidden">
        {journeyOutcomes.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={journey.outcome === o.id}
            onClick={() => update(setOutcome(journey, o.id))}
            className={`flex min-h-20 flex-col items-center justify-center gap-1 rounded-xl border-[1.5px] px-2 py-2 text-center ${
              journey.outcome === o.id ? "border-accent bg-accent-tint" : "border-line bg-card"
            }`}
          >
            <span className="text-accent-ink"><Icon name={o.icon} size={22} /></span>
            <span className="text-xs leading-tight font-bold">{o.label}</span>
          </button>
        ))}
      </div>

      <div className="border-line mt-4 border-t pt-4 print:hidden">
        {syncEnabled && (
          <div className="mb-3">
            {riskLabel && (
              <label className="text-muted mb-2 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={shareRisk} onChange={(e) => setShareRisk(e.target.checked)} />
                Also include my risk group ({riskLabel})
              </label>
            )}
            <button
              type="button"
              onClick={sendToTeam}
              disabled={sendState === "sending"}
              className="bg-accent text-accent-contrast w-full rounded-xl px-4 py-3 font-bold disabled:opacity-60"
            >
              {sendState === "sending"
                ? "Sending..."
                : sendState === "sent"
                  ? "Sent ✓"
                  : sendState === "failed"
                    ? "Couldn't send, tap to retry"
                    : teamName
                      ? `Send my progress to ${teamName.split(" (")[0]}`
                      : "Send my progress to my care team"}
            </button>
            <p className="text-muted mt-1 text-xs">
              {inbox
                ? "Goes straight to your care team member's board. No codes to exchange."
                : linkCode
                  ? `Your care team sees it under code ${linkCode}. Pick your care team member below and even that step disappears.`
                  : "Only your checklist travels, plus anything you tick above."}
            </p>
          </div>
        )}
        {!syncEnabled && (
        <button
          type="button"
          onClick={() => setShareCode(shareCode ? null : encodeShareCode(journey))}
          aria-expanded={!!shareCode}
          className="border-accent text-accent-ink mb-3 w-full rounded-xl border-[1.5px] px-4 py-3 font-bold"
        >
          {shareCode ? "Hide my progress code" : "Share my progress with my care team"}
        </button>
        )}
        {!syncEnabled && shareCode && (
          <div className="bg-paper mb-3 rounded-xl p-3">
            <p className="text-sm">
              This code holds only your checklist above, nothing else. Text or email it to your
              social worker; their board turns it back into your checklist.
            </p>
            <p className="border-line bg-card mt-2 rounded-lg border p-2 font-mono text-xs break-all">{shareCode}</p>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(shareCode);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {
                  /* clipboard blocked: the code is visible to copy by hand */
                }
              }}
              className="bg-accent text-accent-contrast mt-2 rounded-lg px-4 py-2 text-sm font-bold"
            >
              {copied ? "Copied ✓" : "Copy code"}
            </button>
          </div>
        )}
        {contact && !editingContact ? (
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={contactHref(
                contact,
                `Hi, I'm using the fertility navigator. I'm at the step "${
                  journeyStages.find((s) => !journey.done.includes(s.id))?.label ?? "finishing up"
                }" and I have a question. My progress code: ${encodeShareCode(journey)}`,
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
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(contact);
                  setJustSaved(true);
                  setTimeout(() => setJustSaved(false), 2000);
                } catch {
                  /* visible below to copy by hand */
                }
              }}
              className="text-muted text-xs underline"
            >
              copy {contact}
            </button>
            {justSaved && (
              <span className="text-accent-ink animate-pop text-sm font-bold" role="status">
                Saved ✓
              </span>
            )}
          </div>
        ) : (
          <div>
            <p className="text-sm font-bold">Stuck on a step? Your social worker can help.</p>
            <p className="text-muted text-xs">
              Pick your care team member, or add a number or email. Kept on this device only.
            </p>
            <div className="mt-2 flex flex-col gap-2">
              {(careTeam as { id: string; name: string; role: string; contact: string; inbox?: string }[]).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setContact(m.contact);
                    saveContact(m.contact);
                    if (m.inbox) {
                      setInbox(m.inbox);
                      setTeamName(m.name);
                      try {
                        localStorage.setItem(INBOX_KEY, JSON.stringify({ inbox: m.inbox, name: m.name }));
                      } catch {
                        /* fine */
                      }
                    }
                    setEditingContact(false);
                    setJustSaved(true);
                    setTimeout(() => setJustSaved(false), 2500);
                  }}
                  className="border-line bg-card rounded-xl border-[1.5px] px-3 py-2.5 text-left"
                >
                  <span className="block text-sm font-bold">{m.name}</span>
                  <span className="text-muted block text-xs">{m.role}</span>
                </button>
              ))}
            </div>
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
                  setJustSaved(true);
                  setTimeout(() => setJustSaved(false), 2500);
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
