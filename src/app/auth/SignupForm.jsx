"use client";

import { memo } from "react";
import { Mail, Lock, User, Phone, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

const SignupForm = memo(
  ({ form, setForm, showPassword, setShowPassword, onSubmit, loading }) => {
    return (
      <div className="border rounded-xl shadow-sm bg-card p-6">
        <h2 className="text-2xl font-bold text-center mb-1">Create Account</h2>
        <p className="text-center text-muted-foreground mb-6">
          Join us to start your wellness journey
        </p>

        <div className="space-y-4">
          <div className=" flex-row md:flex gap-2 ">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="John"
                  className="w-full pl-10 pr-3 py-2 border border-gray-400 rounded-lg"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      firstName: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Doe"
                  className="w-full pl-10 pr-3 py-2 border border-gray-400 rounded-lg"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      lastName: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full pl-10 pr-3 py-2 border border-gray-400 rounded-lg"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="tel"
                placeholder="9876543210"
                className="w-full pl-10 pr-3 py-2 border border-gray-400 rounded-lg"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2 border border-gray-400 rounded-lg"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
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
          </div>

          {/* Submit Button */}
          <button
            onClick={onSubmit}
            disabled={loading}
            className="w-full py-2 rounded-lg bg-primary text-primary-foreground
                     flex items-center justify-center gap-2
                     disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer hover:bg-primary/90 transition font-medium"
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

          <p className="text-xs text-center text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link
              href="/terms-of-service"
              className="text-primary hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="text-primary hover:underline"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    );
  },
);

export default SignupForm;
