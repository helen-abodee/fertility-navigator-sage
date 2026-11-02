/**
 * Simple line-icon set, consistent stroke, inherits currentColor so it works
 * in both themes. Swappable for designer assets later without touching
 * content: icons are referenced by key.
 */

const paths: Record<string, React.ReactNode> = {
  egg: <path d="M12 3C8.5 3 6 9 6 13a6 6 0 0 0 12 0c0-4-2.5-10-6-10z" />,
  embryo: (
    <>
      <circle cx="12" cy="12" r="7" />
      <circle cx="10.5" cy="11" r="2.5" />
      <path d="M15 14.5c1.5-.5 2.5-2 2.3-3.5" />
    </>
  ),
  sperm: (
    <>
      <circle cx="7" cy="8" r="3" />
      <path d="M9.5 10c2.5 2.5 5 2 7 4s1.5 4.5.5 6" />
    </>
  ),
  tissue: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4a8 8 0 0 0 0 16" strokeDasharray="2 2.5" />
      <circle cx="14.5" cy="10" r="1.2" />
      <circle cx="15" cy="14" r="1.2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path d="M9 12h6" />
    </>
  ),
  move: (
    <>
      <circle cx="8" cy="15" r="3" />
      <path d="M11 12l6-6M13 5h4v4" />
    </>
  ),
  clipboard: (
    <>
      <rect x="6" y="5" width="12" height="16" rx="2" />
      <path d="M9 5V3h6v2M9 11h6M9 15h4" />
    </>
  ),
  syringe: (
    <>
      <path d="M19 5l-2-2M14 4l6 6M15 5l-8 8-2 6 6-2 8-8M9 11l2 2" />
    </>
  ),
  rest: (
    <>
      <path d="M3 18h18M5 18v-6h14v6" />
      <circle cx="8" cy="9" r="1.6" />
      <path d="M12 7h5M13.5 5.5L12 7l1.5 1.5" />
    </>
  ),
  snowflake: (
    <>
      <path d="M12 4v16M6 7l12 10M18 7L6 17M9 5l3 2 3-2M9 19l3-2 3 2" />
    </>
  ),
  flask: (
    <>
      <path d="M10 3h4M11 3v6l-5 9a2 2 0 0 0 2 3h8a2 2 0 0 0 2-3l-5-9V3" />
      <path d="M8.5 16h7" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="6" width="16" height="14" rx="2" />
      <path d="M4 10h16M8 4v4M16 4v4" />
      <circle cx="12" cy="15" r="1.4" />
    </>
  ),
  door: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="1" />
      <circle cx="15" cy="12" r="1" />
    </>
  ),
  scalpel: (
    <>
      <path d="M4 20l9-9M13 11l6-6a2 2 0 0 0-3-3l-6 6M7 17l-3 3" />
    </>
  ),
  sprout: (
    <>
      <path d="M12 21v-8" />
      <path d="M12 13c0-4 3-6 7-6 0 4-3 6-7 6zM12 13c0-3-2.5-5-6-5 0 3 2.5 5 6 5z" />
    </>
  ),
  radiation: (
    <>
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 3v4M12 17v4M4.2 7.5l3.5 2M16.3 14.5l3.5 2M4.2 16.5l3.5-2M16.3 9.5l3.5-2" />
    </>
  ),
  heart: (
    <path d="M12 20s-7-4.5-9-9c-1.3-3 1-7 4.5-7C9.5 4 11 5.5 12 7c1-1.5 2.5-3 4.5-3C20 4 22.3 8 21 11c-2 4.5-9 9-9 9z" />
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" />
    </>
  ),
  dollar: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v9M14.5 9.2c-.6-.9-1.5-1.3-2.5-1.3-1.4 0-2.5.8-2.5 2s1 1.7 2.5 2 2.7.8 2.7 2.1-1.2 2.1-2.7 2.1c-1.1 0-2.1-.5-2.7-1.4" />
    </>
  ),
};

export const optionIcon: Record<string, string> = {
  egg_freezing: "egg",
  embryo_freezing: "embryo",
  sperm_banking: "sperm",
  testicular_sperm_extraction: "flask",
  ovarian_tissue_freezing: "tissue",
  ovarian_suppression: "shield",
  ovarian_transposition: "move",
};

export default function Icon({
  name,
  size = 24,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const content = paths[name] ?? paths.clipboard;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {content}
    </svg>
  );
}
