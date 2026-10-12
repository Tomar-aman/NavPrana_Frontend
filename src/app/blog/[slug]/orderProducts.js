import { milkType } from "@/lib/site";

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

  if (mentionsCow === mentionsBuffalo) return products;

  const want = mentionsCow ? "cow" : "buffalo";
  return [
    ...products.filter((p) => milkType(p) === want),
    ...products.filter((p) => milkType(p) !== want),
  ];
}
