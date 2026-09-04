"use client";

import { memo, useState } from "react";
import { Mail, Lock, User, Phone, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import GoogleSignInButton from "./GoogleSignInButton";
import {
  normalizePhone,
  sanitizePhoneInput,
  validateEmail,
  validatePhone,
} from "@/lib/validators";

/**
 * One rule per field, read by both the blur check and the Create Account check
 * so a field cannot look accepted while typing and then be rejected on submit.
 *
 * Format checks come from the shared validators — the same ones guest checkout
 * runs, so an address or number accepted in one place is accepted in the other.
 * The "required" wording stays here to match the rest of this form.
 */
const FIELD_RULES = {
  firstName: (v) => (String(v || "").trim() ? "" : "First name is required"),
  lastName: (v) => (String(v || "").trim() ? "" : "Last name is required"),
  email: (v) =>
    String(v || "").trim() ? validateEmail(v) : "Email is required",
  phone: (v) =>
    String(v || "").trim() ? validatePhone(v) : "Phone number is required",
  password: (v) => {
    if (!v) return "Password is required";
    if (v.length < 8) return "Password must be at least 8 characters";
    return "";
  },
};

const SignupForm = memo(
  ({ form, setForm, showPassword, setShowPassword, onSubmit, loading, apiErrors = {} }) => {
    const [errors, setErrors] = useState({});
    // Fields the visitor has finished with once. Checking only these keeps the
    // form from turning red before anything has been filled in — every field
    // here is empty on arrival, and flagging them all up front reads as a
    // telling off rather than as help.
    const [touched, setTouched] = useState({});

    /* ---------- VALIDATION ---------- */
    const validate = () => {
      const newErrors = {};
      for (const [field, rule] of Object.entries(FIELD_RULES)) {
        const message = rule(form[field]);
        if (message) newErrors[field] = message;
      }
      setErrors(newErrors);
      // Everything has now been reported on, so a later fix to any field shows
      // its result live rather than waiting for a second submit.
      setTouched(
        Object.fromEntries(Object.keys(FIELD_RULES).map((f) => [f, true])),
      );
      return Object.keys(newErrors).length === 0;
    };

    // Checked on every render for touched fields, so an error clears the moment
    // the value becomes valid instead of hanging around until the next blur.
    const liveErrors = {};
    for (const [field, rule] of Object.entries(FIELD_RULES)) {
      if (touched[field]) {
        const message = rule(form[field]);
        if (message) liveErrors[field] = message;
      }
    }

    // API errors take priority — they are what actually stopped the signup, and
    // they say things the client cannot know ("this email is already
    // registered"). Merged by falling through empty values rather than by
    // spreading: clearError blanks a field to "", which would otherwise spread
    // straight over the live error and leave a bad value looking accepted.
    // apiErrors is the base so keys with no field of their own still surface.
    const allErrors = { ...apiErrors };
    for (const field of Object.keys(FIELD_RULES)) {
      allErrors[field] =
        apiErrors[field] || errors[field] || liveErrors[field] || "";
    }

    const handleSubmit = () => {
      if (!validate()) return;
      onSubmit();
    };

    const clearError = (field) => {
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

    const markTouched = (field) =>
      setTouched((prev) => ({ ...prev, [field]: true }));

    const handleEmailBlur = () => {
      markTouched("email");
      // Pasted addresses routinely carry a trailing space, which survives all
      // the way to a verification mail that never arrives.
      const trimmed = String(form.email || "").trim();
      if (trimmed !== form.email) setForm({ ...form, email: trimmed });
    };

    const handlePhoneBlur = () => {
      markTouched("phone");
      // "+91 98765 43210" and "09876543210" are the same number — settle that
      // here so the account is created with ten bare digits either way.
      const normalized = normalizePhone(form.phone);
      if (normalized !== form.phone) setForm({ ...form, phone: normalized });
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
                  onBlur={() => markTouched("firstName")}
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
                  onBlur={() => markTouched("lastName")}
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
                onBlur={handleEmailBlur}
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
                inputMode="tel"
                // Wide enough for a country code typed in full ("+91 0987…");
                // handlePhoneBlur strips it back to ten digits on the way out.
                maxLength={14}
                className={`w-full pl-14 pr-4 py-3 border rounded-xl text-sm outline-none transition focus:ring-2 focus:ring-primary/20 focus:border-primary ${allErrors.phone ? "border-red-400" : "border-gray-200"
                  }`}
                value={form.phone}
                onBlur={handlePhoneBlur}
                onChange={(e) => {
                  // Anything that cannot belong to a number is dropped as it is
                  // typed, so the field never holds a value rejected for a
                  // reason the visitor cannot see. A pasted "+91 …" survives,
                  // which the old digits-only strip silently mangled.
                  setForm({ ...form, phone: sanitizePhoneInput(e.target.value) });
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
                onBlur={() => markTouched("password")}
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
