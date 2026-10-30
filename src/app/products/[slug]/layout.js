import { generateSlug } from "@/utils/slug";
import {
  SITE_URL,
  getProducts,
  milkSource,
  milkType,
  featuredImage,
  clampDescription,
} from "@/lib/site";
import { familyReviews, averageRating, reviewerName } from "@/lib/reviews";
import { familyMembers } from "@/lib/variants";
import { PRODUCT_GUIDE, fillFaq } from "./productGuide";
import { fetchPricingServer } from "@/lib/pricing";

async function getProductBySlug(slug) {
  const products = await getProducts();
  const product = products.find((p) => generateSlug(p.name) === slug) || null;
  // Carry the catalogue along so the JSON-LD can pool reviews across the pack
  // sizes exactly the way the page does.
  return product ? { ...product, catalogue: products } : null;
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
  const pricing = await fetchPricingServer();
  const freeAbove = `₹${Math.round(Number(pricing.free_shipping_threshold))}`;

  const isCow = milkType(product) === "cow";
  const kind = isCow ? "A2 desi cow" : "A2 buffalo";
  const price = (p) => Math.round(Number(p.price)) || p.price;
  const displayPrice = price(product);
  const seoPackSize = String(product.size || "").replace(/\bLtr\b/i, "litre");
  const packSize = seoPackSize ? ` ${seoPackSize}` : "";

  // All sizes of this ghee share one canonical URL (see src/lib/variants.js).
  // The canonical page is titled for the ghee as a whole, so it can rank for
  // "bilona cow ghee" whichever jar size the searcher ends up buying.
  const members = familyMembers(product, product.catalogue || []);
  const canonicalSlug = generateSlug(members[0].name);
  const isCanonical = canonicalSlug === slug;
  const sizeList = members
    .map((p) => String(p.size || "").replace(/\s+/g, "").replace(/ltr$/i, "L"))
    .filter(Boolean)
    .join(" & ");

  let searchTitle;
  let description;
  if (isCanonical && members.length > 1) {
    const from = Math.min(...members.map((p) => Number(p.price) || Infinity));
    searchTitle = isCow
      ? `Buy A2 Cow Bilona Ghee (${sizeList}) from ₹${from}`
      : `Buy A2 Buffalo Bilona Ghee (${sizeList}) from ₹${from}`;
    description = clampDescription(
      `Buy pure ${isCow ? "A2 desi cow bilona ghee" : "A2 buffalo bilona ghee"} online, hand-churned from curd in the Chambal valley. ` +
        members.map((p) => `${p.size} ₹${price(p)}`).join(", ") +
        `. FSSAI certified. Free shipping above ${freeAbove}.`,
    );
  } else {
    // Lead with the product and price so the snippet matches the purchase
    // intent visible in Search Console queries such as "bilona cow ghee".
    searchTitle = isCow
      ? `Buy A2 Cow Bilona Ghee${packSize} — ₹${displayPrice}`
      : `Buy A2 Buffalo Bilona Ghee${packSize} — ₹${displayPrice}`;
    description = clampDescription(
      `Buy pure ${isCow ? "Bilona Cow Ghee" : "A2 Buffalo Bilona Ghee"}${packSize} online at ₹${displayPrice}. Traditional Bilona method, FSSAI certified. Free shipping on orders above ${freeAbove}.`,
    );
  }

  // Longer copy is fine for social cards, which have no 155-char limit.
  const socialDescription = clampDescription(
    product.details || product.description || description,
    200,
  );

  return {
    title: searchTitle,
    description,
    // NOTE: no `keywords` field — see the comment in src/app/layout.js. The
    // previous list here was buffalo-only, so the two cow SKUs advertised
    // "buy buffalo ghee online" to anyone reading their source.
    openGraph: {
      title: `${searchTitle} | NavPrana Organics`,
      description: socialDescription,
      url: `/products/${canonicalSlug}`,
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
      title: `${searchTitle} | NavPrana Organics`,
      description: socialDescription,
      images: [image],
    },
    alternates: {
      canonical: `/products/${canonicalSlug}`,
    },
  };
}

// Product JSON-LD structured data
function ProductJsonLd({ product, slug, pricing }) {
  if (!product) return null;

  // Mirrors calculateShipping(): one jar on its own is the cheapest order
  // Google can assume, so quote the fee only if that jar is under the threshold.
  const shippingCost =
    Number(product.price) > Number(pricing.free_shipping_threshold)
      ? 0
      : Number(pricing.shipping_fee);

  const reviews = familyReviews(product, product.catalogue || []);
  const rating = averageRating(reviews);

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
          value: String(shippingCost),
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
        value: "Grass-fed",
      },
    ],
  };

  // Only emit aggregateRating when there is a real rating AND real reviews
  // behind it — Google rejects (and can penalise) a reviewCount that isn't
  // backed by actual reviews.
  if (rating && reviews.length > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.toFixed(1),
      bestRating: "5",
      worstRating: "1",
      reviewCount: reviews.length,
    };
  }

  // Add individual reviews if available. getProducts() has already replaced the
  // buyer's email with a display name, so nothing here can leak an address.
  if (reviews.length > 0) {
    jsonLd.review = reviews.slice(0, 5).map((r) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: "5",
      },
      author: {
        "@type": "Person",
        name: r.user_name || reviewerName(r.user_email),
      },
      reviewBody: r.review || r.comment || "",
      datePublished: r.created_at || undefined,
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

  // Mirrors the visible FAQ rendered by ./ProductGuide.jsx.
  const guide = PRODUCT_GUIDE[milkType(product)];
  const faqJsonLd = guide && {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: fillFaq(f.a, pricing.free_shipping_threshold),
      },
    })),
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
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
    </>
  );
}

export default async function ProductLayout({ children, params }) {
  const { slug } = await params;
  const [product, pricing] = await Promise.all([
    getProductBySlug(slug),
    fetchPricingServer(),
  ]);

  return (
    <>
      <ProductJsonLd product={product} slug={slug} pricing={pricing} />
      {children}
    </>
  );
}
