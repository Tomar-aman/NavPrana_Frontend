import { getBlogBySlug } from "@/services/blog/get-blogs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.navprana.com";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const blog = await getBlogBySlug(slug);

    if (!blog) {
      return {
        title: "Blog Post Not Found | NavPrana Organics",
      };
    }

    const title = `${blog.title} | NavPrana Blog`;
    const description = blog.excerpt || blog.meta_description || `Read about ${blog.title} on the NavPrana Organics blog. Insights on organic living and traditional food wisdom.`;
    const image = blog.thumbnail || `${SITE_URL}/opengraph-image`;

    return {
      title,
      description,
      keywords: [
        ...(blog.category ? [blog.category.name] : []),
        "organic food blog",
        "health tips",
        "traditional food",
        "NavPrana",
      ],
      openGraph: {
        title,
        description,
        url: `/blog/${slug}`,
        siteName: "NavPrana Organics",
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: blog.title,
          },
        ],
        type: "article",
        publishedTime: blog.created_at,
        modifiedTime: blog.updated_at,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
      alternates: {
        canonical: `/blog/${slug}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata for blog:", error);
    return {
      title: "Blog | NavPrana Organics",
    };
  }
}

// Blog Article JSON-LD
function BlogJsonLd({ blog, slug }) {
  if (!blog) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt || "",
    image: blog.thumbnail,
    datePublished: blog.created_at,
    dateModified: blog.updated_at || blog.created_at,
    author: {
      "@type": "Organization",
      name: "NavPrana Team",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "NavPrana Organics",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo-ghee.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function BlogDetailLayout({ children, params }) {
  const { slug } = await params;
  let blog = null;
  try {
    blog = await getBlogBySlug(slug);
  } catch (err) {
    console.error("BlogDetailLayout: Fetching failed", err);
  }

  return (
    <>
      <BlogJsonLd blog={blog} slug={slug} />
      {children}
    </>
  );
}
