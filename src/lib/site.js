/**
 * Single source of truth for the canonical site origin and the product API.
 *
 * Every canonical tag, sitemap entry and JSON-LD `url` is built from SITE_URL.
 * Production serves the NON-www host (www.navprana.com 301s to navprana.com),
 * so the fallback here MUST stay non-www — the previous per-file fallbacks were
 * all "https://www.navprana.com", which meant a missing env var silently
 * pointed every canonical and sitemap URL at a redirecting hostname.
 */
import { withSafeReviews, withFamilyRatings } from "@/lib/reviews";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://navprana.com"
).replace(/\/+$/, "");

/**
 * API origin with trailing slashes stripped, so callers can always join with an
 * explicit "/". Concatenating the raw env value produced
 * "https://api.navprana.comapi/v1/..." in production once already.
 */
export const API_BASE = (
  process.env.NEXT_PUBLIC_BASE_URL || "https://api.navprana.com/"
).replace(/\/+$/, "");

const PRODUCTS_ENDPOINT = `${API_BASE}/api/v1/product/products/`;

/**
 * Fetch the product catalogue for server rendering.
 *
 * Shared by the homepage, /products, /products/[slug] and the sitemap so the
 * four of them can never disagree about the catalogue. Cached for an hour and
 * refreshed on demand through /api/revalidate when a product is saved.
 */
export async function getProducts({ revalidate = 3600 } = {}) {
  try {
    const res = await fetch(PRODUCTS_ENDPOINT, {
      next: { revalidate },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      console.error(`getProducts: HTTP ${res.status}`);
      return [];
    }
    const data = await res.json();
    const products = data.results || data || [];
    if (!Array.isArray(products)) return [];
    // Strip buyer emails, then pool each product's rating with its other pack
    // sizes so every surface agrees on the review count.
    return withFamilyRatings(products.map(withSafeReviews));
  } catch (err) {
    console.error("getProducts: fetch failed", err);
    return [];
  }
}

/**
 * Fetch the blog listing for server rendering.
 *
 * Named getBlogList, not getBlogs, because src/services/blog/get-blogs.js
 * already exports a getBlogs — that one goes through the axios client for
 * browser calls, this one uses fetch with ISR for server rendering. Two
 * functions with one name across the two contexts is how you end up importing
 * the wrong one.
 *
 * Same contract as getProducts(): ISR-cached, swallows its own errors so a slow
 * or down API degrades to an empty section rather than a broken page.
 */
export async function getBlogList({ revalidate = 3600 } = {}) {
  try {
    const res = await fetch(`${API_BASE}/api/v1/blogs/`, {
      next: { revalidate },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      console.error(`getBlogList: HTTP ${res.status}`);
      return [];
    }
    const data = await res.json();
    return data.results || data || [];
  } catch (err) {
    console.error("getBlogList: fetch failed", err);
    return [];
  }
}

/**
 * The image to lead with for a product.
 *
 * `images.find(i => i.is_feature)?.image || images[0]?.image` was written out by
 * hand in eight places — every product grid, the product page metadata, the
 * product JSON-LD, the cart, the blog product block. One copy, one fallback.
 */
export function featuredImage(product, fallback = null) {
  const images = product?.images || [];
  return (
    images.find((img) => img.is_feature)?.image || images[0]?.image || fallback
  );
}

/**
 * Which milk a product is made from, derived from its name.
 *
 * The Product JSON-LD used to hardcode "A2 Buffalo Milk" for every SKU, which
 * told Google the cow ghee products were made from buffalo milk — a direct
 * contradiction of the product name that destroyed relevance for cow-ghee
 * queries. Prefer an explicit `milk_source` field when the API grows one.
 */
export function milkSource(product) {
  if (product?.milk_source) return product.milk_source;
  return /cow/i.test(product?.name || "") ? "A2 Desi Cow Milk" : "A2 Buffalo Milk";
}

/** "cow" | "buffalo" — for picking copy variants. */
export function milkType(product) {
  return /cow/i.test(product?.name || "") ? "cow" : "buffalo";
}

/**
 * Trim text to a meta-description-safe length on a word boundary.
 * Google renders ~155-160 characters; the raw API `description` field is
 * multi-paragraph marketing copy, so unbounded use loses control of the snippet.
 */
export function clampDescription(text, max = 155) {
  if (!text) return "";
  const flat = String(text).replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\-\s]+$/, "")}…`;
}
