export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
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
        ],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.navprana.com"}/sitemap.xml`,
  };
}
