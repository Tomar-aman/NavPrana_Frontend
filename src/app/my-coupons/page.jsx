"use client";

import { useEffect, useState } from "react";
import PrivateRoute from "../../../components/PrivateRoute";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Tag, Copy, ChevronLeft, Gift } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function MyCouponsPage() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyCoupons = async () => {
    setLoading(true);
    try {
      const API = (await import("@/services/api")).default;
      const res = await API.get("api/v1/coupon/my-coupons/");
      setCoupons(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCoupons();
  }, []);

  return (
    <PrivateRoute>
      <main className="min-h-screen bg-gray-50/50 pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Back Navigation */}
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary transition"
          >
            <ChevronLeft size={14} />
            Back to Profile
          </Link>

          {/* Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-5">
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl flex items-center gap-2">
                <Tag className="text-primary h-7 w-7" />
                My Coupon Vouchers
              </h1>
              <p className="text-xs text-gray-500">
                View, copy, and manage all your lucky spin winning coupons here.
              </p>
            </div>
            <button
              onClick={() => router.push("/spin")}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/95 transition shadow-sm cursor-pointer self-start sm:self-auto"
            >
              <Gift size={14} />
              Spin & Win More
            </button>
          </div>

          {/* List/Grid Container */}
          {loading ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-xs text-gray-400 mt-3">Fetching your winning coupons...</p>
            </div>
          ) : coupons.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm space-y-4">
              <Tag size={40} className="mx-auto text-gray-300 opacity-60" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-800">No Coupons Won Yet</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  You haven't won any coupons from the Lucky Spin Wheel yet. Try your luck today!
                </p>
              </div>
              <button
                onClick={() => router.push("/spin")}
                className="px-5 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition shadow-sm cursor-pointer"
              >
                Go to Spin Wheel
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              {coupons.map((coupon) => {
                const isFree500ml = coupon.coupon_code.startsWith("NAV-FREE500-");
                return (
                  <div
                    key={coupon.id}
                    className={`relative border rounded-3xl p-5 overflow-hidden flex flex-col justify-between transition-all duration-200 min-h-[160px]
                      ${coupon.is_used
                        ? "border-gray-200 bg-gray-50/50 opacity-75"
                        : coupon.is_expired
                        ? "border-red-200 bg-red-50/20"
                        : "border-primary/20 bg-gradient-to-br from-white to-primary/5 hover:shadow-md hover:border-primary/30"
                      }`}
                  >
                    {/* Ticket Jagged Border Accents */}
                    <div className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-5 h-5 bg-gray-50/80 rounded-full border-r border-gray-200 z-10" />
                    <div className="absolute top-1/2 -right-2.5 -translate-y-1/2 w-5 h-5 bg-gray-50/80 rounded-full border-l border-gray-200 z-10" />

                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1.5">
                        <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full
                          ${coupon.is_used
                            ? "bg-gray-100 text-gray-500"
                            : coupon.is_expired
                            ? "bg-red-100 text-red-600"
                            : isFree500ml
                            ? "bg-amber-100 text-amber-700 animate-pulse"
                            : "bg-primary/10 text-primary"
                          }`}
                        >
                          {coupon.is_used ? "Used" : coupon.is_expired ? "Expired" : "Active"}
                        </span>
                        
                        <h3 className="font-bold text-gray-800 text-base leading-tight">
                          {isFree500ml
                            ? "Free Buffalo Ghee 500ml"
                            : coupon.discount_type === "percent"
                            ? `${parseInt(coupon.percent)}% OFF Order`
                            : coupon.discount_type === "shipping"
                            ? "Free Shipping On Order"
                            : `₹${parseInt(coupon.amount)} OFF Order`}
                        </h3>
                        
                        <p className="text-[10px] text-gray-400">
                          {isFree500ml 
                            ? "Requires 500ml ghee product in your checkout cart" 
                            : "Can be applied instantly at checkout summary"}
                        </p>
                      </div>

                      {/* Copy code button */}
                      {!coupon.is_used && !coupon.is_expired && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(coupon.coupon_code);
                            toast.success("Coupon code copied!");
                          }}
                          className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-500 hover:text-primary hover:border-primary/20 transition cursor-pointer shrink-0"
                          title="Copy Code"
                        >
                          <Copy size={14} />
                        </button>
                      )}
                    </div>

                    <div className="border-t border-dashed border-gray-200 mt-4 pt-4 flex justify-between items-center">
                      <div className="font-mono font-bold text-xs text-primary bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/10 select-all">
                        {coupon.coupon_code}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        Expires: {new Date(coupon.end_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>
    </PrivateRoute>
  );
}
