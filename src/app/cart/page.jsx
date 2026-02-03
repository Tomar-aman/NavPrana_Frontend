"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/redux/features/product";
import { getCart, updateCart, deleteCart } from "@/redux/features/cartSlice";
import { useRouter } from "next/navigation";
import PrivateRoute from "../../../components/PrivateRoute";

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
  const router = useRouter();
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
      return { ...cartItem, product };
    });
  }, [cartItems, products]);

  /* 🔹 Quantity handlers */
  const handleIncrease = (item) => {
    dispatch(updateCart({ cartId: item.id, quantity: item.quantity + 1 }));
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      dispatch(updateCart({ cartId: item.id, quantity: item.quantity - 1 }));
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteCart(id));
  };
  console.log(mergedCartItems);
  /* 🔹 Price calculations */
  const subtotal = mergedCartItems.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + Number(item.product.price) * item.quantity;
  }, 0);

  const mrpSubtotal = mergedCartItems.reduce((sum, item) => {
    if (!item.product) return sum;
    return (
      sum + Number(item.product.max_price || item.product.price) * item.quantity
    );
  }, 0);

  const discountTotal = mrpSubtotal - subtotal;
  const shipping = subtotal > 1000 ? 0 : subtotal === 0 ? 0 : 50;
  const total = subtotal + shipping;

  return (
    <PrivateRoute>
      <div className="flex flex-col my-20">
        <main className="flex-1 py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              Shopping Cart
            </h1>

            {/* EMPTY CART */}
            {mergedCartItems.length === 0 && !loading ? (
              <div className="border border-primary-border rounded-xl shadow p-8 text-center bg-white">
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
                        className="border border-primary-border rounded-xl bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition"
                      >
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* IMAGE */}
                          <div
                            className="relative w-full sm:w-24 h-48 sm:h-24 shrink-0 rounded-lg overflow-hidden border border-primary-border"
                            onClick={() =>
                              router.push(`/product-details/${item.product.id}`)
                            }
                          >
                            <Image
                              src={imageUrl}
                              alt={item.product.name}
                              fill
                              sizes="(max-width: 640px) 100vw, 96px"
                              className="object-cover"
                            />

                            {item.product.discount_precent && (
                              <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded">
                                {parseInt(item.product.discount_precent)}% OFF
                              </span>
                            )}
                          </div>

                          {/* CONTENT */}
                          <div className="flex-1 flex flex-col justify-between ">
                            {/* TITLE + DELETE */}
                            <div className="flex justify-between gap-3">
                              <div>
                                <h3
                                  className="font-semibold text-base sm:text-lg leading-snug cursor-pointer hover:text-primary"
                                  onClick={() =>
                                    router.push(
                                      `/product-details/${item.product.id}`,
                                    )
                                  }
                                >
                                  {item.product.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  Size: <b>{item.product.size}</b>
                                </p>
                              </div>

                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-red-500 hover:text-red-600 self-start"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>

                            {/* QTY + PRICE */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              {/* QUANTITY */}
                              <div className="flex items-center gap-3 border border-primary-border rounded-lg px-2 py-1 w-fit">
                                <button
                                  onClick={() => handleDecrease(item)}
                                  className="p-1 hover:bg-gray-100 rounded"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>

                                <span className="w-8 text-center font-medium">
                                  {item.quantity}
                                </span>

                                <button
                                  onClick={() => handleIncrease(item)}
                                  className="p-1 hover:bg-gray-100 rounded"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>

                              {/* PRICE */}
                              <div className="text-left sm:text-right">
                                {item.product.max_price && (
                                  <p className="text-xs text-gray-400 line-through">
                                    ₹{item.product.max_price * item.quantity}
                                  </p>
                                )}

                                <p className="text-lg font-semibold text-primary">
                                  ₹{item.product.price * item.quantity}
                                </p>

                                {item.product.max_price && (
                                  <p className="text-xs text-green-600 font-medium">
                                    Save ₹
                                    {(item.product.max_price -
                                      item.product.price) *
                                      item.quantity}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ORDER SUMMARY */}
                <div className="lg:col-span-1">
                  <div className="border border-primary-border rounded-xl shadow p-6 sticky top-4 bg-white">
                    <h2 className="text-xl font-semibold mb-4">
                      Order Summary
                    </h2>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">MRP Total</span>
                        <span className="line-through">₹{mrpSubtotal}</span>
                      </div>

                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-₹{discountTotal}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">Shipping</span>
                        <span>
                          {shipping === 0 ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            `₹${shipping}`
                          )}
                        </span>
                      </div>

                      <div className="border-t border-primary-border pt-3 flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">₹{total}</span>
                      </div>
                    </div>

                    <button
                      className="w-full mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2 cursor-pointer"
                      onClick={() => router.push("/checkout")}
                    >
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    <Link href="/products">
                      <button className="w-full mt-3 px-6 py-3 border border-primary-border rounded-lg hover:bg-gray-100 cursor-pointer">
                        Continue Shopping
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </PrivateRoute>
  );
};

export default Page;
