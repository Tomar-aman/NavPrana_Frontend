"use client";

import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import AutoCycleImage from "./AutoCycleImage";
import { generateSlug } from "@/utils/slug";

/**
 * One product card, used by both grids.
 *
 * The homepage grid and the /products grid carried two near-identical ninety-line
 * copies of this markup. When the card's link had to change from an onClick on a
 * <div> to a real <a href>, the same fix had to be made twice — which is the
 * signal that the card belongs in one place.
 *
 * The two call sites differed only in scale, so that is the only prop:
 *   size="lg"  homepage  — taller image, roomier padding, larger title
 *   size="sm"  /products — the denser grid
 *
 * Link behaviour worth preserving: the title is the anchor, and its `before`
 * pseudo-element stretches over the whole card so the entire card is clickable.
 * The CTA sits at z-20 to stay above that overlay. This keeps one crawlable
 * <a href> per card with the product name as its anchor text, without nesting a
 * <button> inside an <a> (which is invalid HTML).
 */

const SIZES = {
  lg: {
    image: "h-60 md:h-64",
    body: "p-5",
    title: "text-lg",
    rating: { box: "px-2 py-0.5", icon: 12, text: "text-xs" },
    price: "text-xl",
    gapBelowPrice: "mb-4",
  },
  sm: {
    image: "h-56 md:h-60",
    body: "p-4",
    title: "text-base",
    rating: { box: "px-2 py-0.5", icon: 11, text: "text-[11px]" },
    price: "text-xl",
    gapBelowPrice: "mb-3",
  },
};

export default function ProductCard({ product, isInCart, onAddToCart, size = "sm" }) {
  const router = useRouter();
  const s = SIZES[size] ?? SIZES.sm;
  const href = `/products/${generateSlug(product.name)}`;

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Image */}
      <div className={`relative w-full ${s.image} overflow-hidden bg-gray-50`}>
        <AutoCycleImage
          images={product.images}
          alt={product.name}
          className="group-hover:scale-105"
        />
        {product.discount_precent && (
          <div className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-primary text-white shadow-sm z-20">
            Save {parseInt(product.discount_precent)}%
          </div>
        )}
      </div>

      {/* Info */}
      <div className={`${s.body} flex flex-col flex-1`}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className={`${s.title} font-semibold text-foreground leading-tight`}>
            <Link
              href={href}
              className="hover:text-primary transition before:absolute before:inset-0 before:z-10 before:content-['']"
            >
              {product.name}
            </Link>
          </h3>
          {(product.family_rating || product.average_rating) && (
            <div
              className={`flex items-center gap-1 shrink-0 ${s.rating.box} bg-primary/10 rounded-md`}
            >
              <Star
                size={s.rating.icon}
                className="text-primary fill-primary"
              />
              <span className={`${s.rating.text} font-bold text-primary`}>
                {Number(product.family_rating || product.average_rating).toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Features */}
        {product.features?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.features.slice(0, 3).map((feature, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[11px] font-medium"
              >
                {feature.feature}
              </span>
            ))}
          </div>
        )}

        {/* Price + size */}
        <div className={`flex items-end justify-between ${s.gapBelowPrice}`}>
          <div className="flex items-baseline gap-2">
            <span className={`${s.price} font-bold text-foreground`}>
              ₹{product.price}
            </span>
            {product.max_price &&
              Number(product.max_price) > Number(product.price) && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{product.max_price}
                </span>
              )}
          </div>
          {product.size && (
            <span className="text-xs text-muted-foreground font-medium bg-gray-50 px-2 py-0.5 rounded">
              {product.size}
            </span>
          )}
        </div>

        {/* CTA — z-20 keeps it above the card's stretched link overlay */}
        <div className="mt-auto relative z-20">
          {isInCart ? (
            <button
              onClick={() => router.push("/cart")}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition cursor-pointer"
            >
              <ShoppingCart size={15} />
              Go to Cart
            </button>
          ) : (
            <button
              onClick={() => onAddToCart(product.id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition cursor-pointer"
            >
              <ShoppingCart size={15} />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
