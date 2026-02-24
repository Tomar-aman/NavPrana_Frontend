import { generateSlug } from "@/utils/slug";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.navprana.com";

export default async function sitemap() {
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/health-benefits`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/shipping-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Fetch product pages dynamically
  const BASE_API = (process.env.NEXT_PUBLIC_BASE_URL || "https://api.navprana.cloud/").replace(/\/+$/, "");
  
  let productPages = [];
  try {
    const res = await fetch(`${BASE_API}/api/v1/product/products/`, {
      next: { revalidate: 86400 },
      headers: { "Accept": "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      const products = data.results || data || [];
      productPages = products.map((product) => ({
        url: `${BASE_URL}/product-details/${generateSlug(product.name)}`,
        lastModified: new Date(product.updated_at || new Date()),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error("Sitemap: Product fetch failed", error);
    // Fallback: hardcode known product slugs
    const knownSlugs = [
      "navprana-organics-pure-desi-buffalo-bilona-ghee-500ml",
      "navprana-organics-pure-desi-buffalo-bilona-ghee-1-litre",
    ];
    productPages = knownSlugs.map((slug) => ({
      url: `${BASE_URL}/product-details/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  }

  // Fetch blog pages dynamically
  let blogPages = [];
  try {
    const res = await fetch(`${BASE_API}/api/v1/blogs/`, {
      next: { revalidate: 86400 },
      headers: { "Accept": "application/json" },
    });
    if (res.ok) {
      const blogs = await res.json();
      blogPages = blogs.map((blog) => ({
        url: `${BASE_URL}/blog/${blog.slug}`,
        lastModified: new Date(blog.updated_at || blog.created_at || new Date()),
        changeFrequency: "monthly",
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error("Sitemap: Blog fetch failed", error);
  }

  return [...staticPages, ...productPages, ...blogPages];
}
