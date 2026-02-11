export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
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
    sitemap: "https://www.navprana.com/sitemap.xml",
  };
}
