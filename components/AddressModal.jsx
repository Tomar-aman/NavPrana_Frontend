"use client";

import { useRef, useState } from "react";
import { X, MapPin, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { usePincodeLookup } from "@/hooks/usePincodeLookup";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh",
  // Union territories — a PIN lookup landing on one of these has to find a
  // matching option here, or the auto-filled state silently comes back blank.
  "Chandigarh", "Puducherry", "Andaman & Nicobar Islands", "Lakshadweep",
  "Dadra & Nagar Haveli and Daman & Diu",
];

const AddressModal = ({
  isOpen,
  formData,
  setFormData,
  onClose,
  onSubmit,
  isEdit,
}) => {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // A resolved PIN lands a few hundred ms after the keystroke, by which time
  // the captured `formData` can be stale — merge onto the latest one instead.
  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  // Editing a saved address starts with a city the shopper may have refined by
  // hand, so only their retyping the PIN gives us leave to replace it.
  const pinTouched = useRef(false);

  const applyPincode = (match) => {
    const current = formDataRef.current || {};
    const overwrite = pinTouched.current;
    setFormData({
      ...current,
      city: overwrite || !current.city?.trim() ? match.city : current.city,
      state: overwrite || !current.state?.trim() ? match.state : current.state,
    });
    setErrors((prev) => ({
      ...prev,
      postal_code: undefined,
      city: undefined,
      state: undefined,
    }));
  };

  const { status: pinStatus, details: pinDetails } = usePincodeLookup(
    formData?.postal_code,
    applyPincode,
  );

  if (!isOpen) return null;

  // A PIN the directory confirms settles the state outright — it is the field
  // shoppers most often get wrong, and there is nothing left to choose. Only
  // locked once the two agree, so a saved address that disagrees with its PIN
  // stays fixable.
  const stateLocked =
    pinStatus === "resolved" &&
    pinDetails?.state === formData.state &&
    INDIAN_STATES.includes(formData.state);

  const validate = () => {
    const errs = {};

    if (!formData.address_line1?.trim())
      errs.address_line1 = "Address is required";
    else if (formData.address_line1.trim().length < 5)
      errs.address_line1 = "Address is too short";

    if (!formData.city?.trim()) errs.city = "City is required";

    if (!formData.state?.trim()) errs.state = "State is required";

    if (!formData.postal_code?.trim())
      errs.postal_code = "PIN code is required";
    else if (!/^\d{6}$/.test(formData.postal_code.trim()))
      errs.postal_code = "Enter valid 6-digit PIN";
    else if (pinStatus === "not_found")
      errs.postal_code = "This PIN code does not exist";
    else if (pinStatus === "loading")
      errs.postal_code = "Checking PIN code — one moment";
    // "unreachable" is deliberately not blocked: the directory being down says
    // nothing about the PIN, so it must not stand between us and an order.

    if (!formData.country?.trim()) errs.country = "Country is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSubmit();
      onClose();
    } catch {
      // error handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  const inputClass = (field) =>
    `w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition ${errors[field] ? "border-red-300" : "border-gray-200"
    }`;

  const pinHint = () => {
    if (errors.postal_code) return null;
    if (pinStatus === "loading")
      return (
        <p className="flex items-center gap-1 text-gray-500 text-xs mt-1">
          <Loader2 size={12} className="animate-spin" />
          Checking PIN code…
        </p>
      );
    if (pinStatus === "resolved")
      return (
        <p className="flex items-center gap-1 text-green-600 text-xs mt-1">
          <CheckCircle2 size={12} />
          {pinDetails.city}, {pinDetails.state}
        </p>
      );
    if (pinStatus === "not_found")
      return (
        <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
          <AlertTriangle size={12} />
          This PIN code does not exist
        </p>
      );
    if (pinStatus === "unreachable")
      return (
        <p className="flex items-center gap-1 text-amber-600 text-xs mt-1">
          <AlertTriangle size={12} />
          Could not verify PIN — fill city and state yourself
        </p>
      );
    return null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}
    >
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              {isEdit ? "Edit Address" : "Add Address"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition cursor-pointer"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
          {/* Address Line 1 */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Address Line 1 *
            </label>
            <input
              className={`mt-1 ${inputClass("address_line1")}`}
              placeholder="House no, street, locality"
              value={formData.address_line1 || ""}
              onChange={(e) => handleChange("address_line1", e.target.value)}
            />
            {errors.address_line1 && (
              <p className="text-red-500 text-xs mt-1">{errors.address_line1}</p>
            )}
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Address Line 2
            </label>
            <input
              className={`mt-1 ${inputClass("address_line2")}`}
              placeholder="Landmark, area (optional)"
              value={formData.address_line2 || ""}
              onChange={(e) => handleChange("address_line2", e.target.value)}
            />
          </div>

          {/* PIN & Country — the PIN is asked before city and state because it
              is what fills them, straight from the India Post directory. */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                PIN Code *
              </label>
              <input
                className={`mt-1 ${inputClass("postal_code")}`}
                placeholder="6-digit PIN"
                maxLength={6}
                inputMode="numeric"
                autoComplete="postal-code"
                value={formData.postal_code || ""}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                  pinTouched.current = true;
                  handleChange("postal_code", val);
                }}
              />
              {errors.postal_code && (
                <p className="text-red-500 text-xs mt-1">{errors.postal_code}</p>
              )}
              {pinHint()}
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Country
              </label>
              <input
                className={`mt-1 ${inputClass("country")} bg-gray-50/80 text-gray-500`}
                value={formData.country || "India"}
                disabled
              />
            </div>
          </div>

          {/* City & State — auto-filled from the PIN above */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                City *
              </label>
              <input
                className={`mt-1 ${inputClass("city")}`}
                placeholder="Fills from PIN code"
                value={formData.city || ""}
                onChange={(e) => handleChange("city", e.target.value)}
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                State *
              </label>
              <select
                className={`mt-1 ${inputClass("state")} appearance-none ${stateLocked ? "bg-gray-50/80 text-gray-600" : "bg-white"
                  }`}
                value={formData.state || ""}
                disabled={stateLocked}
                onChange={(e) => handleChange("state", e.target.value)}
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
              )}
            </div>
          </div>

          {/* Default checkbox */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.is_default || false}
              onChange={(e) =>
                setFormData({ ...formData, is_default: e.target.checked })
              }
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
            />
            <span className="text-sm text-foreground">
              Set as default address
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-2.5 text-sm font-medium rounded-xl bg-primary text-white hover:bg-primary/90 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {isEdit ? "Updating..." : "Saving..."}
              </>
            ) : isEdit ? (
              "Update Address"
            ) : (
              "Save Address"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
