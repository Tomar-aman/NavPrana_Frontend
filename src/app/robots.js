import { SITE_URL } from "@/lib/site";

const DISALLOW = [
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
  "/my-coupons",
  "/cod-success",
  "/spin",
  "/api/",
];

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
