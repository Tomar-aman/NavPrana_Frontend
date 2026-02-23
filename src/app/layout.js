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
    default: "Buy Pure Desi Ghee Online — NavPrana Organics | 100% Organic Bilona Ghee India",
    template: "%s | NavPrana Organics",
  },
  description:
    "Buy 100% pure organic desi ghee online from NavPrana Organics. Traditional Bilona method buffalo ghee from Chambal valley, Madhya Pradesh. No preservatives, no additives. Free shipping on orders above ₹999. FSSAI certified, farm-fresh to your doorstep.",
  keywords: [
    "NavPrana",
    "NavPrana Organics",
    "navprana",
    "desi ghee",
    "pure desi ghee",
    "organic ghee",
    "bilona ghee",
    "pure ghee online",
    "buy ghee online",
    "ghee price",
    "best ghee in India",
    "buffalo ghee",
    "desi ghee online",
    "A2 ghee",
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
    "NavPrana ghee",
    "natural ghee India",
    "ghee Madhya Pradesh",
    "best organic ghee brand",
    "pure ghee for health",
    "chemical free ghee",
    "organic food online India",
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
    title: "Buy Pure Desi Ghee Online — NavPrana Organics | Organic Bilona Ghee",
    description:
      "100% pure organic Bilona desi ghee from Chambal valley. No preservatives, no additives. FSSAI certified. Free shipping above ₹999.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy Pure Desi Ghee Online — NavPrana Organics | Organic Bilona Ghee",
    description:
      "100% pure organic Bilona desi ghee from Chambal valley. FSSAI certified. Free shipping above ₹999.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  alternates: {
    canonical: "/",
  },
  category: "Food & Beverages",
};

// JSON-LD Structured Data
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NavPrana Organics",
  url: SITE_URL,
  logo: `${SITE_URL}/opengraph-image`,
  description:
    "NavPrana Organics is an organic and pure food company bringing traditionally prepared, chemical-free food products to Indian households. Our first product is pure Bilona method desi ghee from the Chambal valley of Madhya Pradesh.",
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
  sameAs: [
    "https://www.instagram.com/navprana/",
  ],
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
    "Buy pure organic desi ghee and natural food products online. Traditional Bilona method, FSSAI certified, free shipping across India.",
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
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NavPrana Organics",
  url: SITE_URL,
  description:
    "Buy pure organic desi ghee and natural food products online from NavPrana Organics. Traditional Bilona method, farm-fresh from Chambal valley.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/products?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
