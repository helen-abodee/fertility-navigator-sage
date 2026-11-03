import type { ReadMoreLink } from "../lib/content-schema";
import Icon from "./icons";

/** Patient-facing onward links, distinct from the audit "Sources" disclosure. */
export default function ReadMore({ links }: { links?: ReadMoreLink[] }) {
  if (!links || links.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-2 print:hidden">
      {links.map((l) => (
        <a
          key={l.url}
          href={l.url}
          target="_blank"
          rel="noreferrer"
          className="border-line bg-paper text-accent-ink inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold"
        >
          <Icon name="compass" size={13} />
          Read more: {l.label}
        </a>
      ))}
    </div>
  );
}
