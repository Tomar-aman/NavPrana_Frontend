"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import gheeProduct from "@/assets/ghee-product.jpg";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const Page = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Pure Desi Ghee",
      price: 899,
      quantity: 2,
      image: gheeProduct,
      size: "500ml",
    },
    {
      id: 2,
      name: "A2 Cow Ghee",
      price: 1299,
      quantity: 1,
      image: gheeProduct,
      size: "1L",
    },
  ]);

  const updateQuantity = (id, change) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Shopping Cart
          </h1>

          {cartItems.length === 0 ? (
            <div className="border rounded-xl shadow p-8 text-center">
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
                <button className="mt-6 px-6 py-3 w-full sm:w-auto bg-primary text-white rounded-lg hover:bg-primary/90 transition">
                  Browse Products
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-xl shadow p-4 bg-white"
                  >
                    <div className="flex gap-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500">{item.size}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Control */}
                          <div className="flex items-center gap-3 border rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-lg font-semibold">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
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
                    {subtotal < 1000 && (
                      <p className="text-xs text-gray-500">
                        Add ₹{1000 - subtotal} more for free shipping
                      </p>
                    )}
                    <div className="border-t pt-3 flex justify-between text-base">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-lg">₹{total}</span>
                    </div>
                  </div>

                  {/* Coupon */}
                  <div className="flex gap-2 mt-4">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      className="flex-1 border rounded-lg px-3 py-2 text-sm"
                    />
                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition">
                      Apply
                    </button>
                  </div>

                  {/* Checkout Button */}
                  <button className="w-full mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2">
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <Link href="/products">
                    <button className="w-full mt-3 px-6 py-3 border rounded-lg hover:bg-gray-100 transition">
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
