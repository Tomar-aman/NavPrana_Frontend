import { notFound } from "next/navigation";
import { findProductBySlug } from "@/utils/slug";
import ProductDetailsClient from "./ProductDetailsClient";

const BASE_API = (
  process.env.NEXT_PUBLIC_BASE_URL || "https://api.navprana.cloud/"
).replace(/\/+$/, "");

async function getProductData() {
  try {
    const res = await fetch(`${BASE_API}/api/v1/product/products/`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.results || data || [];
  } catch (error) {
    console.error("Fetch products failed:", error);
    return null;
  }
}

export const dynamic = "force-dynamic";

// NOTE: metadata (generateMetadata) and Product/BreadcrumbList JSON-LD for this
// route live in ./layout.js — the richer versions there (price-in-title,
// offers, shipping, ratings, reviews) must not be overridden or duplicated here.

const Page = async ({ params }) => {
  const { slug } = await params;
  const products = await getProductData();
  const product = findProductBySlug(products, slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} />;
};

export default Page;
