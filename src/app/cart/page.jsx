"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/redux/features/product";
import { getCart, updateCart, deleteCart } from "@/redux/features/cartSlice";

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

  const { list: products } = useSelector((state) => state.product);
  const { items: cartItems, loading } = useSelector((state) => state.cart);

  /* 🔹 Fetch products & cart */
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(getCart());
  }, [dispatch]);

  /* 🔹 Merge cart items with product data */
  const mergedCartItems = useMemo(() => {
    return cartItems.map((cartItem) => {
      const product = products.find((p) => p.id === cartItem.product);

      return {
        ...cartItem,
        product,
      };
    });
  }, [cartItems, products]);

  /* 🔹 Quantity handlers */
  const handleIncrease = (item) => {
    dispatch(
      updateCart({
        cartId: item.id,
        quantity: item.quantity + 1,
      })
    );
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      dispatch(
        updateCart({
          cartId: item.id,
          quantity: item.quantity - 1,
        })
      );
    }
  };

  const handleDelete = (id) => {
    console.log(id);
    dispatch(deleteCart(id));
  };

  /* 🔹 Price calculations */
  const subtotal = mergedCartItems.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + Number(item.product.price) * item.quantity;
  }, 0);

  const shipping = subtotal > 1000 ? 0 : subtotal === 0 ? 0 : 50;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Shopping Cart
          </h1>

          {/* EMPTY CART */}
          {mergedCartItems.length === 0 && !loading ? (
            <div className="border rounded-xl shadow p-8 text-center bg-white">
              <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-10 w-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold mt-4">
                Your cart is empty
              </h2>
              <p className="text-gray-500 mt-1">
                Add some products to get started
              </p>
              <Link href="/products">
                <button className="mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90">
                  Browse Products
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* CART ITEMS */}
              <div className="lg:col-span-2 space-y-4">
                {mergedCartItems.map((item) => {
                  if (!item.product) return null;

                  const imageUrl = getFeaturedImage(item.product.images);

                  return (
                    <div
                      key={item.id}
                      className="border rounded-xl shadow p-4 bg-white"
                    >
                      <div className="flex gap-4">
                        <Image
                          src={imageUrl}
                          alt={item.product.name}
                          width={96}
                          height={96}
                          className="rounded-lg object-cover"
                        />

                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {item.product.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {item.product.size}
                              </p>
                            </div>

                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-500 hover:text-red-600 cursor-pointer"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            {/* Quantity */}
                            <div className="flex items-center gap-3 border rounded-lg p-1">
                              <button
                                onClick={() => handleDecrease(item)}
                                className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                              >
                                <Minus className="h-4 w-4" />
                              </button>

                              <span className="w-8 text-center font-medium">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() => handleIncrease(item)}
                                className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            <p className="text-lg font-semibold">
                              ₹{Number(item.product.price) * item.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ORDER SUMMARY */}
              <div className="lg:col-span-1">
                <div className="border rounded-xl shadow p-6 sticky top-4 bg-white">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium">₹{subtotal}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `₹${shipping}`
                        )}
                      </span>
                    </div>

                    <div className="border-t pt-3 flex justify-between text-base">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-lg">₹{total}</span>
                    </div>
                  </div>

                  <button className="w-full mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2 cursor-pointer">
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <Link href="/products">
                    <button className="w-full mt-3 px-6 py-3 border rounded-lg hover:bg-gray-100 cursor-pointer">
                      Continue Shopping
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Page;
