# The LLM answer service: plan, guardrails, and what Helen does first

Drafted 2026-11-09. Nothing here is built yet by agreement; the grounding
corpus and this spec come first. Companion artifact: "Navigator LLM Plan".

## Architecture (when we build)

Static site → Supabase Edge Function `ask` (holds the API key, rate-limits by
anonymous session) → Claude (system prompt = content/llm/grounding.md, pinned
to a commit, served with prompt caching) → output filter → client. The
current on-device retrieval stays as the fallback whenever the function is
unreachable, and the crisis filter stays client-side so self-harm messages
are never transmitted.

Model: claude-haiku-4-5 to start (fast, cheap); the corpus is ~11k tokens, so
with caching a question costs well under a cent. Upgradeable per question.

## What Helen must do before any LLM code is written

1. Run supabase/migrations/0004_profiles.sql (profiles; on the clipboard).
2. Create an Anthropic API key (console.anthropic.com) and store it as a
   Supabase Edge Function secret. NEVER as a NEXT_PUBLIC_* var in Vercel;
   the key must not ship to browsers.
3. Pick the model (recommendation: claude-haiku-4-5).
4. Approve the privacy-policy change: typed questions WILL leave the device
   (our function + Anthropic as a processor). This is a real change to the
   current promise and must be disclosed in the Ask panel itself and in the
   policy. Counsel review before real patients, same gate as profiles.
5. For the IRB path: the chatbot is part of the intervention. The protocol
   needs the guardrail spec below and the pinned corpus version (commit
   hash). Raise it with Dr. Su and whichever IRB sponsors.

## Guardrails, layered

- L0 client: crisis language → 988 card locally, never sent. UI tells people
  not to type their name or personal details.
- L1 function input gate: scope check (fertility preservation, costs,
  insurance, clinics, everyday health). Off-topic → fixed decline text.
- L2 system prompt: the ANSWER RULES at the top of grounding.md (answer only
  from the corpus; never a personal risk number; never recommend an option;
  no diagnosis; reading level; "about" on durations; no em dashes).
- L3 output filter in the function: the same banned-phrase and banned-claims
  regexes the tone tests enforce, plus a percent-near-risk detector and a
  "you should choose" recommendation detector. Any hit → discard the model
  answer and return the retrieval cards instead.
- L4 UX: a disclosure line on every answer (AI-written from this tool's
  cited sources, can be wrong, not medical advice), citations rendered like
  everywhere else, care-team pointer on personal questions.
- L5 ops: rate limit per session, capped output tokens, transcripts NOT
  stored (lane-1 counts only: asked/answered/declined), and a golden-question
  eval script (~40 questions with expected behaviors) run manually before any
  corpus or prompt change ships.

## What informs the model (the corpus manifest)

content/llm/grounding.md, generated from the app content by
`WRITE_LLM_GROUNDING=1 npx vitest run tests/llm-grounding.gen.test.ts`:
options, guidance FAQs (SB 600, SB 729, Medi-Cal, LGBTQ+, hormone safety,
sperm protection), aid directory, health facts, compare grades, reflection
path, doctor questions. Every fact carries its source name inline.

Deliberately EXCLUDED: the CRISP regimen risk table (the deterministic risk
module owns personal risk; the model only points at it), clinic details,
the legal/HIPAA docs, and raw PDFs (the D4 toolkit is already distilled
into the coverage and aid content with citations).

## Context sent per question

The question text only, plus at most anatomy and treatment stage as coarse
audience hints, and only after the user has accepted the Ask-panel
disclosure. Survey answers, age, ZIP, diagnosis, and regimen are never sent.
