"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
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
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/redux/features/product";
import { useParams, useRouter } from "next/navigation";
import { addToCart, getCart } from "@/redux/features/cartSlice";
import { toast } from "react-toastify";

const Page = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const { list, loading } = useSelector((state) => state.product);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  // Fetch products if not already loaded
  useEffect(() => {
    if (!list || list.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, list]);

  const handleAddToCart = (productId) => {
    console.log(productId);
    dispatch(
      addToCart({
        product: productId,
        quantity: 1,
      }),
    )
      .unwrap()
      .then(() => {
        toast.success("Product added to cart");
        dispatch(getCart());
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const handleBuyNow = async () => {
    try {
      await dispatch(
        addToCart({
          product: product.id,
          quantity,
        }),
      ).unwrap();

      // ✅ Navigate ONLY after successful add
      router.push("/checkout");
    } catch (error) {
      console.error(error);
    }
  };

  // Find product by ID
  const product = list?.find((item) => item.id === Number(id));

  // Quantity handler
  const handleQuantityChange = (val) => {
    setQuantity((prev) => Math.max(1, prev + val));
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  // Safe image getter
  const images = product.images || [];
  const mainImage = images[selectedImage]?.image || "/placeholder.png";

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* IMAGE SECTION */}
          <div>
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover"
              />

              {product.discount_precent && (
                <span className="absolute top-4 left-4 bg-primary text-white px-4 py-1 rounded-full text-sm">
                  Save {parseInt(product.discount_precent)} %
                </span>
              )}

              {/* <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isWishlisted ? "text-red-500 fill-red-500" : "text-gray-500"
                  }`}
                />
              </button> */}
            </div>

            {/* THUMBNAILS */}
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 mt-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`
        relative aspect-square rounded-lg overflow-hidden
        border-2 transition
        ${
          selectedImage === i
            ? "border-primary ring-2 ring-primary/40"
            : "border-gray-200 hover:border-gray-400"
        }
      `}
                >
                  <Image
                    src={img.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 25vw, (max-width: 768px) 20vw, 120px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* INFO SECTION */}
          <div className="space-y-6">
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-primary text-sm border border-primary-border px-3 py-1 rounded-full">
                <Leaf size={14} /> 100% Natural
              </span>
              <span className="flex items-center gap-1 text-primary text-sm border border-primary-border px-3 py-1 rounded-full">
                <Award size={14} /> Premium Quality
              </span>
            </div>

            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-500">{product.details}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {product.features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs"
                >
                  {feature.feature}
                </span>
              ))}
            </div>
            {/* RATING */}

            {/* PRICE */}
            <div className="flex items-end gap-4">
              <span className="text-3xl font-bold text-primary">
                ₹{product.price}
              </span>
              {product.max_price && (
                <span className="line-through text-gray-400 text-lg">
                  ₹{product.max_price}
                </span>
              )}
            </div>

            <div>
              <p>
                Size: <b>{product.size}</b>
              </p>
            </div>

            {/* QUANTITY */}
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity</span>
              <div className="flex items-center border border-primary-border rounded-lg overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  <Minus size={16} />
                </button>
                <span className="px-6 font-semibold">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex  gap-4 w-full">
              <button
                className="flex-[3] bg-primary hover:bg-primary/90 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold cursor-pointer "
                onClick={() => handleAddToCart(product.id)}
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>

              <button
                className=" flex-[1] border border-primary-border py-3 rounded-lg hover:bg-gray-100 font-semibold cursor-pointer"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 pt-4 border-t border-primary-border">
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

        {/* TABS */}
        <div className="mt-16">
          <div className="flex gap-8 border-b border-primary-border">
            {["description", "Specifications"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium ${
                  activeTab === tab
                    ? "border-b-2 border-primary text-primary"
                    : "text-gray-500"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {activeTab === "description" && (
            <div className="mt-6 max-w-3xl">
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}

          {activeTab === "Specifications" && (
            <div className="mt-6 max-w-3xl">
              <div
                className="text-gray-600 prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: product?.specifications?.specification,
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Page;
