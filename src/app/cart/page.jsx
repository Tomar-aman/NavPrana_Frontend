"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/redux/features/product";
import { getCart, updateCart, deleteCart } from "@/redux/features/cartSlice";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/utils/slug";
import PrivateRoute from "../../../components/PrivateRoute";

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

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(getCart());
  }, [dispatch]);

  const mergedCartItems = useMemo(() => {
    return cartItems.map((cartItem) => {
      const product = products.find((p) => p.id === cartItem.product);
      return { ...cartItem, product };
    });
  }, [cartItems, products]);

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
      <div className="min-h-screen bg-background mt-20">
        <main className="max-w-5xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-xs font-semibold text-primary uppercase tracking-wider mb-3">
              <ShoppingBag size={14} />
              Shopping Cart
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Your Cart
              {mergedCartItems.length > 0 && (
                <span className="text-muted-foreground text-lg font-normal ml-2">
                  ({mergedCartItems.length} item{mergedCartItems.length !== 1 ? "s" : ""})
                </span>
              )}
            </h1>
          </div>

          {/* Empty Cart */}
          {mergedCartItems.length === 0 && !loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                <ShoppingBag className="h-7 w-7 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-1">Your cart is empty</h2>
              <p className="text-sm text-muted-foreground mb-5">
                Add some products to get started
              </p>
              <Link href="/products">
                <button className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition">
                  Browse Products
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-3">
                {mergedCartItems.map((item) => {
                  if (!item.product) return null;
                  const imageUrl = getFeaturedImage(item.product.images);

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-gray-200 transition"
                    >
                      <div className="flex gap-4">
                        {/* Image */}
                        <div
                          className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-gray-50 cursor-pointer"
                          onClick={() =>
                            router.push(`/products/${generateSlug(item.product.name)}`)
                          }
                        >
                          <Image
                            src={imageUrl}
                            alt={item.product.name}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                          {item.product.discount_precent && (
                            <span className="absolute top-1 left-1 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                              {parseInt(item.product.discount_precent)}%
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-2">
                            <div className="min-w-0">
                              <h3
                                className="text-sm font-semibold text-foreground truncate cursor-pointer hover:text-primary transition"
                                onClick={() =>
                                  router.push(`/products/${generateSlug(item.product.name)}`)
                                }
                              >
                                {item.product.name}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Size: <span className="font-medium text-foreground">{item.product.size}</span>
                              </p>
                            </div>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-muted-foreground hover:text-red-500 transition shrink-0 p-1"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            {/* Quantity */}
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                              <button
                                onClick={() => handleDecrease(item)}
                                className="px-2.5 py-1.5 hover:bg-gray-50 transition"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => handleIncrease(item)}
                                className="px-2.5 py-1.5 hover:bg-gray-50 transition"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <p className="text-sm font-semibold text-foreground">
                                ₹{item.product.price * item.quantity}
                              </p>
                              {item.product.max_price && (
                                <p className="text-[11px] text-muted-foreground line-through">
                                  ₹{item.product.max_price * item.quantity}
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

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
                  <h2 className="text-base font-semibold mb-4">Order Summary</h2>

                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">MRP Total</span>
                      <span className="line-through text-muted-foreground">₹{mrpSubtotal}</span>
                    </div>
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Discount</span>
                      <span>-₹{discountTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-green-600 font-medium">Free</span>
                        ) : (
                          `₹${shipping}`
                        )}
                      </span>
                    </div>
                    <div className="border-t border-gray-100 pt-2.5 flex justify-between text-base font-bold">
                      <span>Total</span>
                      <span className="text-foreground">₹{total}</span>
                    </div>
                  </div>

                  {discountTotal > 0 && (
                    <p className="text-xs text-green-700 font-semibold bg-green-50 rounded-lg px-2.5 py-1.5 mt-2">
                      🎉 You save ₹{discountTotal}
                    </p>
                  )}

                  <button
                    className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition cursor-pointer"
                    onClick={() => router.push("/checkout")}
                  >
                    Proceed to Checkout
                    <ArrowRight size={15} />
                  </button>

                  <Link href="/products">
                    <button className="w-full mt-2 py-2.5 border border-gray-200 text-sm font-medium rounded-xl hover:bg-gray-50 transition cursor-pointer">
                      Continue Shopping
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>
      </div >
    </PrivateRoute >
  );
};

export default Page;
