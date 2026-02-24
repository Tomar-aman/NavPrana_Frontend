import ProductsClient from "./ProductsClient";

export const metadata = {
  title: "Organic Desi Ghee Collection | NavPrana Organics",
  description: "Explore our collection of 100% pure organic Desi Ghee. Buffalo A2 Bilona Ghee, farm-fresh from the Chambal valley. Traditionally crafted for ultimate purity and health benefits.",
  openGraph: {
    title: "Organic Desi Ghee Collection | NavPrana Organics",
    description: "Explore our collection of 100% pure organic Desi Ghee. Traditionally crafted Bilona Ghee.",
    url: "/products",
    type: "website",
  },
  alternates: {
    canonical: "/products",
  },
};

const Page = () => {
  return <ProductsClient />;
};

export default Page;

