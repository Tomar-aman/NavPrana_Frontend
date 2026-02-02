"use client";

import { memo, useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

const LoginForm = memo(
  ({
    form,
    setForm,
    showPassword,
    setShowPassword,
    onSubmit,
    loading,
    error,
  }) => {
    const [errors, setErrors] = useState({});

    /* ---------- VALIDATION ---------- */
    const validate = () => {
      const newErrors = {};

      if (!form.email?.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
        newErrors.email = "Enter a valid email address";
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
      <div className="border border-gray-400 rounded-xl shadow-sm bg-card p-6">
        <h2 className="text-2xl font-bold text-center mb-1">Welcome Back</h2>
        <p className="text-center text-muted-foreground mb-6">
          Sign in to your account to continue
        </p>

        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* API Error */}
          {error && (
            <div className="bg-red-50 border border-red-500/30 text-red-600 text-sm rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2 rounded-lg bg-primary text-primary-foreground
              flex items-center justify-center gap-2
              disabled:opacity-70 hover:bg-primary/90 transition font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </div>
      </div>
    );
  },
);

export default LoginForm;
