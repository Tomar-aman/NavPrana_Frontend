"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { signUp } from "@/services/auth/signUp";
import VerifyOtpModal from "./VerifyOtpModal";
import { verifyAPI } from "@/services/auth/verifyOTP";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { loginUser } from "@/store/authSlice";
import { getErrorMessage } from "@/services/httpError";

const Page = () => {
  const [activeTab, setActiveTab] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [signinForm, setSigninForm] = useState({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSignIn = async () => {
    try {
      await dispatch(loginUser(signinForm)).unwrap();
      toast.success("Login successful");
      router.push("/");
      setSigninForm({ email: "", password: "" });
    } catch (err) {
      toast.error(getErrorMessage(err, "Login failed"));
    }
  };

  const handleSignUp = async () => {
    const { firstName, lastName, email, phone, password } = signupForm;
    try {
      const data = await signUp({
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phone,
        password,
      });

      // 🔥 Open OTP Modal
      setSignupEmail(email);
      setShowOtpModal(true);
      toast.success(data);
      // ✅ CLEAR SIGNUP FORM
      setSignupForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
      });
    } catch (err) {
      toast.error(getErrorMessage(err, "Signup failed"));
    }
  };

  const handleVerifyOtp = async (otp) => {
    try {
      const data = await verifyAPI({
        email: signupEmail,
        otp,
      });

      setShowOtpModal(false);
      setActiveTab("signin");
      router.push("/");
    } catch (err) {
      toast.error(getErrorMessage(err, "Invalid OTP"));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          {/* Tabs */}
          <div className="grid grid-cols-2 border border-gray-400 rounded-lg overflow-hidden mb-8">
            <button
              onClick={() => setActiveTab("signin")}
              className={`py-2 font-medium transition ${activeTab === "signin"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground hover:bg-muted"
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`py-2 font-medium transition ${activeTab === "signup"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground hover:bg-muted"
                }`}
            >
              Sign Up
            </button>
          </div>

          {/* Sign In */}
          {activeTab === "signin" && (
            <LoginForm
              form={signinForm}
              setForm={setSigninForm}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              onSubmit={handleSignIn}
            />
          )}

          {/* Sign Up */}
          {activeTab === "signup" && (
            <SignupForm
              form={signupForm}
              setForm={setSignupForm}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              onSubmit={handleSignUp}
            />
          )}
        </div>
        <VerifyOtpModal
          isOpen={showOtpModal}
          email={signupEmail}
          onClose={() => setShowOtpModal(false)}
          onVerify={handleVerifyOtp}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Page;
