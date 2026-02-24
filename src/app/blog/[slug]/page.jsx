import { notFound } from "next/navigation";
import BlogDetailsClient from "./BlogDetailsClient";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.navprana.com";

async function getBlogData(slug) {
  const BASE_API = (process.env.NEXT_PUBLIC_BASE_URL || "https://api.navprana.cloud/").replace(/\/+$/, "");
  try {
    const res = await fetch(`${BASE_API}/api/v1/blogs/${slug}/`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Fetch blog failed:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogData(slug);

  if (!blog) return {};

  const title = `${blog.title} | NavPrana Blog`;
  const description = blog.excerpt || blog.title;
  const imageUrl = blog.thumbnail || `${BASE_URL}/favicon.ico`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/blog/${slug}`,
      images: [{ url: imageUrl }],
      type: "article",
      publishedTime: blog.created_at,
      modifiedTime: blog.updated_at,
      authors: ["NavPrana Team"],
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

const Page = async ({ params }) => {
  const { slug } = await params;
  const blog = await getBlogData(slug);

  if (!blog) {
    notFound();
  }

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    image: blog.thumbnail ? [blog.thumbnail] : [],
    datePublished: blog.created_at,
    dateModified: blog.updated_at || blog.created_at,
    author: {
      "@type": "Organization",
      name: "NavPrana Organics",
    },
    publisher: {
      "@type": "Organization",
      name: "NavPrana Organics",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo-ghee.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogDetailsClient blog={blog} />
    </>
  );
};

export default Page;

