import ProductsClient from "./ProductsClient";
import BuyingGuide from "./BuyingGuide";
import { generateSlug } from "@/utils/slug";
import { SITE_URL, getProducts } from "@/lib/site";

/**
 * Metadata is generated rather than static so the price and the milk types it
 * advertises come from the real catalogue. The previous hardcoded version said
 * "A2 Buffalo Ghee Collection … starting ₹1119" — it never mentioned the two
 * cow SKUs, and the price was wrong.
 */
export async function generateMetadata() {
  const products = await getProducts();
  const prices = products
    .map((p) => Number(p.price))
    .filter((n) => Number.isFinite(n) && n > 0);
  const from = prices.length ? Math.min(...prices) : null;
  const priceClause = from ? ` Starting ₹${from}.` : "";

  const title =
    "Buy A2 Desi Cow & Buffalo Bilona Ghee";
  const description =
    `Shop pure A2 desi cow ghee and A2 buffalo bilona ghee in 500 ml and 1 litre jars.${priceClause}` +
    " Hand-churned bilona method, grass-fed, FSSAI certified. Free shipping above ₹999.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "/products",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: "/products",
    },
  };
}

const Page = async () => {
  const products = await getProducts();

  // JSON-LD — ItemList of real catalog products (SEO/AEO: product names,
  // prices, and URLs visible to crawlers without JavaScript)
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "NavPrana Organics — A2 Desi Cow & Buffalo Bilona Ghee",
    description:
      "Pure A2 desi cow ghee and A2 buffalo bilona ghee — traditional bilona method, grass-fed, FSSAI certified.",
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        url: `${SITE_URL}/products/${generateSlug(product.name)}`,
        image: product.images?.[0]?.image,
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "INR",
          // Derive from the real catalog field so this page can never
          // contradict the Product schema on /products/[slug].
          availability:
            Number(product.available_quantity ?? product.max_quantity ?? 1) > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
        },
      },
    })),
  };

  // /products had no BreadcrumbList, unlike the product detail and blog pages.
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${SITE_URL}/products`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {products.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      <ProductsClient initialProducts={products} />
      <BuyingGuide />
    </>
  );
};

export default Page;
