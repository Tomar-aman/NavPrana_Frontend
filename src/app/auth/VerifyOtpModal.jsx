"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { resendVerifyApi } from "@/services/auth/resendOTP";

const VerifyOtpModal = ({ isOpen, email, onClose, onVerify }) => {
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(30);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp("");
      setCooldown(30);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || cooldown === 0) return;

    const timer = setTimeout(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown, isOpen]);

  if (!isOpen) return null;

  const onResend = async () => {
    try {
      const res = await resendVerifyApi({ email });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-xl w-full max-w-sm p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-black"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold text-center mb-2">
          Verify Your Email
        </h2>

        <p className="text-sm text-center text-gray-500 mb-4">
          OTP sent to <span className="font-medium">{email}</span>
        </p>

        {/* OTP Input */}
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          className="w-full border rounded-lg px-3 py-2 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-primary"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        {/* Verify */}
        <button
          className="w-full mt-4 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition"
          onClick={() => onVerify(otp)}
        >
          Verify OTP
        </button>

        {/* Resend OTP */}
        <div className="text-center mt-4">
          {cooldown > 0 ? (
            <p className="text-sm text-gray-500">Resend OTP in {cooldown}s</p>
          ) : (
            <button
              onClick={onResend}
              className="text-sm text-primary hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpModal;
