"use client";

import { useEffect, useState } from "react";
import { getPricingAPI } from "@/services/store/pricing";
import { PRICING_FALLBACK } from "@/lib/pricing";

// Pricing changes when someone edits it in the admin, which is rare, so the
// answer is shared across every component and every route for the life of the
// page rather than re-fetched per mount. `inflight` keeps two components
// mounting together from firing two requests.
let cached = null;
let inflight = null;

const fetchPricing = () => {
  if (cached) return Promise.resolve(cached);
  if (!inflight) {
    inflight = getPricingAPI()
      .then((data) => {
        cached = { ...PRICING_FALLBACK, ...data };
        return cached;
      })
      .catch(() => PRICING_FALLBACK)
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
};

/**
 * Storefront pricing, as set in the Django admin.
 *
 * @returns {{ pricing: object, loaded: boolean }} `loaded` is false while the
 *   fallback is still standing in.
 */
export const usePricing = () => {
  const [pricing, setPricing] = useState(cached || PRICING_FALLBACK);
  const [loaded, setLoaded] = useState(Boolean(cached));

  useEffect(() => {
    if (cached) return;

    let active = true;
    fetchPricing().then((data) => {
      if (!active) return;
      setPricing(data);
      setLoaded(true);
    });

    return () => {
      active = false;
    };
  }, []);

  return { pricing, loaded };
};

export { PRICING_FALLBACK, calculateShipping } from "@/lib/pricing";
