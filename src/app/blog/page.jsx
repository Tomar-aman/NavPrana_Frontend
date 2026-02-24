import BlogClient from "./BlogClient";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.navprana.com";

async function getBlogListingData() {
  const BASE_API = (process.env.NEXT_PUBLIC_BASE_URL || "https://api.navprana.cloud/").replace(/\/+$/, "");
  try {
    const [blogsRes, catsRes] = await Promise.all([
      fetch(`${BASE_API}/api/v1/blogs/`, { next: { revalidate: 3600 } }),
      fetch(`${BASE_API}/api/v1/blogs/categories/`, { next: { revalidate: 3600 } }),
    ]);

    const blogs = blogsRes.ok ? await blogsRes.json() : [];
    const categories = catsRes.ok ? await catsRes.json() : [];

    return { blogs, categories };
  } catch (error) {
    console.error("Fetch blog listing failed:", error);
    return { blogs: [], categories: [] };
  }
}

export async function generateMetadata() {
  const title = "NavPrana Blog | Organic Living, Health Tips & Traditional Food";
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

  // JSON-LD for Blog
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

