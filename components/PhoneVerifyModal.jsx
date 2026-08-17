"use client";

import { X } from "lucide-react";
import PhoneOtpFlow from "./PhoneOtpFlow";

/**
 * Modal shell around PhoneOtpFlow, for the places that verify a number without
 * leaving the page they are on — signup, checkout and the profile page.
 */
const PhoneVerifyModal = ({
  isOpen,
  onClose,
  onVerified,
  initialPhone = "",
  lockPhone = false,
  title = "Verify your phone",
  subtitle = "Confirm your number so we can reach you about your order.",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold text-foreground mb-1 pr-6">{title}</h2>
        <p className="text-sm text-muted-foreground mb-5">{subtitle}</p>

        <PhoneOtpFlow
          onVerified={onVerified}
          initialPhone={initialPhone}
          lockPhone={lockPhone}
          submitLabel="Send OTP"
          compact
        />
      </div>
    </div>
  );
};

export default PhoneVerifyModal;
