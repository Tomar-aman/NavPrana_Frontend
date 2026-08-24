"use client";

import { useEffect, useRef, useState } from "react";
import { isValidPincode, lookupPincode } from "@/lib/pincode";

// Long enough that typing the last digits of a PIN fires one request, short
// enough that city/state appear while the shopper is still looking at the field.
const DEBOUNCE_MS = 350;

/**
 * Watches a PIN code field and resolves it against the postal directory.
 *
 * `onResolved(details)` is called with { city, state } every
 * time a PIN resolves — the form decides what to overwrite, since a saved
 * address being edited already has a city the shopper may have refined.
 *
 * @returns {{ status: "idle"|"loading"|"resolved"|"not_found"|"unreachable",
 *             details: object|null }}
 */
export const usePincodeLookup = (pin, onResolved) => {
  const [status, setStatus] = useState("idle");
  const [details, setDetails] = useState(null);

  // The callback is written inline at the call site, so it gets a fresh
  // identity every render — holding the latest in a ref keeps the effect keyed
  // on the PIN alone instead of refetching on each keystroke elsewhere.
  const resolveRef = useRef(onResolved);
  resolveRef.current = onResolved;

  useEffect(() => {
    const code = String(pin || "").trim();

    if (!isValidPincode(code)) {
      setStatus("idle");
      setDetails(null);
      return;
    }

    let live = true;
    setStatus("loading");

    const timer = setTimeout(async () => {
      const result = await lookupPincode(code);
      // The PIN changed (or the form closed) while the request was in flight.
      if (!live) return;

      if (!result.ok) {
        setDetails(null);
        setStatus(result.reason === "not_found" ? "not_found" : "unreachable");
        return;
      }

      setDetails(result);
      setStatus("resolved");
      resolveRef.current?.(result);
    }, DEBOUNCE_MS);

    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [pin]);

  return { status, details };
};
