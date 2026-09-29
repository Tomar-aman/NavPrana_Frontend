"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Phone, KeyRound, User, Mail, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { otpLogin } from "@/redux/features/authSlice";
import WhatsAppIcon from "../../../components/icons/WhatsAppIcon";
import { otpErrorMessage, sendLoginOtpApi } from "@/services/auth/phoneOtp";
import { normalizePhone, sanitizePhoneInput, validateEmail, validatePhone } from "@/lib/validators";

const RESEND_SECONDS = 30;

const inputClass = (hasError) =>
  `w-full pl-14 pr-4 py-3 border rounded-xl text-sm outline-none transition focus:ring-2 focus:ring-primary/20 focus:border-primary ${hasError ? "border-red-400" : "border-gray-200"}`;

const Field = ({ label, icon: Icon, error, children }) => (
  <div>
    <label className="block text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
        <Icon size={15} className="text-gray-500" />
      </div>
      {children}
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

// Sign in (or sign up) with a code sent on WhatsApp. A number with no account
// gets one extra step asking for a name and email, then the account is created
// with the phone already verified — so COD works straight away.
const OtpLoginForm = ({ onSuccess, onUsePassword }) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState("phone"); // phone → code → details
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [details, setDetails] = useState({ firstName: "", lastName: "", email: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const sendCode = async () => {
    const phoneError = validatePhone(phone);
    if (phoneError) return setErrors({ phone: phoneError });
    setErrors({});
    setLoading(true);
    try {
      await sendLoginOtpApi(normalizePhone(phone));
      toast.success("OTP sent on your WhatsApp", { icon: <WhatsAppIcon size={18} /> });
      setStep("code");
      setCode("");
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      setErrors({ phone: otpErrorMessage(err, "Could not send OTP") });
    } finally {
      setLoading(false);
    }
  };

  const submit = async (withDetails) => {
    if (code.length !== 6) return setErrors({ code: "Enter the 6-digit OTP" });
    const payload = { phone_number: normalizePhone(phone), otp: code };
    if (withDetails) {
      const next = {};
      if (!details.firstName.trim()) next.firstName = "Enter your first name";
      const emailError = validateEmail(details.email, { required: false });
      if (emailError) next.email = emailError;
      if (Object.keys(next).length) return setErrors(next);
      Object.assign(payload, {
        first_name: details.firstName.trim(),
        last_name: details.lastName.trim(),
        email: details.email.trim(),
      });
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await dispatch(otpLogin(payload)).unwrap();
      if (res.needs_details) {
        setStep("details");
        return;
      }
      onSuccess(res);
    } catch (data) {
      if (data?.email) {
        setErrors({ email: data.email[0] });
      } else {
        const message = data?.message || data?.otp?.[0] || "Could not sign in";
        // A wrong or expired code is fixed on the code step, not the form.
        setStep("code");
        setErrors({ code: message });
      }
    } finally {
      setLoading(false);
    }
  };

  const primaryButton = (label, onClick) => (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full py-3 rounded-xl bg-primary text-primary-foreground flex items-center justify-center gap-2 text-sm disabled:opacity-70 hover:bg-primary/90 transition font-medium cursor-pointer shadow-sm"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{label}<ArrowRight size={16} /></>}
    </button>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-xl font-semibold text-foreground mb-1">
        {step === "details" ? "Almost there" : "Continue with phone number"}
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        {step === "phone" && "Enter your mobile number to get an OTP."}
        {step === "code" && (
          <span className="inline-flex flex-wrap items-center gap-1.5">
            <WhatsAppIcon size={16} /> OTP sent on your WhatsApp
            <span className="font-medium text-foreground">+91 {normalizePhone(phone)}</span>
          </span>
        )}
        {step === "details" && "Tell us your name to create your account. Add an email if you want order updates and invoices by mail."}
      </p>

      <div className="space-y-4">
        {step === "phone" && (
          <>
            <Field label="Mobile number" icon={Phone} error={errors.phone}>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
                onKeyDown={(e) => e.key === "Enter" && sendCode()}
                className={inputClass(errors.phone)}
              />
            </Field>
            {primaryButton("Send OTP", sendCode)}
          </>
        )}

        {step === "code" && (
          <>
            <Field label="OTP" icon={KeyRound} error={errors.code}>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="6-digit OTP"
                maxLength={6}
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                onKeyDown={(e) => e.key === "Enter" && submit(false)}
                className={`${inputClass(errors.code)} tracking-[0.3em] font-semibold`}
              />
            </Field>
            {primaryButton("Verify & continue", () => submit(false))}
            <div className="flex justify-between text-xs">
              <button
                onClick={() => { setStep("phone"); setErrors({}); }}
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
          </>
        )}

        {step === "details" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label="First name" icon={User} error={errors.firstName}>
                <input
                  autoComplete="given-name"
                  value={details.firstName}
                  onChange={(e) => setDetails({ ...details, firstName: e.target.value })}
                  className={inputClass(errors.firstName)}
                />
              </Field>
              <Field label="Last name" icon={User}>
                <input
                  autoComplete="family-name"
                  value={details.lastName}
                  onChange={(e) => setDetails({ ...details, lastName: e.target.value })}
                  className={inputClass(false)}
                />
              </Field>
            </div>
            <Field label="Email (optional)" icon={Mail} error={errors.email}>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={details.email}
                onChange={(e) => setDetails({ ...details, email: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && submit(true)}
                className={inputClass(errors.email)}
              />
            </Field>
            {primaryButton("Create account", () => submit(true))}
          </>
        )}

        <button
          onClick={onUsePassword}
          className="w-full text-center text-xs font-medium text-muted-foreground hover:text-foreground transition cursor-pointer"
        >
          Sign in with email & password instead
        </button>
      </div>
    </div>
  );
};

export default OtpLoginForm;
