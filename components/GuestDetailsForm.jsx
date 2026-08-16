"use client";

import Link from "next/link";
import { User, MapPin } from "lucide-react";

/**
 * Declared at module scope on purpose — defining it inside GuestDetailsForm
 * would remount every input on each keystroke and drop focus mid-typing.
 */
const TextField = ({ id, label, value, onChange, error, ...rest }) => (
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
      }`}
      {...rest}
    />
    {error && <p className="text-red-500 text-[11px] mt-1">{error}</p>}
  </div>
);

/**
 * Contact + delivery details collected on checkout when nobody is signed in.
 * Submitting these creates a silent guest account — no password, no OTP.
 */
const GuestDetailsForm = ({ values, onChange, errors = {} }) => {
  const set = (field) => (e) => onChange({ ...values, [field]: e.target.value });

  const fieldProps = (field, id, label, extra = {}) => ({
    id,
    label,
    value: values[field],
    onChange: set(field),
    error: errors[field],
    ...extra,
  });

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
            })}
          />
          <TextField
            {...fieldProps("phone_number", "guest-phone", "Phone", {
              type: "tel",
              placeholder: "9876543210",
              inputMode: "numeric",
              autoComplete: "tel",
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
          <div className="grid sm:grid-cols-3 gap-3">
            <TextField
              {...fieldProps("city", "guest-city", "City", {
                placeholder: "Morena",
                autoComplete: "address-level2",
              })}
            />
            <TextField
              {...fieldProps("state", "guest-state", "State", {
                placeholder: "Madhya Pradesh",
                autoComplete: "address-level1",
              })}
            />
            <TextField
              {...fieldProps("postal_code", "guest-pin", "PIN Code", {
                placeholder: "476001",
                inputMode: "numeric",
                autoComplete: "postal-code",
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDetailsForm;
