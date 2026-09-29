"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./LoginForm";
import OtpLoginForm from "./OtpLoginForm";
import SignupForm from "./SignupForm";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginUser, signupUser } from "@/redux/features/authSlice";
import { setUserData, trackCompleteRegistration } from "@/lib/meta-pixel";
import { normalizePhone } from "@/lib/validators";
import { Leaf } from "lucide-react";

// Shared auth form — used by both /signin and /signup pages
const AuthForm = ({ initialTab = "signin" }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [signinLoading, setSigninLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [signupErrors, setSignupErrors] = useState({});

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

  // "password" or "otp" (WhatsApp) on the Sign In tab.
  const [signinMode, setSigninMode] = useState("password");

  // Where to go after signing in, e.g. checkout sends a shopper here with
  // ?next=/checkout. Read once on mount, because switching tabs rewrites the
  // URL without it. Only same-site paths, so the link cannot bounce people to
  // another site.
  const nextPath = useRef("/");
  useEffect(() => {
    const next = new URLSearchParams(window.location.search).get("next");
    if (next && next.startsWith("/") && !next.startsWith("//")) nextPath.current = next;
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Navigate to the clean URL for the chosen tab
    router.replace(tab === "signup" ? "/signup" : "/signin", { scroll: false });
  };

  const handleOtpSuccess = (res) => {
    if (res.is_new_user) {
      toast.success("Account created! Welcome to NavPrana.");
      setUserData({
        email: res.email,
        phone_number: res.phone_number,
        first_name: res.first_name,
        last_name: res.last_name,
      });
      trackCompleteRegistration("whatsapp");
    } else {
      toast.success("Login successful");
    }
    router.push(nextPath.current);
  };

  const handleSignIn = async () => {
    if (signinLoading) return;
    try {
      setSigninLoading(true);
      await dispatch(loginUser(signinForm)).unwrap();
      toast.success("Login successful");
      router.push(nextPath.current);
    } catch (err) {
      setLoginError(err?.message || err?.error || "Invalid email/phone or password");
    } finally {
      setSigninLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (signupLoading) return;
    try {
      setSignupLoading(true);
      setSignupErrors({});
      // Cleaned again rather than trusted from the form: the blur that trims
      // the email and strips the country code never fires if the visitor
      // submits straight from a field with the keyboard.
      const email = signupForm.email.trim();
      const firstName = signupForm.firstName.trim();
      const lastName = signupForm.lastName.trim();
      const phone = normalizePhone(signupForm.phone);
      // No OTP step any more: the account is active and signed in at once.
      // Customers were dropping off waiting for the mail; the email can be
      // verified later from the profile page.
      await dispatch(
        signupUser({
          first_name: firstName,
          last_name: lastName,
          email,
          phone_number: phone,
          password: signupForm.password,
        }),
      ).unwrap();
      toast.success("Account created! Welcome to NavPrana.");
      // 📊 Meta Pixel — attach the new customer's details BEFORE the event, so
      // the signup itself is matchable. ProfileContext only loads on a full
      // page load, so without this the pixel stays anonymous for this session.
      // Normalised the same way the account was created, or Meta hashes a
      // different string here than it does everywhere else and the new customer
      // fails to match against their own later events.
      setUserData({
        email,
        phone_number: phone,
        first_name: firstName,
        last_name: lastName,
      });
      trackCompleteRegistration("email");
      router.push(nextPath.current);
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
                {signinMode === "otp" ? (
                  <OtpLoginForm
                    onSuccess={handleOtpSuccess}
                    onUsePassword={() => setSigninMode("password")}
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
                    onUseOtp={() => setSigninMode("otp")}
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
                />
                {/* OTP login creates the account for a new number, no password needed. */}
                <button
                  onClick={() => {
                    setSigninMode("otp");
                    handleTabChange("signin");
                  }}
                  className="w-full mt-3 text-center text-xs font-medium text-primary hover:text-primary/80 transition cursor-pointer"
                >
                  Sign up with phone number instead
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AuthForm;
