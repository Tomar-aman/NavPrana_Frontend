import { notFound } from "next/navigation";
import { generateSlug, findProductBySlug } from "@/utils/slug";
import ProductDetailsClient from "./ProductDetailsClient";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.navprana.com";

async function getProductData() {
  const BASE_API = (process.env.NEXT_PUBLIC_BASE_URL || "https://api.navprana.cloud/").replace(/\/+$/, "");
  try {
    const res = await fetch(`${BASE_API}/api/v1/product/products/`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.results || data || [];
  } catch (error) {
    console.error("Fetch products failed:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const products = await getProductData();
  const product = findProductBySlug(products, slug);

  if (!product) return {};

  const title = `${product.name} | NavPrana Organics`;
  const description = product.details || product.description?.substring(0, 160) || `Buy ${product.name} online from NavPrana Organics.`;
  const imageUrl = product.images?.[0]?.image || `${BASE_URL}/favicon.ico`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/product-details/${slug}`,
      images: [{ url: imageUrl }],
      type: "website",
    },
    alternates: {
      canonical: `/product-details/${slug}`,
    },
  };
}

const Page = async ({ params }) => {
  const { slug } = await params;
  const products = await getProductData();
  const product = findProductBySlug(products, slug);

  if (!product) {
    notFound();
  }

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.details,
    image: product.images?.map((img) => img.image) || [],
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "NavPrana Organics",
    },
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/product-details/${slug}`,
      priceCurrency: "INR",
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailsClient product={product} />
    </>
  );
};

export default Page;

