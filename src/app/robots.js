export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.navprana.com";
  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/signin",
          "/signup",
          "/auth",
          "/profile",
          "/cart",
          "/checkout",
          "/payment",
          "/payment-status",
          "/order",
          "/order-details",
          "/forgot-password",
          "/api/",
        ],
      },
      {
        userAgent: "*",
        allow: [
          "/",
          "/products",
          "/about",
          "/health-benefits",
          "/blog",
          "/faq",
          "/contact",
        ],
        disallow: [
          "/signin",
          "/signup",
          "/auth",
          "/profile",
          "/cart",
          "/checkout",
          "/payment",
          "/payment-status",
          "/order",
          "/order-details",
          "/forgot-password",
          "/api/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
