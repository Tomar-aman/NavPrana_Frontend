export const metadata = {
  title: "About Us — Ghee from the Chambal Valley",
  description:
    "Learn the story of NavPrana Organics — India's best organic bilona ghee brand from Chambal valley, Madhya Pradesh. We bring you 100% pure desi buffalo A2 bilona ghee, made using the traditional Bilona method. Grass-fed, FSSAI certified, premium desi ghee from Village Esah, Morena.",
  // No `keywords` field — Google has ignored <meta name="keywords">
  // since 2009. Target terms belong in visible headings and body copy.
  openGraph: {
    title: "About NavPrana Organics — Vedic Bilona Ghee from Chambal Valley",
    description:
      "The story of NavPrana Organics: pure A2 desi cow ghee and buffalo bilona ghee hand-churned in Morena, Chambal valley. Grass-fed, FSSAI certified.",
    url: "/about",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About NavPrana Organics — Vedic Bilona Ghee from Chambal Valley",
    description:
      "Pure A2 desi cow ghee and buffalo bilona ghee from the Chambal valley, Madhya Pradesh. Traditional bilona method, grass-fed, zero additives.",
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutLayout({ children }) {
  return children;
}

