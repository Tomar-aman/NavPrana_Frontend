/**
 * PIN code → city/state lookup, backed by the public India Post directory
 * (api.postalpincode.in — no key, no quota).
 *
 * Asking for the PIN before the city lets us fill city and state from the
 * postal directory itself, so what the courier receives matches what India Post
 * knows about that PIN instead of whatever the shopper typed from memory.
 */

const ENDPOINT = "https://api.postalpincode.in/pincode/";
const TIMEOUT_MS = 6000;

// The same PIN is looked up again on every remount of the checkout / profile
// forms — one request per PIN per page load is plenty.
const cache = new Map();

/**
 * India Post returns a few states shortened, spelled out, or under their older
 * name, and the value has to match an option in the address form's dropdown to
 * show up at all. Keys are canonical (lowercase, "&" written as "and").
 * Anything not listed here already matches as-is.
 */
const STATE_ALIASES = {
  "jammu and kashmir": "Jammu & Kashmir",
  "nct of delhi": "Delhi",
  "andaman and nicobar": "Andaman & Nicobar Islands",
  "andaman and nicobar islands": "Andaman & Nicobar Islands",
  "dadra and nagar haveli": "Dadra & Nagar Haveli and Daman & Diu",
  "daman and diu": "Dadra & Nagar Haveli and Daman & Diu",
  "dadra and nagar haveli and daman and diu":
    "Dadra & Nagar Haveli and Daman & Diu",
  pondicherry: "Puducherry",
  tamilnadu: "Tamil Nadu",
  orissa: "Odisha",
  uttaranchal: "Uttarakhand",
  chattisgarh: "Chhattisgarh",
};

export const isValidPincode = (value) =>
  /^\d{6}$/.test(String(value || "").trim());

const titleCase = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/(^|[\s\-/&(])([a-z])/g, (_, lead, char) => lead + char.toUpperCase());

// Post office names carry a disambiguating suffix now and then — "Shivpur
// (Bahraich)" is the town Shivpur.
const cleanPlaceName = (value) =>
  titleCase(String(value || "").replace(/\s*\([^)]*\)\s*$/, ""));

// The value the most post offices under a PIN agree on.
const modeOf = (values) => {
  const counts = new Map();
  values
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));

  let winner = "";
  let best = 0;
  counts.forEach((count, value) => {
    if (count > best) {
      winner = value;
      best = count;
    }
  });
  return winner;
};

const normaliseState = (raw) => {
  const key = String(raw || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, " ")
    .trim();
  return STATE_ALIASES[key] || titleCase(raw);
};

/**
 * @returns {Promise<
 *   | { ok: true, pincode, city, state }
 *   | { ok: false, reason: "invalid" | "not_found" | "unreachable" }
 * >}
 */
export const lookupPincode = async (pin) => {
  const code = String(pin || "").trim();
  if (!isValidPincode(code)) return { ok: false, reason: "invalid" };
  if (cache.has(code)) return cache.get(code);

  let payload;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(`${ENDPOINT}${code}`, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    payload = await res.json();
  } catch {
    // Deliberately not cached and kept distinct from "not_found": the directory
    // being unreachable says nothing about the PIN, so callers must let the
    // order through instead of blocking checkout on an outage.
    return { ok: false, reason: "unreachable" };
  }

  const entry = Array.isArray(payload) ? payload[0] : null;
  const offices = Array.isArray(entry?.PostOffice) ? entry.PostOffice : [];

  if (!offices.length) {
    const miss = { ok: false, reason: "not_found" };
    cache.set(code, miss);
    return miss;
  }

  // A head office is named after the town people write on a parcel, where the
  // district often reads nothing like it — Bhuj is in Kachchh, Noida in Gautam
  // Buddha Nagar. Sub offices are no good as a second choice: they carry
  // locality names, so 636016 would come out "Fairlands" when the city is
  // Salem. A PIN with no head office goes by its district instead.
  const headOffice = offices.find(
    (office) => office.BranchType === "Head Post Office",
  );
  // A few PINs come back with a stray office from a neighbouring district, so
  // go by what the offices agree on rather than whichever one is listed first.
  const district = titleCase(modeOf(offices.map((office) => office.District)));

  const result = {
    ok: true,
    pincode: code,
    city:
      cleanPlaceName(headOffice?.Name) ||
      district ||
      cleanPlaceName(offices[0].Name),
    state: normaliseState(modeOf(offices.map((office) => office.State))),
  };
  cache.set(code, result);
  return result;
};
