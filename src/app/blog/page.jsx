import BlogClient from "./BlogClient";

import { SITE_URL as BASE_URL, API_BASE, getBlogList } from "@/lib/site";

async function getCategories() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/blogs/categories/`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || data || [];
  } catch (error) {
    console.error("Fetch blog categories failed:", error);
    return [];
  }
}

// The blog list itself comes from the shared getBlogList() so /blog, the
// homepage preview, every blog post's product block, and the sitemap all read
// the same ISR-cached response instead of four separate fetches of one endpoint.
async function getBlogListingData() {
  const [blogs, categories] = await Promise.all([getBlogList(), getCategories()]);
  return { blogs, categories };
}

export async function generateMetadata() {
  const title = "Ghee & Organic Living Blog";
  const description = "Discover the benefits of organic living. Read our blog for health tips, traditional food preparation methods, and the science behind pure organic ingredients like Bilona Ghee.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "/blog",
      type: "website",
    },
    alternates: {
      canonical: "/blog",
    },
  };
}

const Page = async () => {
  const { blogs, categories } = await getBlogListingData();

  // JSON-LD for Blog — includes the actual post list so the listing page
  // itself surfaces posts to crawlers and answer engines
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "NavPrana Organic Blog",
    description: "Articles on organic living and healthy food habits.",
    url: `${BASE_URL}/blog`,
    publisher: {
      "@type": "Organization",
      name: "NavPrana Organics",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo-ghee.svg`,
      },
    },
    blogPost: blogs.map((blog) => ({
      "@type": "BlogPosting",
      headline: blog.title,
      url: `${BASE_URL}/blog/${blog.slug}`,
      image: blog.thumbnail || undefined,
      datePublished: blog.created_at || undefined,
      dateModified: blog.updated_at || blog.created_at || undefined,
      author: {
        "@type": "Organization",
        name: "NavPrana Organics",
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogClient initialBlogs={blogs} initialCategories={categories} />
    </>
  );
};

export default Page;

