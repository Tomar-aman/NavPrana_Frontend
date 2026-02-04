"use client";

import Image from "next/image";
import {
  ArrowLeft,
  Star,
  Heart,
  Leaf,
  Award,
  ShoppingCart,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/redux/features/product";
import { useEffect } from "react";
import { addToCart, getCart } from "@/redux/features/cartSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
/* 🔹 Get featured image safely */
const getFeaturedImage = (images = []) => {
  return (
    images.find((img) => img.is_feature)?.image ||
    images[0]?.image ||
    "/placeholder.png"
  );
};

const Page = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.product);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  const router = useRouter();
  console.log(list);

  const handleAddToCart = (productId) => {
    // 🚫 If user not logged in → redirect to login
    if (!isAuthenticated) {
      toast.info("Please login to add items to cart");
      router.push("/auth");
      return;
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 mt-20">
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

        {/* PRODUCTS GRID */}

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {list.map((product) => {
            const imageUrl = getFeaturedImage(product.images);
            const isInCart = cartItems.some(
              (item) => item.product === product.id,
            );
            console.log(imageUrl);
            return (
              <div
                key={product.id}
                onClick={() => router.push(`/product-details/${product.id}`)}
                className="group border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full"
              >
                <div className="relative w-full h-64">
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  <div className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                    Save {parseInt(product.discount_precent)} %
                  </div>

                  {/* <button className="absolute top-4 right-4 p-2 rounded-sm bg-white/80 hover:bg-background">
                    <Heart className="h-4 w-4" />
                  </button> */}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">{product.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-primary fill-primary" />
                      <span className="text-sm font-medium">
                        {product.average_rating}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {/* ({product.reviews}) */}
                      </span>
                    </div>
                  </div>

                  {/* <p className="text-muted-foreground text-sm mb-4">
                    {product.details}
                  </p> */}

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

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-primary">
                        {product.price}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        {product.max_price}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.size}
                    </span>
                  </div>

                  <div className="mt-auto pt-4">
                    {isInCart ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push("/cart");
                        }}
                        className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition font-medium cursor-pointer "
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Go to Cart
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product.id);
                        }}
                        className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium cursor-pointer"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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
