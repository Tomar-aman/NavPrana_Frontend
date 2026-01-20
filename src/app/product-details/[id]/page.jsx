// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import {
//   ArrowLeft,
//   Star,
//   Heart,
//   ShoppingCart,
//   Minus,
//   Plus,
//   Truck,
//   Shield,
//   RotateCcw,
//   Leaf,
//   Award,
// } from "lucide-react";

// import gheeProductImage from "@/assets/ghee-product.jpg";
// import cookingGheeImage from "@/assets/cooking-with-ghee.jpg";
// import organicFarmImage from "@/assets/organic-farm.jpg";
// import traditionalCowImage from "@/assets/traditional-cow.jpg";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProducts } from "@/redux/features/product";
// import { useParams } from "next/navigation";

// const Page = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const { list, loading, error } = useSelector((state) => state.product);
//   console.log(list);
//   useEffect(() => {
//     dispatch(fetchProducts());
//   }, [dispatch]);

//   const [selectedImage, setSelectedImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [activeTab, setActiveTab] = useState("description");

//   const products = [
//     {
//       id: 1,
//       name: "Premium A2 Desi Ghee",
//       price: 899,
//       originalPrice: 1200,
//       size: "500ml",
//       rating: 4.9,
//       reviews: 1247,
//       badge: "Bestseller",
//       images: [
//         gheeProductImage,
//         cookingGheeImage,
//         organicFarmImage,
//         traditionalCowImage,
//       ],
//       shortDescription:
//         "Pure A2 ghee from grass-fed Gir cows, traditionally churned",
//       description:
//         "Made from pure A2 cow milk using the traditional bilona method. Rich in nutrients and authentic aroma.",
//       ingredients: "Pure A2 Cow Milk Cream",
//       storage:
//         "Store in a cool, dry place away from direct sunlight. No refrigeration required.",
//     },
//   ];

//   const product = products.find((p) => p.id === Number(id)) || products[0];

//   const handleQuantityChange = (val) => {
//     setQuantity((prev) => Math.max(1, prev + val));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <main className="max-w-7xl mx-auto px-4 py-12">
//         <div className="grid lg:grid-cols-2 gap-12">
//           {/* IMAGE SECTION */}
//           <div>
//             <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow">
//               <Image
//                 src={product.images[selectedImage]}
//                 alt={product.name}
//                 fill
//                 className="object-cover"
//               />

//               <span className="absolute top-4 left-4 bg-green-600 text-white px-4 py-1 rounded-full text-sm">
//                 {product.badge}
//               </span>

//               <button
//                 onClick={() => setIsWishlisted(!isWishlisted)}
//                 className="absolute top-4 right-4 bg-white p-2 rounded-full shadow"
//               >
//                 <Heart
//                   className={`h-5 w-5 ${
//                     isWishlisted ? "text-red-500 fill-red-500" : "text-gray-500"
//                   }`}
//                 />
//               </button>
//             </div>

//             {/* THUMBNAILS */}
//             <div className="grid grid-cols-4 gap-3 mt-4">
//               {product.images.map((img, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setSelectedImage(i)}
//                   className={`rounded-lg overflow-hidden border-2 ${
//                     selectedImage === i ? "border-green-600" : "border-gray-200"
//                   }`}
//                 >
//                   <Image
//                     src={img}
//                     alt=""
//                     width={120}
//                     height={120}
//                     className="object-cover"
//                   />
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* INFO SECTION */}
//           <div className="space-y-6">
//             <div className="flex gap-2">
//               <span className="flex items-center gap-1 text-sm border px-3 py-1 rounded-full">
//                 <Leaf size={14} /> 100% Natural
//               </span>
//               <span className="flex items-center gap-1 text-sm border px-3 py-1 rounded-full">
//                 <Award size={14} /> Certified
//               </span>
//             </div>

//             <h1 className="text-3xl font-bold">{product.name}</h1>
//             <p className="text-gray-500">{product.shortDescription}</p>

//             {/* RATING */}
//             <div className="flex items-center gap-2">
//               {[...Array(5)].map((_, i) => (
//                 <Star
//                   key={i}
//                   className={`h-5 w-5 ${
//                     i < Math.floor(product.rating)
//                       ? "text-yellow-500 fill-yellow-500"
//                       : "text-gray-300"
//                   }`}
//                 />
//               ))}
//               <span className="font-semibold">{product.rating}</span>
//               <span className="text-gray-500">({product.reviews} reviews)</span>
//             </div>

//             {/* PRICE */}
//             <div className="flex items-end gap-4">
//               <span className="text-3xl font-bold text-green-600">
//                 ₹{product.price}
//               </span>
//               <span className="line-through text-gray-400 text-lg">
//                 ₹{product.originalPrice}
//               </span>
//               <span className="text-sm text-gray-500">({product.size})</span>
//             </div>

//             {/* QUANTITY */}
//             <div className="flex items-center gap-4">
//               <span className="font-medium">Quantity</span>
//               <div className="flex items-center border rounded-lg overflow-hidden">
//                 <button
//                   onClick={() => handleQuantityChange(-1)}
//                   className="px-4 py-2 hover:bg-gray-100"
//                 >
//                   <Minus size={16} />
//                 </button>
//                 <span className="px-6 font-semibold">{quantity}</span>
//                 <button
//                   onClick={() => handleQuantityChange(1)}
//                   className="px-4 py-2 hover:bg-gray-100"
//                 >
//                   <Plus size={16} />
//                 </button>
//               </div>
//             </div>

//             {/* ACTION BUTTONS */}
//             <div className="flex gap-4">
//               <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold">
//                 <ShoppingCart size={18} />
//                 Add to Cart
//               </button>

//               <button className="flex-1 border py-3 rounded-lg hover:bg-gray-100 font-semibold">
//                 Buy Now
//               </button>
//             </div>

//             {/* TRUST BADGES */}
//             <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 pt-4 border-t">
//               <div className="flex items-center gap-2">
//                 <Truck size={18} /> Free Shipping
//               </div>
//               <div className="flex items-center gap-2">
//                 <Shield size={18} /> Quality Assured
//               </div>
//               <div className="flex items-center gap-2">
//                 <RotateCcw size={18} /> Easy Returns
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* TABS */}
//         <div className="mt-16">
//           <div className="flex gap-8 border-b">
//             {["description", "storage"].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`pb-3 text-sm font-medium ${
//                   activeTab === tab
//                     ? "border-b-2 border-green-600 text-green-600"
//                     : "text-gray-500"
//                 }`}
//               >
//                 {tab.toUpperCase()}
//               </button>
//             ))}
//           </div>

//           {activeTab === "description" && (
//             <div className="mt-6 max-w-3xl space-y-3">
//               <p className="text-gray-600">{product.description}</p>
//               <div>
//                 <h4 className="font-semibold">Ingredients</h4>
//                 <p className="text-gray-600">{product.ingredients}</p>
//               </div>
//             </div>
//           )}

//           {activeTab === "storage" && (
//             <div className="mt-6 max-w-3xl">
//               <p className="text-gray-600">{product.storage}</p>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Page;

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
import { useParams } from "next/navigation";

const Page = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

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
    <div className="min-h-screen bg-gray-50">
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
                <span className="absolute top-4 left-4 bg-green-600 text-white px-4 py-1 rounded-full text-sm">
                  Save {product.discount_precent}%
                </span>
              )}

              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isWishlisted ? "text-red-500 fill-red-500" : "text-gray-500"
                  }`}
                />
              </button>
            </div>

            {/* THUMBNAILS */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`rounded-lg overflow-hidden border-2 ${
                    selectedImage === i ? "border-green-600" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={img.image}
                    alt={product.name}
                    width={120}
                    height={120}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* INFO SECTION */}
          <div className="space-y-6">
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-sm border px-3 py-1 rounded-full">
                <Leaf size={14} /> 100% Natural
              </span>
              <span className="flex items-center gap-1 text-sm border px-3 py-1 rounded-full">
                <Award size={14} /> Premium Quality
              </span>
            </div>

            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-500">{product.description}</p>

            {/* RATING */}
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.average_rating || 0)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="font-semibold">
                {product.average_rating || 0}
              </span>
            </div>

            {/* PRICE */}
            <div className="flex items-end gap-4">
              <span className="text-3xl font-bold text-green-600">
                ₹{product.price}
              </span>
              {product.max_price && (
                <span className="line-through text-gray-400 text-lg">
                  ₹{product.max_price}
                </span>
              )}
              <span className="text-sm text-gray-500">({product.size})</span>
            </div>

            {/* QUANTITY */}
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity</span>
              <div className="flex items-center border rounded-lg overflow-hidden">
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
            <div className="flex gap-4">
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold">
                <ShoppingCart size={18} />
                Add to Cart
              </button>

              <button className="flex-1 border py-3 rounded-lg hover:bg-gray-100 font-semibold">
                Buy Now
              </button>
            </div>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 pt-4 border-t">
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
          <div className="flex gap-8 border-b">
            {["description", "storage"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium ${
                  activeTab === tab
                    ? "border-b-2 border-green-600 text-green-600"
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

          {activeTab === "storage" && (
            <div className="mt-6 max-w-3xl">
              <p className="text-gray-600">
                Store in a cool, dry place away from sunlight.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Page;
