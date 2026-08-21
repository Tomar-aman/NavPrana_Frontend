export const metadata = {
  title: "Blog — Organic Living, Health Tips & Traditional Food Wisdom",
  description:
    "Explore the NavPrana blog for articles on organic food, traditional food preparation, clean eating, health benefits of pure ingredients, Ayurvedic nutrition, and sustainable living.",
  // No `keywords` field — Google has ignored <meta name="keywords">
  // since 2009. Target terms belong in visible headings and body copy.
  openGraph: {
    title: "Blog | NavPrana Organics",
    description:
      "Insights on organic food, traditional recipes, clean eating, and living a healthier life with pure ingredients.",
    url: "/blog",
  },
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogLayout({ children }) {
  return children;
}
