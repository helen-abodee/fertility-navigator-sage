import { appContent } from "../../content/app/content";
import type { Citation } from "../../lib/types";

export const metadata = { title: "Sources - Fertility Preservation Navigator" };

function collectCitations(): Citation[] {
  const all: Citation[] = [];
  for (const o of appContent.options) {
    all.push(...o.citations, ...o.audienceCitations, ...o.stepsCitations, ...o.expectationsCitations);
    for (const c of o.costs) all.push(...c.citations);
  }
  for (const g of appContent.guidance) {
    for (const p of g.paragraphs) all.push(...p.citations);
    for (const a of g.actions ?? []) all.push(...a.citations);
  }
  for (const a of appContent.aid) all.push(...a.citations);
  for (const q of appContent.doctorQuestions) all.push(...(q.citations ?? []));
  return all;
}

export default function SourcesPage() {
  const bySource = new Map<string, { citation: Citation; count: number }>();
  for (const c of collectCitations()) {
    const entry = bySource.get(c.sourceId);
    if (entry) entry.count += 1;
    else bySource.set(c.sourceId, { citation: c, count: 1 });
  }
  const sources = Array.from(bySource.values()).sort((a, b) => b.count - a.count);

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-3xl">Where the information comes from</h1>
      <p className="text-muted mt-2">
        Every medical, cost, and insurance fact in this tool carries a citation to one of the
        sources below, with its date. Last reviewed {appContent.lastReviewed}.
      </p>
      <ul className="mt-6 flex flex-col gap-4">
        {sources.map(({ citation, count }) => (
          <li key={citation.sourceId} className="border-line bg-card rounded-xl border p-4">
            <p className="font-bold">
              {citation.url ? (
                <a href={citation.url} target="_blank" rel="noreferrer" className="underline">
                  {citation.sourceName}
                </a>
              ) : (
                citation.sourceName
              )}
            </p>
            <p className="text-muted text-sm">
              {citation.sourceDate ? `Published or updated ${citation.sourceDate}. ` : ""}
              Checked {citation.retrieved}. Cited {count} {count === 1 ? "time" : "times"} in this
              tool.
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-8">
        <a href="/" className="text-accent-ink font-bold underline">
          Back to the start
        </a>
      </p>
    </main>
  );
}
