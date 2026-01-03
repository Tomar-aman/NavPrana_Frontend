"use client";

import { useState } from "react";
import { X, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

const ResetPasswordModal = ({ isOpen, email, onClose, onSubmit }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!password || !confirmPassword) {
      toast.warn("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    onSubmit(password, confirmPassword);

    // clear fields
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-sm p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-black"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold text-center mb-2">Reset Password</h2>

        <p className="text-sm text-center text-gray-500 mb-4">
          Reset password for <span className="font-medium">{email}</span>
        </p>

        {/* Password */}
        <div className="relative mb-3">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            className="w-full pl-10 pr-10 py-2 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative mb-4">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full pl-10 pr-10 py-2 border rounded-lg"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
