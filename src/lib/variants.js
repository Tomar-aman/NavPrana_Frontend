import { productFamily } from "@/lib/reviews";
import { generateSlug } from "@/utils/slug";

/**
 * Size variants and the one URL per family that search engines should index.
 *
 * Each pack size is its own product (and its own URL) in the API, so
 * "Desi Cow A2 Bilona Ghee (500 ml)" and "(1 Ltr)" rendered as two
 * near-identical pages. Search Console showed them competing for the same
 * queries — "bilona cow ghee" sat at position 6.6 on the 500 ml page and 46.7
 * on the 1 litre page — so neither ranked well. Every size page stays live
 * (shoppers still buy each size there), but they all name the smallest pack
 * as canonical, and only that one goes into the sitemap.
 */

/** Pack size in millilitres, parsed from the product name. 0 when unknown. */
export function sizeInMl(product) {
  const match = String(product?.name || "").match(
    /(\d+(?:\.\d+)?)\s*(ml|l|ltr|litre|liter)\b/i,
  );
  if (!match) return 0;
  const value = Number(match[1]);
  return /^ml$/i.test(match[2]) ? value : value * 1000;
}

/** Every size of the same ghee as `product`, smallest pack first. */
export function familyMembers(product, catalogue = []) {
  const family = productFamily(product);
  const members = catalogue.filter((p) => productFamily(p) === family);
  if (!members.some((p) => p.id === product?.id)) members.push(product);
  return members.sort((a, b) => sizeInMl(a) - sizeInMl(b));
}

/** The family member whose URL is canonical — the smallest pack. */
export function primaryVariant(product, catalogue = []) {
  return familyMembers(product, catalogue)[0] || product;
}

export function primarySlug(product, catalogue = []) {
  return generateSlug(primaryVariant(product, catalogue).name);
}

/** One product per family (its canonical member), in catalogue order. */
export function primaryVariants(catalogue = []) {
  const seen = new Set();
  const result = [];
  for (const p of catalogue) {
    const family = productFamily(p);
    if (seen.has(family)) continue;
    seen.add(family);
    result.push(primaryVariant(p, catalogue));
  }
  return result;
}

/** "Desi Cow A2 Bilona Ghee (500 ml)" → "Desi Cow A2 Bilona Ghee" — for cards
 *  that stand for every size of the ghee. */
export function familyName(product) {
  return String(product?.name || "").replace(/\s*\([^)]*\)\s*/g, " ").trim();
}
