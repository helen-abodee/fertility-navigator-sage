import Icon from "./icons";

/**
 * The recognizable "ask your care team" callout: distinct tint, stethoscope
 * badge, same shape everywhere so patients learn to spot it.
 */
export default function AskTeam({ text }: { text: string }) {
  return (
    <aside className="border-info/30 flex gap-3 rounded-2xl border-[1.5px] p-4" style={{ background: "color-mix(in srgb, var(--info) 10%, var(--card))" }}>
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{ background: "color-mix(in srgb, var(--info) 18%, var(--card))", color: "var(--info)" }}
      >
        <Icon name="stethoscope" size={22} />
      </span>
      <div>
        <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--info)" }}>
          For your care team
        </p>
        <p className="mt-0.5 text-[0.95rem]">{text}</p>
      </div>
    </aside>
  );
}
