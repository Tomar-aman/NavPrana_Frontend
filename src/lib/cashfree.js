const SDK_URL = "https://sdk.cashfree.com/js/v3/cashfree.js";

// Memoised so checkout can warm the SDK up and /payment reuses the very same
// download instead of fetching the script a second time.
let sdkPromise = null;

export const loadCashfreeSdk = () => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Cashfree SDK needs a browser"));
  }

  if (window.Cashfree) return Promise.resolve(window.Cashfree);
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SDK_URL}"]`);
    const script = existing || document.createElement("script");

    const onLoad = () => {
      if (window.Cashfree) resolve(window.Cashfree);
      else reject(new Error("Cashfree SDK loaded but window.Cashfree is missing"));
    };
    const onError = () => {
      // Let a later attempt retry rather than caching the failure forever.
      sdkPromise = null;
      reject(new Error("Failed to load the Cashfree SDK"));
    };

    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", onError, { once: true });

    if (!existing) {
      script.src = SDK_URL;
      script.async = true;
      document.body.appendChild(script);
    }
  });

  return sdkPromise;
};

/** Cashfree instance for the configured environment. */
export const getCashfree = async () => {
  const Cashfree = await loadCashfreeSdk();
  return new Cashfree({
    mode: process.env.NEXT_PUBLIC_CASHFREE_MODE || "sandbox",
  });
};
