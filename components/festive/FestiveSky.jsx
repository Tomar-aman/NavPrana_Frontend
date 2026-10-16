/**
 * Animated backdrop for the Diwali section: twinkling stars, rising sky
 * lanterns, firework bursts and a gold rangoli outline in two corners.
 *
 * CSS-only animation (see "Festive" in globals.css), transform/opacity only.
 * Every size and position is set inline or as an SVG attribute rather than as
 * a utility class, so if the stylesheet is ever late or stale the decoration
 * stays small and in its corner instead of blowing up across the section.
 * Positions are fixed, not random, so server and client markup match.
 */

// left (%), size (px), duration (s), delay (s, negative = already mid-flight)
const LANTERNS = [
  [5, 22, 19, -3],
  [17, 16, 23, -12],
  [30, 20, 21, -7],
  [48, 14, 25, -16],
  [63, 22, 20, -10],
  [78, 16, 24, -5],
  [91, 20, 22, -14],
];

// top (%), left (%), colour, delay (s)
const BURSTS = [
  [12, 14, "#fbbf24", 0],
  [8, 86, "#f9a8d4", 1.4],
  [30, 72, "#fdba74", 2.6],
  [24, 26, "#fde047", 3.6],
];
const RAYS = 12;

// top (%), left (%), delay (s)
const STARS = [
  [6, 8, 0], [14, 22, 0.6], [4, 38, 1.2], [18, 46, 0.3], [9, 60, 0.9],
  [16, 74, 1.5], [5, 90, 0.4], [28, 4, 1.1], [34, 95, 0.7], [44, 12, 1.8],
  [40, 88, 0.2], [60, 6, 1.3], [66, 93, 0.5], [78, 20, 1.6], [82, 80, 1],
];

function Lantern({ size }) {
  return (
    <svg width={size} height={Math.round(size * 1.4)} viewBox="0 0 20 28">
      <path d="M4 4 H16 L18 20 Q10 26 2 20 Z" fill="#f59e0b" />
      <path d="M5 6 H15 L16.5 19 Q10 23.5 3.5 19 Z" fill="#fde68a" opacity="0.55" />
      <rect x="5" y="2" width="10" height="3" rx="1" fill="#b45309" />
    </svg>
  );
}

function RangoliOutline({ size, style }) {
  const petals = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={style} className="np-rangoli">
      <g transform="translate(100 100)" fill="none" stroke="#d97706" strokeWidth="2">
        {petals.map((deg) => (
          <g key={deg} transform={`rotate(${deg})`}>
            <path d="M0 -24 C14 -42 14 -70 0 -88 C-14 -70 -14 -42 0 -24 Z" />
            <path d="M0 -36 C6 -48 6 -62 0 -74 C-6 -62 -6 -48 0 -36 Z" />
            <circle cy="-95" r="4" fill="#d97706" />
          </g>
        ))}
        <circle r="24" />
        <circle r="14" />
        <circle r="5" fill="#d97706" />
      </g>
    </svg>
  );
}

export default function FestiveSky() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none"
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
    >
      <RangoliOutline size={220} style={{ position: "absolute", left: -90, bottom: -90, opacity: 0.22 }} />
      <RangoliOutline size={180} style={{ position: "absolute", right: -70, top: -70, opacity: 0.18 }} />

      {STARS.map(([top, left, delay], i) => (
        <span
          key={`s${i}`}
          className="np-star"
          style={{ position: "absolute", top: `${top}%`, left: `${left}%`, animationDelay: `${delay}s` }}
        />
      ))}

      {LANTERNS.map(([left, size, dur, delay], i) => (
        <span
          key={`l${i}`}
          className="np-lantern"
          style={{
            position: "absolute",
            top: "100%",
            left: `${left}%`,
            animationDuration: `${dur}s`,
            animationDelay: `${delay}s`,
          }}
        >
          <Lantern size={size} />
        </span>
      ))}

      {BURSTS.map(([top, left, color, delay], b) => (
        <span
          key={`b${b}`}
          style={{ position: "absolute", top: `${top}%`, left: `${left}%`, "--spark": color }}
        >
          {Array.from({ length: RAYS }, (_, r) => (
            <span
              key={r}
              style={{ position: "absolute", left: 0, top: 0, transform: `rotate(${(360 / RAYS) * r}deg)` }}
            >
              <span className="np-spark" style={{ animationDelay: `${delay}s` }} />
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}
