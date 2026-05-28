"use client";

import { useState, useEffect, useRef } from "react";
import { Instagram, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { getInstagramReels } from "@/services/social/reels";

const INSTAGRAM_PROFILE = "https://www.instagram.com/navprana/";

// Convert Instagram URL to embed URL
const getEmbedUrl = (url) => {
  const cleanUrl = url.replace(/\/+$/, "");
  return `${cleanUrl}/embed/`;
};

const ReelCard = ({ reel }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="shrink-0 w-[280px] sm:w-[300px] md:w-[320px]">
      {/* Card */}
      <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-400 hover:-translate-y-1">
        {/* Instagram gradient top accent */}
        <div className="h-[3px] w-full bg-gradient-to-r from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] via-[#bc1888] to-[#833ab4]" />

        {/* Iframe container — tall enough for reel content */}
        <div className="relative w-full" style={{ height: "460px" }}>
          {/* Loading skeleton */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center gap-4 z-10">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#833ab4] flex items-center justify-center">
                <Instagram size={24} className="text-white animate-pulse" />
              </div>
              <div className="space-y-2 w-3/4">
                <div className="h-2.5 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-2.5 bg-gray-100 rounded-full animate-pulse w-2/3 mx-auto" />
              </div>
              <p className="text-xs text-gray-400">Loading reel...</p>
            </div>
          )}

          <iframe
            src={getEmbedUrl(reel.instagram_url)}
            className="absolute inset-0 w-full h-full border-0"
            loading="lazy"
            scrolling="no"
            allowtransparency="true"
            allow="encrypted-media"
            title={reel.caption || "Instagram Reel"}
            onLoad={() => setIsLoaded(true)}
            style={{ overflow: "hidden" }}
          />
        </div>
      </div>

      {/* Caption below the card */}
      <div className="mt-3 px-1">
        <p className="text-sm text-foreground font-medium leading-snug line-clamp-2">
          {reel.caption}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#833ab4] flex items-center justify-center">
            <Instagram size={8} className="text-white" />
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">@navprana</p>
        </div>
      </div>
    </div>
  );
};

// Skeleton loader
const ReelSkeleton = () => (
  <div className="shrink-0 w-[280px] sm:w-[300px] md:w-[320px]">
    <div className="rounded-2xl overflow-hidden bg-white border border-gray-100">
      <div className="h-[3px] w-full bg-gradient-to-r from-gray-200 to-gray-100" />
      <div className="w-full" style={{ height: "460px" }}>
        <div className="w-full h-full bg-gray-100 animate-pulse" />
      </div>
    </div>
    <div className="mt-3 px-1 space-y-2">
      <div className="h-3.5 bg-gray-100 rounded-full animate-pulse w-full" />
      <div className="h-3 bg-gray-50 rounded-full animate-pulse w-2/3" />
    </div>
  </div>
);

const InstagramReels = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const data = await getInstagramReels();
        setReels(data);
      } catch (err) {
        console.error("Failed to fetch reels:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchReels();
  }, []);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 340;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Don't render section if no reels and not loading
  if (!loading && (error || reels.length === 0)) return null;

  return (
    <section
      id="social-proof"
      className="pt-6 pb-2 md:pt-10 md:pb-4 md:px-15 bg-gray-50/80"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#f09433]/10 via-[#dc2743]/10 to-[#833ab4]/10 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            <Instagram size={14} className="text-[#dc2743]" />
            <span className="bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#833ab4] bg-clip-text text-transparent">
              From Our Community
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
            Real Stories,{" "}
            <span className="text-gradient">Real Results</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch what our customers are saying about NavPrana&apos;s
            pure organic ghee — straight from their experience.
          </p>
        </div>

        {/* Horizontal scroll container with nav buttons */}
        <div className="relative group/scroll">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute -left-5 top-[220px] z-10 w-11 h-11 rounded-full bg-white shadow-lg border border-gray-100 items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 transition-all opacity-0 group-hover/scroll:opacity-100 cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute -right-5 top-[220px] z-10 w-11 h-11 rounded-full bg-white shadow-lg border border-gray-100 items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 transition-all opacity-0 group-hover/scroll:opacity-100 cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight size={22} />
          </button>

          {/* Scrollable row */}
          <div
            ref={scrollRef}
            className="flex gap-5 md:gap-6 overflow-x-auto pb-4 scrollbar-hide justify-start md:justify-center"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                <ReelSkeleton key={i} />
              ))
              : reels.map((reel) => (
                <ReelCard key={reel.id} reel={reel} />
              ))}
          </div>
        </div>

        {/* Follow CTA */}
        <div className="text-center mt-6">
          <a
            href={INSTAGRAM_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] via-[#cc2366] to-[#833ab4] text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
          >
            <Instagram size={18} />
            Follow @navprana on Instagram
            <ArrowRight
              size={16}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </a>
          <p className="text-xs text-muted-foreground mt-3">
            Join our community of 5000+ health-conscious families
          </p>
        </div>
      </div>
    </section>
  );
};

export default InstagramReels;
