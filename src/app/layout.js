import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
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
    default: "NavPrana Organics — Pure Desi Ghee | Buy Organic Bilona Ghee Online",
    template: "%s | NavPrana Organics",
  },
  description:
    "NavPrana Organics brings you 100% pure, traditional Bilona method desi ghee sourced from the pristine Chambal valley of Madhya Pradesh. Buy premium organic buffalo ghee online — no preservatives, no additives, farm-fresh to your doorstep.",
  keywords: [
    "NavPrana",
    "NavPrana Organics",
    "navprana",
    "desi ghee",
    "organic ghee",
    "bilona ghee",
    "pure ghee",
    "buffalo ghee",
    "desi ghee online",
    "buy ghee online",
    "traditional ghee",
    "Chambal ghee",
    "farm fresh ghee",
    "A2 ghee",
    "natural ghee India",
    "ghee Madhya Pradesh",
    "organic food India",
    "pure buffalo ghee",
    "ghee buy online India",
    "NavPrana ghee",
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
    title: "NavPrana Organics — Pure Desi Ghee | Buy Organic Bilona Ghee Online",
    description:
      "100% pure, traditional Bilona method desi ghee from the Chambal valley. No preservatives, no additives. Farm-fresh organic ghee delivered to your doorstep.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NavPrana Organics — Pure Desi Ghee | Buy Organic Bilona Ghee Online",
    description:
      "100% pure, traditional Bilona method desi ghee from the Chambal valley. Farm-fresh organic ghee delivered to your doorstep.",
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
    "NavPrana Organics is a clean food company bringing pure, traditional Bilona method desi ghee from the Chambal valley of Madhya Pradesh.",
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

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NavPrana Organics",
  url: SITE_URL,
  description:
    "Buy pure organic desi ghee online from NavPrana Organics. Traditional Bilona method, farm-fresh from Chambal valley.",
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
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                draggable
                theme="light"
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
