import ProductsClient from "./ProductsClient";
import { generateSlug } from "@/utils/slug";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.navprana.com";
const BASE_API = (
  process.env.NEXT_PUBLIC_BASE_URL || "https://api.navprana.cloud/"
).replace(/\/+$/, "");

async function getProducts() {
  try {
    const res = await fetch(`${BASE_API}/api/v1/product/products/`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || data || [];
  } catch (error) {
    console.error("Fetch products failed:", error);
    return [];
  }
}

export const metadata = {
  title: "Buy Pure Desi Bilona Ghee Online — Organic A2 Buffalo Ghee Collection",
  description: "Shop NavPrana's collection of 100% pure organic bilona ghee. Buy the best desi buffalo A2 bilona ghee online — Buffalo A2 Bilona Ghee (500 ml) & (1 Ltr). Traditional Bilona method, grass-fed, FSSAI certified. Pure desi ghee price starting ₹1119. Free shipping above ₹999.",
  keywords: [
    "buy bilona ghee online",
    "a2 bilona ghee price",
    "pure desi buffalo ghee online",
    "grass fed a2 ghee",
    "hand churned bilona ghee",
    "curd churned ghee",
    "desi ghee 500ml price",
    "desi ghee 1 litre price",
    "best bilona ghee brand india",
    "organic ghee online india",
    "lactose free ghee",
    "FSSAI certified ghee online",
  ],
  openGraph: {
    title: "Buy Pure Desi Bilona Ghee Online — Best Organic Ghee Collection | NavPrana",
    description: "Order premium organic bilona ghee. Buy the best A2 buffalo desi ghee in India from ₹1119. Bilona method, FSSAI certified.",
    url: "/products",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy Bilona Ghee Online — Pure Desi Buffalo Ghee | NavPrana Organics",
    description: "Shop 100% pure organic A2 bilona ghee. Best bilona ghee price in India. Free shipping above ₹999.",
  },
  alternates: {
    canonical: "/products",
  },
};

const Page = async () => {
  const products = await getProducts();

  // JSON-LD — ItemList of real catalog products (SEO/AEO: product names,
  // prices, and URLs visible to crawlers without JavaScript)
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "NavPrana Organics — Pure Desi Bilona Ghee Collection",
    description:
      "Buy the best bilona ghee in India. 100% pure desi buffalo A2 bilona ghee — traditional Bilona method, grass-fed, FSSAI certified.",
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        url: `${BASE_URL}/products/${generateSlug(product.name)}`,
        image: product.images?.[0]?.image,
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };

  return (
    <>
      {products.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      <ProductsClient initialProducts={products} />
    </>
  );
};

export default Page;
