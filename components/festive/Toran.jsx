/**
 * Marigold-and-mango-leaf toran hung from the bottom edge of the header, with
 * a string of twinkling Diwali lights below it.
 * Purely decorative: absolutely positioned so it takes no layout space,
 * hidden from screen readers, and ignores clicks so it never covers a link.
 * Animation is CSS only (see "Festive" in globals.css).
 */
const BULB_COLORS = ["#fbbf24", "#f97316", "#f43f5e", "#facc15"];
const BULBS = 48; // enough for a wide desktop; the row clips on phones

export default function Toran() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 right-0 top-full h-[22px] md:h-[34px] overflow-hidden"
    >
      <svg width="100%" height="22" xmlns="http://www.w3.org/2000/svg" className="block">
        <defs>
          <pattern id="np-toran" width="48" height="22" patternUnits="userSpaceOnUse">
            {/* string */}
            <path d="M0 2 Q12 7 24 2 T48 2" fill="none" stroke="#b45309" strokeWidth="1" />
            {/* mango leaf */}
            <path d="M24 3 C20 9 21 15 24 19 C27 15 28 9 24 3 Z" fill="#3f7d2e" />
            <path d="M24 4 L24 18" stroke="#2c5a20" strokeWidth="0.6" />
            {/* marigolds */}
            <circle cx="9" cy="8" r="5" fill="#f59e0b" />
            <circle cx="9" cy="8" r="2.4" fill="#ea580c" />
            <circle cx="39" cy="8" r="5" fill="#fbbf24" />
            <circle cx="39" cy="8" r="2.4" fill="#f97316" />
          </pattern>
        </defs>
        <rect width="100%" height="22" fill="url(#np-toran)" />
      </svg>

      {/* fairy lights — desktop only; on phones the extra 12px reached into
          page headings that sit close under the header */}
      <div className="hidden md:flex justify-between px-1 -mt-1">
        {Array.from({ length: BULBS }, (_, i) => (
          <span
            key={i}
            className="np-bulb"
            style={{
              "--bulb": BULB_COLORS[i % BULB_COLORS.length],
              animationDelay: `${(i % 4) * 0.4}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
