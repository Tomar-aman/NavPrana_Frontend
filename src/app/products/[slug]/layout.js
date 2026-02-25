import { generateSlug } from "@/utils/slug";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://api.navprana.cloud/";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.navprana.com";

async function getProducts() {
  try {
    const res = await fetch(`${API_URL}api/v1/product/products/`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || data || [];
  } catch {
    return [];
  }
}

async function getProductBySlug(slug) {
  const products = await getProducts();
  return products.find((p) => generateSlug(p.name) === slug) || null;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: generateSlug(p.name) }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  const featuredImage =
    product.images?.find((img) => img.is_feature)?.image ||
    product.images?.[0]?.image ||
    `${SITE_URL}/opengraph-image`;

  return {
    title: `${product.name} — ₹${product.price} | Buy Pure Desi Ghee Online`,
    description:
      product.description ||
      product.details ||
      `Buy ${product.name} at ₹${product.price} from NavPrana Organics. 100% pure, traditional Bilona method desi ghee. FSSAI certified, free shipping above ₹999.`,
    keywords: [
      product.name,
      "desi ghee",
      "organic ghee",
      "bilona ghee",
      "pure ghee price",
      "buy ghee online",
      "NavPrana",
      "ghee review",
      "best desi ghee",
    ],
    openGraph: {
      title: `${product.name} — ₹${product.price} | NavPrana Organics`,
      description:
        product.details ||
        `Buy ${product.name} at ₹${product.price}. 100% pure organic Bilona desi ghee. Free shipping above ₹999.`,
      url: `/products/${slug}`,
      images: [
        {
          url: featuredImage,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: "product",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — ₹${product.price} | NavPrana Organics`,
      description:
        product.details ||
        `Buy ${product.name} — pure organic desi ghee. FSSAI certified.`,
      images: [featuredImage],
    },
    alternates: {
      canonical: `/products/${slug}`,
    },
  };
}

// Product JSON-LD structured data
function ProductJsonLd({ product, slug }) {
  if (!product) return null;

  const featuredImage =
    product.images?.find((img) => img.is_feature)?.image ||
    product.images?.[0]?.image;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.details || "",
    image: featuredImage,
    url: `${SITE_URL}/products/${slug}`,
    brand: {
      "@type": "Brand",
      name: "NavPrana Organics",
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/products/${slug}`,
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      seller: {
        "@type": "Organization",
        name: "NavPrana Organics",
      },
    },
    category: "Food & Beverages > Dairy > Ghee",
    sku: `NP-${product.id}`,
    mpn: `NP-${product.id}`,
    itemCondition: "https://schema.org/NewCondition",
  };

  if (product.max_price && Number(product.max_price) > Number(product.price)) {
    jsonLd.offers.highPrice = product.max_price;
  }

  if (product.average_rating) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.average_rating,
      bestRating: "5",
      worstRating: "1",
      reviewCount: product.reviews?.length || 1,
    };
  }

  // Add individual reviews if available
  if (product.reviews?.length > 0) {
    jsonLd.review = product.reviews.slice(0, 5).map((r) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: "5",
      },
      author: {
        "@type": "Person",
        name: r.user_name || "Verified Buyer",
      },
      reviewBody: r.comment || "",
    }));
  }

  // BreadcrumbList schema
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${SITE_URL}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${SITE_URL}/products/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}

export default async function ProductLayout({ children, params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return (
    <>
      <ProductJsonLd product={product} slug={slug} />
      {children}
    </>
  );
}
