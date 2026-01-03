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
} from "lucide-react";

import organicFarmImage from "@/assets/organic-farm.jpg"; // replace with actual image
import traditionalCowImage from "@/assets/traditional-cow.jpg"; // replace with actual image

const Page = () => {
  const values = [
    {
      icon: Heart,
      title: "Passion for Purity",
      description:
        "We are committed to bringing you the purest form of desi ghee, made with love and traditional care.",
    },
    {
      icon: Leaf,
      title: "Sustainable Practices",
      description:
        "Our farming methods respect nature and ensure the well-being of our cows and the environment.",
    },
    {
      icon: Users,
      title: "Family Tradition",
      description:
        "Recipes and methods passed down through generations, preserving authentic taste and quality.",
    },
    {
      icon: Award,
      title: "Quality Excellence",
      description:
        "Every batch is carefully tested and meets the highest standards of purity and nutritional value.",
    },
  ];

  const timeline = [
    {
      year: "1947",
      title: "The Beginning",
      description:
        "Started as a small family farm with just 5 cows, focused on traditional ghee making methods.",
    },
    {
      year: "1975",
      title: "Organic Transition",
      description:
        "Transitioned to 100% organic farming practices, becoming one of the first organic dairies in the region.",
    },
    {
      year: "1995",
      title: "Bilona Method",
      description:
        "Adopted the traditional bilona method exclusively, ensuring the highest quality and authenticity.",
    },
    {
      year: "2010",
      title: "Certification",
      description:
        "Received organic certification and expanded to serve families across India.",
    },
    {
      year: "2020",
      title: "Digital Presence",
      description:
        "Launched online platform to connect directly with health-conscious families nationwide.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 ">
      {/* Header */}
      <div className="bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-6 md:px-15">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-3xl font-bold text-gradient">About Us</h1>
            <div></div>
          </div>
        </div>
      </div>

      <main className="container bg-primary/5 mx-auto px-4 py-12 md:px-15">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Our <span className="text-gradient">Story</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            For over 75 years, we have been dedicated to preserving the ancient
            art of ghee making, bringing you the purest and most authentic desi
            ghee from our family to yours.
          </p>
        </section>

        {/* Story Section */}
        <section className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold">From Humble Beginnings</h3>
            <p className="text-muted-foreground leading-relaxed">
              It all started in 1947 when our founder, Raghunath Singh, began
              making ghee using traditional methods passed down from his
              ancestors. What started as a small operation with just five cows
              has grown into a trusted brand that serves thousands of families
              across India.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We believe that the best ghee comes from happy, healthy cows
              grazing on natural pastures. Our cows roam freely on organic
              farms, feeding on pesticide-free grass and receiving the care and
              respect they deserve.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Every drop of our ghee is made using the traditional bilona method
              - a time-honored process that involves hand-churning curd to
              extract butter, which is then slowly heated to create pure, golden
              ghee with an incomparable aroma and taste.
            </p>
          </div>
          <div className="space-y-4">
            <Image
              src={organicFarmImage}
              alt="Our organic farm"
              className="w-full h-64 object-cover rounded-lg"
            />
            <Image
              src={traditionalCowImage}
              alt="Traditional cows"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12">Our Values</h3>
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
          <h3 className="text-3xl font-bold text-center mb-12">Our Journey</h3>
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

        {/* Farm Info */}
        <section className="bg-card/30 rounded-3xl p-8 md:p-12 mb-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">Our Farm</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Located in the pristine valleys of Rajasthan</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Leaf className="h-5 w-5 text-primary" />
                  <span>500+ acres of organic pastureland</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="h-5 w-5 text-primary" />
                  <span>200+ happy, healthy A2 cows</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-primary" />
                  <span>Certified organic by NPOP India</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Our farm is nestled in the heart of Rajasthan, where the climate
                and soil conditions are perfect for growing nutritious grass
                that our cows love. We maintain the highest standards of animal
                welfare and environmental sustainability.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every aspect of our operation is designed to produce the finest
                quality ghee while respecting nature and traditional methods.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 md:p-12">
          <h3 className="text-3xl font-bold mb-4">Experience Our Legacy</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Taste the difference that 75 years of tradition and passion makes.
            Try our premium desi ghee today.
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
              Visit Our Farm
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Page;
