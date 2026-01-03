import { Heart, Zap, Shield, Sparkles, Droplets, Sun } from "lucide-react";
import organicFarmImage from "@/assets/organic-farm.jpg";
import Image from "next/image";

const Benefits = () => {
  const benefits = [
    {
      icon: Heart,
      title: "Rich in Nutrients",
      description:
        "Packed with vitamins A, D, E, K and essential fatty acids for optimal health and wellness.",
    },
    {
      icon: Zap,
      title: "Boosts Energy",
      description:
        "Natural source of quick energy and helps improve physical strength and stamina.",
    },
    {
      icon: Shield,
      title: "Supports Immunity",
      description:
        "Contains antioxidants and natural compounds that strengthen your immune system.",
    },
    {
      icon: Sparkles,
      title: "Pure & Wholesome",
      description:
        "Free from chemicals, additives, and preservatives - just pure, natural goodness from nature.",
    },
    {
      icon: Droplets,
      title: "Traditional Bilona",
      description:
        "Hand-churned using ancient methods that preserve nutrients and enhance natural flavors.",
    },
    {
      icon: Sun,
      title: "Sun-Dried Goodness",
      description:
        "Made from milk of cows that graze in natural sunlight, enriching the ghee with vitamin D.",
    },
  ];

  return (
    <section
      id="benefits"
      className="py-16 md:py-20 md:px-15 bg-gradient-warm/60"
    >
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
            <span className="text-gradient">Nature's Perfect</span> Nutrition
          </h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the incredible health benefits of our pure desi ghee,
            sourced from happy cows grazing in natural pastures and crafted with
            traditional wisdom passed down through generations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center mb-16">
          {/* Benefits Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="p-5 sm:p-6 bg-card/3 backdrop-blur-sm 
                            transition-all duration-300 
                           shadow-sm hover:-translate-y-1 hover:shadow-xl 
                           rounded-xl group"
              >
                <div className="space-y-4">
                  <div
                    className="w-12 h-12 bg-[#2b6033] rounded-lg flex items-center justify-center 
                                  group-hover:scale-110 transition-transform duration-300 shadow-md"
                  >
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Traditional Source Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <Image
                src={organicFarmImage}
                alt="Organic farm with fresh herbs and natural elements"
                className="w-full h-64 sm:h-80 md:h-[500px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 "></div>
              <div className="absolute bottom-4 sm:bottom-6 left-4 right-4 sm:left-6 sm:right-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-md">
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
                    From Organic Farms to Your Table
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Our commitment to sustainable farming and natural processes
                    ensures that every jar of ghee carries the pure essence of
                    nature's bounty.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ayurvedic Wisdom Section */}
        <div className="text-center">
          <div
            className="backdrop-blur-sm border border-gray-500/50 shadow-xl rounded-2xl 
                          p-6 sm:p-8 md:p-12 max-w-8xl mx-auto"
          >
            <h3 className="text-xl md:text-3xl font-bold text-gradient mb-4 md:mb-6">
              Harmony with Nature, Wellness for Life
            </h3>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 md:mb-8">
              "When we honor nature's gifts and traditional wisdom, we create
              nourishment that feeds not just the body, but the soul. Our ghee
              is a testament to this timeless truth."
            </p>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
              - Traditional Wisdom & Modern Science
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
