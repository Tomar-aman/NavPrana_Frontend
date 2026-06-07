import ProductsClient from "./ProductsClient";

export const metadata = {
  title: "Buy Pure Desi Bilona Ghee Online — Organic A2 Buffalo Ghee Collection",
  description: "Shop NavPrana's collection of 100% pure organic bilona ghee. Buy the best desi buffalo A2 bilona ghee online — Buffalo A2 Bilona Ghee (500 ml) & (1 Ltr). Traditional Bilona method, grass-fed, FSSAI certified. Pure desi ghee price starting ₹1119. Free shipping above ₹999.",
  openGraph: {
    title: "Buy Pure Desi Bilona Ghee Online — Best Organic Ghee Collection | NavPrana",
    description: "Order premium organic bilona ghee. Buy the best A2 buffalo desi ghee in India from ₹1119. Bilona method, FSSAI certified.",
    url: "/products",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy Bilona Ghee Online — Pure Desi Buffalo Ghee | NavPrana Organics",
    description: "Shop 100% pure organic A2 bilona ghee. Best bilona ghee price in India. Free shipping above ₹999.",
  },
  alternates: {
    canonical: "/products",
  },
};

const Page = () => {
  return <ProductsClient />;
};

export default Page;

