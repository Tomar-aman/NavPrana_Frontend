import { Heart, Zap, Shield, Sparkles, Droplets, Sun } from "lucide-react";
import organicFarmImage from "@/assets/image_nutrition.png";
import Image from "next/image";

const Benefits = () => {
  const benefits = [
    {
      icon: Heart,
      title: "Rich in Nutrients",
      description:
        "A powerhouse of essential vitamins and healthy fats that naturally supports heart health and overall wellness.",
      color: "bg-red-50",
      iconColor: "text-red-500",
    },
    {
      icon: Zap,
      title: "Boosts Energy",
      description:
        "Fuel your day with healthy fats that provide long-lasting stamina for active lifestyles.",
      color: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      icon: Shield,
      title: "Supports Immunity",
      description:
        "Rich in antioxidants and butyric acid to strengthen gut health and immune defense.",
      color: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      icon: Sparkles,
      title: "Pure & Wholesome",
      description:
        "Zero additives, zero chemicals. Just golden goodness of pure buffalo milk.",
      color: "bg-purple-50",
      iconColor: "text-purple-500",
    },
    {
      icon: Droplets,
      title: "Traditional Bilona",
      description:
        "Hand-churned using the ancient Bilona technique to preserve aroma and nutrition.",
      color: "bg-cyan-50",
      iconColor: "text-cyan-500",
    },
    {
      icon: Sun,
      title: "Farm Fresh",
      description:
        "Sourced from free-grazing buffaloes with ethical milking practices and supreme quality.",
      color: "bg-orange-50",
      iconColor: "text-orange-500",
    },
  ];

  return (
    <section
      id="benefits"
      className="py-12 md:py-16 md:px-15 bg-gray-50/80"
    >
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-xs font-semibold text-primary uppercase tracking-wider mb-4">
            <Heart size={14} />
            Health Benefits
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
            <span className="text-gradient">Nature's Perfect</span> Nutrition
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the incredible health benefits of our pure buffalo ghee,
            made using the ancient Bilona method.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center mb-8 md:mb-10">
          {/* Benefits Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-2xl border border-gray-100
                           transition-all duration-300
                           hover:-translate-y-1 hover:shadow-md
                           group"
              >
                <div className="space-y-3">
                  <div
                    className={`w-10 h-10 ${benefit.color} rounded-xl flex items-center justify-center
                                  group-hover:scale-110 transition-transform duration-300`}
                  >
                    <benefit.icon className={`h-5 w-5 ${benefit.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-lg">
              <Image
                src={organicFarmImage}
                alt="Organic farm with fresh herbs and natural elements"
                className="w-full h-64 sm:h-72 md:h-[400px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-5 sm:p-6">
                <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                  From Organic Farms to Your Table
                </h3>
                <p className="text-sm text-white/80">
                  Sustainable farming and natural processes ensure every jar
                  carries the pure essence of nature.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="text-center">
          <div
            className="bg-white rounded-2xl border border-gray-100 shadow-sm
                        p-6 sm:p-8 max-w-3xl mx-auto"
          >
            <h3 className="text-lg md:text-2xl font-bold text-gradient mb-3 md:mb-4">
              Harmony with Nature, Wellness for Life
            </h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
              "When we honor nature's gifts and traditional wisdom, we create
              nourishment that feeds not just the body, but the soul."
            </p>
            <p className="text-xs text-muted-foreground font-medium">
              — Traditional Wisdom & Modern Science
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
