import Benefits from "../../components/Benefits";
import Hero from "../../components/Hero";
import InstagramReels from "../../components/InstagramReels";
import Products from "../../components/Products";
import Testimonials from "../../components/Testimonials";

export const metadata = {
  title: "Buy Pure Desi Cow & Buffalo Bilona Ghee Online | NavPrana Organics",
  description:
    "Buy pure desi ghee online from NavPrana Organics — India's best organic bilona ghee brand. Order 100% pure A2 Cow & Buffalo bilona ghee starting ₹1019. Traditional Bilona method, grass-fed, FSSAI certified. Premium desi ghee from Chambal valley, Madhya Pradesh. Buy desi ghee online with free shipping above ₹999.",
  keywords: [
    // Misspellings
    "nvaprana",
    "navparna",
    "navaparna",
    "navprna",
    // Competitor targeting
    "rosier ghee",
    "two brothers organic farms",
    "two brother ghee",
    "anveshan ghee",
    "avneshan ghee",
    "kasutam ghee",
    // Core keywords
    "buy ghee online",
    "bilona ghee",
    "cow bilona ghee",
    "desi cow ghee",
    "a2 cow ghee",
    "best cow ghee in India",
    "buy cow ghee online",
    "pure cow ghee",
    "cow bilona ghee online",
    "best ghee in India",
    "organic ghee",
    "pure desi ghee",
    "a2 bilona ghee",
    "desi ghee online",
    "bilona ghee price",
    "buy desi ghee online",
    "pure ghee online",
    "grass-fed ghee",
    "best bilona ghee in india",
    "bilona ghee online",
    "pure desi buffalo ghee",
    "premium desi ghee",
    "A2 ghee online",
    "organic india ghee",
    "Buffalo A2 Bilona Ghee 500 ml",
    "Buffalo A2 Bilona Ghee 1 Ltr",
    "buy buffalo ghee online",
    "cow ghee online",
    "pure desi ghee price",
  ],
  openGraph: {
    title: "Buy Pure Desi Cow & Buffalo Bilona Ghee Online | NavPrana Organics",
    description:
      "India's best organic bilona ghee — 100% pure A2 Cow and Buffalo desi ghee starting ₹1019. Traditional Bilona method, grass-fed, FSSAI certified. Free shipping above ₹999.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy Pure Desi Cow & Buffalo Bilona Ghee Online | NavPrana Organics",
    description:
      "Order 100% pure organic bilona ghee online. A2 Cow and Buffalo desi ghee, traditional Bilona method. Starting ₹1019. Free shipping above ₹999.",
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
        <InstagramReels />
        <Benefits />

        {/* <Testimonials /> */}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Page;
