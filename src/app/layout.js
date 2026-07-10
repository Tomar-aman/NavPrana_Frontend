import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ProfileProvider } from "@/Context/ProfileContext";
import ReduxProvider from "@/redux/provider";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AuthInitializer from "../../components/AuthInitializer";
import ErrorBoundary from "../../components/ErrorBoundary";
import MetaPixel from "../../components/MetaPixel";
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.navprana.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Buy Pure Desi Cow & Buffalo Bilona Ghee Online | NavPrana Organics",
    template: "%s | NavPrana Organics — Best Organic Ghee India",
  },
  description:
    "Buy 100% pure organic bilona ghee online from NavPrana Organics — India's best desi ghee brand. Traditional Bilona method A2 Cow and Buffalo ghee from Chambal valley. Pure desi ghee starting at ₹1019. Grass-fed, FSSAI certified, zero additives. Buy desi ghee online with free shipping above ₹999.",
  keywords: [
    // Brand keywords
    "NavPrana",
    "NavPrana Organics",
    "navprana",
    "NavPrana ghee",
    // Misspellings
    "nvaprana",
    "navparna",
    "navaparna",
    "navprna",
    // Competitor targeting
    "rosier ghee",
    "two brothers organic farms",
    "two brother ghee",
    "anveshan ghee",
    "avneshan ghee",
    "kasutam ghee",
    // Cow Ghee
    "cow bilona ghee",
    "desi cow ghee",
    "a2 cow ghee",
    "best cow ghee in India",
    // HIGH volume (5000+)
    "bilona ghee",
    "best ghee in India",
    // HIGH volume (1000–3000)
    "organic ghee",
    "pure desi ghee",
    "organic india ghee",
    // MEDIUM volume (500–1000)
    "a2 bilona ghee",
    "bilona ghee price",
    "buy ghee online",
    // MEDIUM volume (200–500)
    "desi ghee online",
    "cow ghee online",
    "pure desi ghee price",
    "pure ghee online",
    "A2 ghee online",
    "grass-fed ghee",
    // LOW volume (100–200)
    "best bilona ghee in india",
    "buy desi ghee online",
    // LOW volume (<100)
    "bilona ghee online",
    "Buy Buffalo Ghee Online",
    // ZERO-KD long-tail (easy to rank)
    "Buffalo A2 Bilona Ghee 500 ml",
    "Buffalo A2 Bilona Ghee 1 Ltr",
    "pure desi buffalo ghee",
    "premium desi ghee",
    "Order 100% pure desi buffalo ghee",
    "Order pure desi buffalo ghee",
    // Supporting keywords
    "buffalo ghee",
    "A2 ghee",
    "desi ghee",
    "ghee price",
    "ghee for cooking",
    "ghee for babies",
    "ghee 1 litre price",
    "ghee 500ml price",
    "traditional ghee",
    "Chambal ghee",
    "farm fresh ghee",
    "organic food India",
    "pure buffalo ghee",
    "ghee buy online India",
    "natural ghee India",
    "ghee Madhya Pradesh",
    "best organic ghee brand",
    "best organic ghee in India",
    "pure ghee for health",
    "chemical free ghee",
    "organic food online India",
    "traditional bilona method ghee",
    "hand churned ghee",
    "Chambal valley ghee",
    "FSSAI certified ghee",
    "ghee benefits",
    "ghee for weight loss",
    "desi cow ghee",
    "ghee online India",
    "best ghee brand India",
    "ghee for health",
  ],
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
    title: "Buy Pure Desi Cow & Buffalo Bilona Ghee Online | NavPrana",
    description:
      "India's best organic bilona ghee — 100% pure A2 Cow and Buffalo desi ghee from Chambal valley. Traditional Bilona method, grass-fed, FSSAI certified. Buy ghee online starting ₹1019. Free shipping above ₹999.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy Pure Desi Cow & Buffalo Bilona Ghee Online | NavPrana",
    description:
      "India's best organic bilona ghee. Pure A2 Cow and Buffalo desi ghee, Chambal valley. FSSAI certified. Free shipping above ₹999.",
    creator: "@navprana",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  alternates: {
    canonical: "/",
  },
  category: "Food & Beverages",
  other: {
    "google-site-verification": process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
  },
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
    "Organic Ghee",
    "Pure Desi Ghee",
    "Buffalo Ghee",
    "Traditional Bilona Method",
    "Grass-fed Ghee",
    "Organic Food India",
    "Chambal Valley Products",
  ],
  makesOffer: [
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        name: "Buffalo A2 Bilona Ghee (500 ml)",
        description: "Premium pure desi buffalo A2 bilona ghee, 500ml. Traditional Bilona method, grass-fed, FSSAI certified.",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        name: "Buffalo A2 Bilona Ghee (1 Ltr)",
        description: "Premium pure desi buffalo A2 bilona ghee, 1 litre. Traditional Bilona method, grass-fed, FSSAI certified.",
      },
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "NavPrana Organic Ghee Collection",
    itemListElement: [
      {
        "@type": "OfferCatalog",
        name: "Pure Desi Buffalo Bilona Ghee",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Product",
              name: "Buffalo A2 Bilona Ghee (500 ml)",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Product",
              name: "Buffalo A2 Bilona Ghee (1 Ltr)",
            },
          },
        ],
      },
    ],
  },
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
    "Buy pure organic bilona ghee and natural food products online. Best bilona ghee in India — A2 Cow and Buffalo desi ghee, traditional Bilona method, grass-fed, FSSAI certified, free shipping across India. Order pure desi cow ghee starting ₹1019.",
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
    "Buy pure organic bilona ghee online — India's best desi ghee brand. A2 buffalo bilona ghee, traditional Bilona method, grass-fed, FSSAI certified. Order pure desi buffalo ghee, organic ghee, and premium desi ghee from Chambal valley.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/products?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
  about: {
    "@type": "Thing",
    name: "Organic Bilona Ghee",
    description: "Pure desi A2 Cow and Buffalo bilona ghee made using traditional Bilona method from Chambal valley, Madhya Pradesh.",
  },
  keywords: "cow bilona ghee, best cow ghee in India, a2 cow ghee, buy cow ghee online, bilona ghee, best ghee in India, organic ghee, pure desi ghee, a2 bilona ghee, buy ghee online, desi ghee online, grass-fed ghee, bilona ghee price, buy buffalo ghee online, pure desi buffalo ghee, premium desi ghee",
};

// ItemList for product rich snippets
const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "NavPrana Organics — Pure Desi Bilona Ghee Products",
  description: "Buy the best bilona ghee in India. Order pure desi buffalo A2 bilona ghee online from NavPrana Organics.",
  numberOfItems: 2,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Buffalo A2 Bilona Ghee (500 ml)",
      url: `${SITE_URL}/products/navprana-organics-pure-desi-buffalo-bilona-ghee-500ml`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Buffalo A2 Bilona Ghee (1 Ltr)",
      url: `${SITE_URL}/products/navprana-organics-pure-desi-buffalo-bilona-ghee-1-litre`,
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PKBBHL4K');`,
          }}
        />
        {/* End Google Tag Manager */}
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(itemListJsonLd),
          }}
        />
        {/* Meta Pixel (noscript fallback) */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1815246863217774&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
              <Footer />
              </ErrorBoundary>
            </ProfileProvider>
        </ReduxProvider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
