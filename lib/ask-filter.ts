/**
 * The server-side output filter (guardrail L3 in docs/LLM-PLAN.md): if a
 * model answer trips any of these, the answer is discarded and the client
 * falls back to the retrieval cards. The model never gets the last word.
 * Shared with the edge function (bundled by scripts/build-ask-function.mjs)
 * and unit-tested here.
 */

const RULES: { id: string; re: RegExp }[] = [
  // personal risk numbers: any percent or odds near risk/chance/fertility words
  { id: "risk_number", re: /\b\d{1,3}\s?(%|percent)\s?(chance|risk|odds|likelihood|probability)|\b(chance|risk|odds|likelihood|probability)\b[^.]{0,40}\b\d{1,3}\s?(%|percent)/i },
  // directive recommendations
  { id: "recommendation", re: /\byou should (choose|pick|go with|do|freeze|bank|preserve)\b|\bI (recommend|suggest|advise)\b|\bthe best option for you\b/i },
  // benefit claims the tone gates ban
  { id: "claim", re: /\b(boost|improve|improves|improving|increase[sd]?)\s(your\s)?(fertility|chances?)\b|\bguarantee[sd]?\s(a\s)?(baby|child|pregnancy)\b/i },
  // diagnosis / personal medical interpretation (narrow: "you have options"
  // and "if you have ovaries" are fine; diagnosing the person is not)
  { id: "diagnosis", re: /\byou (are|'re) (infertile|sterile)\b|\byou (likely |probably )?have (cancer|infertility|low|poor|diminished)\b|\byour (results|labs|pathology) (mean|show|indicate)\b/i },
  // tone bans
  { id: "tone", re: /\b(be gentle with yourself|self-care|stay positive|stay strong|listen to your body)\b/i },
  // urgency
  { id: "urgency", re: /\b(act now|don'?t wait|time is running out|hurry|as soon as possible before it'?s too late)\b/i },
];

export function filterAnswer(text: string): { ok: boolean; reason?: string } {
  for (const r of RULES) {
    if (r.re.test(text)) return { ok: false, reason: r.id };
  }
  return { ok: true };
}

export const ASK_DISCLOSURE =
  "AI answers are written by a language model from this tool's cited sources. They can be wrong, and they are not medical advice. Questions you type here are sent to our server and an AI service to generate the answer; please don't include your name or other personal details.";
