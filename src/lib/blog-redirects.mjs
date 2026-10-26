/**
 * Retired blog slugs → the post that replaced them.
 *
 * Read by next.config.mjs (permanent redirects) and by the sitemap (so a
 * redirecting URL is never listed). Plain .mjs with no imports so the Next
 * config can load it.
 *
 * Old slugs were still collecting impressions in Search Console while serving
 * a soft-404 "Blog" page, which threw that ranking away. A redirect passes it
 * to the live post instead.
 */
export const BLOG_REDIRECTS = {
  // Renamed posts
  "best-ghee-for-babies-how-to-choose-and-what-to-avoid": "best-ghee-for-babies-how-to-choose",
  "ghee-with-warm-milk-at-night": "ghee-with-warm-milk-at-night-benefits",
  "cow-ghee-vs-buffalo-ghee-which-one-should-you-buy": "cow-ghee-vs-buffalo-ghee-which-is-better",

  // Duplicate topic. Both posts targeted "does ghee increase cholesterol" and
  // sat at positions 10-11, splitting the query between them. The older,
  // longer post (from draft blog-15) is kept; unpublish the other in Django
  // admin as well.
  "is-ghee-increase-cholesterol": "does-ghee-increase-cholesterol",
};
