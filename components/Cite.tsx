import type { Citation } from "../lib/types";

function fmt(c: Citation): string {
  const date = c.sourceDate ? ` (${c.sourceDate})` : "";
  const page = c.page ? `, p. ${c.page}` : "";
  return `${c.sourceName}${date}${page}`;
}

/**
 * Citations stay attached to every fact but out of the reading path: a small
 * collapsed "Sources" disclosure on screen, expanded plain text in print.
 */
export default function Cite({ citations }: { citations: Citation[] }) {
  if (!citations || citations.length === 0) return null;
  const unique = Array.from(new Map(citations.map((c) => [fmt(c), c])).values());
  const rendered = unique.map((c, i) => (
    <span key={i}>
      {i > 0 && "; "}
      {c.url ? (
        <a href={c.url} target="_blank" rel="noreferrer" className="underline">
          {fmt(c)}
        </a>
      ) : (
        fmt(c)
      )}
    </span>
  ));
  return (
    <>
      <details className="mt-1 print:hidden">
        <summary className="text-muted cursor-pointer list-none text-xs underline decoration-dotted">
          Where this comes from
        </summary>
        <p className="text-muted mt-1 text-xs">{rendered}</p>
      </details>
      <p className="text-muted hidden text-xs print:block">Where this comes from: {rendered}</p>
    </>
  );
}
