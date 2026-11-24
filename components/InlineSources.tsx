import type { Citation } from "../lib/types";

/**
 * Headway-style attribution: the source named right there, linked, no
 * "Sources" drawer. For screens where one or two names carry the trust.
 */
export default function InlineSources({ citations, max = 2 }: { citations: Citation[]; max?: number }) {
  const seen = new Set<string>();
  const unique = citations.filter((c) => {
    const k = c.sourceName;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  }).slice(0, max);
  if (unique.length === 0) return null;
  return (
    <p className="text-muted text-xs">
      {unique.map((c, i) => (
        <span key={i}>
          {i > 0 && " · "}
          {c.url ? (
            <a href={c.url} target="_blank" rel="noreferrer" className="underline decoration-dotted">
              {shorten(c.sourceName)}
            </a>
          ) : (
            shorten(c.sourceName)
          )}
        </span>
      ))}
    </p>
  );
}

function shorten(name: string): string {
  return name.split(" (")[0].split(":")[0].slice(0, 60);
}
