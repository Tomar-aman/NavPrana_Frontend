"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import VerifyOtpModal from "./VerifyOtpModal";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import PhoneLoginForm from "./PhoneLoginForm";
import PhoneVerifyModal from "../../../components/PhoneVerifyModal";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginUser, signupUser, verifyOtp, phoneLogin } from "@/redux/features/authSlice";
import { trackCompleteRegistration } from "@/lib/meta-pixel";
import { Leaf } from "lucide-react";

// Shared auth form — used by both /signin and /signup pages
const AuthForm = ({ initialTab = "signin" }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  // "password" or "phone" — only meaningful while the signin tab is showing
  const [signinMode, setSigninMode] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showPhoneVerify, setShowPhoneVerify] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const [signinLoading, setSigninLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [signupErrors, setSignupErrors] = useState({});
  // Firebase proof that the number typed on the signup form is really theirs.
  // Held with the number it was issued for, so editing the field invalidates it.
  const [verifiedPhone, setVerifiedPhone] = useState({ number: "", token: "" });

  const dispatch = useDispatch();
  const router = useRouter();

  const [signinForm, setSigninForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  // Only counts while the number in the field still matches the one verified.
  const isPhoneVerified =
    Boolean(verifiedPhone.token) && verifiedPhone.number === signupForm.phone;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSigninMode("password");
    // Navigate to the clean URL for the chosen tab
    router.replace(tab === "signup" ? "/signup" : "/signin", { scroll: false });
  };

  /* Passwordless sign-in — Firebase proved the number, our API issues the JWT */
  const handlePhoneLogin = async (idToken) => {
    const res = await dispatch(phoneLogin(idToken)).unwrap();
    if (res?.is_new_user) trackCompleteRegistration("phone");
    toast.success(res?.message || "Login successful");
    router.push("/");
  };

  const handleSignIn = async () => {
    if (signinLoading) return;
    try {
      setSigninLoading(true);
      await dispatch(loginUser(signinForm)).unwrap();
      toast.success("Login successful");
      router.push("/");
    } catch (err) {
      setLoginError(err?.message || err?.error || "Invalid email or password");
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
          // Only sent once the number has actually been verified over SMS
          ...(isPhoneVerified ? { firebase_id_token: verifiedPhone.token } : {}),
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
          firebase_id_token: "phone",
        };
        // The API's standardized error shape names the offending field
        // separately; anything else is a plain field -> message map.
        if (err.field_name || err.message) {
          const formKey = fieldMap[err.field_name] || err.field_name;
          if (formKey) setSignupErrors({ [formKey]: err.message });
          else toast.error(err.message || "Signup failed");
        } else {
          const mapped = {};
          for (const [key, val] of Object.entries(err)) {
            const formKey = fieldMap[key] || key;
            mapped[formKey] = Array.isArray(val) ? val[0] : val;
          }
          setSignupErrors(mapped);
        }
      } else {
        toast.error(err || "Signup failed");
      }
    } finally {
      setSignupLoading(false);
    }
  };

  const handleVerifyOtp = async (otp) => {
    try {
      await dispatch(verifyOtp({ email: signupEmail, otp })).unwrap();
      toast.success("Account verified! You're now logged in.");
      setShowOtpModal(false);
      // 📊 Meta Pixel — CompleteRegistration
      trackCompleteRegistration("email");
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
                  onClick={() => handleTabChange(tab)}
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
            {activeTab === "signin" && (
              <motion.div
                key="signin"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {signinMode === "phone" ? (
                  <PhoneLoginForm
                    onVerified={handlePhoneLogin}
                    onBack={() => setSigninMode("password")}
                  />
                ) : (
                  <LoginForm
                    form={signinForm}
                    setForm={setSigninForm}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    onSubmit={handleSignIn}
                    loading={signinLoading}
                    error={loginError}
                    onPhoneClick={() => {
                      setLoginError("");
                      setSigninMode("phone");
                    }}
                  />
                )}
              </motion.div>
            )}

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
                  phoneVerified={isPhoneVerified}
                  onVerifyPhone={() => setShowPhoneVerify(true)}
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

        <PhoneVerifyModal
          isOpen={showPhoneVerify}
          initialPhone={signupForm.phone}
          title="Verify your phone"
          subtitle="Confirm your number so we can reach you about your orders."
          onClose={() => setShowPhoneVerify(false)}
          onVerified={(idToken, e164) => {
            const national = e164.replace(/\D/g, "").slice(-10);
            setVerifiedPhone({ number: national, token: idToken });
            // Keep the form showing the number that was actually verified
            setSignupForm((prev) => ({ ...prev, phone: national }));
            setSignupErrors((prev) => ({ ...prev, phone: "" }));
            setShowPhoneVerify(false);
            toast.success("Phone number verified");
          }}
        />
      </main>
    </div>
  );
};

export default AuthForm;
