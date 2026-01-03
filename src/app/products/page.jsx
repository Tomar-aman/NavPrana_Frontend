"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Heart,
  Leaf,
  Award,
  ShoppingCart,
} from "lucide-react";

import gheeProductImage from "@/assets/ghee-product.jpg";
import organicFarmImage from "@/assets/organic-farm.jpg";

const Page = () => {
  const products = [
    {
      id: 1,
      name: "Premium A2 Desi Ghee",
      price: "₹899",
      originalPrice: "₹1200",
      size: "500ml",
      rating: 4.9,
      reviews: 342,
      image: gheeProductImage,
      features: [
        "A2 Cow Milk",
        "Hand Churned",
        "No Preservatives",
        "Traditional Bilona Method",
      ],
      description:
        "Made from pure A2 cow milk using the traditional bilona method, this premium ghee offers exceptional taste and health benefits.",
    },
    {
      id: 2,
      name: "Organic Grass-Fed Ghee",
      price: "₹1299",
      originalPrice: "₹1600",
      size: "1kg",
      rating: 4.8,
      reviews: 156,
      image: organicFarmImage,
      features: [
        "Grass Fed Cows",
        "Organic Certified",
        "Rich in Omega-3",
        "Farm Fresh",
      ],
      description:
        "Our cows graze freely on organic pastures, producing the finest quality milk for this premium organic ghee.",
    },
    {
      id: 3,
      name: "Heritage Village Ghee",
      price: "₹649",
      originalPrice: "₹850",
      size: "250ml",
      rating: 4.7,
      reviews: 89,
      image: gheeProductImage,
      features: [
        "Village Made",
        "Traditional Recipe",
        "Small Batch",
        "Authentic Taste",
      ],
      description:
        "Crafted in small batches by village artisans using recipes passed down through generations.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
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
            <h1 className="text-3xl font-bold text-gradient">
              Our Premium Products
            </h1>
            <div></div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 md:px-15">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Nature&apos;s Finest{" "}
            <span className="text-gradient">Desi Ghee</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover our collection of premium desi ghee, each crafted with love
            using traditional methods and the finest ingredients from
            nature&apos;s bounty.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm">
              <Leaf className="h-4 w-4 mr-2" />
              100% Natural
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm">
              <Award className="h-4 w-4 mr-2" />
              Premium Quality
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm">
              <Heart className="h-4 w-4 mr-2" />
              Made with Love
            </span>
          </div>
        </section>

        {/* Products Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {products.map((product) => (
            <div
              key={product.id}
              className="group border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                  Save{" "}
                  {Math.round(
                    ((parseInt(product.originalPrice.slice(1)) -
                      parseInt(product.price.slice(1))) /
                      parseInt(product.originalPrice.slice(1))) *
                      100
                  )}
                  %
                </div>
                <button className="absolute top-4 right-4 p-2 rounded-sm bg-white/80 hover:bg-background transition">
                  <Heart className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold">{product.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-primary fill-primary" />
                    <span className="text-sm font-medium">
                      {product.rating}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviews})
                    </span>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm mb-4">
                  {product.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {product.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded border border-border text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-primary">
                      {product.price}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {product.originalPrice}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.size}
                  </span>
                </div>

                <button className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Why Choose Our Products */}
        <section className="bg-card/30 rounded-3xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-center mb-8">
            Why Choose Our Ghee?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">100% Natural</h4>
              <p className="text-muted-foreground">
                No chemicals, preservatives, or artificial additives. Pure
                nature in every drop.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">
                Traditional Methods
              </h4>
              <p className="text-muted-foreground">
                Crafted using age-old bilona method for authentic taste and
                maximum nutrition.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Made with Love</h4>
              <p className="text-muted-foreground">
                Each batch is prepared with care and dedication by our skilled
                artisans.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Page;
