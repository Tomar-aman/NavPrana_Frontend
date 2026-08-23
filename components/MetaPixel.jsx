"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useProfile } from "@/Context/ProfileContext";
import {
  PIXEL_ID,
  clearUserData,
  getUserData,
  setUserData,
  trackPageView,
} from "@/lib/meta-pixel";

/**
 * MetaPixel — Client component that:
 *  1. Injects the fbevents.js SDK once on mount.
 *  2. Attaches the signed-in customer's details (advanced matching) so Meta can
 *     actually match conversions to people.
 *  3. Fires a fresh PageView on every SPA route change.
 *
 * Mounted inside ProfileProvider (see app/layout.js) — it needs the profile.
 */
const MetaPixel = () => {
  const { profile } = useProfile();

  /* ——— Inject the SDK once ——— */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.fbq) return; // already loaded

    /* eslint-disable */
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      "script",
      "https://connect.facebook.net/en_US/fbevents.js"
    );
    /* eslint-enable */

    // If the profile already resolved before the SDK stub existed, its details
    // were cached in the module and would otherwise be lost on this init.
    const known = getUserData();
    if (known) {
      window.fbq("init", PIXEL_ID, known);
    } else {
      window.fbq("init", PIXEL_ID);
    }
    window.fbq("track", "PageView");
  }, []);

  /* ——— Advanced matching: who is browsing/buying ——— */
  // Without this every event reaches Meta anonymous — Events Manager shows the
  // Purchase but cannot attribute it, so ads reporting and audiences stay empty.
  // Re-calling init with user data does not fire an extra PageView.
  const wasSignedIn = useRef(false);

  useEffect(() => {
    if (profile) {
      wasSignedIn.current = true;
      setUserData(profile);
    } else if (wasSignedIn.current) {
      // Signed out without a reload — do not tag the next visitor as this one.
      wasSignedIn.current = false;
      clearUserData();
    }
  }, [profile]);

  /* ——— Fire PageView on every SPA route change ——— */
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip the very first mount — the SDK init above already fired PageView.
    // (This guard used to be missing, so every first page load counted twice.)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!window.fbq) return;
    trackPageView();
  }, [pathname]);

  // The <noscript> fallback lives in app/layout.js so it renders server-side.
  return null;
};

export default MetaPixel;
