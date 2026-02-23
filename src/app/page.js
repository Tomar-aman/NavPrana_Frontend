import Benefits from "../../components/Benefits";
import Hero from "../../components/Hero";
import Products from "../../components/Products";
import Testimonials from "../../components/Testimonials";

export const metadata = {
  title: "Buy Pure Desi Ghee Online — 100% Organic Bilona Ghee | NavPrana Organics",
  description:
    "Shop 100% pure organic desi ghee from NavPrana Organics starting at ₹1119. Traditional Bilona method, farm-fresh from Chambal valley, Madhya Pradesh. FSSAI certified, zero additives. Free shipping above ₹999. India's trusted organic food brand.",
  openGraph: {
    title: "Buy Pure Desi Ghee Online — NavPrana Organics | Organic Bilona Ghee",
    description:
      "100% pure organic Bilona desi ghee starting at ₹1119. Farm-fresh from Chambal valley. FSSAI certified, free shipping above ₹999.",
    url: "/",
  },
  alternates: {
    canonical: "/",
  },
};

const Page = () => {
  return (
    <div className="min-h-screen">
      {/* <Header /> */}
      <main>
        <Hero />
        <Products />
        <Benefits />

        {/* <Testimonials /> */}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Page;
