/**
 * Seasonal theming switch. Everything festive on the site reads from here, so
 * it switches itself on and off by date — nobody has to remember to take the
 * Diwali decorations down in December.
 *
 * Dates are inclusive and in IST. For the next festival, add an entry; the
 * first one whose window contains today wins.
 */
export const FESTIVALS = [
  {
    id: "diwali-2026",
    name: "Diwali",
    start: "2026-10-17",
    end: "2026-11-12", // Diwali is 8 Nov 2026; runs through Bhai Dooj.
    // Delivery is 3-7 days, so this is the last safe day to order for most of India.
    orderBy: "1 November",
  },
];

function todayIST(now = new Date()) {
  return new Date(now.getTime() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** The festival running today, or null. */
export function activeFestival(now = new Date()) {
  const today = todayIST(now);
  return FESTIVALS.find((f) => today >= f.start && today <= f.end) || null;
}
