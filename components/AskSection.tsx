"use client";

import { useRef, useState } from "react";
import type { Answers } from "../lib/types";
import type { GuidanceSection } from "../lib/content-schema";
import Cite from "./Cite";
import { askCorpus, cannedQuestions, CHAT_STRINGS, type ChatEntry } from "../lib/chat";
import { ASK_DISCLOSURE } from "../lib/ask-filter";
import { track } from "../lib/analytics";

const LLM_ENABLED =
  process.env.NEXT_PUBLIC_ASK_LLM === "1" && Boolean(process.env.NEXT_PUBLIC_SYNC_URL);

/** Calls the hosted answer service; null means fall back to retrieval. */
async function askModel(
  question: string,
  answers: { anatomy?: string; stage?: string },
): Promise<string | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SYNC_URL}/functions/v1/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SYNC_ANON_KEY ?? ""}`,
      },
      body: JSON.stringify({ question, anatomy: answers.anatomy, stage: answers.stage }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.answer === "string" && data.answer ? data.answer : null;
  } catch {
    return null;
  }
}
import Icon from "./icons";

interface Message {
  role: "user" | "app";
  text?: string;
  entries?: ChatEntry[];
  crisis?: boolean;
  ai?: boolean;
  thinking?: boolean;
  related?: ChatEntry[];
}

/**
 * The on-device Ask panel. Every answer is a passage from the app's cited
 * content; there is no model and nothing typed leaves the browser. History
 * lives in component state only, so closing the panel erases it.
 */
export default function AskSection({
  answers,
  guidance = [],
  onClose,
  onNavigate,
}: {
  answers: Answers;
  guidance?: GuidanceSection[];
  onClose: () => void;
  onNavigate: (target: string) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [aiConsent, setAiConsent] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const chips = cannedQuestions(answers);

  const scrollDown = () =>
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 50);

  function submit(q: string) {
    const question = q.trim();
    if (!question) return;
    const retrieval = askCorpus(question, answers);
    setDraft("");

    // Crisis language never leaves the device, AI mode or not.
    if (retrieval.kind === "crisis") {
      setMessages((m) => [...m, { role: "user", text: question }, { role: "app", crisis: true }]);
      scrollDown();
      return;
    }

    if (LLM_ENABLED && aiConsent) {
      setMessages((m) => [...m, { role: "user", text: question }, { role: "app", thinking: true }]);
      scrollDown();
      void askModel(question, { anatomy: answers.anatomy, stage: answers.stage }).then((ai) => {
        track(ai || retrieval.entries.length > 0 ? "chat_question_answered" : "chat_no_answer");
        // Link the parts of the tool the question touches, like footnotes.
        const related = retrieval.kind === "results"
          ? retrieval.entries.filter((e) => e.goto).slice(0, 2)
          : [];
        setMessages((m) => {
          const out = m.filter((x) => !x.thinking);
          if (ai) return [...out, { role: "app", text: ai, ai: true, related }];
          if (retrieval.kind === "results") return [...out, { role: "app", entries: retrieval.entries }];
          return [...out, { role: "app", text: CHAT_STRINGS.noAnswer }];
        });
        scrollDown();
      });
      return;
    }

    track(retrieval.entries.length > 0 ? "chat_question_answered" : "chat_no_answer");
    setMessages((m) => [
      ...m,
      { role: "user", text: question },
      retrieval.kind === "results"
        ? { role: "app", entries: retrieval.entries }
        : { role: "app", text: CHAT_STRINGS.noAnswer },
    ]);
    scrollDown();
  }

  return (
    <div className="bg-paper fixed inset-0 z-50 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-6 pt-6 pb-6">
        <button
          type="button"
          onClick={onClose}
          className="text-accent-ink -ml-2 self-start rounded-lg px-2 py-2 text-sm font-bold"
        >
          &larr; Back
        </button>

        <div className="flex items-center gap-2.5">
          <span className="bg-accent-tint text-accent-ink flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
            <Icon name="chat" size={20} />
          </span>
          <h2 className="text-lg leading-tight">Ask</h2>
        </div>

        {messages.length === 0 && <p className="text-muted text-sm">{CHAT_STRINGS.scope}</p>}
        {LLM_ENABLED && (
          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm font-bold">
              <input
                type="checkbox"
                checked={aiConsent}
                onChange={(e) => setAiConsent(e.target.checked)}
                className="h-4 w-4 shrink-0"
              />
              AI answers
            </label>
            <details>
              <summary className="text-muted cursor-pointer list-none text-xs underline decoration-dotted">What gets sent?</summary>
              <p className="text-muted mt-1 max-w-[240px] text-right text-xs">{ASK_DISCLOSURE}</p>
            </details>
          </div>
        )}

        {messages.length === 0 && (
          <div className="flex flex-col gap-2">
            {chips.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => submit(q)}
                className="border-line bg-card rounded-xl border px-4 py-3 text-left text-sm font-bold"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {messages.length === 0 && guidance.length > 0 && (
          <details className="border-line bg-card rounded-2xl border px-4 py-3">
            <summary className="cursor-pointer list-none font-bold">
              Common questions <span className="text-accent-ink float-right">+</span>
            </summary>
            <div className="mt-2 flex flex-col gap-2">
              {guidance.map((g) => (
                <details key={g.id} className="border-line rounded-lg border px-3 py-2">
                  <summary className="cursor-pointer list-none text-sm font-bold">{g.heading}</summary>
                  {g.paragraphs.map((p, i) => (
                    <p key={i} className="mt-2 text-sm">{p.text}</p>
                  ))}
                  <Cite citations={g.paragraphs.flatMap((p) => p.citations)} />
                </details>
              ))}
            </div>
          </details>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <p key={i} className="bg-accent text-accent-contrast max-w-[85%] self-end rounded-2xl rounded-br-md px-4 py-2.5 text-sm">
              {m.text}
            </p>
          ) : m.crisis ? (
            <section key={i} className="border-line bg-card max-w-[92%] self-start rounded-2xl rounded-bl-md border p-4" style={{ borderColor: "var(--warn, #A8653A)" }}>
              <p className="text-sm font-bold">{CHAT_STRINGS.crisis}</p>
            </section>
          ) : m.thinking ? (
            <section key={i} className="border-line bg-card max-w-[92%] self-start rounded-2xl rounded-bl-md border p-4">
              <p className="text-muted text-sm">Checking the sources&hellip;</p>
            </section>
          ) : m.ai ? (
            <section key={i} className="border-line bg-card max-w-[92%] self-start rounded-2xl rounded-bl-md border p-4">
              <p className="text-sm">{m.text}</p>
              {m.related && m.related.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {m.related.map((e) =>
                    e.goto!.target === "sources" ? (
                      <a key={e.id} href="/sources" className="border-line bg-paper text-accent-ink rounded-full border px-3 py-1 text-xs font-bold">
                        {e.goto!.label}
                      </a>
                    ) : (
                      <button
                        key={e.id}
                        type="button"
                        onClick={() => onNavigate(e.goto!.target)}
                        className="border-line bg-paper text-accent-ink rounded-full border px-3 py-1 text-xs font-bold"
                      >
                        {e.goto!.label} &rsaquo;
                      </button>
                    ),
                  )}
                </div>
              )}
            </section>
          ) : m.entries ? (
            <div key={i} className="flex max-w-[92%] flex-col gap-2 self-start">
              {m.entries.map((e) => (
                <section key={e.id} className="border-line bg-card rounded-2xl rounded-bl-md border p-4">
                  <p className="text-sm font-bold">{e.title}</p>
                  {e.text !== e.title && <p className="mt-1 text-sm">{e.text.length > 240 ? e.text.slice(0, 237).trimEnd() + "\u2026" : e.text}</p>}
                  {e.citations && e.citations.length > 0 && <Cite citations={e.citations} />}
                  {e.goto && e.goto.target === "sources" ? (
                    <a href="/sources" className="text-accent-ink mt-2 inline-block text-sm font-bold underline">
                      {e.goto.label}
                    </a>
                  ) : e.goto ? (
                    <button
                      type="button"
                      onClick={() => onNavigate(e.goto!.target)}
                      className="text-accent-ink mt-2 text-sm font-bold underline"
                    >
                      {e.goto.label} &rsaquo;
                    </button>
                  ) : null}
                </section>
              ))}
            </div>
          ) : (
            <section key={i} className="border-line bg-card max-w-[92%] self-start rounded-2xl rounded-bl-md border p-4">
              <p className="text-sm">{m.text}</p>
            </section>
          ),
        )}
          <div ref={endRef} />
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(draft);
        }}
        className="border-line bg-card border-t"
      >
        {aiConsent && (
          <p className="text-muted mx-auto max-w-md px-4 pt-2 text-center text-[0.68rem]">
            AI answers can be wrong. Not medical advice.
          </p>
        )}
        <div className="mx-auto flex max-w-md items-center gap-2 px-4 py-3">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={CHAT_STRINGS.placeholder}
            aria-label="Type a question"
            className="border-line bg-paper min-h-12 flex-1 rounded-xl border px-4 text-sm"
          />
          <button
            type="submit"
            aria-label="Send question"
            className="bg-accent text-accent-contrast flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
          >
            <span aria-hidden="true" className="text-lg">&rarr;</span>
          </button>
        </div>
      </form>
    </div>
  );
}
