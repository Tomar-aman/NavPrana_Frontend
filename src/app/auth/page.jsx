"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import VerifyOtpModal from "./VerifyOtpModal";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginUser, signupUser, verifyOtp } from "@/redux/features/authSlice";
import { Leaf } from "lucide-react";

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
    if (signinLoading) return;

    try {
      setSigninLoading(true);

      await dispatch(loginUser(signinForm)).unwrap();

      toast.success("Login successful");
      router.push("/");
    } catch (err) {
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

      toast.success("Account verified! You're now logged in.");
      setShowOtpModal(false);
      router.push("/");
    } catch {
      toast.error("Invalid OTP");
    }
  };

  return (
    <div className="flex flex-col">
      <main className="flex-1 flex items-center justify-center pt-32 pb-20 px-4">
        <div className="w-full max-w-md">

          {/* Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-3">
              <Leaf size={24} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">NavPrana</h1>
            <p className="text-sm text-muted-foreground mt-1">Pure wellness, naturally delivered</p>
          </div>

          {/* Tabs */}
          <div className="bg-gray-100 rounded-xl p-1 mb-6">
            <div className="grid grid-cols-2 gap-1">
              {["signin", "signup"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative py-2.5 text-sm font-medium rounded-lg transition-all cursor-pointer ${activeTab === tab
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {tab === "signin" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Sign In */}
            {activeTab === "signin" && (
              <motion.div
                key="signin"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
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
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
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
