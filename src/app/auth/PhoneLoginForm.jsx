"use client";

import { Smartphone, ArrowLeft } from "lucide-react";
import PhoneOtpFlow from "../../../components/PhoneOtpFlow";

/**
 * Passwordless sign-in: the number is verified over SMS by Firebase, and the
 * resulting token is exchanged for our own JWT. A number we have never seen
 * gets an account created for it, the same as Google sign-in does.
 */
const PhoneLoginForm = ({ onVerified, onBack }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <div className="flex items-center gap-3 mb-1">
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Smartphone size={17} className="text-primary" />
      </div>
      <h2 className="text-xl font-semibold text-foreground">Sign in with phone</h2>
    </div>
    <p className="text-sm text-muted-foreground mb-6">
      No password needed — we&apos;ll text you a one-time code.
    </p>

    <PhoneOtpFlow onVerified={onVerified} submitLabel="Send OTP" />

    <button
      type="button"
      onClick={onBack}
      className="w-full mt-4 text-xs font-medium text-muted-foreground hover:text-foreground
        transition cursor-pointer flex items-center justify-center gap-1"
    >
      <ArrowLeft size={13} />
      Use email and password instead
    </button>
  </div>
);

export default PhoneLoginForm;
