"use client";

import { memo, useState } from "react";
import { Mail, Lock, User, Phone, Eye, EyeOff, Loader2 } from "lucide-react";
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

    return (
      <div className="border border-gray-400 rounded-xl shadow-sm bg-card p-6">
        <h2 className="text-2xl font-bold text-center mb-1">Create Account</h2>
        <p className="text-center text-muted-foreground mb-6">
          Join us to start your wellness journey
        </p>

        <div className="space-y-4">
          {/* First & Last Name */}
          <div className="flex flex-col md:flex-row gap-2">
            {/* First Name */}
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                First Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none ${allErrors.firstName ? "border-red-500" : "border-primary-border"
                    }`}
                  placeholder="Enter First name"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                />
              </div>
              {allErrors.firstName && (
                <p className="text-xs text-red-600 mt-1">{allErrors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Last Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Enter Last name"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none ${allErrors.lastName ? "border-red-500" : "border-primary-border"
                    }`}
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                />
              </div>
              {allErrors.lastName && (
                <p className="text-xs text-red-600 mt-1">{allErrors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="you@example.com"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none ${allErrors.email ? "border-red-500" : "border-primary-border"
                  }`}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            {allErrors.email && (
              <p className="text-xs text-red-600 mt-1">{allErrors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="10-digit mobile number"
                type="tel"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none ${allErrors.phone ? "border-red-500" : "border-primary-border"
                  }`}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            {allErrors.phone && (
              <p className="text-xs text-red-600 mt-1">{allErrors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none ${allErrors.password ? "border-red-500" : "border-primary-border"
                  }`}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {allErrors.password && (
              <p className="text-xs text-red-600 mt-1">{allErrors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2 rounded-lg bg-primary text-primary-foreground
              flex items-center justify-center gap-2
              disabled:opacity-70 hover:bg-primary/90 transition font-medium cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          {/* Google Sign-In */}
          <GoogleSignInButton />

          <p className="text-xs text-center text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link href="/terms-of-service" className="text-primary">
              Terms
            </Link>{" "}
            &{" "}
            <Link href="/privacy-policy" className="text-primary">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    );
  },
);

export default SignupForm;
