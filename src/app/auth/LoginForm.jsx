"use client";

import { memo, useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Phone } from "lucide-react";
import GoogleSignInButton from "./GoogleSignInButton";
import { validatePhone } from "@/lib/validators";

const LoginForm = memo(
  ({
    form,
    setForm,
    showPassword,
    setShowPassword,
    onSubmit,
    loading,
    error,
    onUseOtp,
  }) => {
    const [errors, setErrors] = useState({});

    /* ---------- VALIDATION ---------- */
    const validate = () => {
      const newErrors = {};

      // One field takes either: anything with an "@" is read as an email,
      // anything else as a mobile number.
      const id = form.email?.trim() || "";
      if (!id) {
        newErrors.email = "Enter your email or phone number";
      } else if (id.includes("@")) {
        if (!/^\S+@\S+\.\S+$/.test(id)) newErrors.email = "Enter a valid email address";
      } else {
        const phoneError = validatePhone(id);
        if (phoneError) newErrors.email = phoneError;
      }

      if (!form.password) {
        newErrors.password = "Password is required";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
      if (!validate()) return;
      onSubmit();
    };

    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-foreground mb-1">Welcome back</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Sign in to your account to continue
        </p>

        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
              Email or phone number
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <Mail size={15} className="text-gray-500" />
              </div>
              <input
                type="text"
                autoComplete="username"
                placeholder="you@example.com or 98765 43210"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                className={`w-full pl-14 pr-4 py-3 border rounded-xl text-sm outline-none transition focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors.email ? "border-red-400" : "border-gray-200"
                  }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <Lock size={15} className="text-gray-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                className={`w-full pl-14 pr-12 py-3 border rounded-xl text-sm outline-none transition focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors.password ? "border-red-400" : "border-gray-200"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary hover:text-primary/80 transition"
            >
              Forgot password?
            </Link>
          </div>

          {/* API Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold">!</span>
              </div>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground
              flex items-center justify-center gap-2 text-sm
              disabled:opacity-70 hover:bg-primary/90 transition font-medium cursor-pointer shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* WhatsApp OTP */}
          <button
            type="button"
            onClick={onUseOtp}
            className="w-full py-3 rounded-xl border border-gray-200 text-foreground flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
          >
            <Phone size={16} className="text-primary" />
            Continue with phone number
          </button>

          {/* Google Sign-In */}
          <GoogleSignInButton />
        </div>
      </div>
    );
  },
);

export default LoginForm;
