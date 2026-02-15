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
    title: `${product.name} — Buy Pure Desi Ghee Online`,
    description:
      product.description ||
      product.details ||
      `Buy ${product.name} from NavPrana Organics. 100% pure, traditional Bilona method desi ghee. Free shipping available.`,
    keywords: [
      product.name,
      "desi ghee",
      "organic ghee",
      "bilona ghee",
      "NavPrana",
      "buy ghee online",
    ],
    openGraph: {
      title: `${product.name} | NavPrana Organics`,
      description:
        product.details ||
        `Buy ${product.name} — 100% pure organic desi ghee from NavPrana Organics.`,
      url: `/product-details/${slug}`,
      images: [
        {
          url: featuredImage,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | NavPrana Organics`,
      description:
        product.details ||
        `Buy ${product.name} — pure organic desi ghee from NavPrana.`,
      images: [featuredImage],
    },
    alternates: {
      canonical: `/product-details/${slug}`,
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
    url: `${SITE_URL}/product-details/${slug}`,
    brand: {
      "@type": "Brand",
      name: "NavPrana Organics",
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/product-details/${slug}`,
      seller: {
        "@type": "Organization",
        name: "NavPrana Organics",
      },
    },
  };

  if (product.average_rating) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.average_rating,
      bestRating: "5",
      reviewCount: product.reviews?.length || 1,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
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
