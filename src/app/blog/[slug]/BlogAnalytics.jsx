"use client";

import { useEffect } from "react";
import {
  trackBlogView,
  trackBlogScroll,
  trackBlogRead,
} from "@/lib/analytics";

const SCROLL_MILESTONES = [25, 50, 75, 100];

// Reaching 75 % counts as a finished read — the last quarter of the page is
// author box, related links and footer, which most real readers never scroll to.
const COMPLETION_THRESHOLD = 75;

/**
 * Renders nothing. Measures how many people opened a blog post, how long they
 * actually read it, and how far down they got — then reports it to GA4.
 */
const BlogAnalytics = ({ blog }) => {
  const slug = blog?.slug;
  const title = blog?.title;
  const category = blog?.category?.name;

  useEffect(() => {
    if (!slug) return;

    const meta = { slug, title, category: category || "Uncategorised" };

    trackBlogView(meta);

    // --- active-time accounting -------------------------------------------
    // Only time with the tab actually visible is counted, so a post left open
    // in a background tab overnight does not report as an 8-hour read.
    let activeMs = 0;
    let lastResume =
      document.visibilityState === "visible" ? Date.now() : null;

    const pause = () => {
      if (lastResume !== null) {
        activeMs += Date.now() - lastResume;
        lastResume = null;
      }
    };

    const resume = () => {
      if (lastResume === null) lastResume = Date.now();
    };

    // --- scroll depth ------------------------------------------------------
    let maxScroll = 0;
    const milestonesSent = new Set();

    const onScroll = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;

      // A post shorter than the viewport can never be scrolled — treat it as
      // fully seen rather than reporting 0 %.
      const percent =
        scrollable > 0
          ? Math.min(100, Math.round((window.scrollY / scrollable) * 100))
          : 100;

      if (percent > maxScroll) maxScroll = percent;

      for (const milestone of SCROLL_MILESTONES) {
        if (maxScroll >= milestone && !milestonesSent.has(milestone)) {
          milestonesSent.add(milestone);
          trackBlogScroll({ ...meta, percent: milestone });
        }
      }
    };

    // --- exit reporting ----------------------------------------------------
    // `sent` is scoped to this effect rather than a ref, so navigating from one
    // post to another re-arms it instead of silently swallowing the next read.
    let sent = false;

    const flush = () => {
      if (sent) return;
      sent = true;
      pause();
      trackBlogRead({
        ...meta,
        readSeconds: Math.round(activeMs / 1000),
        maxScroll,
        completed: maxScroll >= COMPLETION_THRESHOLD,
      });
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // The only exit signal that is reliable everywhere — mobile browsers
        // can freeze or discard a page without ever firing pagehide/unload.
        flush();
      } else {
        resume();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", flush);

    onScroll(); // record the initial position, incl. short unscrollable posts

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", flush);
      flush(); // client-side navigation away from this post
    };
  }, [slug, title, category]);

  return null;
};

export default BlogAnalytics;
