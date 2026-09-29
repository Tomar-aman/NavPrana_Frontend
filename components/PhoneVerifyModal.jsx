"use client";

import { useEffect, useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import WhatsAppIcon from "./icons/WhatsAppIcon";
import { toast } from "sonner";
import {
  otpErrorMessage,
  sendPhoneVerificationApi,
  verifyPhoneApi,
} from "@/services/auth/phoneOtp";
import { normalizePhone, sanitizePhoneInput, validatePhone } from "@/lib/validators";
import NavPranaLoader from "./NavPranaLoader";

const RESEND_SECONDS = 60;

/**
 * Verify the signed-in customer's phone with a WhatsApp code. Used from the
 * profile page and at checkout, where COD needs a verified number.
 *
 * The number stays editable: a Google sign-up may have none, and a typo is
 * the very thing this exists to catch. It is only saved once the code checks
 * out, and `onVerified` receives the updated profile.
 */
const PhoneVerifyModal = ({
  isOpen,
  initialPhone = "",
  onClose,
  onVerified,
  title = "Verify your phone",
  description = "We'll send an OTP to this number on WhatsApp.",
}) => {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    setStep("phone");
    setPhone(initialPhone || "");
    setCode("");
    setError("");
  }, [isOpen, initialPhone]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  if (!isOpen) return null;

  const sendCode = async () => {
    const phoneError = validatePhone(phone);
    if (phoneError) return setError(phoneError);
    setError("");
    setLoading(true);
    try {
      await sendPhoneVerificationApi(normalizePhone(phone));
      toast.success("OTP sent on your WhatsApp", { icon: <WhatsAppIcon size={18} /> });
      setStep("code");
      setCode("");
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      // A code went out seconds ago: let them type that one.
      if (err?.response?.status === 429 && step === "phone") {
        setStep("code");
      }
      setError(otpErrorMessage(err, "Could not send OTP"));
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    if (code.length !== 6) return setError("Enter the 6-digit OTP");
    setError("");
    setLoading(true);
    try {
      const profile = await verifyPhoneApi(normalizePhone(phone), code);
      toast.success("Phone number verified");
      onVerified?.(profile);
    } catch (err) {
      setError(otpErrorMessage(err, "Invalid code"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative shadow-xl">
        {loading && <NavPranaLoader />}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center">
            <WhatsAppIcon size={30} />
          </div>
        </div>

        <h2 className="text-lg font-semibold text-center text-foreground mb-1">{title}</h2>
        <p className="text-sm text-center text-muted-foreground mb-5">
          {step === "phone" ? (
            description
          ) : (
            <>
              <span className="inline-flex items-center gap-1.5">
                <WhatsAppIcon size={15} /> OTP sent on your WhatsApp
              </span>
              <br />
              <span className="font-medium text-foreground">+91 {normalizePhone(phone)}</span>
            </>
          )}
        </p>

        {step === "phone" ? (
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="98765 43210"
            value={phone}
            onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
            onKeyDown={(e) => e.key === "Enter" && sendCode()}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        ) : (
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="6-digit OTP"
            maxLength={6}
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            onKeyDown={(e) => e.key === "Enter" && verify()}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-lg font-semibold tracking-[0.4em] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        )}

        {error && <p className="text-xs text-red-500 mt-2 text-center">{error}</p>}

        <button
          onClick={step === "phone" ? sendCode : verify}
          disabled={loading}
          className="w-full mt-4 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
        >
          {step === "phone" ? "Send OTP" : "Verify"}
        </button>

        {step === "code" && (
          <div className="flex justify-between text-xs mt-4">
            <button
              onClick={() => { setStep("phone"); setError(""); }}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <ArrowLeft size={13} /> Change number
            </button>
            {cooldown > 0 ? (
              <span className="text-muted-foreground">Resend in {cooldown}s</span>
            ) : (
              <button onClick={sendCode} className="font-medium text-primary hover:text-primary/80 cursor-pointer">
                Resend OTP
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneVerifyModal;
