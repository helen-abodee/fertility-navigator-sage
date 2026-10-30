import type { Citation } from "../lib/types";

function fmt(c: Citation): string {
  const date = c.sourceDate ? ` (${c.sourceDate})` : "";
  const page = c.page ? `, p. ${c.page}` : "";
  return `${c.sourceName}${date}${page}`;
}

export default function Cite({ citations }: { citations: Citation[] }) {
  if (!citations || citations.length === 0) return null;
  const unique = Array.from(new Map(citations.map((c) => [fmt(c), c])).values());
  return (
    <p className="text-muted mt-1 text-xs">
      Source: {unique.map((c, i) => (
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
      ))}
    </p>
  );
}
