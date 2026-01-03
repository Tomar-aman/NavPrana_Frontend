"use client";

import { useState } from "react";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

import { forgotPasswordOTP } from "@/services/auth/forgot-password-otp";
import { forgotPasswordOTPVerify } from "@/services/auth/forgot-password-otp-verify";
import { forgotPassword } from "@/services/auth/forgot-password";
import ResetPasswordModal from "./ResetPasswordModal";
import Link from "next/link";

const Page = () => {
  const [step, setStep] = useState(1); // 1=email, 2=otp
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // 🔹 Send OTP
  const onSubmitEmail = async () => {
    if (!email) {
      toast.warn("Please enter email");
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPasswordOTP({ email });
      toast.success(res?.message || "OTP sent successfully");
      setStep(2);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Verify OTP
  const onSubmitOTP = async () => {
    if (otp.length !== 6) {
      toast.warn("Enter valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPasswordOTPVerify({ email, otp });
      toast.success(res?.message || "OTP verified");
      setShowResetModal(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Reset Password
  const onSubmitPasswordReset = async (password, confirmPassword) => {
    try {
      setLoading(true);
      const res = await forgotPassword({
        email,
        password,
        confirm_password: confirmPassword,
      });

      toast.success(res?.message || "Password reset successful");

      // reset everything
      setShowResetModal(false);
      setStep(1);
      setEmail("");
      setOtp("");
      navigate("/auth");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between md:px-15">
          <Link
            href="/auth"
            className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Login</span>
          </Link>
          {/* <h1 className="text-3xl font-bold text-gradient">Health Benefits</h1> */}
          <div></div>
        </div>
      </header>
      <main className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-center mb-2">
            {step === 1 ? "Forgot Password" : "Verify OTP"}
          </h2>

          <p className="text-center text-gray-500 mb-6">
            {step === 1
              ? "Enter your email to receive an OTP"
              : `OTP sent to ${email}`}
          </p>

          {/* STEP 1: EMAIL */}
          {step === 1 && (
            <>
              <div className="relative mb-4">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-3 py-2 border rounded-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                onClick={onSubmitEmail}
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </>
          )}

          {/* STEP 2: OTP */}
          {step === 2 && (
            <>
              <div className="relative mb-4">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  className="w-full pl-10 pr-3 py-2 border rounded-lg text-center tracking-widest"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              <button
                onClick={onSubmitOTP}
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full mt-3 text-sm text-primary hover:underline"
              >
                Change Email
              </button>
            </>
          )}
        </div>
      </main>

      {/* RESET PASSWORD MODAL */}
      <ResetPasswordModal
        isOpen={showResetModal}
        email={email}
        onClose={() => setShowResetModal(false)}
        onSubmit={onSubmitPasswordReset}
      />
    </div>
  );
};

export default Page;
