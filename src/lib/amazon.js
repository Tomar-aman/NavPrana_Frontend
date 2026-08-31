/**
 * Amazon marketplace links for the "Buy on Amazon" button on product pages.
 *
 * The product API (/api/v1/product/products/) has no marketplace field, so the
 * mapping lives here. If the backend ever adds one, an `amazon_url` (or
 * `amazon_link`) on the product wins automatically — no code change needed.
 *
 * Resolution order:
 *   1. product.amazon_url / product.amazon_link from the API
 *   2. AMAZON_PRODUCT_LINKS below, keyed by the product slug
 *   3. AMAZON_STORE_URL — the storefront, used only when ALLOW_STORE_FALLBACK
 *      is on, so a mis-slugged product does not silently dump shoppers on a
 *      generic page instead of the listing they clicked for
 *   4. null → the button is not rendered at all
 */
import { generateSlug } from "@/utils/slug";

/** Brand storefront / search page. */
export const AMAZON_STORE_URL = "";

/**
 * Send shoppers to AMAZON_STORE_URL when a product has no listing of its own.
 * Off by default: a wrong-product landing costs more than a missing button.
 */
const ALLOW_STORE_FALLBACK = false;

/**
 * Per-product listings, keyed by the slug generateSlug() builds from the
 * product name (the same slug the /products/[slug] route uses).
 *
 * Leave a value empty to hide the button for that product.
 */
export const AMAZON_PRODUCT_LINKS = {
  // Both cow sizes share one Amazon listing (size is a variant there), so the
  // 1 L and 500 ml pages deliberately point at the same ASIN.
  "desi-cow-a2-bilona-ghee-1-ltr": "https://www.amazon.in/dp/B0H6VF8R7S",
  "desi-cow-a2-bilona-ghee-500-ml": "https://www.amazon.in/dp/B0H6VF8R7S",
  // th=1 selects the default variant on the buffalo listing.
  "buffalo-a2-bilona-ghee-1-ltr": "https://www.amazon.in/dp/B0H4VFYGJ7?th=1",
  "buffalo-a2-bilona-ghee-500-ml": "https://www.amazon.in/dp/B0H4VFYGJ7?th=1",
};

/**
 * Amazon affiliate/attribution tag appended as ?tag= when set. Kept out of the
 * URLs above so it can be changed in one place.
 */
const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG || "";

const isHttpUrl = (value) =>
  typeof value === "string" && /^https?:\/\//i.test(value.trim());

const withTag = (url) => {
  if (!AMAZON_TAG) return url;
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has("tag")) {
      parsed.searchParams.set("tag", AMAZON_TAG);
    }
    return parsed.toString();
  } catch {
    return url;
  }
};

/**
 * Resolve the Amazon listing for a product.
 * @returns {string|null} an absolute https URL, or null when there is none.
 */
export function getAmazonUrl(product) {
  if (!product) return null;

  const fromApi = product.amazon_url || product.amazon_link;
  if (isHttpUrl(fromApi)) return withTag(fromApi.trim());

  const mapped = AMAZON_PRODUCT_LINKS[generateSlug(product.name)];
  if (isHttpUrl(mapped)) return withTag(mapped.trim());

  if (ALLOW_STORE_FALLBACK && isHttpUrl(AMAZON_STORE_URL)) {
    return withTag(AMAZON_STORE_URL.trim());
  }

  return null;
}
