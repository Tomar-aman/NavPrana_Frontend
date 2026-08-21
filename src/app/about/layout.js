export const metadata = {
  title: "About Us — Ghee from the Chambal Valley",
  description:
    "Learn the story of NavPrana Organics — India's best organic bilona ghee brand from Chambal valley, Madhya Pradesh. We bring you 100% pure desi buffalo A2 bilona ghee, made using the traditional Bilona method. Grass-fed, FSSAI certified, premium desi ghee from Village Esah, Morena.",
  // No `keywords` field — Google has ignored <meta name="keywords">
  // since 2009. Target terms belong in visible headings and body copy.
  openGraph: {
    title: "About NavPrana Organics — Best Organic Bilona Ghee Brand in India",
    description:
      "Discover the story of NavPrana Organics. Pure desi A2 bilona ghee from Chambal valley. Best bilona ghee in India — traditional Bilona method, grass-fed, FSSAI certified.",
    url: "/about",
  },
  twitter: {
    card: "summary",
    title: "About NavPrana Organics — Best Bilona Ghee Brand in India",
    description:
      "India's best organic bilona ghee brand. Pure desi buffalo A2 ghee from Chambal valley, traditional Bilona method.",
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutLayout({ children }) {
  return children;
}
