"use client";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border">
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
      </header>

      <main className="container bg-primary/5 mx-auto px-4 py-12 md:px-15">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Nature&apos;s <span className="text-gradient">Superfood</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover the incredible health benefits of pure desi ghee - an
            ancient superfood that has been nourishing families for thousands of
            years with its powerful nutritional properties.
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
          <h3 className="text-3xl font-bold text-center mb-8">
            Nutritional Profile
          </h3>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Per 100g serving of our premium desi ghee contains essential
            nutrients your body needs for optimal health.
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
          <h3 className="text-3xl font-bold mb-8">
            How to Incorporate Ghee in Your Diet
          </h3>
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

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 md:p-12">
          <h3 className="text-3xl font-bold mb-4">
            Start Your Health Journey Today
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the incredible benefits of pure desi ghee and transform
            your health naturally.
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
