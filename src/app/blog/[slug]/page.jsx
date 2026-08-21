import { notFound } from "next/navigation";
import { API_BASE, getProducts, getBlogList } from "@/lib/site";
import BlogDetailsClient from "./BlogDetailsClient";
import ShopTheGhee from "./ShopTheGhee";


// Allow new blog slugs not known at build time to be rendered on-demand
// This is critical: when you add a new blog from admin, Next.js will
// server-render it on the first visit EVEN if it wasn't in generateStaticParams
export const dynamicParams = true;

async function getBlogData(slug) {
  try {
    const res = await fetch(`${API_BASE}/api/v1/blogs/${slug}/`, {
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
  const blogs = await getBlogList({ revalidate: 86400 });
  return blogs.filter((b) => b.slug).map((b) => ({ slug: b.slug }));
}

const Page = async ({ params }) => {
  const { slug } = await params;
  const [blog, products] = await Promise.all([getBlogData(slug), getProducts()]);

  if (!blog) {
    notFound();
  }

  return (
    <>
      <BlogDetailsClient blog={blog} />
      <ShopTheGhee blog={blog} products={products} />
    </>
  );
};

export default Page;
