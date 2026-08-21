import Benefits from "../../components/Benefits";
import Hero from "../../components/Hero";
import InstagramReels from "../../components/InstagramReels";
import Products from "../../components/Products";
import MilkChooser from "../../components/home/MilkChooser";
import BilonaProcess from "../../components/home/BilonaProcess";
import BlogPreviewAndProof from "../../components/home/BlogPreviewAndProof";
import { getProducts, getBlogList } from "@/lib/site";

export const metadata = {
  title: "Buy Pure A2 Desi Cow & Buffalo Bilona Ghee Online",
  description:
    "Buy pure A2 desi cow ghee and buffalo bilona ghee online from NavPrana Organics. Hand-churned the traditional bilona way in the Chambal valley. Grass-fed, FSSAI certified, free shipping above ₹999.",
  // NOTE: no `keywords` field. Google has ignored <meta name="keywords"> since
  // 2009, and the previous ~50-term list here included competitors' brand names.
  // Target terms belong in visible headings and body copy instead.
  openGraph: {
    title: "Buy Pure A2 Desi Cow & Buffalo Bilona Ghee Online | NavPrana Organics",
    description:
      "A2 desi cow ghee and buffalo bilona ghee, hand-churned the traditional bilona way in the Chambal valley. Grass-fed, FSSAI certified. Free shipping above ₹999.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy Pure A2 Desi Cow & Buffalo Bilona Ghee Online | NavPrana Organics",
    description:
      "A2 desi cow ghee and buffalo bilona ghee, hand-churned the traditional bilona way. FSSAI certified. Free shipping above ₹999.",
  },
  alternates: {
    canonical: "/",
  },
};

const Page = async () => {
  // Fetched on the server so product names, prices and links are in the initial
  // HTML. Previously <Products /> loaded the catalogue through a Redux
  // useEffect, so the homepage server-rendered zero product content.
  const [products, blogs] = await Promise.all([getProducts(), getBlogList()]);

  return (
    <div className="min-h-screen">
      <main>
        {/* Order follows the question a visitor asks next:
            what do you sell → which one is for me → why does it cost this →
            what does it do for me → can I trust you → tell me more. */}
        <Hero />
        <Products initialProducts={products} />
        <MilkChooser products={products} />
        <BilonaProcess />
        <Benefits />
        <InstagramReels />
        <BlogPreviewAndProof blogs={blogs} />
      </main>
    </div>
  );
};

export default Page;
