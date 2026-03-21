import { generateSlug } from "@/utils/slug";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.navprana.com";
const BASE_API = (process.env.NEXT_PUBLIC_BASE_URL || "https://api.navprana.cloud/").replace(/\/+$/, "");

const staticPages = [
  { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
  { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
  { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE_URL}/health-benefits`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/shipping-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
  { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  { url: `${BASE_URL}/terms-of-service`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
];

async function fetchProductPages() {
  try {
    const res = await fetch(`${BASE_API}/api/v1/product/products/`, {
      next: { revalidate: 86400 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return fallbackProductPages();
    const data = await res.json();
    const products = data.results || data || [];
    return products.map((product) => ({
      url: `${BASE_URL}/products/${generateSlug(product.name)}`,
      lastModified: new Date(product.updated_at || new Date()),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (err) {
    console.error("Sitemap: Product fetch failed", err);
    return fallbackProductPages();
  }
}

function fallbackProductPages() {
  const knownSlugs = [
    "navprana-organics-pure-desi-buffalo-bilona-ghee-500ml",
    "navprana-organics-pure-desi-buffalo-bilona-ghee-1-litre",
  ];
  return knownSlugs.map((slug) => ({
    url: `${BASE_URL}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));
}

async function fetchBlogPages() {
  try {
    const res = await fetch(`${BASE_API}/api/v1/blogs/`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      console.error(`Sitemap: Blog fetch returned HTTP ${res.status}`);
      return [];
    }
    const data = await res.json();
    const blogs = data.results || data || [];
    return blogs
      .filter((blog) => blog.slug)
      .map((blog) => ({
        url: `${BASE_URL}/blog/${blog.slug}`,
        lastModified: new Date(blog.updated_at || blog.created_at || new Date()),
        changeFrequency: "weekly",
        priority: 0.7,
      }));
  } catch (err) {
    console.error("Sitemap: Blog fetch failed", err);
    return [];
  }
}

export default async function sitemap() {
  try {
    const [productPages, blogPages] = await Promise.all([
      fetchProductPages(),
      fetchBlogPages(),
    ]);
    return [...staticPages, ...productPages, ...blogPages];
  } catch (err) {
    // Guaranteed fallback: always return valid sitemap XML
    console.error("Sitemap: Unexpected error, returning static pages only", err);
    return staticPages;
  }
}
