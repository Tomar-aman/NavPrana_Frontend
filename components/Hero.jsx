"use client";

import Image from "next/image";
import pineappleImage from "@/assets/hero_image.jpg";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section
      id="home"
      className="
        relative w-full overflow-hidden
        mt-20
        aspect-[16/9]
      "
    >
      <div className="relative w-full h-full">
        <Image
          src={pineappleImage}
          alt="NavPrana Organics Pure Desi Bilona Ghee — Best Organic Buffalo Ghee in India, Traditional Bilona Method from Chambal Valley"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Bottom CTA + SEO H1 */}
        <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-0 right-0">
          <div className="container mx-auto px-6">
            <div className="max-lg">
              <h1 className="sr-only">
                Buy Pure Desi Ghee Online — Best Bilona Ghee in India | NavPrana Organics
              </h1>
              <p className="sr-only">
                Buy 100% organic bilona ghee online from NavPrana Organics — India's best organic ghee brand.
                Order pure desi buffalo ghee made with the traditional Bilona method. Our premium A2 bilona ghee
                is sourced from grass-fed buffaloes in Chambal Valley, Madhya Pradesh. FSSAI certified, zero additives.
                Available as Buffalo A2 Bilona Ghee (500 ml) and Buffalo A2 Bilona Ghee (1 Ltr).
                Buy desi ghee online with free shipping above ₹999. Best bilona ghee in India at the best bilona ghee price.
                Pure desi ghee price starting at ₹1119. Order pure desi buffalo ghee, cow ghee online, or A2 ghee online
                from NavPrana — India's most trusted organic india ghee brand. Premium desi ghee, grass-fed ghee,
                and organic ghee delivered farm-fresh to your doorstep.
              </p>
              <Link
                href="/products"
                aria-label="Shop Pure Desi Bilona Ghee Online — Buy Best Ghee in India"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-6 sm:py-3 bg-white text-foreground text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:bg-white/90 transition shadow-lg backdrop-blur-sm"
              >
                Shop Now
                <ArrowRight size={13} className="sm:hidden" />
                <ArrowRight size={16} className="hidden sm:block" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
