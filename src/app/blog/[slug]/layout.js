import { getBlogBySlug } from "@/services/blog/get-blogs";

import { SITE_URL } from "@/lib/site";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const blog = await getBlogBySlug(slug);

    if (!blog) {
      return {
        title: "Blog Post Not Found | NavPrana Organics",
      };
    }

    // `meta_title` is the editorially written search title from the Django
    // admin; it was never read, so editing it there changed nothing.
    const title = blog.meta_title?.trim() || `${blog.title} | NavPrana Blog`;
    // `excerpt` is the blog-card copy; use the editorially written SEO
    // description for search and social snippets when the CMS provides one.
    const description = blog.meta_description || blog.excerpt || `Read about ${blog.title} on the NavPrana Organics blog. Insights on organic living and traditional food wisdom.`;
    const image = blog.thumbnail || `${SITE_URL}/opengraph-image`;

    return {
      title,
      description,
      // No `keywords` field — Google has ignored <meta name="keywords">
      // since 2009. Target terms belong in visible headings and body copy.
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

// Strip tags and decode the common HTML entities so JSON-LD carries plain text
// ("&amp;" would otherwise show up literally in rich results).
function htmlToText(html) {
  return html
    .replace(/<\/(p|li)>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;|&rsquo;|&lsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

// Extract FAQ pairs from blog content HTML for Answer Engines (AEO)
function extractFaqsFromContent(htmlContent) {
  if (!htmlContent || typeof htmlContent !== "string") return [];

  // Match the FAQ section starting with <h2>...Frequently Asked Questions...</h2>
  // Heading text is matched with (?:(?!<\/h2>)[\s\S])*? rather than .*? —
  // CMS headings carry newlines (`<h2>\n FAQ\n</h2>`), which `.` does not match.
  const faqSectionRegex =
    /<h2[^>]*>(?:(?!<\/h2>)[\s\S])*?(?:Frequently Asked Questions|FAQ)[\s\S]*?<\/h2>([\s\S]*?)(?=<h2|$)/i;
  const match = htmlContent.match(faqSectionRegex);
  if (!match || !match[1]) return [];

  const sectionHtml = match[1];
  // The answer is everything up to the next question, so multi-paragraph
  // answers and lists are kept whole.
  const qaRegex = /<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3|$)/gi;
  const faqs = [];
  let item;
  while ((item = qaRegex.exec(sectionHtml)) !== null) {
    const q = htmlToText(item[1]);
    const a = htmlToText(item[2]);
    if (q && a) {
      faqs.push({ question: q, answer: a });
    }
  }
  return faqs;
}

// Blog Article JSON-LD
function BlogJsonLd({ blog, slug }) {
  if (!blog) return null;

  const faqs = extractFaqsFromContent(blog.content);

  const authorEntity =
    blog.author && !blog.author.startsWith("REPLACE")
      ? {
          "@type": "Person",
          name: blog.author,
          url: `${SITE_URL}/about`,
        }
      : {
          "@type": "Organization",
          name: "NavPrana Team",
          url: SITE_URL,
        };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.meta_description || blog.excerpt || "",
    image: blog.thumbnail || `${SITE_URL}/opengraph-image`,
    datePublished: blog.created_at,
    dateModified: blog.updated_at || blog.created_at,
    author: authorEntity,
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

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: blog.title,
        item: `${SITE_URL}/blog/${slug}`,
      },
    ],
  };

  const faqJsonLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
    </>
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
