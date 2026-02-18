"use client";

import { memo, useState } from "react";
import { Mail, Lock, User, Phone, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import GoogleSignInButton from "./GoogleSignInButton";

const SignupForm = memo(
  ({ form, setForm, showPassword, setShowPassword, onSubmit, loading, apiErrors = {} }) => {
    const [errors, setErrors] = useState({});

    // Merge client-side and API errors (API errors take priority)
    const allErrors = { ...errors, ...apiErrors };

    /* ---------- VALIDATION ---------- */
    const validate = () => {
      const newErrors = {};

      if (!form.firstName?.trim())
        newErrors.firstName = "First name is required";

      if (!form.lastName?.trim()) newErrors.lastName = "Last name is required";

      if (!form.email?.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
        newErrors.email = "Enter a valid email address";
      }

      if (!form.phone?.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^[0-9]{10}$/.test(form.phone)) {
        newErrors.phone = "Phone must be 10 digits";
      }

      if (!form.password) {
        newErrors.password = "Password is required";
      } else if (form.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
      if (!validate()) return;
      onSubmit();
    };

    const clearError = (field) => {
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-foreground mb-1">Create account</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Join us to start your wellness journey
        </p>

        <div className="space-y-4">
          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            {/* First Name */}
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                First Name
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <User size={15} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  className={`w-full pl-14 pr-3 py-3 border rounded-xl text-sm outline-none transition focus:ring-2 focus:ring-primary/20 focus:border-primary ${allErrors.firstName ? "border-red-400" : "border-gray-200"
                    }`}
                  placeholder="First name"
                  value={form.firstName}
                  onChange={(e) => {
                    setForm({ ...form, firstName: e.target.value });
                    clearError("firstName");
                  }}
                />
              </div>
              {allErrors.firstName && (
                <p className="text-xs text-red-500 mt-1">{allErrors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                Last Name
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <User size={15} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Last name"
                  className={`w-full pl-14 pr-3 py-3 border rounded-xl text-sm outline-none transition focus:ring-2 focus:ring-primary/20 focus:border-primary ${allErrors.lastName ? "border-red-400" : "border-gray-200"
                    }`}
                  value={form.lastName}
                  onChange={(e) => {
                    setForm({ ...form, lastName: e.target.value });
                    clearError("lastName");
                  }}
                />
              </div>
              {allErrors.lastName && (
                <p className="text-xs text-red-500 mt-1">{allErrors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
              Email
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <Mail size={15} className="text-gray-500" />
              </div>
              <input
                type="email"
                placeholder="you@example.com"
                className={`w-full pl-14 pr-4 py-3 border rounded-xl text-sm outline-none transition focus:ring-2 focus:ring-primary/20 focus:border-primary ${allErrors.email ? "border-red-400" : "border-gray-200"
                  }`}
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  clearError("email");
                }}
              />
            </div>
            {allErrors.email && (
              <p className="text-xs text-red-500 mt-1">{allErrors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <Phone size={15} className="text-gray-500" />
              </div>
              <input
                placeholder="10-digit mobile number"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                className={`w-full pl-14 pr-4 py-3 border rounded-xl text-sm outline-none transition focus:ring-2 focus:ring-primary/20 focus:border-primary ${allErrors.phone ? "border-red-400" : "border-gray-200"
                  }`}
                value={form.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setForm({ ...form, phone: val });
                  clearError("phone");
                }}
              />
            </div>
            {allErrors.phone && (
              <p className="text-xs text-red-500 mt-1">{allErrors.phone}</p>
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
                placeholder="Minimum 8 characters"
                className={`w-full pl-14 pr-12 py-3 border rounded-xl text-sm outline-none transition focus:ring-2 focus:ring-primary/20 focus:border-primary ${allErrors.password ? "border-red-400" : "border-gray-200"
                  }`}
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  clearError("password");
                }}
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
            {allErrors.password && (
              <p className="text-xs text-red-500 mt-1">{allErrors.password}</p>
            )}
          </div>

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
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Google Sign-In */}
          <GoogleSignInButton />

          <p className="text-xs text-center text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link href="/terms-of-service" className="text-primary hover:underline">
              Terms
            </Link>{" "}
            &{" "}
            <Link href="/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    );
  },
);

export default SignupForm;
