import Benefits from "../../components/Benefits";
import Hero from "../../components/Hero";
import Products from "../../components/Products";
import Testimonials from "../../components/Testimonials";

export const metadata = {
  title: "NavPrana Organics — Pure Desi Ghee | Buy Organic Bilona Ghee Online",
  description:
    "NavPrana Organics brings you 100% pure, traditional Bilona method desi ghee sourced from the Chambal valley of Madhya Pradesh. Shop premium organic buffalo ghee online — farm-fresh, no preservatives.",
  openGraph: {
    title: "NavPrana Organics — Pure Desi Ghee | Buy Organic Bilona Ghee Online",
    description:
      "Shop 100% pure organic desi ghee from NavPrana Organics. Traditional Bilona method, farm-fresh from Chambal valley.",
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
