"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Leaf,
  Award,
  Check,
} from "lucide-react";

import gheeProductImage from "@/assets/ghee-product.jpg";
import cookingGheeImage from "@/assets/cooking-with-ghee.jpg";
import organicFarmImage from "@/assets/organic-farm.jpg";
import traditionalCowImage from "@/assets/traditional-cow.jpg";

const Page = ({ params }) => {
  const { id } = params;

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const products = [
    {
      id: 1,
      name: "Premium A2 Desi Ghee",
      price: 899,
      originalPrice: 1200,
      size: "500ml",
      rating: 4.9,
      reviews: 1247,
      badge: "Bestseller",
      images: [
        gheeProductImage,
        cookingGheeImage,
        organicFarmImage,
        traditionalCowImage,
      ],
      shortDescription:
        "Pure A2 ghee from grass-fed Gir cows, traditionally churned",
      description:
        "Made from pure A2 cow milk using the traditional bilona method.",
      features: [
        "100% Pure A2 Milk",
        "Grass-Fed Cows",
        "Traditional Bilona Method",
        "No Preservatives",
      ],
      ingredients: "Pure A2 Cow Milk Cream",
      storage:
        "Store in a cool, dry place away from direct sunlight. No refrigeration required.",
    },
  ];

  const product = products.find((p) => p.id === Number(id)) || products[0];

  const handleQuantityChange = (val) => {
    setQuantity((prev) => Math.max(1, prev + val));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
          <Link href="/products" className="flex items-center gap-2">
            <ArrowLeft size={18} />
            Back to Products
          </Link>

          <Link
            href="/cart"
            className="flex items-center gap-2 border px-4 py-2 rounded"
          >
            <ShoppingCart size={16} />
            Cart
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative aspect-square bg-white rounded-xl overflow-hidden">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
              />

              <span className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded text-sm">
                {product.badge}
              </span>

              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 bg-white p-2 rounded"
              >
                <Heart
                  className={isWishlisted ? "fill-red-500 text-red-500" : ""}
                />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 mt-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`border rounded overflow-hidden ${
                    selectedImage === i ? "border-green-600" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={img}
                    alt=""
                    width={100}
                    height={100}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex gap-2 mb-2">
              <span className="border px-3 py-1 rounded text-sm flex items-center gap-1">
                <Leaf size={14} /> 100% Natural
              </span>
              <span className="border px-3 py-1 rounded text-sm flex items-center gap-1">
                <Award size={14} /> Certified
              </span>
            </div>

            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-500 mt-1">{product.shortDescription}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="font-semibold">{product.rating}</span>
              <span className="text-gray-500">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mt-4">
              <span className="text-3xl font-bold text-green-600">
                ₹{product.price}
              </span>
              <span className="line-through text-gray-400">
                ₹{product.originalPrice}
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mt-6">
              <span className="font-medium">Quantity:</span>
              <div className="flex border rounded">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-2"
                >
                  <Minus size={16} />
                </button>
                <span className="px-6 py-2">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-2"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <button className="flex-1 bg-green-600 text-white py-3 rounded flex items-center justify-center gap-2">
                <ShoppingCart size={18} />
                Add to Cart
              </button>

              <button className="flex-1 border py-3 rounded">Buy Now</button>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <Truck size={18} /> Free Shipping
              </div>
              <div className="flex items-center gap-2">
                <Shield size={18} /> Quality Assured
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={18} /> Easy Returns
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-6 border-b">
            {["description", "storage"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 ${
                  activeTab === tab
                    ? "border-b-2 border-green-600 font-semibold"
                    : "text-gray-500"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {activeTab === "description" && (
            <div className="mt-6">
              <p className="text-gray-600">{product.description}</p>
              <h4 className="font-semibold mt-4">Ingredients</h4>
              <p className="text-gray-600">{product.ingredients}</p>
            </div>
          )}

          {activeTab === "storage" && (
            <div className="mt-6">
              <p className="text-gray-600">{product.storage}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Page;
