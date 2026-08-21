import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ProfileProvider } from "@/Context/ProfileContext";
import ReduxProvider from "@/redux/provider";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AuthInitializer from "../../components/AuthInitializer";
import ErrorBoundary from "../../components/ErrorBoundary";
import MetaPixel from "../../components/MetaPixel";
import { PIXEL_ID } from "@/lib/meta-pixel";
import { SITE_URL, getProducts } from "@/lib/site";
import GlobalUI from "../../components/GlobalUI";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "swiper/css";
import "swiper/css/pagination";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Buy Pure A2 Desi Cow & Buffalo Bilona Ghee Online | NavPrana Organics",
    // Keep this SHORT. Google renders roughly 60 characters, and the previous
    // template ("| NavPrana Organics — Best Organic Ghee India") pushed /about,
    // /products, /blog and /faq past 110 characters — /faq ended up with
    // "NavPrana Organics" in it twice. Child titles must NOT repeat the brand.
    template: "%s | NavPrana Organics",
  },
  description:
    "Buy pure A2 desi cow ghee and A2 buffalo bilona ghee online from NavPrana Organics. Hand-churned the traditional bilona way in the Chambal valley, Madhya Pradesh. Grass-fed, FSSAI certified, nothing added. Free shipping above ₹999.",
  // NOTE: no `keywords` field, deliberately.
  //
  // Google has ignored <meta name="keywords"> since 2009, so the ~110 terms
  // that used to live here earned nothing. They were also publicly visible in
  // page source and included competitors' brand names (rosier ghee, anveshan
  // ghee, two brothers organic farms, kasutam ghee) plus misspellings of our
  // own — all downside, no upside. Target terms belong in visible headings and
  // body copy, which is where Google actually reads them.
  authors: [{ name: "NavPrana Organics" }],
  creator: "NavPrana Organics",
  publisher: "NavPrana Organics",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "NavPrana Organics",
    title: "Buy Pure A2 Desi Cow & Buffalo Bilona Ghee Online | NavPrana",
    description:
      "A2 desi cow ghee and A2 buffalo bilona ghee, hand-churned the traditional bilona way in the Chambal valley. Grass-fed, FSSAI certified. Free shipping above ₹999.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy Pure A2 Desi Cow & Buffalo Bilona Ghee Online | NavPrana",
    description:
      "A2 desi cow ghee and A2 buffalo bilona ghee from the Chambal valley. Bilona method, FSSAI certified. Free shipping above ₹999.",
    creator: "@navprana",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/android-chrome-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  alternates: {
    canonical: "/",
  },
  category: "Food & Beverages",
  // Only emit the verification tag when the value actually exists — the old
  // `|| ""` fallback rendered content="" which does nothing. Verify by DNS or
  // HTML file if you prefer; this is just a convenience.
  ...(process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
        },
      }
    : {}),
};

// JSON-LD Structured Data
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NavPrana Organics",
  url: SITE_URL,
  logo: `${SITE_URL}/opengraph-image`,
  description:
    "NavPrana Organics is India's best organic bilona ghee brand, bringing traditionally prepared, chemical-free pure desi ghee and food products to Indian households. Our flagship products are 100% pure A2 Cow and Buffalo Bilona Ghee from the Chambal valley of Madhya Pradesh — grass-fed, FSSAI certified, and made using the traditional Bilona method.",
  foundingDate: "2025",
  address: {
    "@type": "PostalAddress",
    streetAddress: "L-232, Old H.B Colony",
    addressLocality: "Morena",
    addressRegion: "Madhya Pradesh",
    postalCode: "476001",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-7509531811",
    contactType: "customer service",
    email: "support@navprana.com",
    availableLanguage: ["English", "Hindi"],
  },
  alternateName: ["NavPrana", "NavPrana Organics", "NavPrana Ghee"],
  sameAs: [
    "https://www.instagram.com/navprana/",
    "https://www.facebook.com/navprana",
    // "https://twitter.com/navprana",
    // "https://www.youtube.com/@navprana",
  ],
  knowsAbout: [
    "Bilona Ghee",
    "A2 Bilona Ghee",
    "A2 Desi Cow Ghee",
    "Buffalo Ghee",
    "Organic Ghee",
    "Pure Desi Ghee",
    "Traditional Bilona Method",
    "Grass-fed Ghee",
    "Organic Food India",
    "Chambal Valley Products",
  ],
  // NOTE: do NOT add makesOffer / hasOfferCatalog with nested Product objects
  // here — Google detects each nested Product as a standalone item missing
  // "offers"/"review"/"aggregateRating" and flags a critical issue on EVERY
  // page. Product rich data lives on /products (ItemList) and /products/[slug]
  // (full Product schema with offers, ratings, reviews).
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#localbusiness`,
  name: "NavPrana Organics",
  image: `${SITE_URL}/opengraph-image`,
  url: SITE_URL,
  telephone: "+91-7509531811",
  email: "support@navprana.com",
  description:
    "Buy pure A2 desi cow ghee and A2 buffalo bilona ghee online. Traditional bilona method, grass-fed, FSSAI certified, shipped across India from Morena, Madhya Pradesh.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "L-232, Old H.B Colony",
    addressLocality: "Morena",
    addressRegion: "Madhya Pradesh",
    postalCode: "476001",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 26.5,
    longitude: 78.0,
  },
  priceRange: "₹₹",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
  hasMap: "https://maps.google.com/?q=NavPrana+Organics+Morena+Madhya+Pradesh",
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  paymentAccepted: ["UPI", "Credit Card", "Debit Card", "Net Banking", "Cash on Delivery"],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NavPrana Organics",
  alternateName: "NavPrana — Best Bilona Ghee in India",
  url: SITE_URL,
  description:
    "Buy pure A2 desi cow ghee and A2 buffalo bilona ghee online. Traditional bilona method, grass-fed, FSSAI certified, from the Chambal valley of Madhya Pradesh.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/products?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
  about: {
    "@type": "Thing",
    name: "A2 Bilona Ghee",
    description:
      "Pure A2 desi cow ghee and A2 buffalo ghee made using the traditional bilona method in the Chambal valley, Madhya Pradesh.",
  },
};

// NOTE: the site-wide ItemList schema was removed — it hardcoded 2 products
// with outdated slugs (drifted from the real catalog) and Google wants
// ItemList only on list pages. /products emits the real catalog-driven
// ItemList (with offers) instead.

// Async so the footer can be given the real catalogue. The site-wide footer
// is the only place every page can link to individual products from, and
// hardcoding slugs here is exactly the drift that left the old sitemap
// fallback pointing at two 404s. getProducts() is ISR-cached and swallows
// its own errors, so a slow or down API degrades to an empty Shop column.
export default async function RootLayout({ children }) {
  const products = await getProducts();

  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        {/* NOTE: Google Tag Manager is NOT loaded here any more. It used to be
            an inline dangerouslySetInnerHTML script in <head>, which blocks the
            critical rendering path on every page. It now loads via
            <GoogleTagManager /> at the end of <body> — same container, same
            dataLayer, but deferred. Only the JSON-LD below stays in <head>;
            application/ld+json is never executed, so it costs nothing. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
        {/* Meta Pixel (noscript fallback) */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PKBBHL4K"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <MetaPixel />
        <ReduxProvider>
            <ProfileProvider>
              <ErrorBoundary>
              <Header />
              <AuthInitializer />
              <GlobalUI />

              {children}

              {/* 🔔 Global Toast Notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    borderRadius: "12px",
                    padding: "14px 16px",
                    fontSize: "14px",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                  },
                }}
                richColors
                closeButton
              />
              <Footer products={products} />
              </ErrorBoundary>
            </ProfileProvider>
        </ReduxProvider>
        {/* Deferred third-party tags — loaded after hydration, not in <head>. */}
        <GoogleTagManager gtmId="GTM-PKBBHL4K" />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
