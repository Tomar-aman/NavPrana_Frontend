"use client";

import { Leaf, Award, Heart } from "lucide-react";
import ProductCard from "../../../components/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/redux/features/product";
import { useEffect } from "react";
import { addToCart, getCart } from "@/redux/features/cartSlice";
import { trackAddToCart } from "@/lib/meta-pixel";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ProductsClient = ({ initialProducts = [] }) => {
  const dispatch = useDispatch();
  const { list: reduxProducts, loading, error } = useSelector((state) => state.product);
  const { items: cartItems } = useSelector((state) => state.cart);
  const router = useRouter();

  // Server-fetched products render immediately (SEO/AEO: content is in the
  // initial HTML); Redux list takes over once hydrated for cart interactions.
  const products = reduxProducts.length > 0 ? reduxProducts : initialProducts;

  useEffect(() => {
    if (reduxProducts.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, reduxProducts.length]);

  const handleAddToCart = (productId) => {
    // No login wall — signed-out shoppers build a local cart and convert it
    // during guest checkout. The guest branch of the addToCart thunk needs
    // productDetail; without it the dispatch is rejected outright.
    const productObj = products.find((p) => p.id === productId);
    dispatch(
      addToCart({
        product: productId,
        quantity: 1,
        productDetail: productObj,
      }),
    )
      .unwrap()
      .then(() => {
        toast.success("Product added to cart");
        dispatch(getCart());
        // 📊 Meta Pixel — AddToCart
        trackAddToCart(productObj, 1);
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
            Buy Pure A2 Desi{" "}
            <span className="text-gradient">Cow &amp; Buffalo Bilona Ghee</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-5">
            Four sizes across two milk types — A2 desi cow ghee from indigenous
            breeds, and A2 buffalo ghee from native breed buffaloes. Every jar is
            hand-churned using the traditional bilona method in the Chambal
            valley of Madhya Pradesh.
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
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              size="sm"
              isInCart={cartItems.some((item) => item.product === product.id)}
              onAddToCart={handleAddToCart}
            />
          ))}
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
