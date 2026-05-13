"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { PIXEL_ID, trackPageView } from "@/lib/meta-pixel";

/**
 * MetaPixel — Client component that:
 *  1. Injects the fbevents.js SDK once on mount.
 *  2. Fires a fresh PageView on every SPA route change.
 */
const MetaPixel = () => {
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

    window.fbq("init", PIXEL_ID);
    window.fbq("track", "PageView");
  }, []);

  /* ——— Fire PageView on every SPA route change ——— */
  const pathname = usePathname();

  useEffect(() => {
    // Skip the very first mount — the SDK init above already fired PageView
    if (!window.fbq) return;
    trackPageView();
  }, [pathname]);

  return null; // renders nothing
};

export default MetaPixel;
