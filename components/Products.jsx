"use client";
import { ShoppingCart, Star, Truck, Shield, Heart, Leaf, Award, ArrowRight } from "lucide-react";
import Image from "next/image";
import AutoCycleImage from "./AutoCycleImage";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, getCart } from "@/redux/features/cartSlice";
import { fetchProducts } from "@/redux/features/product";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/utils/slug";
import Link from "next/link";

const getFeaturedImage = (images = []) => {
  return (
    images.find((img) => img.is_feature)?.image ||
    images[0]?.image ||
    "/placeholder.png"
  );
};

const Products = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { list, loading, error } = useSelector((state) => state.product);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = (productId) => {
    if (!isAuthenticated) {
      toast.info("Please login to add items to cart");
      router.push("/auth");
      return;
    }
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

  const trustItems = [
    { icon: Truck, title: "Free Shipping", desc: "On orders above ₹999" },
    { icon: Shield, title: "Quality Assured", desc: "Lab tested purity" },
    { icon: Star, title: "5000+ Reviews", desc: "Customer satisfaction" },
    { icon: Heart, title: "Made with Love", desc: "Traditional methods" },
    { icon: Award, title: "FSSAI Certified", desc: "Government approved" },
    { icon: Leaf, title: "100% Organic", desc: "No preservatives" },
  ];

  return (
    <section id="products" className="py-12 md:py-16 bg-background md:px-15">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-xs font-semibold text-primary uppercase tracking-wider mb-4">
            <Leaf size={14} />
            Our Products
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
            Pure <span className="text-gradient">Buffalo Ghee</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Hand-churned using the traditional Bilona method. Authentic taste
            and maximum nutrition in every jar.
          </p>
        </div>

        {/* Product Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {list.slice(0, 3).map((product) => {
            const imageUrl = getFeaturedImage(product.images);
            const isInCart = cartItems.some(
              (item) => item.product === product.id,
            );
            return (
              <div
                key={product.id}
                onClick={() =>
                  router.push(
                    `/product-details/${generateSlug(product.name)}`,
                  )
                }
                className="group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer"
              >
                {/* Image */}
                <div className="relative w-full h-60 md:h-64 overflow-hidden bg-gray-50">
                  <AutoCycleImage
                    images={product.images}
                    alt={product.name}
                    className="group-hover:scale-105"
                  />

                  {/* Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-primary text-white shadow-sm z-10">
                    Save {parseInt(product.discount_precent)}%
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-foreground leading-tight">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0 px-2 py-0.5 bg-primary/10 rounded-md">
                      <Star size={12} className="text-primary fill-primary" />
                      <span className="text-xs font-bold text-primary">
                        {product.average_rating}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {product.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[11px] font-medium"
                      >
                        {feature.feature}
                      </span>
                    ))}
                  </div>

                  {/* Price + Size */}
                  <div className="flex items-end justify-between mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-foreground">
                        ₹{product.price}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{product.max_price}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium bg-gray-50 px-2 py-0.5 rounded">
                      {product.size}
                    </span>
                  </div>

                  {/* CTA */}
                  <div className="mt-auto">
                    {isInCart ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push("/cart");
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition cursor-pointer"
                      >
                        <ShoppingCart size={15} />
                        Go to Cart
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product.id);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition cursor-pointer"
                      >
                        <ShoppingCart size={15} />
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All */}
        <div className="text-center mb-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition"
          >
            View all products
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {trustItems.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-white rounded-xl border border-gray-100"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <item.icon size={18} className="text-primary" />
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-foreground text-xs sm:text-sm">
                  {item.title}
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
