/**
 * Line icons for the five bilona steps.
 *
 * Drawn to match Lucide's visual language, which the rest of the site already
 * uses: 48-unit grid, 2px stroke, round caps and joins, no fills except where a
 * shape needs to read as solid. `currentColor` throughout, so the parent sets
 * the colour and both themes work with no extra rules.
 *
 * Deliberately geometric rather than illustrative. A generated photo of a
 * churning pot implies it is a photo of OUR churning pot; a line drawing makes
 * no such claim. It is also ~1 KB instead of ~250 KB, and five of them stay
 * visually consistent in a way five separate AI generations would not.
 */

const base = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
  focusable: "false",
};

/* 01 — Milking: a pail catching milk, under the humped back of a zebu cow. */
export function IconMilking(props) {
  return (
    <svg {...base} {...props}>
      {/* zebu back line with the shoulder hump — the hump is the point */}
      <path d="M6 15c2.5 0 3.5-5 6-5s3.2 3.5 5.6 3.5H30" />
      {/* pail */}
      <path d="M17 26h14l-1.6 13.5a2 2 0 0 1-2 1.8h-6.8a2 2 0 0 1-2-1.8Z" />
      <path d="M15.5 26h17" />
      {/* handle */}
      <path d="M20 26a4 4 0 0 1 8 0" />
      {/* falling drops */}
      <path d="M24 17.5v4" />
      <path d="M20.5 19v2.5" />
      <path d="M27.5 19v2.5" />
    </svg>
  );
}

/* 02 — Culturing: whole milk set into curd overnight, under a crescent moon. */
export function IconCulturing(props) {
  return (
    <svg {...base} {...props}>
      {/* crescent moon — this step happens overnight */}
      <path d="M37 8a5.5 5.5 0 1 0 5 7 6 6 0 0 1-5-7Z" />
      {/* clay pot */}
      <path d="M11 22h22l-2 15.5a3 3 0 0 1-3 2.5H16a3 3 0 0 1-3-2.5Z" />
      <path d="M9 22h26" />
      {/* the set curd surface — flat and undisturbed */}
      <path d="M14 28h16" />
    </svg>
  );
}

/* 03 — Churning: the bilona itself. Rod, rotation, butter granules rising. */
export function IconChurning(props) {
  return (
    <svg {...base} {...props}>
      {/* pot */}
      <path d="M11 24h22l-2 14.5a3 3 0 0 1-3 2.5H16a3 3 0 0 1-3-2.5Z" />
      <path d="M9 24h26" />
      {/* churn rod, through the lid and standing above it */}
      <path d="M22 24V7" />
      <path d="M18 7h8" />
      {/* rotation — the rope pulled back and forth */}
      <path d="M29 12a8 8 0 0 0-5-3" />
      <path d="M28.5 15.5 29.5 12l-3.5.6" />
      <path d="M15 14a8 8 0 0 1 5-4" />
      {/* butter granules gathering at the surface */}
      <circle cx="17" cy="30" r="1.4" />
      <circle cx="26.5" cy="31" r="1.4" />
      <circle cx="21.5" cy="33.5" r="1.4" />
    </svg>
  );
}

/* 04 — Simmering: butter reducing in a heavy kadhai over a low flame. */
export function IconSimmering(props) {
  return (
    <svg {...base} {...props}>
      {/* steam */}
      <path d="M19 12c0-2 2-2 2-4s-2-2-2-4" />
      <path d="M27 12c0-2 2-2 2-4s-2-2-2-4" />
      {/* kadhai — deep and round-bottomed */}
      <path d="M9 20h30a15 15 0 0 1-30 0Z" />
      <path d="M7 20h34" />
      {/* low flame */}
      <path d="M24 38.5c-2.2 0-4-1.6-4-3.6 0-2.6 4-4.4 4-4.4s4 1.8 4 4.4c0 2-1.8 3.6-4 3.6Z" />
    </svg>
  );
}

/* 05 — Filling: strained through mesh into glass, setting grainy as it cools. */
export function IconFilling(props) {
  return (
    <svg {...base} {...props}>
      {/* strainer */}
      <path d="M15 7h18l-7 8h-4Z" />
      <path d="M18 11h12" />
      {/* pouring stream */}
      <path d="M24 15v5" />
      {/* jar: neck, shoulder, body */}
      <path d="M19 20h10" />
      <path d="M17 41V26a4 4 0 0 1 2-3.5h10a4 4 0 0 1 2 3.5v15Z" />
      {/* danedar grain forming as it sets */}
      <circle cx="21" cy="31" r="1.3" />
      <circle cx="27" cy="32.5" r="1.3" />
      <circle cx="23.5" cy="36" r="1.3" />
    </svg>
  );
}

export const BILONA_ICONS = [
  IconMilking,
  IconCulturing,
  IconChurning,
  IconSimmering,
  IconFilling,
];
