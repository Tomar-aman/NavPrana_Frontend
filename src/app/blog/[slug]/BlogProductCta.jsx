"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { generateSlug } from "@/utils/slug";
import { featuredImage } from "@/lib/site";
import { familyName } from "@/lib/variants";

/**
 * In-article product card, placed a couple of sections into the post.
 *
 * ShopTheGhee sits below the article, past the point most readers stop
 * scrolling, so blog traffic was rarely seeing a product at all. This puts
 * one relevant product in front of them while they are still reading.
 */
export function InlineProductCard({ product }) {
  if (!product) return null;
  const href = `/products/${generateSlug(product.name)}`;
  const image = featuredImage(product);

  return (
    <aside
      data-cta-placement="inline_card"
      aria-label="Featured product"
      className="my-8 flex items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-4"
    >
      {image && (
        <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-white">
          <Image
            src={image}
            alt={`${product.name} — pure bilona ghee by NavPrana Organics`}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-primary mb-1">
          Made the way this article describes
        </p>
        <p className="text-sm font-semibold leading-snug">{familyName(product)}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Hand-churned bilona · Grass-fed · FSSAI certified
        </p>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-sm font-bold">
            From ₹{Math.round(Number(product.price))}
          </span>
          <Link
            href={href}
            className="ml-auto inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 transition"
          >
            Shop now <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </aside>
  );
}

const DISMISS_KEY = "navprana_blog_shopbar_dismissed";

/**
 * Slim bar pinned to the bottom of the screen once the reader is a quarter of
 * the way through the post. Hidden again when the ShopTheGhee block scrolls
 * into view (no point showing both), and dismissible for the session.
 */
export function StickyShopBar({ product }) {
  const [pastThreshold, setPastThreshold] = useState(false);
  const [shopBlockVisible, setShopBlockVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }

    const onScroll = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      setPastThreshold(scrollable > 0 && window.scrollY / scrollable > 0.25);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    let observer;
    const shopBlock = document.getElementById("shop-the-ghee");
    if (shopBlock) {
      observer = new IntersectionObserver(([entry]) =>
        setShopBlockVisible(entry.isIntersecting),
      );
      observer.observe(shopBlock);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  if (!product) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // storage blocked — dismissal just won't persist across posts
    }
  };

  const visible = pastThreshold && !shopBlockVisible && !dismissed;
  const href = `/products/${generateSlug(product.name)}`;

  return (
    <div
      data-cta-placement="sticky_bar"
      aria-hidden={!visible}
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate">{familyName(product)}</p>
          <p className="text-xs text-muted-foreground">
            From ₹{Math.round(Number(product.price))} · Free shipping above ₹999
          </p>
        </div>
        <Link
          href={href}
          tabIndex={visible ? 0 : -1}
          className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition"
        >
          Shop now <ArrowRight size={14} />
        </Link>
        <button
          type="button"
          onClick={dismiss}
          tabIndex={visible ? 0 : -1}
          aria-label="Hide"
          className="shrink-0 p-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
