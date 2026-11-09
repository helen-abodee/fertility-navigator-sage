"use client";

import { useRef, useState } from "react";
import type { Answers } from "../lib/types";
import { askCorpus, cannedQuestions, CHAT_STRINGS, type ChatEntry } from "../lib/chat";
import { track } from "../lib/analytics";
import Cite from "./Cite";
import Icon from "./icons";

interface Message {
  role: "user" | "app";
  text?: string;
  entries?: ChatEntry[];
  crisis?: boolean;
}

/**
 * The on-device Ask panel. Every answer is a passage from the app's cited
 * content; there is no model and nothing typed leaves the browser. History
 * lives in component state only, so closing the panel erases it.
 */
export default function AskSection({
  answers,
  onClose,
  onNavigate,
}: {
  answers: Answers;
  onClose: () => void;
  onNavigate: (target: string) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const chips = cannedQuestions(answers);

  function submit(q: string) {
    const question = q.trim();
    if (!question) return;
    const answer = askCorpus(question, answers);
    track(answer.entries.length > 0 ? "chat_question_answered" : "chat_no_answer");
    setMessages((m) => [
      ...m,
      { role: "user", text: question },
      answer.kind === "crisis"
        ? { role: "app", crisis: true }
        : answer.kind === "results"
          ? { role: "app", entries: answer.entries }
          : { role: "app", text: CHAT_STRINGS.noAnswer },
    ]);
    setDraft("");
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 50);
  }

  return (
    <div className="bg-paper fixed inset-0 z-50 flex flex-col overflow-y-auto">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-1 flex-col gap-4 px-6 pt-6 pb-28">
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

        <section className="border-line bg-card rounded-2xl border p-4">
          <p className="text-sm">{CHAT_STRINGS.scope}</p>
          <p className="text-muted mt-2 text-xs">{CHAT_STRINGS.intro}</p>
        </section>

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

        {messages.map((m, i) =>
          m.role === "user" ? (
            <p key={i} className="bg-accent text-accent-contrast max-w-[85%] self-end rounded-2xl rounded-br-md px-4 py-2.5 text-sm">
              {m.text}
            </p>
          ) : m.crisis ? (
            <section key={i} className="border-line bg-card max-w-[92%] self-start rounded-2xl rounded-bl-md border p-4" style={{ borderColor: "var(--warn, #A8653A)" }}>
              <p className="text-sm font-bold">{CHAT_STRINGS.crisis}</p>
            </section>
          ) : m.entries ? (
            <div key={i} className="flex max-w-[92%] flex-col gap-2 self-start">
              {m.entries.map((e) => (
                <section key={e.id} className="border-line bg-card rounded-2xl rounded-bl-md border p-4">
                  <p className="text-sm font-bold">{e.title}</p>
                  {e.text !== e.title && <p className="mt-1 text-sm">{e.text}</p>}
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

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(draft);
        }}
        className="border-line bg-card fixed right-0 bottom-0 left-0 border-t"
      >
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
