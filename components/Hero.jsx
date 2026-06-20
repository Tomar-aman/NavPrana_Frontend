"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import pineappleImage from "@/assets/hero_image.jpg";
import cowImage from "@/assets/img_3.png";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: pineappleImage,
      alt: "NavPrana Organics Pure Desi Bilona Ghee — Best Organic Buffalo Ghee in India",
    },
    {
      image: cowImage,
      alt: "NavPrana Organics Pure Desi A2 Cow Bilona Ghee — Best Organic Cow Ghee in India",
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden mt-20 aspect-[16/9] group"
    >
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              className="object-cover object-center"
            />
          </div>
        ))}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-20 pointer-events-none" />

        {/* Navigation Arrows (Visible on hover on desktop) */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden sm:block"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden sm:block"
        >
          <ChevronRight size={24} />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${currentSlide === index ? "w-8 bg-white" : "w-2 bg-white/50"
                }`}
            />
          ))}
        </div>

        {/* Bottom CTA + SEO H1 */}
        <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-0 right-0 z-30 pointer-events-none">
          <div className="container mx-auto px-6 pointer-events-auto">
            <div className="max-lg">
              <h1 className="sr-only">
                Buy Pure Desi Cow & Buffalo Ghee Online — Best Bilona Ghee in India | NavPrana Organics
              </h1>
              <p className="sr-only">
                Buy 100% organic bilona ghee online from NavPrana Organics — India's best organic ghee brand.
                Order pure desi cow and buffalo ghee made with the traditional Bilona method. Our premium A2 cow bilona ghee
                is sourced from grass-fed cows. FSSAI certified, zero additives.
                Available as Desi Cow A2 Bilona Ghee and Buffalo A2 Bilona Ghee.
                Buy desi ghee online with free shipping above ₹999. Best cow bilona ghee in India at the best price.
                Pure desi cow ghee price starting at ₹1019. Order pure desi cow ghee, buffalo ghee online, or A2 cow ghee online
                from NavPrana — India's most trusted organic india ghee brand. Premium desi cow ghee, grass-fed cow ghee,
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
