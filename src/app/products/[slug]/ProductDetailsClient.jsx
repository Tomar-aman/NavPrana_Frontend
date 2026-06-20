"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Leaf,
  Award,
  ChevronDown,
  Star,
  Clock,
  CheckCircle2,
  Image as ImageIcon,
  Send
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { addToCart, getCart } from "@/redux/features/cartSlice";
import { trackViewContent, trackAddToCart } from "@/lib/meta-pixel";
import { toast } from "sonner";
import StickyCartBar from "../../../../components/StickyCartBar";
import { generateSlug } from "@/utils/slug";

// Added: Image Magnifier Component for premium feel
const ImageMagnifier = ({ src, alt }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setPosition({ x, y });
    setCursorPosition({ x: e.pageX - left - window.scrollX, y: e.pageY - top - window.scrollY });
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden cursor-crosshair group"
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
    >
      <Image src={src} alt={alt} fill className="object-cover" />
      {showMagnifier && (
        <div
          className="absolute pointer-events-none rounded-full border-4 border-white shadow-2xl bg-white z-50 hidden md:block"
          style={{
            width: "200px",
            height: "200px",
            left: `${cursorPosition.x - 100}px`,
            top: `${cursorPosition.y - 100}px`,
            backgroundImage: `url(${src})`,
            backgroundPosition: `${position.x}% ${position.y}%`,
            backgroundSize: "250%",
            backgroundRepeat: "no-repeat",
          }}
        />
      )}
    </div>
  );
};

// Added: Accordion Component for premium feel
const Accordion = ({ title, children, isOpen, onClick }) => {
  return (
    <div className={`border border-gray-100 rounded-2xl mb-4 bg-white transition-all duration-300 ${isOpen ? 'shadow-md ring-1 ring-primary/10' : 'shadow-sm hover:shadow-md'}`}>
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left transition-colors rounded-2xl focus:outline-none"
      >
        <span className={`font-bold text-lg ${isOpen ? 'text-primary' : 'text-foreground'}`}>{title}</span>
        <div className={`p-2 rounded-full transition-all duration-300 ${isOpen ? "rotate-180 bg-primary/10 text-primary" : "bg-gray-50 text-gray-400"}`}>
            <ChevronDown size={20} className="currentColor" />
        </div>
      </button>
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-5 md:p-6 pt-0 border-t border-gray-50 mt-2 text-base text-gray-600 prose max-w-none leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

const ComparisonGrid = () => {
  return (
    <div className="my-10 bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 text-center border-b border-primary/10">
        <h3 className="text-2xl font-extrabold text-foreground tracking-tight">NavPrana vs Commercial Ghee</h3>
        <p className="text-muted-foreground mt-2 text-sm font-medium">See why our traditional Bilona ghee stands out from the rest.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr>
              <th className="p-5 border-b border-gray-100 font-bold text-gray-500 w-1/3 uppercase text-xs tracking-wider">Features</th>
              <th className="p-5 border-b border-primary/20 font-extrabold text-primary bg-primary/5 w-1/3 uppercase text-xs tracking-wider">NavPrana A2 Bilona Ghee</th>
              <th className="p-5 border-b border-gray-100 font-bold text-gray-500 w-1/3 uppercase text-xs tracking-wider">Commercial Ghee</th>
            </tr>
          </thead>
          <tbody>
            {[
              { feature: "Process", nav: "Traditional Bilona (Curd)", com: "Cream Separation" },
              { feature: "Milk Quality", nav: "A2 Grass-fed Buffalo/Cow", com: "Mixed/A1 Milk" },
              { feature: "Nutrients", nav: "High in CLA & Vitamins", com: "Low Nutritional Value" },
              { feature: "Aroma & Texture", nav: "Rich, Granular (Danedar)", com: "Flat, Artificial Smell" },
              { feature: "Additives", nav: "100% Pure, Zero Preservatives", com: "Colors & Flavors Added" },
            ].map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="p-5 border-b border-gray-50 text-sm font-bold text-gray-700">{row.feature}</td>
                <td className="p-5 border-b border-primary/10 bg-primary/5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1 rounded-full bg-primary/20"><CheckCircle2 size={16} className="text-primary shrink-0" /></div>
                    <span className="text-sm font-bold text-gray-900">{row.nav}</span>
                  </div>
                </td>
                <td className="p-5 border-b border-gray-50">
                   <div className="flex items-center gap-2.5">
                    <div className="p-1 rounded-full bg-gray-100"><Minus size={16} className="text-gray-400 shrink-0" /></div>
                    <span className="text-sm font-medium text-gray-500">{row.com}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const ProductDetailsClient = ({ product }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items: cartItems } = useSelector((state) => state.cart);
  const { list: allProducts } = useSelector((state) => state.product);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState("description");

  // Variant matching
  // Assume products with same first 2 words in name are variants
  const baseNameWords = product.name.split(" ").slice(0, 3).join(" ");
  const variants = allProducts.filter(p => p.name.includes(baseNameWords) && p.id !== product.id);

  // Delivery estimation logic
  const [deliveryDate, setDeliveryDate] = useState("");
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 0 });

  useEffect(() => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    setDeliveryDate(date.toLocaleDateString('en-IN', options));

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 45, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 📊 Meta Pixel — ViewContent on product view
  useEffect(() => {
    trackViewContent(product);
  }, [product]);

  const handleAddToCart = (productId) => {
    if (!isAuthenticated) {
      toast.info("Please login to add items to cart");
      router.push("/signin");
      return;
    }
    dispatch(addToCart({ product: productId, quantity }))
      .unwrap()
      .then(() => {
        toast.success("Product added to cart");
        dispatch(getCart());
        // 📊 Meta Pixel — AddToCart
        trackAddToCart(product, quantity);
      })
      .catch((err) => {
        toast.error(typeof err === "string" ? err : "Failed to add to cart");
      });
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.info("Please login to buy products");
      router.push("/signin");
      return;
    }
    try {
      if (!isInCart) {
        await dispatch(
          addToCart({ product: product.id, quantity }),
        ).unwrap();
        dispatch(getCart());
      }
      router.push("/checkout");
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "Something went wrong. Please try again."
      );
    }
  };


  const isInCart = cartItems.some((item) => item.product === product.id);

  const handleQuantityChange = (val) => {
    setQuantity((prev) => Math.max(1, prev + val));
  };

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? "" : id);
  };

  const images = product.images || [];
  const mainImage = images[selectedImage]?.image || "/placeholder.png";

  const trustBadges = [
    { icon: Truck, label: "Free Shipping", desc: "On orders above ₹999", color: "bg-blue-50", iconColor: "text-blue-500" },
    { icon: Shield, label: "Quality Assured", desc: "Lab tested pure ghee", color: "bg-green-50", iconColor: "text-green-600" },
    { icon: RotateCcw, label: "Easy Returns", desc: "Hassle-free process", color: "bg-amber-50", iconColor: "text-amber-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="text-xs md:text-sm text-gray-500 mb-8 flex items-center gap-2.5 font-medium">
          <span className="cursor-pointer hover:text-primary transition" onClick={() => router.push('/')}>Home</span>
          <span className="text-gray-300">/</span>
          <span className="cursor-pointer hover:text-primary transition" onClick={() => router.push('/products')}>Products</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-bold truncate">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* IMAGE SECTION */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
             {/* Thumbnails (Vertical on desktop, horizontal on mobile) */}
             <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar w-full md:w-20 shrink-0">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-square w-16 md:w-full rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i
                    ? "border-primary ring-2 ring-primary/20 shadow-md"
                    : "border-gray-100 hover:border-primary/50 opacity-70 hover:opacity-100"
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

            <div className="relative aspect-square md:aspect-[4/5] w-full bg-gray-50 rounded-2xl overflow-hidden flex-1 group">
              <ImageMagnifier src={mainImage} alt={product.name} />
              {product.discount_precent && (
                <span className="absolute top-4 left-4 bg-red-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-black shadow-lg z-10 tracking-wider uppercase">
                  Save {parseInt(product.discount_precent)}%
                </span>
              )}
            </div>
          </div>

          {/* INFO SECTION */}
          <div className="flex flex-col">
            <div className="space-y-5 flex-1">
              {/* Badges */}
              <div className="flex flex-wrap gap-2.5">
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200 uppercase tracking-wide">
                  <Leaf size={14} /> 100% Natural Organic
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 uppercase tracking-wide">
                  <Award size={14} /> FSSAI Certified
                </span>
              </div>

              {/* Name & Details */}
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-[1.1] tracking-tight">
                  {product.name}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center gap-4 mb-4">
                   <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-lg border border-amber-100">
                      <Star size={16} className="text-amber-500 fill-amber-500" />
                      <span className="text-sm font-black text-amber-800">
                        {product.average_rating || "5.0"}
                      </span>
                    </div>
                    <div className="h-5 w-[1px] bg-gray-200"></div>
                    <span className="text-sm font-semibold text-primary underline cursor-pointer hover:text-primary/80 transition" onClick={() => setActiveAccordion("reviews")}>
                      {product.reviews?.length || 0} Verified Reviews
                    </span>
                </div>
                
                <p className="text-base md:text-lg text-gray-600 leading-relaxed font-medium">{product.details}</p>
              </div>

              {/* Price block */}
              <div className="flex items-end gap-3 pt-2">
                <span className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                  ₹{product.price}
                </span>
                {product.max_price && (
                  <span className="line-through text-gray-400 text-xl md:text-2xl mb-1.5 font-medium">
                    ₹{product.max_price}
                  </span>
                )}
              </div>
              <div className="text-sm font-semibold text-gray-500">Inclusive of all taxes</div>

              <div className="h-[1px] bg-gray-100 w-full my-6"></div>

              {/* Variants Selector */}
              <div className="space-y-3">
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">Select Size</span>
                 </div>
                 <div className="flex flex-wrap gap-3">
                    <button className="px-5 py-2.5 bg-primary/10 border-2 border-primary rounded-xl text-sm font-bold text-primary shadow-sm relative overflow-hidden">
                       {product.size}
                       <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-t-primary border-l-transparent"></div>
                       <CheckCircle2 size={10} className="absolute top-0.5 right-0.5 text-white" />
                    </button>
                    {variants.map(v => (
                       <button 
                         key={v.id}
                         onClick={() => router.push(`/products/${generateSlug(v.name)}`)}
                         className="px-5 py-2.5 bg-white border-2 border-gray-200 hover:border-primary/50 rounded-xl text-sm font-bold text-gray-600 transition shadow-sm"
                       >
                         {v.size}
                       </button>
                    ))}
                 </div>
              </div>

              {/* Urgency & Delivery Estimate */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                 <div className="flex-1 flex items-center gap-3 p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                    <div className="p-2 bg-white rounded-full shadow-sm">
                      <Clock className="text-orange-500" size={20} />
                    </div>
                    <div>
                       <div className="text-xs font-bold text-orange-800 uppercase tracking-wide">Order within</div>
                       <div className="text-sm font-bold text-orange-900">
                         {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                       </div>
                    </div>
                 </div>

                 <div className="flex-1 flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                    <div className="p-2 bg-white rounded-full shadow-sm">
                      <Truck className="text-blue-500" size={20} />
                    </div>
                    <div>
                       <div className="text-xs font-bold text-blue-800 uppercase tracking-wide">Delivery by</div>
                       <div className="text-sm font-bold text-blue-900">{deliveryDate}</div>
                    </div>
                 </div>
              </div>

              {/* Quantity */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="px-5 py-3.5 hover:bg-gray-50 transition text-gray-700 active:bg-gray-100"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="px-5 font-black text-lg w-16 text-center text-gray-900">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-5 py-3.5 hover:bg-gray-50 transition text-gray-700 active:bg-gray-100"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-gray-100">
              {isInCart ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/cart");
                  }}
                  className="flex-[1] flex items-center justify-center gap-2.5 py-4.5 rounded-xl bg-primary text-white text-lg font-black hover:bg-primary/90 transition shadow-lg hover:shadow-primary/30 active:scale-[0.98]"
                >
                  <ShoppingCart size={22} />
                  Go to Cart
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product.id);
                  }}
                  className="flex-[1] flex items-center justify-center gap-2.5 py-4.5 rounded-xl bg-primary text-white text-lg font-black hover:bg-primary/90 transition shadow-lg hover:shadow-primary/30 active:scale-[0.98]"
                >
                  <ShoppingCart size={22} />
                  Add to Cart
                </button>
              )}

              <button
                className="flex-[1] border-2 border-primary text-primary bg-primary/5 py-4.5 rounded-xl hover:bg-primary/10 text-lg font-black transition shadow-sm active:scale-[0.98]"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>

            <StickyCartBar
              product={product}
              isInCart={isInCart}
              onAddToCart={() => handleAddToCart(product.id)}
              onGoToCart={() => router.push("/cart")}
            />
          </div>
        </div>

        {/* Trust Badges Full Width */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {trustBadges.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-5 p-6 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-16 h-16 ${badge.color} rounded-2xl flex items-center justify-center shrink-0 shadow-sm`}>
                <badge.icon size={28} className={badge.iconColor} />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900 mb-1">
                  {badge.label}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {badge.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        <ComparisonGrid />

        {/* Product Details Accordion Section */}
        <div className="mt-12 max-w-4xl mx-auto">
           <div className="text-center mb-10">
             <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Product Information</h2>
             <p className="text-lg text-gray-500 font-medium">Everything you need to know about our premium product.</p>
           </div>
           
           <div className="space-y-4">
             <Accordion 
               title="Detailed Description" 
               isOpen={activeAccordion === "description"}
               onClick={() => toggleAccordion("description")}
             >
               {product.description ? (
                 <div className="prose-lg max-w-none prose-p:mb-4 prose-headings:font-bold prose-headings:text-gray-900 text-gray-600">
                   {product.description}
                 </div>
               ) : (
                 <p>This premium A2 Bilona Ghee is made using the traditional hand-churning method, preserving all natural nutrients and aroma.</p>
               )}
             </Accordion>

             <Accordion 
               title="Specifications & Lab Test Reports" 
               isOpen={activeAccordion === "specifications"}
               onClick={() => toggleAccordion("specifications")}
             >
                {product?.specifications?.specification ? (
                  <div className="prose-lg max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: product.specifications.specification,
                    }}
                  />
                ) : (
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
                    <Award size={40} className="text-primary mx-auto mb-3" />
                    <h4 className="text-lg font-bold text-gray-900 mb-2">FSSAI Certified & Lab Tested</h4>
                    <p className="text-gray-600">Our products pass rigorous quality checks to ensure 100% purity and authenticity.</p>
                  </div>
                )}
             </Accordion>
             
             <Accordion 
               title={`Customer Reviews (${product.reviews?.length || 0})`}
               isOpen={activeAccordion === "reviews"}
               onClick={() => toggleAccordion("reviews")}
             >
                <div className="pt-4 max-w-2xl mx-auto">
                   {/* Review Stats & List */}
                   <div>
                     <h4 className="text-xl font-extrabold text-gray-900 mb-6 text-center">What our customers say</h4>
                     {product.reviews?.length > 0 ? (
                       <div className="space-y-6">
                         {product.reviews.map((review, i) => (
                           <div key={i} className="border-b border-gray-100 pb-6">
                             <div className="flex items-center gap-2 mb-2">
                               {[1,2,3,4,5].map(s => (
                                 <Star key={s} size={14} className={s <= review.rating ? "text-amber-500 fill-amber-500" : "text-gray-200"} />
                               ))}
                             </div>
                             <p className="text-gray-700 font-medium italic">"{review.comment}"</p>
                             <div className="text-sm text-gray-500 mt-2 font-semibold">- {review.user_name || "Verified Customer"}</div>
                           </div>
                         ))}
                       </div>
                     ) : (
                       <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
                         <Star size={48} className="text-gray-300 mx-auto mb-4" />
                         <p className="text-gray-900 font-bold text-lg mb-1">No reviews yet</p>
                         <p className="text-gray-500">Check back later for customer reviews!</p>
                       </div>
                     )}
                   </div>
                </div>
             </Accordion>
           </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailsClient;
