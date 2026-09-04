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
    <section id="home" className="w-full mt-20">
      {/* Every slide is a finished piece of artwork carrying its own headline,
          body copy and Shop Now button, so nothing is laid over it — the
          headline below used to sit on top and buried theirs. It read worst on
          a phone, where 16:9 leaves about 220px of height and the overlay took
          most of it. The images are exactly 16:9, so this box crops none of
          them at any width. */}
      <div className="relative w-full aspect-[16/9] overflow-hidden group">
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

        {/* The artwork has a Shop Now button painted into it, which people aim
            at — the whole banner has to answer that tap. Sits under the arrows
            and dots so their own clicks still reach them. */}
        <Link
          href="/products"
          aria-label="Shop pure desi bilona ghee online"
          className="absolute inset-0 z-20"
        />

        {/* Navigation Arrows (Visible on hover on desktop) */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden sm:block"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden sm:block"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Pagination dots sit under the banner rather than on it. White dots
          worked only because a dark gradient used to be painted over the photo;
          with the artwork left alone they would vanish into the cream slides. */}
      <div className="flex justify-center gap-2 pt-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 rounded-full transition-all ${currentSlide === index ? "w-8 bg-primary" : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 pt-5 pb-8 sm:pt-6 sm:pb-10">
        <div className="max-w-2xl">
          {/* NOTE: this h1 must stay VISIBLE. It was previously sr-only,
              together with a keyword-stuffed paragraph — hidden text and
              keyword stuffing are both named in Google's spam policies, and
              it left the homepage with no visible heading at all. Below the
              banner is still visible; behind it was not. */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 leading-[1.15] tracking-tight">
            Pure A2 Desi Cow &amp; Buffalo Bilona Ghee
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-5 max-w-xl leading-relaxed">
            Hand-churned the traditional bilona way in the Chambal valley of
            Madhya Pradesh. Grass-fed, FSSAI certified, nothing added.
          </p>
          {/* White on white now that this is off the darkened photo, so it
              takes the brand colour instead. */}
          <Link
            href="/products"
            aria-label="Shop pure desi bilona ghee online"
            className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition shadow-sm"
          >
            Shop Now
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
