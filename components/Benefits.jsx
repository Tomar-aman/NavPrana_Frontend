import { Heart, Zap, Shield, Sparkles, Droplets, Sun } from "lucide-react";
import organicFarmImage from "@/assets/image_nutrition.png";
import Image from "next/image";

const Benefits = () => {
  const benefits = [
    {
      icon: Heart,
      title: "Fat-Soluble Vitamins",
      description:
        "Ghee naturally carries vitamins A, D, E and K — the fat-soluble ones your body absorbs better when they come with fat.",
      color: "bg-red-50",
      iconColor: "text-red-500",
    },
    {
      icon: Zap,
      title: "Slow-Burning Fat",
      description:
        "Ghee is almost entirely fat, which digests slower than carbohydrate — which is why a spoon in dal keeps a meal satisfying for longer.",
      color: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      icon: Shield,
      title: "Butyric Acid",
      description:
        "Ghee is one of the richest natural food sources of butyric acid, a short-chain fatty acid long valued in Indian kitchens and Ayurveda.",
      color: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      icon: Sparkles,
      title: "One Ingredient",
      description:
        "No palm oil, no vanaspati, no colour, no preservative, no synthetic flavour. Just A2 milk — cow or buffalo — and nothing else.",
      color: "bg-purple-50",
      iconColor: "text-purple-500",
    },
    {
      icon: Droplets,
      title: "Hand-Churned Bilona",
      description:
        "Cultured into curd overnight, churned by hand, then slow-simmered. Roughly 30 litres of milk go into a single litre of ghee.",
      color: "bg-cyan-50",
      iconColor: "text-cyan-500",
    },
    {
      icon: Sun,
      title: "Grass-Fed, Open Grazing",
      description:
        "From indigenous cows and native breed buffaloes on open grazing along the Chambal, not stall-fed on concentrate.",
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
            What&apos;s actually <span className="text-gradient">in the jar</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Ghee is a food, not a supplement. Here is what A2 bilona ghee — cow
            or buffalo — is made of, and how ours is made.
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
                alt="Open grazing along the Chambal valley, where NavPrana sources A2 cow and buffalo milk for bilona ghee"
                className="w-full h-64 sm:h-72 md:h-[400px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-5 sm:p-6">
                <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                  From the Chambal valley to your kitchen
                </h3>
                <p className="text-sm text-white/80">
                  Small batches, open grazing, and a process that has not changed
                  in generations.
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
              How much is enough?
            </h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
              Two to three teaspoons a day across meals is roughly what
              traditional Indian cooking already uses. Ghee is calorie dense, so
              it is not something to add on top of an existing diet without
              accounting for it.
            </p>
            <p className="text-xs text-muted-foreground font-medium">
              Not medical advice — ask a doctor or dietitian about your own diet.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
