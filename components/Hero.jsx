"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import pineappleImage from "@/assets/hero_image.jpg";
import cowImage from "@/assets/img_3.png";
import salesImage from "@/assets/sales.png";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: salesImage,
      alt: "NavPrana Organics - Limited Time Offer - Buy 100% Organic Bilona Ghee Online",
    },
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
              /* Without `sizes`, next/image assumes 100vw and serves the largest
                 srcset candidate. This is the homepage LCP element. */
              sizes="100vw"
              priority={index === 0}
              loading={index === 0 ? undefined : "lazy"}
              className="object-cover object-center"
            />
          </div>
        ))}

        {/* Gradient Overlay — carries the headline text over the photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-20 pointer-events-none" />

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

        {/* Bottom headline + CTA */}
        <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-0 right-0 z-30 pointer-events-none">
          <div className="container mx-auto px-6 pointer-events-auto">
            <div className="max-w-2xl">
              {/* NOTE: this h1 must stay VISIBLE. It was previously sr-only,
                  together with a keyword-stuffed paragraph — hidden text and
                  keyword stuffing are both named in Google's spam policies, and
                  it left the homepage with no visible heading at all. */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3 leading-[1.12] tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]">
                Pure A2 Desi Cow &amp; Buffalo Bilona Ghee
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-white/90 mb-3 sm:mb-5 max-w-xl leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
                Hand-churned the traditional bilona way in the Chambal valley of
                Madhya Pradesh. Grass-fed, FSSAI certified, nothing added.
              </p>
              <Link
                href="/products"
                aria-label="Shop pure desi bilona ghee online"
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
