"use client";
import { Truck, Shield, Star, Heart, Leaf, Award, ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, getCart } from "@/redux/features/cartSlice";
import { fetchProducts } from "@/redux/features/product";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Products = ({ initialProducts = [] }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { list: reduxProducts, loading, error } = useSelector((state) => state.product);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Server-fetched products render in the initial HTML (this component is a
  // client component, so a Redux-only list meant Googlebot saw an empty grid
  // and the homepage shipped with no product content at all). Redux takes over
  // after hydration so cart state stays live.
  const list = reduxProducts.length > 0 ? reduxProducts : initialProducts;

  useEffect(() => {
    if (reduxProducts.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, reduxProducts.length]);

  const handleAddToCart = (productId) => {
    // No login wall — signed-out shoppers build a local cart and convert it
    // during guest checkout.
    const productDetail = list.find((p) => p.id === productId);
    dispatch(
      addToCart({
        product: productId,
        quantity: 1,
        productDetail,
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
    { icon: Shield, title: "Quality Assured", desc: "Lab tested pure desi ghee" },
    { icon: Star, title: "Verified Reviews", desc: "From real customers" },
    { icon: Heart, title: "Bilona Method", desc: "Traditional hand-churned" },
    { icon: Award, title: "FSSAI Certified", desc: "Government approved" },
    { icon: Leaf, title: "100% Organic", desc: "Grass-fed cow & buffalo" },
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
            Pure Desi <span className="text-gradient">Cow &amp; Buffalo Bilona Ghee</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            A2 desi cow ghee for light, everyday cooking, and A2 buffalo ghee for
            richer, denser nutrition — both hand-churned using the traditional
            bilona method, with nothing added.
          </p>
        </div>

        {/* Product Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {list.slice(0, 3).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              size="lg"
              isInCart={cartItems.some((item) => item.product === product.id)}
              onAddToCart={handleAddToCart}
            />
          ))}
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
