"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import VerifyOtpModal from "./VerifyOtpModal";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginUser, signupUser, verifyOtp } from "@/redux/features/authSlice";

const Page = () => {
  const [activeTab, setActiveTab] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const [signinLoading, setSigninLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [signupErrors, setSignupErrors] = useState({});

  const dispatch = useDispatch();
  const router = useRouter();
  // const { loadProfile } = useProfile();

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
    if (signinLoading) return; // ✅ extra safety

    try {
      setSigninLoading(true); // ✅ FIRST LINE

      await dispatch(loginUser(signinForm)).unwrap();

      toast.success("Login successful");
      router.push("/");
    } catch (err) {
      // toast.error(err || "Login failed");
      const message = err?.message || err?.error || "Invalid email or password";

      setLoginError(message);
    } finally {
      setSigninLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (signupLoading) return;
    try {
      setSignupLoading(true);
      setSignupErrors({});
      await dispatch(
        signupUser({
          first_name: signupForm.firstName,
          last_name: signupForm.lastName,
          email: signupForm.email,
          phone_number: signupForm.phone,
          password: signupForm.password,
        }),
      ).unwrap();

      setSignupEmail(signupForm.email);
      setShowOtpModal(true);
      toast.success("OTP sent");
    } catch (err) {
      if (typeof err === "object" && err !== null) {
        // Map backend field names to form field names
        const fieldMap = {
          first_name: "firstName",
          last_name: "lastName",
          email: "email",
          phone_number: "phone",
          password: "password",
        };
        const mapped = {};
        for (const [key, val] of Object.entries(err)) {
          const formKey = fieldMap[key] || key;
          mapped[formKey] = Array.isArray(val) ? val[0] : val;
        }
        setSignupErrors(mapped);
      } else {
        toast.error(err || "Signup failed");
      }
    } finally {
      setSignupLoading(false);
    }
  };

  const handleVerifyOtp = async (otp) => {
    try {
      await dispatch(
        verifyOtp({
          email: signupEmail,
          otp,
        }),
      ).unwrap();

      toast.success("Account verified");
      setShowOtpModal(false);
      setActiveTab("signin");
      router.push("/");
    } catch {
      toast.error("Invalid OTP");
    }
  };

  return (
    <div className=" flex flex-col">
      <main className="flex-1 flex items-center justify-center pt-40 pb-30 px-4">
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

          <AnimatePresence mode="wait">
            {/* Sign In */}
            {activeTab === "signin" && (
              <motion.div
                key="signin"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <LoginForm
                  form={signinForm}
                  setForm={setSigninForm}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  onSubmit={handleSignIn}
                  loading={signinLoading}
                  error={loginError}
                />
              </motion.div>
            )}

            {/* Sign Up */}
            {activeTab === "signup" && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <SignupForm
                  form={signupForm}
                  setForm={setSignupForm}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  onSubmit={handleSignUp}
                  loading={signupLoading}
                  apiErrors={signupErrors}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <VerifyOtpModal
          isOpen={showOtpModal}
          email={signupEmail}
          onClose={() => setShowOtpModal(false)}
          onVerify={handleVerifyOtp}
        />
      </main>
    </div>
  );
};

export default Page;
