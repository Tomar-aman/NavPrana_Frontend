/**
 * Google Analytics 4 — Centralized Utility
 *
 * GA4 is loaded once in the root layout via <GoogleAnalytics /> from
 * @next/third-parties, which defines the global `window.gtag`. This module
 * exposes helpers on top of it so components never touch `window.gtag`
 * directly — same pattern as `@/lib/meta-pixel`.
 *
 * Usage:  import { trackBlogView } from '@/lib/analytics';
 */

// Kept for parity with meta-pixel.js. The literal is the current property and
// acts as a fallback if the env var is missing on a deploy target.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-YGN5Y61HW8";

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

/** Safe wrapper — only fires if gtag is available (client-side) */
const gtag = (...args) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
};

/**
 * Generic event helper — for anything not covered by a named export below.
 *
 * @param {string} eventName
 * @param {Object} params
 */
export const trackEvent = (eventName, params = {}) => {
  gtag("event", eventName, params);
};

/**
 * Read-time buckets. GA4 reports event *parameters* as dimensions (strings)
 * out of the box, while numeric params need a custom metric registered in
 * Admin. Sending a bucket alongside the raw number means the report is
 * readable immediately, without any GA4 configuration.
 */
const readTimeBucket = (seconds) => {
  if (seconds < 10) return "0-10s (bounce)";
  if (seconds < 30) return "10-30s (skim)";
  if (seconds < 60) return "30-60s";
  if (seconds < 180) return "1-3 min";
  if (seconds < 300) return "3-5 min";
  return "5+ min (deep read)";
};

/* ------------------------------------------------------------------ */
/*  Blog Events                                                       */
/* ------------------------------------------------------------------ */

/**
 * blog_view — one per blog post opened.
 *
 * GA4 already records its own automatic `page_view`, so this is NOT a
 * replacement for it. It exists so blog posts can be reported on by slug,
 * title and category instead of by raw URL path.
 *
 * @param {Object} meta
 * @param {string} meta.slug
 * @param {string} meta.title
 * @param {string} meta.category
 */
export const trackBlogView = ({ slug, title, category } = {}) => {
  trackEvent("blog_view", {
    blog_slug: slug,
    blog_title: title,
    blog_category: category,
  });
};

/**
 * blog_scroll — fired once per milestone (25/50/75/100 %) per page view.
 *
 * @param {Object} meta
 * @param {number} meta.percent - the milestone reached
 */
export const trackBlogScroll = ({ slug, title, category, percent } = {}) => {
  trackEvent("blog_scroll", {
    blog_slug: slug,
    blog_title: title,
    blog_category: category,
    percent_scrolled: percent,
  });
};

/**
 * blog_read — fired once when the reader leaves the post. Carries how long
 * they actually stayed and how far they got.
 *
 * @param {Object} meta
 * @param {number} meta.readSeconds - active (tab-visible) seconds only
 * @param {number} meta.maxScroll   - deepest scroll % reached
 * @param {boolean} meta.completed  - true when they reached the end of the post
 */
export const trackBlogRead = ({
  slug,
  title,
  category,
  readSeconds = 0,
  maxScroll = 0,
  completed = false,
} = {}) => {
  trackEvent("blog_read", {
    blog_slug: slug,
    blog_title: title,
    blog_category: category,
    read_seconds: readSeconds,
    read_time_bucket: readTimeBucket(readSeconds),
    max_scroll: maxScroll,
    read_completed: completed ? "yes" : "no",
  });
};

export { GA_ID };
