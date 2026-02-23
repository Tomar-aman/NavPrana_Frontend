"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowLeft, Leaf } from "lucide-react";
import { getBlogBySlug } from "@/services/blog/get-blogs";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "@/redux/features/uiSlice";

const Page = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        dispatch(showLoader());
        const data = await getBlogBySlug(slug);
        setBlog(data);
      } catch (err) {
        toast.error("Failed to load blog");
      } finally {
        setLoading(false);
        dispatch(hideLoader());
      }
    };
    if (slug) fetchBlog();
  }, [slug]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return null;
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background mt-20 flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Blog not found.</p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft size={14} /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background mt-20">
      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition mb-8"
        >
          <ArrowLeft size={14} /> Back to Blog
        </Link>

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
        <article
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

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
              More Articles <ArrowLeft size={14} className="rotate-180" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
