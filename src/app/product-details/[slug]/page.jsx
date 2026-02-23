"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Star,
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
import { notFound, useParams, useRouter } from "next/navigation";
import { addToCart, getCart } from "@/redux/features/cartSlice";
import { toast } from "sonner";
import { findProductBySlug } from "@/utils/slug";
import NavPranaLoader from "../../../../components/NavPranaLoader";
import StickyCartBar from "../../../../components/StickyCartBar";

const Page = () => {
  const { slug } = useParams();

  const dispatch = useDispatch();
  const router = useRouter();
  const { list, loading } = useSelector((state) => state.product);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!list || list.length === 0) {
      dispatch(fetchProducts()).finally(() => {
        setHasFetched(true);
      });
    } else {
      setHasFetched(true);
    }
  }, [dispatch, list]);

  const handleAddToCart = (productId) => {
    if (!isAuthenticated) {
      toast.info("Please login to add items to cart");
      router.push("/auth");
      return;
    }
    dispatch(addToCart({ product: productId, quantity: 1 }))
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
        addToCart({ product: product.id, quantity }),
      ).unwrap();
      router.push("/checkout");
    } catch (error) {
      console.error(error);
    }
  };

  const product = findProductBySlug(list, slug);
  const isInCart = product
    ? cartItems.some((item) => item.product === product.id)
    : false;

  const handleQuantityChange = (val) => {
    setQuantity((prev) => Math.max(1, prev + val));
  };

  if (loading || !hasFetched) {
    return <NavPranaLoader />;
  }

  if (!product) {
    notFound();
  }

  const images = product.images || [];
  const mainImage = images[selectedImage]?.image || "/placeholder.png";

  const trustBadges = [
    { icon: Truck, label: "Free Shipping", color: "bg-blue-50", iconColor: "text-blue-500" },
    { icon: Shield, label: "Quality Assured", color: "bg-green-50", iconColor: "text-green-600" },
    { icon: RotateCcw, label: "Easy Returns", color: "bg-amber-50", iconColor: "text-amber-500" },
  ];

  return (
    <div className="min-h-screen bg-background mt-20">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* IMAGE SECTION */}
          <div>
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.discount_precent && (
                <span className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                  Save {parseInt(product.discount_precent)}%
                </span>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 mt-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${selectedImage === i
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <Image
                    src={img.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 20vw, 80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* INFO SECTION */}
          <div className="space-y-5">
            {/* Badges */}
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                <Leaf size={13} /> 100% Natural
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                <Award size={13} /> Premium Quality
              </span>
            </div>

            {/* Name & Details */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                {product.name}
              </h1>
              <p className="text-sm text-muted-foreground">{product.details}</p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-1.5">
              {product.features.map((feature, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[11px] font-medium"
                >
                  {feature.feature}
                </span>
              ))}
            </div>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-foreground">
                ₹{product.price}
              </span>
              {product.max_price && (
                <span className="line-through text-muted-foreground text-base">
                  ₹{product.max_price}
                </span>
              )}
              {product.discount_precent && (
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                  {parseInt(product.discount_precent)}% OFF
                </span>
              )}
            </div>

            {/* Size */}
            <div className="text-sm text-muted-foreground">
              Size: <span className="font-semibold text-foreground">{product.size}</span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Quantity</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-2 hover:bg-gray-50 transition"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 font-semibold text-sm">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-2 hover:bg-gray-50 transition"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {isInCart ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/cart");
                  }}
                  className="flex-[3] flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition cursor-pointer"
                >
                  <ShoppingCart size={16} />
                  Go to Cart
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product.id);
                  }}
                  className="flex-[3] flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition cursor-pointer"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
              )}

              <button
                className="flex-[1] border border-gray-200 py-3 rounded-xl hover:bg-gray-50 text-sm font-semibold transition cursor-pointer"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>

            <StickyCartBar
              product={product}
              isInCart={isInCart}
              onAddToCart={handleAddToCart}
              onGoToCart={() => router.push("/cart")}
            />

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
              {trustBadges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className={`w-8 h-8 ${badge.color} rounded-lg flex items-center justify-center shrink-0`}>
                    <badge.icon size={14} className={badge.iconColor} />
                  </div>
                  <span className="text-xs font-medium text-foreground">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10">
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
            {["description", "Specifications"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition ${activeTab === tab
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {activeTab === "description" && (
            <div className="mt-4 max-w-3xl">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {activeTab === "Specifications" && (
            <div className="mt-4 max-w-3xl">
              <div
                className="text-sm text-muted-foreground prose max-w-none"
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
