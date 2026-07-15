import {
  ArrowLeft,
  Heart,
  Brain,
  Zap,
  Shield,
  Sparkles,
  Leaf,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Health Benefits of Pure Desi Bilona Ghee — Best Organic Ghee in India",
  description:
    "Discover the incredible health benefits of pure desi bilona ghee — heart health, brain function, energy, immune support, skin care, and digestive health. Learn why NavPrana's A2 bilona ghee is the best organic ghee in India and a true superfood.",
  keywords: [
    // AEO question keywords — what people ask Google & AI assistants
    "is ghee good for health",
    "ghee benefits",
    "how much ghee per day",
    "ghee vs butter which is better",
    "cow ghee vs buffalo ghee",
    "ghee on empty stomach benefits",
    "ghee for babies",
    "ghee with warm milk at night",
    "how to check pure ghee",
    "is ghee lactose free",
    "ghee smoke point",
    "butyric acid ghee benefits",
    "ghee for digestion",
    "ghee for weight loss",
    "ghee for skin and hair",
    "ayurvedic benefits of ghee",
    "desi ghee nutrition facts",
  ],
  openGraph: {
    title: "Health Benefits of Pure Desi Bilona Ghee | NavPrana Organics — Best Ghee in India",
    description:
      "Discover the powerful health benefits of traditional A2 bilona desi ghee — from heart health to brain function. Best organic ghee in India.",
    url: "/health-benefits",
  },
  alternates: {
    canonical: "/health-benefits",
  },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.navprana.com";

/**
 * AEO-targeted Q&As — direct answer in the first sentence, 40–70 words each.
 * Rendered visibly on the page AND emitted as FAQPage JSON-LD (Google requires
 * the schema content to be visible on the page).
 */
const healthFaqs = [
  {
    question: "How much ghee should I eat per day?",
    answer:
      "1–2 teaspoons of ghee per day is considered a moderate, healthy intake for most adults. Modern research shows moderate ghee consumption does not significantly increase cardiovascular risk in healthy individuals. Ghee is calorie-dense, so consistency in small amounts — with meals, rotis, or warm milk — works better than large quantities.",
  },
  {
    question: "Is ghee healthier than butter?",
    answer:
      "Ghee has two clear advantages over butter: a much higher smoke point (around 250°C / 485°F vs 177°C / 350°F for butter), making it safer for Indian cooking, frying and tadka, and it is virtually lactose-free and casein-free because milk solids are removed. Calorie and fat content are similar, but ghee is richer in butyrate and fat-soluble vitamins A, D, E and K.",
  },
  {
    question: "Which is better — cow ghee or buffalo ghee?",
    answer:
      "Both are healthy; they serve different needs. Cow ghee is lighter and easier to digest, making it ideal for daily use. Buffalo ghee is denser and more nutrient-rich — higher in butyric acid, calcium and phosphorus — offering more energy, which suits growing children, active lifestyles, and rich traditional recipes. In Ayurveda, buffalo ghee is valued for strength and better sleep.",
  },
  {
    question: "What are the benefits of eating ghee on an empty stomach?",
    answer:
      "A teaspoon of ghee on an empty stomach in the morning supports digestion, lubricates the gut, and provides steady energy. Its healthy fats keep you feeling full longer, which can support weight management. The butyric acid in pure bilona ghee also helps nourish the gut lining and reduce inflammation.",
  },
  {
    question: "Can babies eat ghee?",
    answer:
      "Yes — babies can start ghee at around 6 months of age, when solids are introduced. Begin with 2–3 drops (about ¼ teaspoon) stirred into cooled dal or khichdi once a day, increasing slowly with age. Ghee supports a baby's brain development, digestion, immunity, and weight gain. Always consult your pediatrician first, especially if there is a milk allergy.",
  },
  {
    question: "Is ghee lactose-free?",
    answer:
      "Yes, pure ghee is virtually lactose-free and casein-free. During the traditional Bilona process, milk solids — which contain the lactose and casein — are separated and removed, leaving pure golden butterfat. This is why most people with lactose intolerance or dairy sensitivity can enjoy ghee comfortably.",
  },
  {
    question: "How can I check if my ghee is pure?",
    answer:
      "Pure desi ghee is golden yellow, has a distinct nutty aroma, and develops a natural grainy (danedar) texture at room temperature. It melts instantly on a warm palm or spoon. Check the label: authentic bilona ghee lists a single ingredient — curd-churned butterfat — with no refined oils, additives, colours, or preservatives, and carries FSSAI certification.",
  },
  {
    question: "Does ghee with warm milk at night help?",
    answer:
      "Yes — a teaspoon of ghee in warm milk before bed is a time-tested Ayurvedic remedy. It can improve sleep quality, ease constipation by lubricating the digestive tract, soothe joints, and calm the nervous system. Buffalo ghee in particular is considered cooling and sleep-promoting in Ayurveda.",
  },
];

// FAQPage JSON-LD — mirrors the visible FAQ section below
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: healthFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

// Article JSON-LD — health content page
const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Health Benefits of Pure Desi Bilona Ghee",
  description:
    "The science-backed health benefits of pure desi bilona ghee — heart health, brain function, energy, immunity, skin, and digestion — plus nutrition facts and how to use ghee daily.",
  url: `${SITE_URL}/health-benefits`,
  image: `${SITE_URL}/opengraph-image`,
  author: {
    "@type": "Organization",
    name: "NavPrana Organics",
    url: SITE_URL,
  },
  publisher: {
    "@type": "Organization",
    name: "NavPrana Organics",
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/opengraph-image`,
    },
  },
  mainEntityOfPage: `${SITE_URL}/health-benefits`,
};

const Page = () => {
  const benefits = [
    {
      icon: Heart,
      title: "Heart Health",
      description:
        "Rich in healthy fats that support cardiovascular function and help maintain cholesterol levels.",
      details: [
        "Contains beneficial fatty acids",
        "Supports healthy cholesterol levels",
        "Promotes cardiovascular wellness",
        "Natural source of CLA (Conjugated Linoleic Acid)",
      ],
    },
    {
      icon: Brain,
      title: "Brain Function",
      description:
        "Essential fatty acids that nourish the brain and support cognitive function and memory.",
      details: [
        "Enhances memory and concentration",
        "Supports nervous system health",
        "Rich in DHA and omega-3 fatty acids",
        "Improves mental clarity",
      ],
    },
    {
      icon: Zap,
      title: "Energy Boost",
      description:
        "Quick source of energy that helps fuel your body and maintain stamina throughout the day.",
      details: [
        "Instant energy from medium-chain fatty acids",
        "Improves physical endurance",
        "Supports metabolic function",
        "Enhances athletic performance",
      ],
    },
    {
      icon: Shield,
      title: "Immune Support",
      description:
        "Packed with vitamins and antioxidants that strengthen your body's natural defense system.",
      details: [
        "Rich in fat-soluble vitamins A, D, E, K",
        "Contains powerful antioxidants",
        "Supports immune system function",
        "Has anti-inflammatory properties",
      ],
    },
    {
      icon: Sparkles,
      title: "Skin & Hair",
      description:
        "Nourishes skin from within and promotes healthy, lustrous hair growth.",
      details: [
        "Natural moisturizer for skin",
        "Promotes healthy hair growth",
        "Rich in vitamin E",
        "Anti-aging properties",
      ],
    },
    {
      icon: Leaf,
      title: "Digestive Health",
      description:
        "Aids digestion and helps maintain a healthy gut microbiome for better nutrient absorption.",
      details: [
        "Improves digestion and absorption",
        "Supports gut health",
        "Helps with lactose intolerance",
        "Balances stomach acidity",
      ],
    },
  ];

  const nutritionalFacts = [
    {
      nutrient: "Vitamin A",
      amount: "684 IU",
      benefit: "Eye health and immune function",
    },
    {
      nutrient: "Vitamin D",
      amount: "15 IU",
      benefit: "Bone health and calcium absorption",
    },
    {
      nutrient: "Vitamin E",
      amount: "2.8 mg",
      benefit: "Antioxidant protection",
    },
    {
      nutrient: "Vitamin K",
      amount: "8.6 mcg",
      benefit: "Blood clotting and bone health",
    },
    {
      nutrient: "CLA",
      amount: "High content",
      benefit: "Fat metabolism and immune support",
    },
    {
      nutrient: "Butyric Acid",
      amount: "Natural source",
      benefit: "Gut health and inflammation reduction",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 my-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {/* Header */}
      {/* <header className="bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between md:px-15">
          <Link
            href="/"
            className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl font-bold text-gradient">Health Benefits</h1>
          <div></div>
        </div>
      </header> */}

      <main className="container bg-primary/5 mx-auto px-4 py-12 md:px-15">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Health Benefits of Pure Desi <span className="text-gradient">Bilona Ghee</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover the incredible health benefits of pure desi bilona ghee — an
            ancient superfood that has been nourishing families for thousands of
            years. Our organic A2 bilona ghee is the best ghee in India for your wellness journey.
          </p>
        </section>

        {/* Benefits Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group border border-border/50 rounded-2xl bg-card/50 backdrop-blur-sm p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground mb-4">
                  {benefit.description}
                </p>
              </div>
              <ul className="space-y-2">
                {benefit.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Nutritional Facts */}
        <section className="bg-card/30 rounded-3xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Nutritional Profile
          </h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Per 100g serving of our premium pure desi bilona ghee contains essential
            nutrients your body needs for optimal health. Buy the best organic ghee in India.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nutritionalFacts.map((fact, index) => (
              <div
                key={index}
                className="bg-background/50 rounded-lg p-6 text-center border border-border/30"
              >
                <h4 className="text-lg font-semibold text-primary mb-2">
                  {fact.nutrient}
                </h4>
                <p className="text-2xl font-bold mb-2">{fact.amount}</p>
                <p className="text-sm text-muted-foreground">{fact.benefit}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to Use */}
        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">
            How to Incorporate Ghee in Your Diet
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Cooking",
                desc: "Use for sautéing, frying, and roasting. High smoke point makes it perfect for all cooking methods.",
              },
              {
                title: "Morning Ritual",
                desc: "Add a teaspoon to warm water or milk in the morning for better digestion and energy.",
              },
              {
                title: "With Rotis",
                desc: "Spread on warm rotis or parathas for enhanced flavor and nutritional benefits.",
              },
              {
                title: "Desserts",
                desc: "Perfect for making traditional sweets and adding richness to desserts.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white/50 rounded-xl p-6">
                <h4 className="text-lg font-semibold mb-3">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section — AEO: direct answers to the questions people ask
            Google & AI assistants about ghee (matches FAQPage JSON-LD above) */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">
            Ghee Health Questions, Answered
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            Straight answers to the most common questions about desi ghee,
            backed by tradition and modern nutrition science.
          </p>
          <div className="max-w-3xl mx-auto space-y-4">
            {healthFaqs.map((faq, index) => (
              <details
                key={index}
                className="group border border-border/50 rounded-2xl bg-card/50 backdrop-blur-sm p-6"
              >
                <summary className="cursor-pointer list-none">
                  <h3 className="inline text-lg font-semibold">
                    {faq.question}
                  </h3>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-4">
            Start Your Health Journey with the Best Bilona Ghee in India
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the incredible benefits of pure desi bilona ghee and transform
            your health naturally. Buy organic ghee online from NavPrana Organics.
          </p>
          <Link href="/products">
            <button className="bg-primary py-2 px-4 rounded-xl text-white">
              Shop Premium Ghee
            </button>
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Page;
