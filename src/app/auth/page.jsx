"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import Header from "@/../components/Header";
import Footer from "@/../components/Footer";
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
    try {
      await dispatch(loginUser(signinForm)).unwrap();
      toast.success("Login successful");
      router.push("/");
    } catch (err) {
      toast.error(err);
    }
  };
  // const handleSignIn = async () => {
  //   try {
  //     const data = await loginApi(signinForm);
  //     // await loadProfile(); // 🔥 THIS LINE FIXES EVERYTHING
  //     toast.success(data.message || "Login successful");
  //     setUser(data);
  //     // 🔥 SAVE TOKEN IN COOKIE (if loginApi does not already do it)
  //     if (data?.access) {
  //       setAuthToken(data.access);
  //     }

  //     // ✅ NAVIGATE TO HOME
  //     router.push("/");

  //     setSigninForm({
  //       email: "",
  //       password: "",
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     toast.error(err?.response?.data?.message || "Login failed");
  //   }
  // };

  // const handleSignUp = async () => {
  //   const { firstName, lastName, email, phone, password } = signupForm;
  //   try {
  //     const data = await signUp({
  //       first_name: firstName,
  //       last_name: lastName,
  //       email,
  //       phone_number: phone,
  //       password,
  //     });

  //     // 🔥 Open OTP Modal
  //     setSignupEmail(email);
  //     setShowOtpModal(true);
  //     toast.success(data);
  //     console.log(data);
  //     // ✅ CLEAR SIGNUP FORM
  //     setSignupForm({
  //       firstName: "",
  //       lastName: "",
  //       email: "",
  //       phone: "",
  //       password: "",
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     toast.error(err.response?.data || "Signup failed");
  //   }
  // };

  const handleSignUp = async () => {
    try {
      await dispatch(
        signupUser({
          first_name: signupForm.firstName,
          last_name: signupForm.lastName,
          email: signupForm.email,
          phone_number: signupForm.phone,
          password: signupForm.password,
        })
      ).unwrap();

      setSignupEmail(signupForm.email);
      setShowOtpModal(true);
      toast.success("OTP sent");
    } catch (err) {
      toast.error(err);
    }
  };

  const handleVerifyOtp = async (otp) => {
    try {
      await dispatch(
        verifyOtp({
          email: signupEmail,
          otp,
        })
      ).unwrap();

      toast.success("Account verified");
      setShowOtpModal(false);
      setActiveTab("signin");
      router.push("/");
    } catch {
      toast.error("Invalid OTP");
    }
  };

  // const handleVerifyOtp = async (otp) => {
  //   try {
  //     const data = await verifyAPI({
  //       email: signupEmail,
  //       otp,
  //     });

  //     console.log(data);
  //     setShowOtpModal(false);
  //     setActiveTab("signin");
  //     router.push("/");
  //   } catch (err) {
  //     console.log("Invalid OTP");
  //   }
  // };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          {/* Tabs */}
          <div className="grid grid-cols-2 border border-gray-400 rounded-lg overflow-hidden mb-8">
            <button
              onClick={() => setActiveTab("signin")}
              className={`py-2 font-medium transition ${
                activeTab === "signin"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground hover:bg-muted"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`py-2 font-medium transition ${
                activeTab === "signup"
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
