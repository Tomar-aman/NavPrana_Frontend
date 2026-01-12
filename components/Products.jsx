"use client";
import { ShoppingCart, Star, Truck, Shield, Heart } from "lucide-react";
import gheeProductImage from "@/assets/ghee-product.jpg";
import cookingGheeImage from "@/assets/cooking-with-ghee.jpg";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/features/cartSlice";
import { fetchProducts } from "@/redux/features/product";
import { useEffect } from "react";
const getFeaturedImage = (images = []) => {
  return (
    images.find((img) => img.is_feature)?.image ||
    images[0]?.image ||
    "/placeholder.png"
  );
};

const Products = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  console.log(list);

  const handleAddToCart = (productId) => {
    console.log(productId);
    dispatch(
      addToCart({
        product: productId,
        quantity: 1,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Product added to cart");
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  return (
    <section id="products" className="py-20 bg-background md:px-15">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="text-gradient">Premium Collection</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from our carefully crafted range of pure desi ghee, each made
            with traditional methods and the finest ingredients for authentic
            taste and nutrition.
          </p>
        </div>

        {/* Product Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {list.slice(0, 3).map((product) => {
            const imageUrl = getFeaturedImage(product.images);
            console.log(imageUrl);
            return (
              <div
                key={product.id}
                className="group border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative w-full h-64">
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  <div className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                    Save {product.discount_precent} %
                  </div>

                  <button className="absolute top-4 right-4 p-2 rounded-sm bg-white/80 hover:bg-background">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-6">
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

                  <p className="text-muted-foreground text-sm mb-4">
                    {product.description}
                  </p>

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

                  <button
                    className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium cursor-pointer"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            {
              icon: Truck,
              title: "Free Shipping",
              desc: "On orders above ₹999",
            },
            {
              icon: Shield,
              title: "Quality Assured",
              desc: "Lab tested purity",
            },
            {
              icon: Star,
              title: "5000+ Reviews",
              desc: "Customer satisfaction",
            },
            {
              icon: Heart,
              title: "Made with Love",
              desc: "Traditional methods",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center space-y-3 p-6 bg-card/30 rounded-lg"
            >
              <div className="w-12 h-12 bg-[#2b6033] rounded-full flex items-center justify-center">
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
