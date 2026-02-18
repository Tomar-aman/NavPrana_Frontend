"use client";

import { useState } from "react";
import { X, Eye, EyeOff, Lock, Loader2 } from "lucide-react";

const ChangePasswordModal = ({
  isOpen,
  oldPassword,
  newPassword,
  confirmPassword,
  setOldPassword,
  setNewPassword,
  setConfirmPassword,
  showOldPassword,
  showNewPassword,
  showConfirmPassword,
  setShowOldPassword,
  setShowNewPassword,
  setShowConfirmPassword,
  onClose,
  onSubmit,
}) => {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};

    if (!oldPassword.trim()) errs.old = "Current password is required";

    if (!newPassword.trim()) errs.new = "New password is required";
    else if (newPassword.length < 8)
      errs.new = "Password must be at least 8 characters";

    if (!confirmPassword.trim()) errs.confirm = "Please confirm your password";
    else if (newPassword !== confirmPassword)
      errs.confirm = "Passwords do not match";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSubmit();
    } catch {
      // handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  const PasswordField = ({
    label,
    value,
    onChange,
    show,
    onToggle,
    placeholder,
    error,
    errorKey,
  }) => (
    <div>
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      <div className="relative mt-1">
        <Lock
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (errors[errorKey])
              setErrors({ ...errors, [errorKey]: undefined });
          }}
          placeholder={placeholder}
          className={`w-full pl-9 pr-10 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition ${error ? "border-red-300" : "border-gray-200"
            }`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}
    >
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Lock size={18} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Change Password
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition cursor-pointer"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            <PasswordField
              label="Current Password *"
              value={oldPassword}
              onChange={setOldPassword}
              show={showOldPassword}
              onToggle={() => setShowOldPassword(!showOldPassword)}
              placeholder="Enter current password"
              error={errors.old}
              errorKey="old"
            />

            <PasswordField
              label="New Password *"
              value={newPassword}
              onChange={setNewPassword}
              show={showNewPassword}
              onToggle={() => setShowNewPassword(!showNewPassword)}
              placeholder="Min 8 characters"
              error={errors.new}
              errorKey="new"
            />

            <PasswordField
              label="Confirm Password *"
              value={confirmPassword}
              onChange={setConfirmPassword}
              show={showConfirmPassword}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
              placeholder="Re-enter new password"
              error={errors.confirm}
              errorKey="confirm"
            />
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 text-sm font-medium rounded-xl bg-primary text-white hover:bg-primary/90 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
