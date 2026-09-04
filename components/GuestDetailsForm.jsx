"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  User,
  MapPin,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { usePincodeLookup } from "@/hooks/usePincodeLookup";
import {
  normalizePhone,
  sanitizePhoneInput,
  validateEmail,
  validatePhone,
} from "@/lib/validators";

/**
 * Declared at module scope on purpose — defining it inside GuestDetailsForm
 * would remount every input on each keystroke and drop focus mid-typing.
 */
const TextField = ({ id, label, value, onChange, error, hint, ...rest }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-[11px] uppercase tracking-wider font-medium text-muted-foreground mb-1.5"
    >
      {label}
    </label>
    <input
      id={id}
      value={value || ""}
      onChange={onChange}
      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition focus:ring-1 ${
        error
          ? "border-red-300 focus:border-red-400 focus:ring-red-200"
          : "border-gray-200 focus:border-primary focus:ring-primary/20"
      } ${rest.readOnly ? "bg-gray-50/80 text-gray-600" : ""}`}
      {...rest}
    />
    {error ? (
      <p className="text-red-500 text-[11px] mt-1">{error}</p>
    ) : (
      hint || null
    )}
  </div>
);

/**
 * Contact + delivery details collected on checkout when nobody is signed in.
 * Submitting these creates a silent guest account — no password, no OTP.
 */
const GuestDetailsForm = ({
  values,
  onChange,
  errors = {},
  onPincodeStatus,
}) => {
  const set = (field) => (e) => onChange({ ...values, [field]: e.target.value });

  const fieldProps = (field, id, label, extra = {}) => ({
    id,
    label,
    value: values[field],
    onChange: set(field),
    error: errors[field],
    ...extra,
  });

  // The PIN resolves a few hundred ms after the keystroke, so the `values` this
  // render closed over may be stale by then — merge onto the latest instead.
  const valuesRef = useRef(values);
  valuesRef.current = values;

  // Contact fields are checked as the shopper leaves them rather than only on
  // Place Order, so a typo in the address they'll receive the order at surfaces
  // while they are still looking at it. Nothing is flagged before it has been
  // filled in once — a red field the moment you tab past it reads as a telling
  // off, and this form is the first thing a guest sees.
  const [touched, setTouched] = useState({});
  const markTouched = (field) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const contactError = (field, validate) => {
    // Errors raised by the failed submit win: they are what stopped the order.
    if (errors[field]) return errors[field];
    if (!touched[field]) return "";
    return validate(values[field]) || "";
  };

  const emailError = contactError("email", validateEmail);
  const phoneError = contactError("phone_number", validatePhone);

  const handleEmailBlur = () => {
    markTouched("email");
    // Pasted addresses routinely carry a trailing space, which survives all the
    // way to a bounced confirmation mail.
    const trimmed = String(values.email || "").trim();
    if (trimmed !== values.email) {
      onChange({ ...valuesRef.current, email: trimmed });
    }
  };

  const handlePhoneBlur = () => {
    markTouched("phone_number");
    // "+91 98765-43210" and "09876543210" are the same number — settle that
    // here so the backend and the courier only ever see ten bare digits.
    const normalized = normalizePhone(values.phone_number);
    if (normalized !== values.phone_number) {
      onChange({ ...valuesRef.current, phone_number: normalized });
    }
  };

  const okHint = (text) => (
    <p className="flex items-center gap-1 text-green-600 text-[11px] mt-1">
      <CheckCircle2 size={11} />
      {text}
    </p>
  );

  const { status: pinStatus, details: pinDetails } = usePincodeLookup(
    values.postal_code,
    (match) =>
      onChange({ ...valuesRef.current, city: match.city, state: match.state }),
  );

  // Checkout blocks the order on a PIN the directory does not know. Reported
  // from an effect, not mid-render — the parent stores it in state.
  const statusRef = useRef(onPincodeStatus);
  statusRef.current = onPincodeStatus;
  useEffect(() => {
    statusRef.current?.(pinStatus);
  }, [pinStatus]);

  const pinHint = () => {
    if (pinStatus === "loading")
      return (
        <p className="flex items-center gap-1 text-gray-500 text-[11px] mt-1">
          <Loader2 size={11} className="animate-spin" />
          Checking PIN code…
        </p>
      );
    if (pinStatus === "resolved")
      return (
        <p className="flex items-center gap-1 text-green-600 text-[11px] mt-1">
          <CheckCircle2 size={11} />
          {pinDetails.city}, {pinDetails.state}
        </p>
      );
    if (pinStatus === "not_found")
      return (
        <p className="flex items-center gap-1 text-red-500 text-[11px] mt-1">
          <AlertTriangle size={11} />
          This PIN code does not exist
        </p>
      );
    if (pinStatus === "unreachable")
      return (
        <p className="flex items-center gap-1 text-amber-600 text-[11px] mt-1">
          <AlertTriangle size={11} />
          Could not verify — fill city and state yourself
        </p>
      );
    return null;
  };

  return (
    <div className="space-y-5">
      {/* Contact */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <User size={15} className="text-primary" />
            </div>
            <h2 className="text-base font-semibold">Your Details</h2>
          </div>
          <Link
            href="/signin"
            className="text-xs font-medium text-primary hover:underline"
          >
            Have an account? Sign in
          </Link>
        </div>
        <p className="text-xs text-muted-foreground mb-4 sm:ml-10">
          No account needed — we&apos;ll email your order confirmation.
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          <TextField
            {...fieldProps("first_name", "guest-first-name", "First Name", {
              placeholder: "Aman",
              autoComplete: "given-name",
            })}
          />
          <TextField
            {...fieldProps("last_name", "guest-last-name", "Last Name (optional)", {
              placeholder: "Tomar",
              autoComplete: "family-name",
            })}
          />
          <TextField
            {...fieldProps("email", "guest-email", "Email", {
              type: "email",
              placeholder: "you@example.com",
              autoComplete: "email",
              error: emailError,
              onBlur: handleEmailBlur,
              hint:
                touched.email && !emailError && values.email
                  ? okHint("Order confirmation goes here")
                  : null,
            })}
          />
          <TextField
            {...fieldProps("phone_number", "guest-phone", "Phone", {
              type: "tel",
              placeholder: "9876543210",
              inputMode: "tel",
              autoComplete: "tel",
              error: phoneError,
              onBlur: handlePhoneBlur,
              // Anything that cannot belong to a number is dropped as it is
              // typed, so the field cannot hold a value the check will reject
              // for a reason the shopper can't see.
              onChange: (e) =>
                onChange({
                  ...valuesRef.current,
                  phone_number: sanitizePhoneInput(e.target.value),
                }),
              hint:
                touched.phone_number && !phoneError && values.phone_number
                  ? okHint("Delivery updates come here")
                  : null,
            })}
          />
        </div>
      </div>

      {/* Address */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
            <MapPin size={15} className="text-green-600" />
          </div>
          <h2 className="text-base font-semibold">Delivery Address</h2>
        </div>

        <div className="space-y-3">
          <TextField
            {...fieldProps("address_line1", "guest-addr1", "Address Line 1", {
              placeholder: "House / street",
              autoComplete: "address-line1",
            })}
          />
          <TextField
            {...fieldProps("address_line2", "guest-addr2", "Address Line 2 (optional)", {
              placeholder: "Landmark, area",
              autoComplete: "address-line2",
            })}
          />
          {/* PIN first — city and state are filled from it, out of the India
              Post directory, so the address matches what the courier reads. */}
          <div className="grid sm:grid-cols-3 gap-3">
            <TextField
              {...fieldProps("postal_code", "guest-pin", "PIN Code", {
                placeholder: "476001",
                inputMode: "numeric",
                maxLength: 6,
                autoComplete: "postal-code",
                hint: pinHint(),
                onChange: (e) =>
                  onChange({
                    ...valuesRef.current,
                    postal_code: e.target.value.replace(/\D/g, "").slice(0, 6),
                  }),
              })}
            />
            <TextField
              {...fieldProps("city", "guest-city", "City", {
                placeholder: "Fills from PIN",
                autoComplete: "address-level2",
              })}
            />
            <TextField
              {...fieldProps("state", "guest-state", "State", {
                placeholder: "Fills from PIN",
                autoComplete: "address-level1",
                // A confirmed PIN settles the state — the field shoppers most
                // often get wrong, with nothing left to decide once it is known.
                readOnly:
                  pinStatus === "resolved" && values.state === pinDetails?.state,
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDetailsForm;
