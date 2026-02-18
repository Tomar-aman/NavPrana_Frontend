"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const AutoCycleImage = ({ images = [], alt, className = "" }) => {
  const [current, setCurrent] = useState(0);
  const [sliding, setSliding] = useState(false);
  const nextRef = useRef(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      const nextIdx = (nextRef.current + 1) % images.length;
      nextRef.current = nextIdx;
      setSliding(true);

      // After animation ends, commit the new index and reset
      setTimeout(() => {
        setCurrent(nextIdx);
        setSliding(false);
      }, 600);
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length]);

  if (!images.length) {
    return <Image src="/placeholder.png" alt={alt} fill className={`object-cover ${className}`} />;
  }

  const currentSrc = images[current]?.image || "/placeholder.png";
  const nextSrc = images[nextRef.current]?.image || currentSrc;

  return (
    <>
      {/* Current — slides out left */}
      <div
        className="absolute inset-0"
        style={{
          transform: sliding ? "translateX(-100%)" : "translateX(0)",
          transition: sliding ? "transform 600ms ease-in-out" : "none",
        }}
      >
        <Image src={currentSrc} alt={alt} fill className={`object-cover ${className}`} />
      </div>

      {/* Next — slides in from right */}
      <div
        className="absolute inset-0"
        style={{
          transform: sliding ? "translateX(0)" : "translateX(100%)",
          transition: sliding ? "transform 600ms ease-in-out" : "none",
        }}
      >
        <Image src={nextSrc} alt={alt} fill className={`object-cover ${className}`} />
      </div>

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
          {images.map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === (sliding ? nextRef.current : current) ? "bg-white w-3" : "bg-white/50"
                }`}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default AutoCycleImage;
