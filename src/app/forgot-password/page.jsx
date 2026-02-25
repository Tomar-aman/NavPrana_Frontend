"use client";

import { useState } from "react";
import {
  Mail, KeyRound, ArrowLeft, CheckCircle2, Send,
  ShieldCheck, Eye, EyeOff, Leaf, Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  resetPassword, resetPasswordState,
  sendForgotOtp, verifyForgotOtp,
} from "@/redux/features/passwordSlice";

const STEPS = { EMAIL: 1, OTP: 2, RESET: 3 };
const stepMeta = [
  { id: STEPS.EMAIL, label: "Email" },
  { id: STEPS.OTP, label: "Verify" },
  { id: STEPS.RESET, label: "Reset" },
];

export default function Page() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { step, email: reduxEmail } = useSelector((s) => s.password);
  const router = useRouter();

  /* ── handlers ── */
  const onSubmitEmail = async () => {
    if (!email) { toast.warning("Please enter your email"); return; }
    try {
      setLoading(true);
      await dispatch(sendForgotOtp({ email })).unwrap();
      toast.success("OTP sent to your email");
    } catch (err) { toast.error(err || "Failed to send OTP"); }
    finally { setLoading(false); }
  };

  const onSubmitOTP = async () => {
    if (otp.length !== 6) { toast.warning("Enter a valid 6-digit OTP"); return; }
    try {
      setLoading(true);
      await dispatch(verifyForgotOtp({ email: reduxEmail || email, otp })).unwrap();
      toast.success("OTP verified!");
    } catch (err) { toast.error(err || "Invalid OTP"); }
    finally { setLoading(false); }
  };

  const onSubmitReset = async () => {
    if (!password || !confirmPassword) { toast.warning("Please fill all fields"); return; }
    if (password.length < 8) { toast.warning("Password must be at least 8 characters"); return; }
    if (password !== confirmPassword) { toast.error("Passwords do not match"); return; }
    try {
      setLoading(true);
      await dispatch(resetPassword({ email: reduxEmail || email, password, confirm_password: confirmPassword })).unwrap();
      toast.success("Password reset successful!");
      dispatch(resetPasswordState());
      router.push("/signin");
    } catch (err) { toast.error(err); }
    finally { setLoading(false); }
  };

  /* ── per-step content ── */
  const stepIcon = {
    [STEPS.EMAIL]: <Mail size={28} className="text-primary" />,
    [STEPS.OTP]: <KeyRound size={28} className="text-primary" />,
    [STEPS.RESET]: <ShieldCheck size={28} className="text-primary" />,
  };
  const stepTitle = {
    [STEPS.EMAIL]: "Forgot Password?",
    [STEPS.OTP]: "Check your email",
    [STEPS.RESET]: "Create new password",
  };
  const stepSub = {
    [STEPS.EMAIL]: "Enter your email and we'll send you a one-time password.",
    [STEPS.OTP]: `Enter the 6-digit code sent to ${reduxEmail || email}`,
    [STEPS.RESET]: "Almost done — choose a strong new password.",
  };

  /* ── input class helper ── */
  const inputCls = (hasError = false) =>
    `w-full pl-11 pr-4 py-3.5 rounded-xl text-sm border transition-all outline-none bg-white
     ${hasError
      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/15"}`;

  return (
    <div className="min-h-screen flex">

      {/* ═══════════ LEFT PANEL — brand ═══════════ */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] bg-primary px-12 py-14 relative overflow-hidden">

        {/* decorative blobs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 -right-10 w-48 h-48 rounded-full bg-white/5" />

        {/* logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <Leaf size={20} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">NavPrana Organics</span>
        </div>

        {/* center copy */}
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white/90 text-xs font-medium">
            <Sparkles size={13} /> Pure • Organic • Trusted
          </div>
          <h2 className="text-4xl font-bold text-white leading-snug">
            Secure your<br />account in<br />seconds.
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-xs">
            Follow the simple steps to verify your identity and set a new password for your NavPrana account.
          </p>

          {/* step pills */}
          <div className="space-y-3 pt-2">
            {[
              { n: "01", label: "Enter your email address" },
              { n: "02", label: "Verify with the OTP sent to you" },
              { n: "03", label: "Set your new password" },
            ].map((s) => (
              <div key={s.n} className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-xs font-bold text-white">{s.n}</span>
                <span className="text-white/80 text-sm">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* footer quote */}
        <p className="relative z-10 text-white/40 text-xs">
          "Pure wellness, naturally delivered."
        </p>
      </div>

      {/* ═══════════ RIGHT PANEL — form ═══════════ */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-gray-50/60">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Leaf size={16} className="text-primary" />
          </div>
          <span className="font-bold text-foreground">NavPrana Organics</span>
        </div>

        <div className="w-full max-w-[400px]">

          {/* Step indicator */}
          <div className="flex items-center mb-10">
            {stepMeta.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex items-center gap-2 shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step > s.id ? "bg-primary text-white"
                      : step === s.id ? "bg-primary text-white ring-4 ring-primary/20"
                        : "bg-gray-200 text-gray-400"
                    }`}>
                    {step > s.id ? <CheckCircle2 size={14} /> : s.id}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block transition-colors ${step >= s.id ? "text-primary" : "text-gray-400"
                    }`}>{s.label}</span>
                </div>
                {i < stepMeta.length - 1 && (
                  <div className={`flex-1 h-px mx-3 transition-all duration-500 ${step > s.id ? "bg-primary" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Icon + heading */}
          <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
              {stepIcon[step]}
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1.5">
              {stepTitle[step]}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {stepSub[step]}
            </p>
          </div>

          {/* ── FORMS ── */}
          <AnimatePresence mode="wait">

            {/* Step 1: Email */}
            {step === STEPS.EMAIL && (
              <motion.div key="email"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type="email" placeholder="you@example.com"
                        className={inputCls()}
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onSubmitEmail()} />
                    </div>
                  </div>
                  <button onClick={onSubmitEmail} disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm shadow-primary/30">
                    {loading ? <span className="animate-pulse">Sending…</span> : <><Send size={15} /> Send OTP</>}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: OTP */}
            {step === STEPS.OTP && (
              <motion.div key="otp"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">One-Time Password</label>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type="text" inputMode="numeric" maxLength={6}
                        placeholder="• • • • • •"
                        className={`${inputCls()} text-center tracking-[0.6em] font-bold text-lg`}
                        value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        onKeyDown={(e) => e.key === "Enter" && onSubmitOTP()} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 text-center">Check inbox and spam folder</p>
                  </div>
                  <button onClick={onSubmitOTP} disabled={loading || otp.length !== 6}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm shadow-primary/30">
                    {loading ? <span className="animate-pulse">Verifying…</span> : <><CheckCircle2 size={15} /> Verify OTP</>}
                  </button>
                  <button onClick={() => dispatch(resetPasswordState())}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-xl hover:bg-gray-100 transition-all">
                    <ArrowLeft size={14} /> Change email
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Reset */}
            {step === STEPS.RESET && (
              <motion.div key="reset"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">New Password</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type={showPassword ? "text" : "password"} placeholder="Min. 8 characters"
                        className={inputCls()} value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-foreground transition-colors">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Confirm Password</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type={showConfirm ? "text" : "password"} placeholder="Re-enter your password"
                        className={inputCls(confirmPassword.length > 0 && confirmPassword !== password)}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onSubmitReset()} />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-foreground transition-colors">
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {confirmPassword.length > 0 && confirmPassword !== password && (
                      <p className="text-xs text-red-500 mt-1.5">Passwords do not match</p>
                    )}
                  </div>
                  <button onClick={onSubmitReset} disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm shadow-primary/30 mt-2">
                    {loading ? <span className="animate-pulse">Resetting…</span> : <><ShieldCheck size={15} /> Reset Password</>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back to sign in */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <Link href="/signin"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
