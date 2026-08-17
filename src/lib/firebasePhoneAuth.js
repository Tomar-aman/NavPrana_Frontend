"use client";

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "./firebase";

export { isFirebaseConfigured };

let verifier = null;
let containerId = null;
let containerSeq = 0;

/**
 * Tear the verifier down along with the element it rendered into.
 *
 * Removing the whole element matters: grecaptcha keeps its own record of every
 * container it has drawn into, and neither verifier.clear() nor emptying
 * innerHTML clears that record. Rendering into the same element a second time
 * throws "reCAPTCHA has already been rendered in this element" — which is what
 * a retry or a Resend OTP does.
 */
export const resetRecaptcha = () => {
  try {
    verifier?.clear();
  } catch {
    // Already torn down — nothing to clean up.
  }
  verifier = null;
  if (containerId) {
    document.getElementById(containerId)?.remove();
    containerId = null;
  }
};

/**
 * Always builds a fresh verifier in a brand-new container. An invisible
 * reCAPTCHA token is single-use, so reusing the previous one — exactly what
 * "Resend OTP" would do — fails the captcha check on the second send.
 */
const getVerifier = async () => {
  resetRecaptcha();

  containerSeq += 1;
  containerId = `firebase-recaptcha-container-${containerSeq}`;
  const el = document.createElement("div");
  el.id = containerId;
  el.style.display = "none";
  document.body.appendChild(el);

  verifier = new RecaptchaVerifier(getFirebaseAuth(), containerId, {
    size: "invisible",
  });
  await verifier.render();
  return verifier;
};

/** '9876543210' or '+91 98765 43210' -> '+919876543210'. */
export const toE164 = (phone, dialCode = "+91") => {
  const raw = String(phone || "").trim();
  if (raw.startsWith("+")) return "+" + raw.slice(1).replace(/\D/g, "");
  const digits = raw.replace(/\D/g, "");
  return `${dialCode}${digits.slice(-10)}`;
};

export const isValidMobile = (phone) =>
  /^[6-9]\d{9}$/.test(String(phone || "").replace(/\D/g, "").slice(-10));

const FIREBASE_ERRORS = {
  "auth/invalid-phone-number": "That doesn't look like a valid phone number.",
  "auth/missing-phone-number": "Enter your phone number first.",
  "auth/quota-exceeded": "Too many OTP requests right now. Please try again later.",
  "auth/too-many-requests": "Too many attempts. Please wait a few minutes and try again.",
  "auth/invalid-verification-code": "That OTP is incorrect. Please check and try again.",
  "auth/code-expired": "That OTP has expired. Request a new one.",
  "auth/captcha-check-failed": "Verification check failed. Please reload and try again.",
  "auth/network-request-failed": "Network problem — check your connection and try again.",
  "auth/operation-not-allowed": "Phone sign-in is not enabled for this site yet.",
  "auth/billing-not-enabled": "Phone sign-in is not available right now.",
  "auth/unauthorized-domain": "This site is not authorised for phone sign-in.",
};

export const phoneAuthErrorMessage = (err, fallback = "Something went wrong. Please try again.") => {
  // The mapped copy above hides which of several causes actually fired, which
  // makes console-side problems (provider off, key restricted, quota) hard to
  // tell apart. Keep the raw code visible while developing.
  if (process.env.NODE_ENV !== "production") {
    console.error("[phone-auth]", err?.code, err?.message, err);
  }
  return FIREBASE_ERRORS[err?.code] || err?.message?.replace(/^Firebase:\s*/, "") || fallback;
};

/**
 * Send an OTP and return the confirmation handle needed to check it.
 * The verifier is discarded on failure so the next attempt starts clean.
 */
export const sendPhoneOtp = async (e164) => {
  const auth = getFirebaseAuth();
  try {
    const appVerifier = await getVerifier();
    return await signInWithPhoneNumber(auth, e164, appVerifier);
  } catch (err) {
    resetRecaptcha();
    throw err;
  }
};

/**
 * Check the code and return the Firebase ID token our API verifies.
 *
 * The Firebase session is signed out immediately afterwards — the token has
 * already been captured, and leaving a second logged-in identity around would
 * only be one more thing to keep in sync with our own auth.
 */
export const confirmPhoneOtp = async (confirmationResult, code) => {
  const credential = await confirmationResult.confirm(code);
  const idToken = await credential.user.getIdToken();
  resetRecaptcha();
  try {
    await signOut(getFirebaseAuth());
  } catch {
    // Not being signed out of Firebase is harmless — we never read that session.
  }
  return idToken;
};
