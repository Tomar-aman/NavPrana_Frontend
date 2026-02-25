"use client";

import { generateSlug } from "@/utils/slug";
import { Star, Leaf, Award, Heart, ShoppingCart } from "lucide-react";
import AutoCycleImage from "../../../components/AutoCycleImage";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/redux/features/product";
import { useEffect } from "react";
import { addToCart, getCart } from "@/redux/features/cartSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const getFeaturedImage = (images = []) => {
  return (
    images.find((img) => img.is_feature)?.image ||
    images[0]?.image ||
    "/placeholder.png"
  );
};

const ProductsClient = () => {
  const dispatch = useDispatch();
  const { list: products, loading, error } = useSelector((state) => state.product);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const handleAddToCart = (productId) => {
    if (!isAuthenticated) {
      toast.info("Please login to add items to cart");
      router.push("/signin");
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

  return (
    <div className="min-h-screen bg-background mt-20">
      <main className="container mx-auto px-4 py-8 md:px-15">
        {/* Header */}
        <section className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-xs font-semibold text-primary uppercase tracking-wider mb-3">
            <Leaf size={14} />
            Our Collection
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            Nature&apos;s Finest{" "}
            <span className="text-gradient">Desi Ghee</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-5">
            Premium desi ghee crafted with love using traditional methods
            and the finest ingredients.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { icon: Leaf, label: "100% Natural" },
              { icon: Award, label: "Premium Quality" },
              { icon: Heart, label: "Made with Love" },
            ].map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium"
              >
                <item.icon size={13} />
                {item.label}
              </span>
            ))}
          </div>
        </section>

        {/* Products Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {products.map((product) => {
            const isInCart = cartItems.some(
              (item) => item.product === product.id,
            );
            return (
              <div
                key={product.id}
                onClick={() =>
                  router.push(
                    `/products/${generateSlug(product.name)}`,
                  )
                }
                className="group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative w-full h-56 md:h-60 overflow-hidden bg-gray-50">
                  <AutoCycleImage
                    images={product.images}
                    alt={product.name}
                    className="group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-primary text-white shadow-sm z-10">
                    Save {parseInt(product.discount_precent)}%
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-semibold text-foreground leading-tight">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0 px-2 py-0.5 bg-primary/10 rounded-md">
                      <Star size={11} className="text-primary fill-primary" />
                      <span className="text-[11px] font-bold text-primary">
                        {product.average_rating}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {product.features?.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[11px] font-medium"
                      >
                        {feature.feature}
                      </span>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-end justify-between mb-3">
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
        </section>

        {/* Why Choose */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
          <h3 className="text-xl font-bold text-center mb-6">
            Why Choose Our Ghee?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Leaf,
                title: "100% Natural",
                desc: "No chemicals, preservatives, or artificial additives. Pure nature in every drop.",
                color: "bg-green-50",
                iconColor: "text-green-600",
              },
              {
                icon: Award,
                title: "Traditional Methods",
                desc: "Crafted using age-old bilona method for authentic taste and maximum nutrition.",
                color: "bg-amber-50",
                iconColor: "text-amber-600",
              },
              {
                icon: Heart,
                title: "Made with Love",
                desc: "Each batch is prepared with care and dedication by our skilled artisans.",
                color: "bg-red-50",
                iconColor: "text-red-500",
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div
                  className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3`}
                >
                  <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                </div>
                <h4 className="text-sm font-semibold mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductsClient;
