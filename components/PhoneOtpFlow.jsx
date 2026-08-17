"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, ShieldCheck, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import {
  sendPhoneOtp,
  confirmPhoneOtp,
  toE164,
  isValidMobile,
  phoneAuthErrorMessage,
  resetRecaptcha,
  isFirebaseConfigured,
} from "@/lib/firebasePhoneAuth";

/**
 * The two-step SMS OTP flow, shared by every place that needs a verified phone
 * number: phone login, signup, guest checkout and the profile page.
 *
 * It owns only the Firebase half of the job. Once the code checks out it hands
 * the caller the Firebase ID token and the number in E.164, and the caller
 * decides what that proof is for — signing in, or attaching to an account.
 *
 * @param onVerified  async (idToken, e164) => void — throw to keep the OTP step
 *                    open with an error, e.g. when the API rejects the token.
 */
const PhoneOtpFlow = ({
  onVerified,
  initialPhone = "",
  lockPhone = false,
  submitLabel = "Send OTP",
  compact = false,
}) => {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState(String(initialPhone || "").replace(/\D/g, "").slice(-10));
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [confirmation, setConfirmation] = useState(null);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef([]);

  // Drop the invisible reCAPTCHA widget when the flow unmounts, otherwise the
  // next mount tries to render a second one into the same container.
  useEffect(() => () => resetRecaptcha(), []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (step === "otp") setTimeout(() => inputRefs.current[0]?.focus(), 80);
  }, [step]);

  const e164 = toE164(phone);

  const handleSend = async () => {
    if (sending) return;
    if (!isFirebaseConfigured) {
      return setError("Phone sign-in is not available right now.");
    }
    if (!isValidMobile(phone)) {
      return setError("Enter a valid 10-digit mobile number.");
    }

    setError("");
    setSending(true);
    try {
      const result = await sendPhoneOtp(e164);
      setConfirmation(result);
      setOtp(["", "", "", "", "", ""]);
      setStep("otp");
      setCooldown(30);
    } catch (err) {
      setError(phoneAuthErrorMessage(err, "Could not send the OTP. Please try again."));
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async (code) => {
    if (verifying || !confirmation) return;
    setError("");
    setVerifying(true);
    try {
      const idToken = await confirmPhoneOtp(confirmation, code);
      await onVerified(idToken, e164);
    } catch (err) {
      // Anything the caller throws is already customer-facing; Firebase codes
      // get translated. Either way we stay on the OTP step so they can retry.
      setError(
        typeof err === "string"
          ? err
          : phoneAuthErrorMessage(err, "Could not verify that OTP. Please try again."),
      );
      setVerifying(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    const code = next.join("");
    if (code.length === 6) handleVerify(code);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = Array.from({ length: 6 }, (_, i) => pasted[i] || "");
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    if (pasted.length === 6) handleVerify(pasted);
  };

  const errorBox = error ? (
    <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
      {error}
    </div>
  ) : null;

  /* ---------- STEP 1: PHONE ---------- */
  if (step === "phone") {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
            Mobile Number
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <Phone size={15} className="text-gray-500" />
              </div>
              <span className="text-sm text-muted-foreground">+91</span>
            </div>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              autoComplete="tel-national"
              disabled={lockPhone}
              placeholder="9876543210"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, ""));
                if (error) setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className={`w-full pl-24 pr-4 py-3 border rounded-xl text-sm outline-none transition
                focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-50
                ${error ? "border-red-400" : "border-gray-200"}`}
            />
          </div>
          {!compact && (
            <p className="text-xs text-muted-foreground mt-1.5">
              We&apos;ll text you a 6-digit code. Standard SMS rates may apply.
            </p>
          )}
        </div>

        {errorBox}

        <button
          type="button"
          onClick={handleSend}
          disabled={sending}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground
            flex items-center justify-center gap-2 text-sm font-medium
            disabled:opacity-70 hover:bg-primary/90 transition cursor-pointer shadow-sm"
        >
          {sending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending OTP...
            </>
          ) : (
            <>
              {submitLabel}
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    );
  }

  /* ---------- STEP 2: OTP ---------- */
  return (
    <div className="space-y-4">
      {!compact && (
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <ShieldCheck size={28} className="text-primary" />
          </div>
        </div>
      )}

      <p className="text-sm text-center text-muted-foreground">
        Enter the 6-digit code sent to
        <br />
        <span className="font-medium text-foreground">{e164}</span>
      </p>

      <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={digit}
            disabled={verifying}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-11 h-12 border border-gray-200 rounded-xl text-center text-lg font-semibold
              outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20
              disabled:bg-gray-50"
          />
        ))}
      </div>

      {errorBox}

      <button
        type="button"
        onClick={() => handleVerify(otp.join(""))}
        disabled={otp.join("").length < 6 || verifying}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground
          flex items-center justify-center gap-2 text-sm font-medium
          disabled:opacity-70 hover:bg-primary/90 transition cursor-pointer shadow-sm"
      >
        {verifying ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify OTP"
        )}
      </button>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            setStep("phone");
            setError("");
            setConfirmation(null);
            resetRecaptcha();
          }}
          disabled={verifying}
          className="text-xs font-medium text-muted-foreground hover:text-foreground
            transition cursor-pointer flex items-center gap-1 disabled:opacity-50"
        >
          <ArrowLeft size={13} />
          {lockPhone ? "Back" : "Change number"}
        </button>

        {cooldown > 0 ? (
          <p className="text-xs text-muted-foreground">
            Resend in <span className="font-medium text-foreground">{cooldown}s</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleSend}
            disabled={sending || verifying}
            className="text-xs font-medium text-primary hover:text-primary/80 transition cursor-pointer disabled:opacity-50"
          >
            {sending ? "Sending..." : "Resend OTP"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PhoneOtpFlow;
