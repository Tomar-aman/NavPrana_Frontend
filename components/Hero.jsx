"use client";

import { useState, useEffect, useRef } from "react";
import { preload } from "react-dom";
import Image from "next/image";
import pineappleImage from "@/assets/hero_3.png";
import cowImage from "@/assets/img_3.png";
import salesImage from "@/assets/hero_4.png";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

// Festive banner videos, played in this order ahead of the images while a
// festival is on. Each poster is the clip's first frame, so the banner is
// filled before the video arrives (and on any browser that cannot play WebM).
const FESTIVE_VIDEOS = [
  {
    video: "/videos/navprana-diwali-light.webm",
    poster: "/videos/navprana-diwali-light-poster.webp",
    alt: "NavPrana Diwali special — up to 30% off A2 bilona cow ghee ₹799 and buffalo ghee ₹699",
  },
  {
    video: "/videos/navprana-diwali-gifting.webm",
    poster: "/videos/navprana-diwali-gifting-poster.webp",
    alt: "NavPrana Diwali gifting — A2 desi cow bilona ghee ₹799 and A2 buffalo bilona ghee ₹699",
  },
];
const SLIDE_MS = 5000;
const VIDEO_LOOPS = 2; // the clips are 4s; let each play through twice before moving on

const Hero = ({ festiveVideo = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [videoMs, setVideoMs] = useState({}); // slide index -> how long to hold it
  const videoRefs = useRef({});

  // The first poster is the first thing painted in the banner, so it is the
  // homepage LCP while the videos lead — fetch it early.
  if (festiveVideo) preload(FESTIVE_VIDEOS[0].poster, { as: "image", fetchPriority: "high" });

  // `festive: false` keeps a slide out of the banner during a festival, when
  // the videos already carry the same offer. Nothing is removed for good: they
  // all come back as soon as the festival window closes.
  const imageSlides = [
    {
      image: salesImage,
      alt: "NavPrana Organics - Limited Time Offer - Buy 100% Pure Bilona Ghee Online",
      festive: false, // same 20%/30% offer the Diwali videos show
    },
    {
      image: pineappleImage,
      alt: "NavPrana Organics Pure Desi A2 Cow Bilona Ghee — the way it should be",
    },
    {
      image: cowImage,
      alt: "NavPrana Organics Pure Desi A2 Cow Bilona Ghee — Hand-Churned A2 Cow Ghee",
      festive: false, // keeps the festive rotation short
    }
  ];
  const slides = festiveVideo
    ? [...FESTIVE_VIDEOS, ...imageSlides.filter((s) => s.festive !== false)]
    : imageSlides;

  // One timeout per slide rather than a fixed interval, so a video slide can
  // stay up for the length of its clip instead of being cut at 5 seconds.
  const onVideoSlide = Boolean(slides[currentSlide]?.video);
  const slideCount = slides.length;
  const holdMs = onVideoSlide ? videoMs[currentSlide] || 8000 : SLIDE_MS;

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, holdMs);
    return () => clearTimeout(timer);
  }, [currentSlide, slideCount, holdMs]);

  // Restart the current clip each time its slide comes round; pause the rest.
  useEffect(() => {
    for (const [index, v] of Object.entries(videoRefs.current)) {
      if (!v) continue;
      if (Number(index) === currentSlide) {
        v.currentTime = 0;
        v.play().catch(() => {}); // blocked autoplay just leaves the poster up
      } else {
        v.pause();
      }
    }
  }, [currentSlide]);

  return (
    <section id="home" className="w-full mt-20">
      {/* Every slide is a finished piece of artwork carrying its own headline,
          body copy and Shop Now button, so nothing is laid over it — the
          headline below used to sit on top and buried theirs. It read worst on
          a phone, where 16:9 leaves about 220px of height and the overlay took
          most of it. The images are exactly 16:9, so this box crops none of
          them at any width. Kept full-bleed on purpose: a capped width left
          dead margins beside it while the header and the copy below run
          nearly edge to edge, which read as a mis-sized image. */}
      <div className="relative w-full aspect-[16/9] overflow-hidden group">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
          >
            {slide.video ? (
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                src={slide.video}
                poster={slide.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-label={slide.alt}
                onLoadedMetadata={(e) => {
                  const d = e.currentTarget.duration;
                  if (Number.isFinite(d) && d > 0) {
                    const ms = Math.max(SLIDE_MS, d * 1000 * VIDEO_LOOPS);
                    setVideoMs((prev) => (prev[index] === ms ? prev : { ...prev, [index]: ms }));
                  }
                }}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            ) : (
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
            )}
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

      {/* Visually hidden by request: the banner artwork already says this,
          and the block left a large gap under it. Kept in the page for search
          engines and screen readers (sr-only, not display:none).
          NOTE: keep it exactly this — one honest heading and one sentence that
          match what the banner shows. Adding keywords or extra copy here turns
          it into hidden-text keyword stuffing, which Google's spam policies
          name explicitly. */}
      <div className="sr-only">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 leading-[1.15] tracking-tight">
            Pure A2 Desi Cow &amp; Buffalo Bilona Ghee
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-5 max-w-xl leading-relaxed">
            Hand-churned the traditional bilona way in the Chambal valley of
            Madhya Pradesh. Grass-fed, FSSAI certified, nothing added.
          </p>
          {/* No Shop Now link here: an invisible link would still take keyboard
              focus. The banner itself links to /products. */}
        </div>
      </div>
    </section>
  );
};

export default Hero;
