"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Leaf,
  Users,
  Award,
  Clock,
  MapPin,
  Search,
  Sprout,
  Play,
  Instagram,
} from "lucide-react";

import traditionalCowImage from "@/assets/buffalo.png";
import { motion } from "framer-motion";

// ──────────────────────────────────────────────────────────
// 🎬 PASTE YOUR TWO FOUNDER INSTAGRAM REEL URLs BELOW
// ──────────────────────────────────────────────────────────
const FOUNDER_VIDEOS = [
  "https://www.instagram.com/p/DXORXgaids3/", // Founder Video 1
  "https://www.instagram.com/p/DVI-shzCSNv/", // Founder Video 2
];

const getEmbedUrl = (url) => {
  if (!url) return "";
  const cleanUrl = url.replace(/\/+$/, "");
  return `${cleanUrl}/embed/`;
};

const FounderVideoCard = ({ url, index }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="shrink-0 w-full max-w-[320px] mx-auto">
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
              <p className="text-xs text-gray-400">Loading video...</p>
            </div>
          )}

          <iframe
            src={getEmbedUrl(url)}
            className="absolute inset-0 w-full h-full border-0"
            loading="lazy"
            scrolling="no"
            allowtransparency="true"
            allow="encrypted-media"
            title={`Founder Video ${index + 1}`}
            onLoad={() => setIsLoaded(true)}
            style={{ overflow: "hidden" }}
          />
        </div>
      </div>

      {/* Caption below the card */}
      <div className="mt-3 px-1 text-center">
        <div className="flex items-center justify-center gap-1.5 mt-1.5">
          <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#833ab4] flex items-center justify-center">
            <Instagram size={8} className="text-white" />
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">@navprana</p>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  const values = [
    {
      icon: Search,
      title: "Chambal Origins",
      description:
        "Rooted in the pristine, untouched lands of the Chambal valley in Madhya Pradesh.",
      color: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      icon: Leaf,
      title: "Absolutely Natural",
      description:
        "No preservatives, no additives. Just pure, farm-fresh produce as nature intended.",
      color: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      icon: Users,
      title: "Community of Esah",
      description:
        "We empower the local farmers of Village Esah, preserving their traditional way of life.",
      color: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      icon: Sprout,
      title: "Beyond Just Ghee",
      description:
        "Starting with Ghee, we are on a mission to bring a complete range of pure, organic food staples to your table.",
      color: "bg-purple-50",
      iconColor: "text-purple-500",
    },
  ];

  const timeline = [
    {
      year: "2024",
      title: "The Discovery",
      description:
        "During travels through the Chambal region, we discovered the untapped purity of Village Esah in Morena.",
    },
    {
      year: "2025",
      title: "The Foundation",
      description:
        "We spent months with farmers in Esah, Morena, setting up a supply chain that honors fair trade and quality.",
    },
    {
      year: "Late 2025",
      title: "NavPrana is Born",
      description:
        "NavPrana Organics was established as a clean food company, dedicated to bridging the gap between rural purity and urban needs.",
    },
    {
      year: "2026",
      title: "The First Launch",
      description:
        "We introduce our flagship product: Pure Buffalo Ghee, bringing the authentic taste of Chambal to the world.",
    },
  ];

  return (
    <div className="min-h-screen bg-background mt-20">
      <main className="container mx-auto px-4 py-8 md:px-15">
        {/* Header */}
        <section className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-xs font-semibold text-primary uppercase tracking-wider mb-3">
            <Heart size={14} />
            Our Story
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            Purity from the Heart of{" "}
            <span className="text-gradient">Chambal</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            NavPrana Organics is a clean food company on a mission. Our journey
            begins with the golden elixir—Ghee—sourced directly from the
            untouched ravines of Madhya Pradesh.
          </p>
        </section>

        {/* Story */}
        <section className="grid lg:grid-cols-2 gap-8 mb-10">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Our Roots in Village Esah</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              NavPrana Organics was born from a simple realization: the food on
              our city shelves lacked the soul and purity of the village. As
              explorers at heart, we traveled deep into the{" "}
              <strong>Chambal region of Morena, Madhya Pradesh</strong>, looking
              for authentic sources of nutrition.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We found our answer in <strong>Village Esah</strong>.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Here, amidst the rugged beauty of Chambal, farming isn&apos;t a
              business—it&apos;s a way of life. The soil is rich, the air is clean,
              and the cattle graze freely on natural pastures.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              While we are launching with our premium{" "}
              <strong>pure desi Buffalo A2 Bilona Ghee</strong> as our first offering, NavPrana is
              more than just a dairy brand. We are building a portfolio of
              organic food products — the best bilona ghee in India and beyond — that bring the raw, unadulterated power of
              nature straight to your kitchen. Buy organic ghee online from NavPrana Organics.
            </p>
          </div>
          <div className="relative h-64 md:h-full min-h-[300px] rounded-2xl overflow-hidden border border-gray-100">
            <Image
              src={traditionalCowImage}
              alt="Buffaloes in Chambal Valley — Source of NavPrana's pure desi A2 bilona ghee, best organic buffalo ghee in India"
              fill
              className="object-cover"
            />
          </div>
        </section>

        {/* Meet the Founders Video Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full text-xs font-semibold text-amber-600 uppercase tracking-wider mb-3">
              <Users size={14} />
              Hear from Us
            </div>
            <h2 className="text-2xl md:text-4xl font-bold mb-3">
              From Our <span className="text-gradient">Founders</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
              Watch our founders share the story, values, and vision that drive NavPrana Organics.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {FOUNDER_VIDEOS.map((url, index) => (
              <FounderVideoCard key={index} url={url} index={index} />
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-center mb-6">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition text-center"
              >
                <div
                  className={`w-10 h-10 ${value.color} rounded-xl flex items-center justify-center mx-auto mb-3`}
                >
                  <value.icon className={`h-5 w-5 ${value.iconColor}`} />
                </div>
                <h4 className="text-sm font-semibold mb-1.5">{value.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-center mb-6">
            Our Journey So Far
          </h2>

          <motion.div
            className="relative space-y-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.2 } },
            }}
          >
            <div className="absolute left-6 top-0 bottom-0 w-px bg-primary/15 hidden sm:block" />

            {timeline.map((item, index) => (
              <motion.div
                key={index}
                className="relative flex gap-4 items-start"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: "easeOut" },
                  },
                }}
              >
                <div className="relative z-10 shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                </div>

                <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-4 hover:border-gray-200 transition">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-primary">{item.year}</span>
                    <h4 className="text-sm font-semibold">{item.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Origin Section */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 mb-10">
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-xl font-bold mb-4">Origin: Morena, M.P.</h2>
              <div className="space-y-3">
                {[
                  { icon: MapPin, text: "Sourced from Village Esah, Morena (Chambal)", color: "bg-red-50", iconColor: "text-red-500" },
                  { icon: Leaf, text: "Known for pristine soil and natural farming", color: "bg-green-50", iconColor: "text-green-600" },
                  { icon: Heart, text: "Cruelty-free, free-grazing livestock", color: "bg-pink-50", iconColor: "text-pink-500" },
                  { icon: Award, text: "Traditional Bilona Method used", color: "bg-amber-50", iconColor: "text-amber-600" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center shrink-0`}>
                      <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                    </div>
                    <span className="text-sm text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Chambal region in Madhya Pradesh is legendary for its raw,
                unpolluted environment. In Village Esah, we found a community
                that still respects the rhythm of nature.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We are proud to bring the produce of this land to the world.
                While we start with our signature Ghee, we are committed to
                expanding our range to include other authentic food products
                from this rich soil.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-primary/5 rounded-2xl border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl font-bold mb-2">
            Taste the Purity of Chambal
          </h2>
          <p className="text-sm text-muted-foreground mb-5 max-w-xl mx-auto">
            Experience the first offering from NavPrana Organics. Try our
            premium Ghee today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products"
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition"
            >
              Shop Our Products
            </Link>
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Page;
