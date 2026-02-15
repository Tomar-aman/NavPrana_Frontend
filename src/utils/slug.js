/**
 * Generate a URL-friendly slug from a product name.
 * e.g. "Buffalo A2 Bilona Ghee (500 ml)" → "buffalo-a2-bilona-ghee-500-ml"
 */
export function generateSlug(name) {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/[()]/g, "") // remove parentheses
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
}

/**
 * Find a product from a list by matching its generated slug.
 * Returns the product object or null.
 */
export function findProductBySlug(products, slug) {
  if (!products || !slug) return null;
  return products.find((p) => generateSlug(p.name) === slug) || null;
}
