/**
 * Meta Pixel (Facebook Pixel) — Centralized Utility
 *
 * This module exposes helpers for every standard and custom event
 * so that individual components never need to touch `window.fbq` directly.
 *
 * Usage:  import { trackAddToCart } from '@/lib/meta-pixel';
 */

// Set NEXT_PUBLIC_META_PIXEL_ID to point the site at a different Meta account
// without touching code. NEXT_PUBLIC_* values are baked in at build time, so a
// rebuild is required after changing it. The literal is the current pixel and
// acts as a fallback if the env var is missing on a deploy target.
const PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "1608795464220542";

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

/** Safe wrapper — only fires if fbq is available (client-side) */
const fbq = (...args) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq(...args);
  }
};

const digitsOnly = (value) => String(value ?? "").replace(/\D/g, "");

/** Meta normalises advanced-matching text itself, but only after trimming. */
const clean = (value) => {
  const text = String(value ?? "").trim().toLowerCase();
  return text || undefined;
};

/** Meta wants city/state as one lowercase token with no spaces or punctuation. */
const cleanToken = (value) => {
  const text = clean(value);
  return text ? text.replace(/[^a-z]/g, "") || undefined : undefined;
};

/**
 * Meta wants E.164 digits WITHOUT the leading "+". Numbers are stored here as
 * bare 10-digit Indian mobiles, which Meta cannot match without a country
 * code, so prefix 91 when that is clearly what we have.
 */
const normalizePhone = (phone) => {
  const digits = digitsOnly(phone);
  if (!digits) return undefined;
  if (digits.length === 10) return `91${digits}`;
  return digits;
};

// Meta expects a lowercase 2-letter ISO country code. Addresses here store the
// display name, so map the ones we actually ship to.
const COUNTRY_CODES = { india: "in", bharat: "in" };

const countryCode = (country) => {
  const text = clean(country);
  if (!text) return undefined;
  if (text.length === 2) return text;
  return COUNTRY_CODES[text];
};

/* ------------------------------------------------------------------ */
/*  Advanced Matching (customer details)                              */
/* ------------------------------------------------------------------ */

/*
 * WHY THIS EXISTS
 *
 * fbq("init", PIXEL_ID) on its own sends events with no person attached, so
 * Events Manager records a Purchase it cannot attribute to anyone: no match
 * quality, no attribution back to the ad that drove the sale, and the buyer
 * can never land in a Custom Audience or a lookalike seed.
 *
 * The browser pixel takes these fields as PLAIN TEXT — fbevents.js SHA-256
 * hashes them before anything leaves the browser, so no raw PII goes over the
 * wire. Re-calling init with the same pixel id updates the matching params for
 * every subsequent event and does NOT fire another PageView, which is how you
 * attach details that only become known later (login, checkout).
 */

/** Last advanced-matching payload pushed to the pixel. */
let userData = null;

/**
 * Map whatever mix of profile / guest-form / address fields we have onto the
 * short keys Meta's browser pixel expects.
 *
 * @param {Object} source
 * @returns {Object} only the keys that actually carry a value
 */
export const buildUserData = (source = {}) => {
  const externalId = source.id ?? source.user_id ?? source.customer_id;

  const data = {
    em: clean(source.email),
    ph: normalizePhone(source.phone_number ?? source.phone),
    fn: clean(source.first_name),
    ln: clean(source.last_name),
    ct: cleanToken(source.city),
    st: cleanToken(source.state),
    zp: digitsOnly(source.postal_code ?? source.zip) || undefined,
    country: countryCode(source.country),
    external_id: externalId != null ? String(externalId) : undefined,
  };

  // Empty keys actively LOWER the match-quality score, so drop them.
  return Object.fromEntries(Object.entries(data).filter(([, v]) => v));
};

/**
 * Attach customer details to every subsequent pixel event.
 *
 * Merges with whatever was already known — the profile knows the email and
 * phone, the checkout address knows the city and PIN, and both should end up
 * on the Purchase event. Skips the re-init when nothing changed so a re-render
 * does not churn the pixel.
 *
 * @param {Object} source  profile, guest details, or an address object
 */
export const setUserData = (source) => {
  const next = buildUserData(source);
  if (Object.keys(next).length === 0) return;

  const merged = { ...(userData || {}), ...next };
  if (userData && JSON.stringify(merged) === JSON.stringify(userData)) return;

  userData = merged;
  fbq("init", PIXEL_ID, merged);
};

/** Read back the current matching payload (used by the SDK loader on init). */
export const getUserData = () => userData;

/** Drop customer details — call on sign-out so the next visitor is not tagged. */
export const clearUserData = () => {
  userData = null;
};

/* ------------------------------------------------------------------ */
/*  Conversions API support                                           */
/* ------------------------------------------------------------------ */

/*
 * A server-side (CAPI) event matches far better when it carries the same
 * browser identifiers the pixel uses — _fbp (browser id) and _fbc (ad click
 * id). Django cannot read them on its own: the API is on api.navprana.com,
 * a different origin, and the axios client does not send cookies there. So
 * they ride along in the create-order payload instead, and the backend stores
 * them on the order for when it fires Purchase.
 */

const readCookie = (name) => {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : undefined;
};

/**
 * Browser identifiers to hand to the Conversions API.
 *
 * `_fbc` only exists once someone has arrived from an ad — the pixel writes it
 * from the `fbclid` query param and it then persists as a cookie. The URL
 * fallback below only helps if the purchase happens on the very landing page,
 * but it costs nothing and covers the case where the pixel was blocked from
 * writing the cookie.
 *
 * @returns {{ fbp?: string, fbc?: string }} omits whichever is unavailable
 */
export const getFbCookies = () => {
  const fbp = readCookie("_fbp");
  let fbc = readCookie("_fbc");

  if (!fbc && typeof window !== "undefined") {
    const fbclid = new URLSearchParams(window.location.search).get("fbclid");
    // Meta's documented format: fb.<subdomainIndex>.<timestamp>.<fbclid>
    if (fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
  }

  return { ...(fbp ? { fbp } : {}), ...(fbc ? { fbc } : {}) };
};

/* ------------------------------------------------------------------ */
/*  Standard Events                                                   */
/* ------------------------------------------------------------------ */

/**
 * Build Meta's `contents` array from cart-shaped rows.
 *
 * Meta uses it for catalogue matching and dynamic-ads retargeting; a Purchase
 * without it cannot be tied back to the products that were actually bought.
 *
 * @param {Array} items  rows shaped { product | product_detail, quantity }
 */
export const buildContents = (items = []) =>
  items
    .map((item) => {
      const product = item.product_detail || item.product || {};
      // Server cart rows carry the id on `product`; local guest rows and the
      // merged checkout rows put the whole object there instead.
      const id =
        (typeof product === "object" ? product.id : product) ??
        item.product ??
        item.product_id;
      if (id == null || typeof id === "object") return null;

      const price = Number(product?.price);
      return {
        id: String(id),
        quantity: Number(item.quantity) || 1,
        ...(Number.isFinite(price) && price > 0 ? { item_price: price } : {}),
      };
    })
    .filter(Boolean);

/**
 * PageView — fired automatically from the layout script, but exposed
 * here so SPA route-changes can re-fire it if needed.
 */
export const trackPageView = () => {
  fbq("track", "PageView");
};

/**
 * ViewContent — fire when a user views a product detail page.
 *
 * @param {Object} product  - The product object
 */
export const trackViewContent = (product) => {
  if (!product) return;
  fbq("track", "ViewContent", {
    content_name: product.name,
    content_ids: [String(product.id)],
    contents: [
      {
        id: String(product.id),
        quantity: 1,
        item_price: Number(product.price),
      },
    ],
    content_type: "product",
    value: Number(product.price),
    currency: "INR",
  });
};

/**
 * AddToCart
 *
 * @param {Object}  product   - Product object (id, name, price …)
 * @param {number}  quantity  - Quantity being added
 */
export const trackAddToCart = (product, quantity = 1) => {
  if (!product) return;
  fbq("track", "AddToCart", {
    content_name: product.name,
    content_ids: [String(product.id)],
    contents: [
      { id: String(product.id), quantity, item_price: Number(product.price) },
    ],
    content_type: "product",
    value: Number(product.price) * quantity,
    currency: "INR",
    num_items: quantity,
  });
};

/**
 * InitiateCheckout
 *
 * @param {Array}  items     - Merged cart items [{product, quantity}]
 * @param {number} total     - Cart total
 */
export const trackInitiateCheckout = (items = [], total = 0) => {
  const contents = buildContents(items);
  fbq("track", "InitiateCheckout", {
    content_ids: contents.map((c) => c.id),
    contents,
    content_type: "product",
    num_items: contents.reduce((sum, c) => sum + c.quantity, 0),
    value: Number(total),
    currency: "INR",
  });
};

/**
 * AddPaymentInfo — fire when a user selects a payment method.
 *
 * @param {string} paymentMethod  - e.g. "upi", "card", "cod"
 * @param {number} value          - order value at the time of selection
 */
export const trackAddPaymentInfo = (paymentMethod, value = 0) => {
  fbq("track", "AddPaymentInfo", {
    content_category: paymentMethod,
    value: Number(value) || 0,
    currency: "INR",
  });
};

/**
 * Purchase — fire on successful order completion (COD or online).
 *
 * NOTE: transaction_id is deliberately NOT sent as a parameter. It is not a
 * Meta field (Events Manager flags it as unsupported); order_id is the standard
 * one, and the transaction id is used for the dedup eventID instead.
 *
 * @param {Object} opts
 * @param {string} opts.orderId
 * @param {number} opts.value
 * @param {string} opts.currency   - defaults to "INR"
 * @param {Array}  opts.contentIds - array of product ID strings
 * @param {Array}  opts.contents   - [{ id, quantity, item_price }]
 * @param {number} opts.numItems
 * @param {string} opts.eventId    - dedup key (also dedups a page refresh)
 */
export const trackPurchase = ({
  orderId,
  value = 0,
  currency = "INR",
  contentIds = [],
  contents = [],
  numItems = 0,
  eventId,
} = {}) => {
  const ids = contentIds.length
    ? contentIds.map(String)
    : contents.map((c) => String(c.id));

  const params = {
    content_type: "product",
    content_ids: ids,
    value: Number(value) || 0,
    currency,
    num_items:
      Number(numItems) ||
      contents.reduce((sum, c) => sum + (Number(c.quantity) || 0), 0),
  };

  if (contents.length) params.contents = contents;
  if (orderId) params.order_id = String(orderId);

  // The 4th argument is the only way to set eventID, and handing fbevents an
  // explicit undefined there is not safe — so branch instead.
  if (eventId) {
    fbq("track", "Purchase", params, { eventID: String(eventId) });
  } else {
    fbq("track", "Purchase", params);
  }
};

/* ------------------------------------------------------------------ */
/*  Purchase hand-off (checkout ➜ success screen)                     */
/* ------------------------------------------------------------------ */

/*
 * The success screens only ever knew an order id — not the amount, not the
 * products, not who bought. That is why COD purchases reported a value of 0
 * with no content_ids and no customer attached.
 *
 * All of it IS known on the checkout screen, so checkout stashes a snapshot
 * and the success screen fires the complete event from it. sessionStorage
 * rather than Redux because Cashfree navigates away and back, and a refresh on
 * the success page wipes the store. The snapshot is replaced by a "fired"
 * marker once used, so a refresh cannot double-count the sale.
 */

const PENDING_KEY = "navprana_pending_purchase";

const readPending = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writePending = (payload) => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(payload));
  } catch {
    // Private mode / quota — firePendingPurchase falls back to a minimal event.
  }
};

/**
 * Stash everything the Purchase event needs, at the moment the order is created.
 *
 * @param {Object} snapshot
 * @param {string} snapshot.orderId
 * @param {string} snapshot.transactionId
 * @param {number} snapshot.value      - amount actually payable
 * @param {Array}  snapshot.contents   - [{ id, quantity, item_price }]
 * @param {Object} snapshot.user       - customer details for advanced matching
 */
export const savePendingPurchase = ({
  orderId,
  transactionId,
  value = 0,
  currency = "INR",
  contents = [],
  user = null,
} = {}) => {
  writePending({
    orderId: orderId != null ? String(orderId) : null,
    transactionId: transactionId != null ? String(transactionId) : null,
    value: Number(value) || 0,
    currency,
    contents,
    // Hashing happens in fbevents.js, but only the short Meta keys are stored
    // here — never the raw form object.
    user: user ? buildUserData(user) : null,
    fired: false,
  });
};

/**
 * Fire the Purchase event for a completed order, exactly once.
 *
 * @param {Object} opts
 * @param {string} opts.orderId        - id known to the success screen
 * @param {string} opts.transactionId
 * @param {number} opts.fallbackValue  - amount from the payment API, used only
 *                                       if the checkout snapshot is missing
 * @returns {boolean} whether an event was sent
 */
export const firePendingPurchase = ({
  orderId,
  transactionId,
  fallbackValue = 0,
} = {}) => {
  const pending = readPending();
  const id = orderId ?? pending?.orderId;
  const txn = transactionId ?? pending?.transactionId;

  if (!id && !txn) return false;

  // Already counted this order — a refresh or a re-render, not a second sale.
  if (pending?.fired && String(pending.orderId) === String(id)) return false;

  // A stale snapshot from an earlier order must not be attached to this one.
  const usable = Boolean(
    pending &&
      !pending.fired &&
      (!id || !pending.orderId || String(pending.orderId) === String(id)),
  );

  const value =
    usable && pending.value > 0 ? pending.value : Number(fallbackValue) || 0;

  if (usable && pending.user) {
    // Re-attach the buyer's details before the event goes out — on this screen
    // the profile may not have loaded, and guests have no profile at all.
    setUserData(pending.user);
  }

  trackPurchase({
    orderId: id,
    value,
    currency: usable ? pending.currency : "INR",
    contents: usable ? pending.contents : [],
    // Deterministic so Meta also dedups it against a server-side (CAPI) copy
    // and against a browser re-fire inside the dedup window.
    eventId: id ? `purchase_${id}` : `purchase_txn_${txn}`,
  });

  writePending({ orderId: id != null ? String(id) : null, fired: true });
  return true;
};

/**
 * CompleteRegistration — fire when a user successfully signs up.
 *
 * @param {string} method - e.g. "email"
 */
export const trackCompleteRegistration = (method = "email") => {
  fbq("track", "CompleteRegistration", {
    content_name: method,
    status: true,
  });
};

/**
 * Contact — fire when a user submits the contact form.
 */
export const trackContact = () => {
  fbq("track", "Contact");
};

/**
 * Lead — fire alongside Contact for lead-gen tracking.
 *
 * @param {Object} opts
 * @param {string} opts.contentName  - e.g. "Contact Form"
 */
export const trackLead = ({ contentName = "Contact Form" } = {}) => {
  fbq("track", "Lead", {
    content_name: contentName,
  });
};

/**
 * Search — fire when a user searches for products.
 *
 * @param {string} query
 */
export const trackSearch = (query) => {
  fbq("track", "Search", {
    search_string: query,
  });
};

/**
 * Custom event helper — for anything not covered above.
 *
 * @param {string} eventName
 * @param {Object} params
 */
export const trackCustomEvent = (eventName, params = {}) => {
  fbq("trackCustom", eventName, params);
};

export { PIXEL_ID };
