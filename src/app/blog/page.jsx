"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, Leaf, ChevronRight } from "lucide-react";
import { getBlogs, getBlogCategories } from "@/services/blog/get-blogs";
import { subscribeNewsletter } from "@/services/contact/subscribe";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "@/redux/features/uiSlice";

const Page = () => {
  const dispatch = useDispatch();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(showLoader());
        const [blogsData, categoriesData] = await Promise.all([
          getBlogs(),
          getBlogCategories(),
        ]);
        setBlogs(blogsData);
        setCategories(categoriesData);
      } catch (err) {
        toast.error("Failed to load blogs");
      } finally {
        setLoading(false);
        dispatch(hideLoader());
      }
    };
    fetchData();
  }, []);

  const featuredBlog = blogs.find((b) => b.is_featured) || blogs[0];

  const filteredBlogs =
    activeCategory === "All"
      ? blogs.filter((b) => b.id !== featuredBlog?.id)
      : blogs.filter((b) => b.category?.name === activeCategory);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return null;
  }

  if (blogs.length === 0) {
    return (
      <div className="min-h-screen bg-background mt-20 flex items-center justify-center">
        <p className="text-muted-foreground">No blogs available yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background mt-20">
      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-4">
            <Leaf size={13} /> NavPrana Blog
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Organic Living &{" "}
            <span className="text-gradient">Food Wisdom</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our articles on organic food, traditional preparation
            methods, clean eating, and how pure ingredients can transform
            your family&apos;s health.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <span
            onClick={() => setActiveCategory("All")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer transition ${activeCategory === "All"
              ? "bg-primary text-white"
              : "bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
              }`}
          >
            All
          </span>
          {categories.map((cat) => (
            <span
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer transition ${activeCategory === cat.name
                ? "bg-primary text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
                }`}
            >
              {cat.name}
            </span>
          ))}
        </div>

        {/* Featured Post */}
        {featuredBlog && activeCategory === "All" && (
          <Link href={`/blog/${featuredBlog.slug}`}>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-10 hover:border-gray-200 hover:shadow-md transition-all">
              <div className="grid md:grid-cols-2">
                <div className="aspect-[4/3] md:aspect-auto relative overflow-hidden">
                  {featuredBlog.thumbnail ? (
                    <Image
                      src={featuredBlog.thumbnail}
                      alt={featuredBlog.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-50 to-primary/5 flex items-center justify-center">
                      <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <Leaf size={36} className="text-primary" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  {featuredBlog.category && (
                    <span className="inline-flex items-center text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md w-fit mb-3">
                      {featuredBlog.category.name}
                    </span>
                  )}
                  <h2 className="text-xl md:text-2xl font-bold mb-3 leading-tight">
                    {featuredBlog.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {featuredBlog.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-5">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {featuredBlog.read_time}
                    </span>
                    <span>{formatDate(featuredBlog.created_at)}</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
                    Read Article <ArrowRight size={15} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredBlogs.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-md transition-all group h-full">
                {/* Thumbnail */}
                <div className="aspect-[16/10] relative overflow-hidden">
                  {post.thumbnail ? (
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Leaf size={24} className="text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    {post.category && (
                      <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                        {post.category.name}
                      </span>
                    )}
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock size={11} /> {post.read_time}
                    </span>
                  </div>
                  <h3 className="text-base font-bold mb-2 leading-snug group-hover:text-primary transition line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(post.created_at)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-1.5 transition-all">
                      Read <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {filteredBlogs.length === 0 && activeCategory !== "All" && (
          <div className="text-center py-12 mb-12">
            <p className="text-sm text-muted-foreground">
              No blogs found in &quot;{activeCategory}&quot; category.
            </p>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-8 md:p-10 text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-2">
            Stay Connected with NavPrana
          </h3>
          <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
            Get the latest articles on organic food, health tips, new product
            launches, and exclusive offers delivered to your inbox.
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!subscribeEmail.trim()) {
                toast.error("Please enter your email address");
                return;
              }
              setSubscribing(true);
              try {
                await subscribeNewsletter(subscribeEmail.trim());
                toast.success("Subscribed successfully! 🎉");
                setSubscribeEmail("");
              } catch (err) {
                toast.error(
                  err.response?.data?.email?.[0] ||
                  err.response?.data?.message ||
                  "Failed to subscribe. Please try again."
                );
              } finally {
                setSubscribing(false);
              }
            }}
            className="flex gap-2 max-w-sm mx-auto"
          >
            <input
              type="email"
              placeholder="Your email address"
              value={subscribeEmail}
              onChange={(e) => setSubscribeEmail(e.target.value)}
              className="flex-1 border border-gray-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
              required
            />
            <button
              type="submit"
              disabled={subscribing}
              className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {subscribing ? "..." : "Subscribe"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Page;
