import { notFound } from "next/navigation";
import { findProductBySlug } from "@/utils/slug";
import { getProducts } from "@/lib/site";
import ProductDetailsClient from "./ProductDetailsClient";

// NOTE: this route used to set `export const dynamic = "force-dynamic"` and
// fetch with `cache: "no-store"`. That forced the whole segment dynamic, which
// made generateStaticParams() in ./layout.js dead code and turned every crawl
// into a live API round trip. It now uses the shared hour-long ISR cache — call
// /api/revalidate from the Django admin on product save for instant updates.
export const revalidate = 3600;

// NOTE: metadata (generateMetadata) and Product/BreadcrumbList JSON-LD for this
// route live in ./layout.js — the richer versions there (price-in-title,
// offers, shipping, ratings, reviews) must not be overridden or duplicated here.

const Page = async ({ params }) => {
  const { slug } = await params;
  const products = await getProducts();
  const product = findProductBySlug(products, slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} catalogue={products} />;
};

export default Page;
