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
          alt="NavPrana Organics — Pure Desi Ghee"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Bottom CTA + SEO H1 */}
        <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-0 right-0">
          <div className="container mx-auto px-6">
            <div className="max-w-lg">
              <h1 className="sr-only">
                Pure Desi Ghee — NavPrana Organics
              </h1>
              <p className="sr-only">
                100% Organic Bilona Ghee from Chambal Valley, Madhya Pradesh.
                Farm-fresh. FSSAI Certified. Free shipping above ₹999.
              </p>
              <Link
                href="/products"
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
