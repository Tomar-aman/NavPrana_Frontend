"use client";

import Image from "next/image";
import pineappleImage from "@/assets/hero_image.png";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section
      id="home"
      className="
        relative w-full overflow-hidden
        pt-20
        h-[45vh]
        sm:h-[60vh]
        md:h-[85vh]
        lg:h-screen
      "
    >
      <div className="relative w-full h-full">
        <Image
          src={pineappleImage}
          alt="NavPrana Organics — Pure Desi Ghee"
          fill
          priority
          className="object-contain sm:object-cover object-center"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Bottom CTA */}
        <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-0 right-0">
          <div className="container mx-auto px-6">
            <div className="max-w-md">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-foreground text-sm font-semibold rounded-xl hover:bg-white/90 transition shadow-lg backdrop-blur-sm"
              >
                Shop Now
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
