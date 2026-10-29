import { milkType } from "@/lib/site";
import { blogCtaCopy } from "./ctaCopy";

/**
 * Products ordered by relevance to a blog post: a post about cow ghee leads
 * with the cow SKUs. When a post names both milks (e.g. "cow ghee vs buffalo
 * ghee") or neither, the catalogue order is kept.
 *
 * Shared by the in-article product card, the sticky shop bar and the
 * ShopTheGhee block so all three recommend the same product first.
 */
export function orderProductsForBlog(blog, products = []) {
  const haystack = `${blog?.title || ""} ${blog?.slug || ""} ${
    blog?.excerpt || ""
  }`.toLowerCase();

  const mentionsCow = /\bcow\b/.test(haystack);
  const mentionsBuffalo = /buffalo/.test(haystack);

  // A post that names neither (or both) milks used to fall back to catalogue
  // order, so a "ghee in milk at night" reader could be shown buffalo ghee.
  // Use the post's topic instead: sweets lead with buffalo, the rest with cow.
  const want =
    mentionsCow !== mentionsBuffalo
      ? mentionsCow ? "cow" : "buffalo"
      : blogCtaCopy(blog).milk;
  if (!want) return products;

  return [
    ...products.filter((p) => milkType(p) === want),
    ...products.filter((p) => milkType(p) !== want),
  ];
}
