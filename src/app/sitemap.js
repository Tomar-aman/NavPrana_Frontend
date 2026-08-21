import { generateSlug } from "@/utils/slug";
import { SITE_URL, getProducts, getBlogList } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * Static pages carry a HAND-MAINTAINED lastModified date.
 *
 * These previously all reported `new Date()` — i.e. "changed today" on every
 * single sitemap fetch. Google's documented behaviour is to ignore lastmod
 * entirely once it decides a site's values are unreliable, which throws away a
 * signal that genuinely helps the pages that DO change (products, blog posts).
 *
 * When you meaningfully edit one of these pages, bump its date here. Leaving it
 * alone is correct and costs nothing; faking it is what causes harm.
 */
const staticPages = [
  { url: SITE_URL, lastModified: "2026-08-22", changeFrequency: "weekly", priority: 1.0 },
  { url: `${SITE_URL}/products`, lastModified: "2026-08-22", changeFrequency: "weekly", priority: 0.95 },
  { url: `${SITE_URL}/a2-desi-cow-ghee`, lastModified: "2026-08-22", changeFrequency: "monthly", priority: 0.9 },
  { url: `${SITE_URL}/health-benefits`, lastModified: "2026-08-22", changeFrequency: "monthly", priority: 0.85 },
  { url: `${SITE_URL}/about`, lastModified: "2026-08-22", changeFrequency: "monthly", priority: 0.8 },
  { url: `${SITE_URL}/blog`, lastModified: "2026-08-22", changeFrequency: "daily", priority: 0.8 },
  { url: `${SITE_URL}/faq`, lastModified: "2026-08-22", changeFrequency: "monthly", priority: 0.75 },
  { url: `${SITE_URL}/contact`, lastModified: "2026-02-11", changeFrequency: "yearly", priority: 0.7 },
  { url: `${SITE_URL}/shipping-policy`, lastModified: "2026-02-11", changeFrequency: "yearly", priority: 0.4 },
  { url: `${SITE_URL}/privacy-policy`, lastModified: "2026-02-11", changeFrequency: "yearly", priority: 0.3 },
  { url: `${SITE_URL}/terms-of-service`, lastModified: "2026-02-11", changeFrequency: "yearly", priority: 0.3 },
];

async function fetchProductPages() {
  // NOTE: there used to be a fallbackProductPages() here listing two hardcoded
  // slugs ("navprana-organics-pure-desi-buffalo-bilona-ghee-500ml", ...). Those
  // had drifted from the real catalogue and 404'd — a sitemap full of 404s is
  // worse than a shorter sitemap, so an empty list is the correct fallback.
  const products = await getProducts({ revalidate: 86400 });
  return products.map((product) => ({
    url: `${SITE_URL}/products/${generateSlug(product.name)}`,
    lastModified: new Date(product.updated_at || Date.now()),
    changeFrequency: "weekly",
    priority: 0.9,
  }));
}

async function fetchBlogPages() {
  const blogs = await getBlogList();
  return blogs
    .filter((blog) => blog.slug)
    .map((blog) => ({
      url: `${SITE_URL}/blog/${blog.slug}`,
      lastModified: new Date(blog.updated_at || blog.created_at || Date.now()),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
}

export default async function sitemap() {
  const withDate = staticPages.map((page) => ({
    ...page,
    lastModified: new Date(page.lastModified),
  }));

  try {
    const [productPages, blogPages] = await Promise.all([
      fetchProductPages(),
      fetchBlogPages(),
    ]);
    return [...withDate, ...productPages, ...blogPages];
  } catch (err) {
    // Guaranteed fallback: always return valid sitemap XML
    console.error("Sitemap: Unexpected error, returning static pages only", err);
    return withDate;
  }
}
