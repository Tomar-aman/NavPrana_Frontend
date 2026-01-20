"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Heart,
  Leaf,
  Users,
  Award,
  Clock,
  MapPin,
  Search,
  Sprout, // Added Sprout to represent the broader food company vision
} from "lucide-react";

import organicFarmImage from "@/assets/organic-farm.jpg"; // replace with actual image
import traditionalCowImage from "@/assets/traditional-cow.jpg"; // replace with actual image

const Page = () => {
  const values = [
    {
      icon: Search,
      title: "Chambal Origins",
      description:
        "Rooted in the pristine, untouched lands of the Chambal valley in Madhya Pradesh.",
    },
    {
      icon: Leaf,
      title: "Absolutely Natural",
      description:
        "No preservatives, no additives. Just pure, farm-fresh produce as nature intended.",
    },
    {
      icon: Users,
      title: "Community of Esah",
      description:
        "We empower the local farmers of Village Esah, preserving their traditional way of life.",
    },
    {
      icon: Sprout,
      title: "Beyond Just Ghee",
      description:
        "Starting with Ghee, we are on a mission to bring a complete range of pure, organic food staples to your table.",
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 ">
      <main className="container bg-primary/5 mx-auto px-4 py-12 md:px-15">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Purity from the Heart of <span className="text-gradient">Chambal</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            NavPrana Organics is a clean food company on a mission.
            Our journey begins with the golden elixir—Ghee—sourced directly from the
            untouched ravines of Madhya Pradesh.
          </p>
        </section>

        {/* Story Section */}
        <section className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold">Our Roots in Village Esah</h3>
            <p className="text-muted-foreground leading-relaxed">
              NavPrana Organics was born from a simple realization: the food on our city shelves
              lacked the soul and purity of the village. As explorers at heart, we traveled
              deep into the <strong>Chambal region of Morena, Madhya Pradesh</strong>, looking
              for authentic sources of nutrition.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We found our answer in <strong>Village Esah</strong>.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Here, amidst the rugged beauty of Chambal, farming isn't a business—it's a way of life.
              The soil is rich, the air is clean, and the cattle graze freely on natural pastures.
              We knew immediately that this was where NavPrana had to begin.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              While we are launching with our premium <strong>Buffalo Ghee</strong> as our first offering,
              NavPrana is more than just a dairy brand. We are building a portfolio of organic food products
              that bring the raw, unadulterated power of nature straight to your kitchen.
            </p>
          </div>
          <div className="space-y-4">
            <div className="relative h-64 w-full">
              {/* Tip: Use an image of the Chambal landscape or village Esah here */}
              <Image
                src={organicFarmImage}
                alt="Landscape of Morena, MP"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="relative h-64 w-full">
              <Image
                src={traditionalCowImage}
                alt="Buffaloes in Chambal"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12">Our Core Values</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center border border-border/50 bg-card/50 backdrop-blur-sm rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-3">{value.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12">Our Journey So Far</h3>
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-card/30 rounded-lg p-6">
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="text-2xl font-bold text-primary">
                        {item.year}
                      </span>
                      <h4 className="text-xl font-semibold">{item.title}</h4>
                    </div>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Farm Info - Pivot to Sourcing */}
        <section className="bg-card/30 rounded-3xl p-8 md:p-12 mb-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">Origin: Morena, M.P.</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Sourced from Village Esah, Morena (Chambal)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Leaf className="h-5 w-5 text-primary" />
                  <span>Known for pristine soil and natural farming</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="h-5 w-5 text-primary" />
                  <span>Cruelty-free, free-grazing livestock</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-primary" />
                  <span>Traditional Bilona Method used</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                The Chambal region in Madhya Pradesh is legendary for its raw, unpolluted environment.
                In Village Esah, we found a community that still respects the rhythm of nature.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We are proud to bring the produce of this land to the world. While we start with
                our signature Ghee, we are committed to expanding our range to include other
                authentic food products from this rich soil.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 md:p-12">
          <h3 className="text-3xl font-bold mb-4">Taste the Purity of Chambal</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the first offering from NavPrana Organics.
            Try our premium Ghee today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition"
            >
              Shop Our Products
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-lg border border-primary text-primary hover:bg-primary/10 transition"
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