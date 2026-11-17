import { parenthoodIntro, parenthoodPaths } from "../content/app/parenthood";
import Cite from "./Cite";
import Icon from "./icons";

/**
 * The after-treatment family-building paths. Six cards, none ranked above
 * another; tap a card to read the cited detail.
 */
export default function ParenthoodSection() {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg">Paths to parenthood</h2>
        <p className="text-muted mt-1 text-sm">{parenthoodIntro.text}</p>
        <Cite citations={parenthoodIntro.citations} />
      </div>
      <div className="flex flex-col gap-3">
        {parenthoodPaths.map((p) => (
          <details key={p.id} className="border-line bg-card rounded-2xl border p-4">
            <summary className="flex cursor-pointer list-none items-center gap-2.5">
              <span className="bg-accent-tint text-accent-ink flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                <Icon name={p.icon} size={20} />
              </span>
              <span className="flex-1">
                <span className="block text-lg leading-tight font-bold">{p.name}</span>
                <span className="text-muted block text-sm">{p.short}</span>
              </span>
              <span className="text-accent-ink text-xl" aria-hidden="true">+</span>
            </summary>
            <div className="mt-3 flex flex-col gap-2">
              {p.paragraphs.map((para, i) => (
                <p key={i} className="text-[0.95rem]">{para.text}</p>
              ))}
              <Cite citations={p.paragraphs.flatMap((para) => para.citations)} />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
