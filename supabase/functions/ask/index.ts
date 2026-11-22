// The Ask answer service (guardrails L1-L3 of docs/LLM-PLAN.md).
// Deploy: npx supabase functions deploy ask --no-verify-jwt
// Secret:  ANTHROPIC_API_KEY (Edge Function secret, never NEXT_PUBLIC).
// grounding.ts and filter.ts are generated: node scripts/build-ask-function.mjs
import { GROUNDING } from "./grounding.ts";
import { filterAnswer } from "./filter.ts";

const MODEL = Deno.env.get("ASK_MODEL") ?? "claude-haiku-4-5";
const KEY = Deno.env.get("ANTHROPIC_API_KEY");

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_TAIL = `
You are the Ask feature inside the Fertility Preservation Navigator, a free
tool for young adults with cancer. The document above is your ENTIRE world;
follow its ANSWER RULES exactly, especially rule 0 (VOICE): 2 to 4 short
plain sentences, about 60 words, the most useful fact first, at most one
source name in parentheses and only when it adds trust. Talk like a kind,
plainspoken nurse. Never mention a document, corpus, sources list, or rules.
Never use an em dash.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    if (!KEY) return json({ error: "not_configured" }, 503);
    const { question, anatomy, stage } = await req.json();
    const q = String(question ?? "").slice(0, 500).trim();
    if (!q) return json({ error: "empty" }, 400);

    const hints = [
      anatomy ? `The person answered anatomy: ${String(anatomy).slice(0, 20)}.` : "",
      stage ? `Treatment stage: ${String(stage).slice(0, 20)}.` : "",
    ].filter(Boolean).join(" ");

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 300,
        system: [
          { type: "text", text: GROUNDING + SYSTEM_TAIL, cache_control: { type: "ephemeral" } },
        ],
        messages: [{ role: "user", content: `${hints}\nQuestion: ${q}` }],
      }),
    });
    if (!res.ok) return json({ error: "upstream" }, 502);
    const data = await res.json();
    const raw: string = (data.content ?? [])
      .filter((b: { type: string }) => b.type === "text")
      .map((b: { text: string }) => b.text)
      .join(" ")
      .trim();
    // House style bans em dashes; enforce mechanically rather than hoping.
    const text = raw.replace(/\s*[\u2014\u2013]\s*/g, ", ");

    const verdict = filterAnswer(text);
    if (!text || !verdict.ok) {
      // The model never gets the last word: the client falls back to retrieval.
      return json({ filtered: true, reason: verdict.reason ?? "empty" });
    }
    return json({ answer: text });
  } catch {
    return json({ error: "bad_request" }, 400);
  }
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "content-type": "application/json" },
  });
}
