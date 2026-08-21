import { generateSlug } from "@/utils/slug";
import {
  SITE_URL,
  getProducts,
  milkSource,
  milkType,
  featuredImage,
  clampDescription,
} from "@/lib/site";

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

  const image = featuredImage(product, `${SITE_URL}/opengraph-image`);

  const isCow = milkType(product) === "cow";
  const kind = isCow ? "A2 desi cow ghee" : "A2 buffalo ghee";

  // Google renders ~155 characters. The raw API `description` field is
  // multi-paragraph marketing copy, so using it unbounded meant Google
  // truncated and rewrote the snippet on every product page.
  const description = clampDescription(
    product.details ||
      product.description ||
      `Buy ${product.name} at ₹${product.price} — pure ${kind}, hand-churned bilona method, FSSAI certified. Free shipping above ₹999.`,
  );

  // Longer copy is fine for social cards, which have no 155-char limit.
  const socialDescription = clampDescription(
    product.details || product.description || description,
    200,
  );

  return {
    title: `${product.name} — ₹${Math.round(Number(product.price)) || product.price}`,
    description,
    // NOTE: no `keywords` field — see the comment in src/app/layout.js. The
    // previous list here was buffalo-only, so the two cow SKUs advertised
    // "buy buffalo ghee online" to anyone reading their source.
    openGraph: {
      title: `Buy ${product.name} — ₹${product.price} | NavPrana Organics`,
      description: socialDescription,
      url: `/products/${slug}`,
      images: [
        {
          url: image,
          width: 800,
          height: 800,
          alt: `${product.name} — pure ${kind} by NavPrana Organics`,
        },
      ],
      // NOTE: Next.js Metadata API only accepts specific OG types ("website",
      // "article", ...) — "product" throws and kills ALL metadata for the page.
      // Product rich data is provided via the Product JSON-LD below instead.
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Buy ${product.name} — ₹${product.price} | NavPrana Organics`,
      description: socialDescription,
      images: [image],
    },
    alternates: {
      canonical: `/products/${slug}`,
    },
  };
}

// Product JSON-LD structured data
function ProductJsonLd({ product, slug }) {
  if (!product) return null;

  const image = featuredImage(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.details || "",
    image: image,
    url: `${SITE_URL}/products/${slug}`,
    brand: {
      "@type": "Brand",
      name: "NavPrana Organics",
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      // NOTE: the API field is "available_quantity" — there is no "stock" field.
      // Reading product.stock gave undefined > 0 === false, which advertised
      // every product as OutOfStock to Google. Fall back to max_quantity, then
      // to in-stock, so a missing field never silently kills availability.
      availability:
        Number(product.available_quantity ?? product.max_quantity ?? 1) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/products/${slug}`,
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      seller: {
        "@type": "Organization",
        name: "NavPrana Organics",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "INR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 7,
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
      },
    },
    category: "Food & Beverages > Dairy > Ghee",
    sku: `NP-${product.id}`,
    mpn: `NP-${product.id}`,
    itemCondition: "https://schema.org/NewCondition",
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Method",
        value: "Traditional Bilona",
      },
      {
        // NOTE: this was hardcoded to "A2 Buffalo Milk" for EVERY product,
        // which told Google the two cow SKUs were made from buffalo milk —
        // structured data contradicting the product name. Derive it instead.
        "@type": "PropertyValue",
        name: "Source",
        value: milkSource(product),
      },
      {
        "@type": "PropertyValue",
        name: "Origin",
        value: "Chambal Valley, Madhya Pradesh",
      },
      {
        "@type": "PropertyValue",
        name: "Certification",
        value: "FSSAI Certified",
      },
      {
        "@type": "PropertyValue",
        name: "Diet",
        value: "Grass-fed, Organic",
      },
    ],
  };

  if (product.max_price && Number(product.max_price) > Number(product.price)) {
    jsonLd.offers.highPrice = product.max_price;
  }

  // Only emit aggregateRating when there is a real rating AND real reviews
  // behind it — Google rejects (and can penalise) a reviewCount that isn't
  // backed by actual reviews.
  if (product.average_rating && product.reviews?.length > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.average_rating,
      bestRating: "5",
      worstRating: "1",
      reviewCount: product.reviews.length,
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
