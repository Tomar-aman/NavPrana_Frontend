"use client";

import { useState, useEffect, useRef } from "react";
import { ShoppingCart } from "lucide-react";

const StickyCartBar = ({ product, isInCart, onAddToCart, onGoToCart }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    // Watch when the main "Add to Cart" button scrolls out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar when the sentinel (original button area) is NOT visible
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Invisible sentinel — place this near the original Add to Cart button */}
      <div ref={sentinelRef} className="w-0 h-0" />

      {/* Sticky bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-primary-border shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-transform duration-300 ${isVisible ? "translate-y-0" : "translate-y-full"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Product info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground text-sm truncate">
              {product.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-primary font-bold text-lg">₹{product.price}</span>
              {product.max_price && (
                <span className="line-through text-muted-foreground text-sm">
                  ₹{product.max_price}
                </span>
              )}
            </div>
          </div>

          {/* CTA button */}
          {isInCart ? (
            <button
              onClick={onGoToCart}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition cursor-pointer whitespace-nowrap"
            >
              <ShoppingCart size={18} />
              Go to Cart
            </button>
          ) : (
            <button
              onClick={() => onAddToCart(product.id)}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition cursor-pointer whitespace-nowrap"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default StickyCartBar;
