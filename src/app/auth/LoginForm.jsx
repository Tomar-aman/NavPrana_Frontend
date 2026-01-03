"use client";

import { memo } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const LoginForm = memo(
  ({ form, setForm, showPassword, setShowPassword, onSubmit }) => {
    return (
      <div className="border border-gray-400 rounded-xl shadow-sm bg-card p-6">
        <h2 className="text-2xl font-bold text-center mb-1">Welcome Back</h2>
        <p className="text-center text-muted-foreground mb-6">
          Sign in to your account to continue
        </p>

        <div className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="signin-email"
              className="block text-sm font-medium mb-1"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                id="signin-email"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="w-full pl-10 pr-3 py-2 border border-gray-400 rounded-lg bg-background focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="signin-password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                id="signin-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                className="w-full pl-10 pr-10 py-2 border border-gray-400 rounded-lg bg-background focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
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

          {/* Button */}
          <button
            className="w-full py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium"
            onClick={onSubmit}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }
);

export default LoginForm;
