/**
 * Shared contact-field validators.
 *
 * Both the live check the form runs on blur and the check that gates Place
 * Order read these, so a field can never read as valid while typing and then
 * be rejected on submit.
 */

// Deliberately stricter than the browser's type="email" check, which passes
// "aman@digimonk" — a domain with no TLD takes the order confirmation nowhere.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

// Indian mobile numbers are ten digits opening 6-9. Landlines are excluded on
// purpose: they cannot receive the dispatch SMS the courier sends.
const MOBILE_RE = /^[6-9]\d{9}$/;

/**
 * Reduce anything a shopper might reasonably type or paste — "+91 98765-43210",
 * "091 9876543210", "09876543210" — to the bare ten digits the backend stores.
 *
 * A number that fits none of those shapes is returned with its digits intact
 * rather than trimmed to length: silently cutting a 13-digit typo down to ten
 * would turn a mistake into a plausible-looking wrong number.
 */
export const normalizePhone = (value) => {
  let digits = String(value ?? "").replace(/\D/g, "");
  // The country code and the trunk zero turn up in either order and in any
  // combination, so peel them off one at a time rather than trying to match
  // every shape. Guarded on length > 10 so a real number that happens to open
  // "91" — 9187654321 — is left exactly as it was typed.
  while (digits.length > 10) {
    if (digits.startsWith("91")) digits = digits.slice(2);
    else if (digits.startsWith("0")) digits = digits.slice(1);
    else break;
  }
  return digits;
};

/**
 * Keep the phone input to characters that can belong to a number. Thirteen
 * digits is the widest valid shape ("+91 09876543210"); normalizePhone strips
 * the country code and trunk zero back off once the shopper leaves the field,
 * and anything genuinely longer than a real number still fails the check.
 */
export const sanitizePhoneInput = (value) => {
  const raw = String(value ?? "");
  const prefix = raw.trimStart().startsWith("+") ? "+" : "";
  return prefix + raw.replace(/\D/g, "").slice(0, 13);
};

/** Returns an error message, or "" when the value is acceptable. */
export const validateEmail = (value, { required = true } = {}) => {
  const email = String(value ?? "").trim();
  if (!email) return required ? "Enter your email" : "";
  if (!EMAIL_RE.test(email)) return "Enter a valid email address";
  return "";
};

/** Returns an error message, or "" when the value is acceptable. */
export const validatePhone = (value, { required = true } = {}) => {
  const raw = String(value ?? "").trim();
  if (!raw) return required ? "Enter your phone number" : "";

  const phone = normalizePhone(raw);
  if (phone.length !== 10) return "Enter a valid 10-digit mobile number";
  // Length is right but the number cannot exist, so say which part is wrong
  // instead of repeating the digit count back at someone who got it right.
  if (!MOBILE_RE.test(phone)) return "Mobile numbers start with 6, 7, 8 or 9";
  return "";
};
