/**
 * Meta Pixel (Facebook Pixel) — Centralized Utility
 *
 * Pixel ID: 1893858241314981
 *
 * This module exposes helpers for every standard and custom event
 * so that individual components never need to touch `window.fbq` directly.
 *
 * Usage:  import { trackAddToCart } from '@/lib/meta-pixel';
 */

const PIXEL_ID = "1893858241314981";

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

/** Safe wrapper — only fires if fbq is available (client-side) */
const fbq = (...args) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq(...args);
  }
};

/* ------------------------------------------------------------------ */
/*  Standard Events                                                   */
/* ------------------------------------------------------------------ */

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
  fbq("track", "InitiateCheckout", {
    content_ids: items
      .filter((i) => i.product)
      .map((i) => String(i.product.id)),
    content_type: "product",
    num_items: items.reduce((sum, i) => sum + (i.quantity || 0), 0),
    value: Number(total),
    currency: "INR",
  });
};

/**
 * AddPaymentInfo — fire when a user selects a payment method.
 *
 * @param {string} paymentMethod  - e.g. "upi", "card", "cod"
 */
export const trackAddPaymentInfo = (paymentMethod) => {
  fbq("track", "AddPaymentInfo", {
    content_category: paymentMethod,
  });
};

/**
 * Purchase — fire on successful order completion (COD or online).
 *
 * @param {Object} opts
 * @param {string} opts.orderId
 * @param {string} opts.transactionId
 * @param {number} opts.value
 * @param {string} opts.currency   - defaults to "INR"
 * @param {Array}  opts.contentIds - array of product ID strings
 * @param {number} opts.numItems
 */
export const trackPurchase = ({
  orderId,
  transactionId,
  value = 0,
  currency = "INR",
  contentIds = [],
  numItems = 0,
} = {}) => {
  fbq("track", "Purchase", {
    content_ids: contentIds,
    content_type: "product",
    value: Number(value),
    currency,
    num_items: numItems,
    order_id: orderId,
    transaction_id: transactionId,
  });
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
