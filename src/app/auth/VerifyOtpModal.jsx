"use client";

import { useState, useEffect, useRef } from "react";
import { X, ShieldCheck, Loader2 } from "lucide-react";
import { resendVerifyApi } from "@/services/auth/resendOTP";

const VerifyOtpModal = ({ isOpen, email, onClose, onVerify }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(30);
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef([]);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", "", "", ""]);
      setCooldown(30);
      setVerifying(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
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

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 0) return;
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || "";
    }
    setOtp(newOtp);
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const otpString = otp.join("");

  const handleVerify = async () => {
    if (otpString.length < 6) return;
    setVerifying(true);
    await onVerify(otpString);
    setVerifying(false);
  };

  const onResend = async () => {
    try {
      await resendVerifyApi({ email });
      setCooldown(30);
    } catch (err) { }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative shadow-xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <ShieldCheck size={28} className="text-primary" />
          </div>
        </div>

        <h2 className="text-lg font-semibold text-center text-foreground mb-1">
          Verify your email
        </h2>

        <p className="text-sm text-center text-muted-foreground mb-6">
          We sent a 6-digit code to<br />
          <span className="font-medium text-foreground">{email}</span>
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-2.5 mb-5" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-11 h-12 border border-gray-200 rounded-xl text-center text-lg font-semibold outline-none transition
                focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          ))}
        </div>

        {/* Verify */}
        <button
          className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium
            hover:bg-primary/90 transition flex items-center justify-center gap-2 cursor-pointer
            disabled:opacity-70"
          onClick={handleVerify}
          disabled={otpString.length < 6 || verifying}
        >
          {verifying ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </button>

        {/* Resend OTP */}
        <div className="text-center mt-4">
          {cooldown > 0 ? (
            <p className="text-xs text-muted-foreground">
              Resend code in <span className="font-medium text-foreground">{cooldown}s</span>
            </p>
          ) : (
            <button
              onClick={onResend}
              className="text-xs font-medium text-primary hover:text-primary/80 transition cursor-pointer"
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
