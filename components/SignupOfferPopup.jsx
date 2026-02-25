"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { X, Gift, Sparkles, ArrowRight } from "lucide-react";

const SignupOfferPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    // Don't show if user is logged in
    if (isAuthenticated) return;

    // Don't show if user already dismissed it in this session
    const dismissed = sessionStorage.getItem("signup_popup_dismissed");
    if (dismissed) return;

    // Show popup after 5 seconds of browsing
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("signup_popup_dismissed", "true");
  };

  const handleSignup = () => {
    setIsVisible(false);
    sessionStorage.setItem("signup_popup_dismissed", "true");
    router.push("/signup");
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300"
      >
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-gray-700 transition cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Top banner */}
        <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="text-accent" size={24} />
            <span className="text-accent font-bold text-sm uppercase tracking-wider">
              Exclusive Offer
            </span>
            <Sparkles className="text-accent" size={24} />
          </div>
          <h2 className="text-white text-2xl font-bold">
            Welcome to NavPrana!
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-6 text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="text-accent" size={32} />
          </div>

          <h3 className="text-xl font-bold text-foreground mb-2">
            Get a Special Discount!
          </h3>

          <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
            Sign up today and receive an <strong className="text-primary">exclusive coupon code</strong> for
            your first order of our premium organic desi ghee.
          </p>

          {/* Discount highlight */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
            <p className="text-primary font-bold text-lg">
              🎉 Special First-Order Discount
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              Create your account to unlock the coupon
            </p>
          </div>

          {/* CTA Buttons */}
          <button
            onClick={handleSignup}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 px-6 rounded-xl font-semibold hover:bg-primary/90 transition cursor-pointer mb-3"
          >
            Sign Up Now
            <ArrowRight size={18} />
          </button>

          <button
            onClick={handleDismiss}
            className="text-muted-foreground text-sm hover:text-foreground transition cursor-pointer"
          >
            No thanks, I&apos;ll browse first
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupOfferPopup;
