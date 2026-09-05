/**
 * Storefront pricing — the figures staff set in the Django admin under Pricing
 * Settings, plus the one calculation the storefront has to be able to do for
 * itself.
 *
 * Deliberately free of React so that server components (the Shipping Policy
 * page) and the client hook can both read it.
 */

/**
 * Used only until the real figures arrive, and again if the request fails.
 *
 * These must stay equal to the defaults on PricingSettings in the backend. They
 * are a stopgap, not a second source of truth: the backend prices every order
 * itself, so if these are ever wrong the shopper sees a total the order is not
 * created with. Falling back rather than blocking is still the right trade —
 * a config request that fails must not cost a sale.
 */
export const PRICING_FALLBACK = {
  cod_handling_fee: 49,
  shipping_fee: 50,
  free_shipping_threshold: 599,
  prepaid_discount_enabled: false,
  prepaid_discount: 0,
};

/**
 * Shipping for a given subtotal. Mirrors Order.calculate_shipping() on the
 * backend — the one piece of arithmetic that has to exist on both sides,
 * because the storefront quotes it before there is an order to ask about.
 */
export const calculateShipping = (subtotal, pricing, freeShippingCoupon = false) => {
  if (subtotal <= 0) return 0;
  if (subtotal > pricing.free_shipping_threshold) return 0;
  if (freeShippingCoupon) return 0;
  return pricing.shipping_fee;
};

/**
 * Server-side read, for pages rendered on the server.
 *
 * Uses plain fetch rather than the axios client, which attaches a token read
 * from browser storage and has nothing to attach here. Revalidated hourly:
 * these pages are static, and a policy page an hour behind a price change is
 * acceptable where a checkout total would not be.
 */
export const fetchPricingServer = async () => {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL;
    if (!base) return PRICING_FALLBACK;

    const res = await fetch(`${base}api/v1/public/pricing/`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return PRICING_FALLBACK;

    return { ...PRICING_FALLBACK, ...(await res.json()) };
  } catch {
    // A policy page must still render when the API is unreachable.
    return PRICING_FALLBACK;
  }
};
