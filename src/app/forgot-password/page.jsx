"use client";

import { useState } from "react";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

import ResetPasswordModal from "./ResetPasswordModal";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import {
  resetPassword,
  resetPasswordState,
  sendForgotOtp,
  verifyForgotOtp,
} from "@/redux/features/passwordSlice";

const Page = () => {
  // const [step, setStep] = useState(1); // 1=email, 2=otp
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const dispatch = useDispatch();
  const { step } = useSelector((state) => state.password);

  const router = useRouter();
  // 🔹 Send OTP
  const onSubmitEmail = async () => {
    if (!email) {
      toast.warn("Please enter email");
      return;
    }

    try {
      await dispatch(sendForgotOtp({ email })).unwrap();
      toast.success("OTP sent successfully");
    } catch (err) {
      toast.error(err);
    }
  };

  const onSubmitOTP = async () => {
    if (otp.length !== 6) {
      toast.warn("Enter valid 6-digit OTP");
      return;
    }

    try {
      await dispatch(verifyForgotOtp({ email, otp })).unwrap();
      toast.success("OTP verified");
      setShowResetModal(true);
    } catch (err) {
      toast.error(err);
    }
  };

  const onSubmitPasswordReset = async (password, confirmPassword) => {
    try {
      await dispatch(
        resetPassword({ email, password, confirm_password: confirmPassword }),
      ).unwrap();

      toast.success("Password reset successful");

      dispatch(resetPasswordState());
      setShowResetModal(false);
      router.push("/auth");
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
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
                  className="w-full pl-10 pr-3 py-2 border border-primary-border rounded-lg"
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
                  className="w-full pl-10 pr-3 py-2 border border-primary-border rounded-lg text-center tracking-widest"
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
