import { notFound } from "next/navigation";
import BlogDetailsClient from "./BlogDetailsClient";

const BASE_API = (
  process.env.NEXT_PUBLIC_BASE_URL || "https://api.navprana.cloud/"
).replace(/\/+$/, "");

// Allow new blog slugs not known at build time to be rendered on-demand
// This is critical: when you add a new blog from admin, Next.js will
// server-render it on the first visit EVEN if it wasn't in generateStaticParams
export const dynamicParams = true;

async function getBlogData(slug) {
  try {
    const res = await fetch(`${BASE_API}/api/v1/blogs/${slug}/`, {
      next: { revalidate: 1800 }, // Re-fetch every 30 min for fresh content
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Fetch blog failed:", error);
    return null;
  }
}

// Pre-generate slugs known at BUILD TIME (makes known pages fast/static)
// New blogs added from admin will still work thanks to dynamicParams = true
export async function generateStaticParams() {
  try {
    const res = await fetch(`${BASE_API}/api/v1/blogs/`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const blogs = await res.json();
    return (Array.isArray(blogs) ? blogs : blogs.results || []).map((b) => ({
      slug: b.slug,
    }));
  } catch {
    return [];
  }
}

const Page = async ({ params }) => {
  const { slug } = await params;
  const blog = await getBlogData(slug);

  if (!blog) {
    notFound();
  }

  return <BlogDetailsClient blog={blog} />;
};

export default Page;
