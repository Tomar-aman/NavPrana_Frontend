"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Leaf } from "lucide-react";
import BlogAnalytics from "./BlogAnalytics";
import { InlineProductCard, StickyShopBar } from "./BlogProductCta";

const BlogDetailsClient = ({ blog, featuredProduct = null }) => {
  // The CMS content convention starts with an <h1>, while this page already
  // renders the post title as its accessible page-level <h1> above. Remove
  // only a leading content H1 so published articles expose a single H1.
  const articleContent = (blog.content || "").replace(
    /^\s*<h1\b[^>]*>[\s\S]*?<\/h1>/i,
    "",
  );

  // Split the article just before its second <h2> — after the intro and first
  // section — so the product card lands while the reader is still engaged.
  // Posts with fewer than two sections get no inline card.
  const h2Positions = [...articleContent.matchAll(/<h2\b/gi)].map((m) => m.index);
  const splitAt = featuredProduct && h2Positions.length >= 2 ? h2Positions[1] : -1;
  const contentBefore = splitAt > -1 ? articleContent.slice(0, splitAt) : articleContent;
  const rest = splitAt > -1 ? articleContent.slice(splitAt) : "";

  // Long posts get a second card just before the FAQ (or the last section),
  // where only readers who made it through the whole article arrive: the
  // most interested people on the page, who otherwise saw one card 1,000
  // words earlier.
  const restH2 = [...rest.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)];
  const faqH2 = restH2.find((m) => /frequently asked|faq/i.test(m[1]));
  const endAt =
    h2Positions.length >= 4 && restH2.length >= 3
      ? (faqH2 || restH2[restH2.length - 1]).index
      : -1;
  const contentAfter = endAt > 0 ? rest.slice(0, endAt) : rest;
  const contentEnd = endAt > 0 ? rest.slice(endAt) : "";

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background mt-20">
      <BlogAnalytics blog={blog} />
      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-8">
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
            <li>
              <Link href="/" className="hover:text-primary transition">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-gray-300">/</li>
            <li>
              <Link href="/blog" className="hover:text-primary transition">
                Blog
              </Link>
            </li>
            <li aria-hidden="true" className="text-gray-300">/</li>
            <li
              className="text-foreground font-medium truncate max-w-[200px] sm:max-w-xs"
              aria-current="page"
            >
              {blog.title}
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          {blog.category && (
            <span className="inline-flex items-center text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md mb-4">
              {blog.category.name}
            </span>
          )}
          <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
            {blog.title}
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {blog.excerpt}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock size={12} /> {blog.read_time}
            </span>
            <span>{formatDate(blog.created_at)}</span>
          </div>
        </div>

        {/* Thumbnail */}
        {blog.thumbnail && (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8">
            <Image
              src={blog.thumbnail}
              alt={blog.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        {/* Blog Content */}
        <article>
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: contentBefore }}
          />
          {contentAfter && (
            <>
              <InlineProductCard product={featuredProduct} blog={blog} />
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: contentAfter }}
              />
            </>
          )}
          {contentEnd && (
            <>
              <InlineProductCard product={featuredProduct} blog={blog} placement="inline_card_end" />
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: contentEnd }}
              />
            </>
          )}
        </article>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Leaf size={14} className="text-primary" />
              </div>
              <span className="text-sm font-semibold">NavPrana Team</span>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              More Articles <Clock size={14} className="rotate-180" />
            </Link>
          </div>
        </div>
      </main>
      <StickyShopBar product={featuredProduct} blog={blog} />
    </div>
  );
};

export default BlogDetailsClient;
