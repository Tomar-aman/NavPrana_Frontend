// import { Home, MapPin, Building, Flag, Hash, Globe } from "lucide-react";

// const AddressModal = ({
//   isOpen,
//   formData,
//   setFormData,
//   onClose,
//   onSubmit,
//   isEdit,
// }) => {
//   if (!isOpen) return null;
//   const Label = ({ icon: Icon, text }) => (
//     <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
//       <Icon size={16} className="text-primary" />
//       {text}
//     </label>
//   );
//   return (
//     <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
//       <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-lg relative">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-semibold flex items-center gap-2">
//             <Home size={18} /> {isEdit ? "Edit Address" : "Add New Address"}
//           </h2>
//         </div>

//         {/* Form */}
//         <div className="space-y-4">
//           {/* Address Line 1 */}
//           <div>
//             <Label icon={MapPin} text="Address Line 1" />
//             <input
//               className="w-full border px-3 py-2 rounded-lg"
//               placeholder="House no, street"
//               value={formData.address_line1 || ""}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   address_line1: e.target.value,
//                 })
//               }
//             />
//           </div>

//           {/* Address Line 2 */}
//           <div>
//             <Label icon={Building} text="Address Line 2" />
//             <input
//               className="w-full border px-3 py-2 rounded-lg"
//               placeholder="Landmark, area"
//               value={formData.address_line2 || ""}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   address_line2: e.target.value,
//                 })
//               }
//             />
//           </div>

//           {/* City & State */}
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <Label icon={MapPin} text="City" />
//               <input
//                 className="border px-3 py-2 rounded-lg w-full"
//                 placeholder="City"
//                 value={formData.city || ""}
//                 onChange={(e) =>
//                   setFormData({ ...formData, city: e.target.value })
//                 }
//               />
//             </div>

//             <div>
//               <Label icon={Flag} text="State" />
//               <input
//                 className="border px-3 py-2 rounded-lg w-full"
//                 placeholder="State"
//                 value={formData.state || ""}
//                 onChange={(e) =>
//                   setFormData({ ...formData, state: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           {/* Postal Code & Country */}
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <Label icon={Hash} text="Postal Code" />
//               <input
//                 className="border px-3 py-2 rounded-lg w-full"
//                 placeholder="PIN Code"
//                 value={formData.postal_code || ""}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     postal_code: e.target.value,
//                   })
//                 }
//               />
//             </div>

//             <div>
//               <Label icon={Globe} text="Country" />
//               <input
//                 className="border px-3 py-2 rounded-lg w-full"
//                 value={formData.country || "India"}
//                 onChange={(e) =>
//                   setFormData({ ...formData, country: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           {/* Default checkbox */}
//           <label className="flex items-center gap-2 text-sm">
//             <input
//               type="checkbox"
//               checked={formData.is_default || false}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   is_default: e.target.checked,
//                 })
//               }
//             />
//             Set as default address
//           </label>

//           {/* Actions */}
//           <div className="flex justify-end gap-3 pt-4">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 border rounded-lg hover:bg-gray-100"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={() => {
//                 onSubmit();
//                 onClose();
//               }}
//               className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
//             >
//               {isEdit ? "Update" : "Save"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddressModal;

import { useState } from "react";
import { Home, MapPin, Building, Flag, Hash, Globe } from "lucide-react";

const AddressModal = ({
  isOpen,
  formData,
  setFormData,
  onClose,
  onSubmit,
  isEdit,
}) => {
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const Label = ({ icon: Icon, text }) => (
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
      <Icon size={16} className="text-primary" />
      {text}
    </label>
  );

  /* ---------- VALIDATION ---------- */
  const validate = () => {
    const newErrors = {};

    if (!formData.address_line1?.trim())
      newErrors.address_line1 = "Address Line 1 is required";

    if (!formData.city?.trim()) newErrors.city = "City is required";

    if (!formData.state?.trim()) newErrors.state = "State is required";

    if (!formData.postal_code?.trim())
      newErrors.postal_code = "Postal code is required";
    else if (!/^\d{6}$/.test(formData.postal_code))
      newErrors.postal_code = "Enter valid 6-digit PIN code";

    if (!formData.country?.trim()) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit();
    onClose();
  };

  const inputClass =
    "w-full border px-3 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Home size={18} />
            {isEdit ? "Edit Address" : "Add New Address"}
          </h2>
        </div>

        <div className="space-y-4">
          {/* Address Line 1 */}
          <div>
            <Label icon={MapPin} text="Address Line 1" />
            <input
              className={`${inputClass} ${
                errors.address_line1 ? "border-red-500" : ""
              }`}
              placeholder="House no, street"
              value={formData.address_line1 || ""}
              onChange={(e) =>
                setFormData({ ...formData, address_line1: e.target.value })
              }
            />
            {errors.address_line1 && (
              <p className="text-red-500 text-xs mt-1">
                {errors.address_line1}
              </p>
            )}
          </div>

          {/* Address Line 2 */}
          <div>
            <Label icon={Building} text="Address Line 2" />
            <input
              className={inputClass}
              placeholder="Landmark, area"
              value={formData.address_line2 || ""}
              onChange={(e) =>
                setFormData({ ...formData, address_line2: e.target.value })
              }
            />
          </div>

          {/* City & State */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label icon={MapPin} text="City" />
              <input
                className={`${inputClass} ${
                  errors.city ? "border-red-500" : ""
                }`}
                placeholder="City"
                value={formData.city || ""}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <Label icon={Flag} text="State" />
              <input
                className={`${inputClass} ${
                  errors.state ? "border-red-500" : ""
                }`}
                placeholder="State"
                value={formData.state || ""}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
              />
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
              )}
            </div>
          </div>

          {/* Postal Code & Country */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label icon={Hash} text="Postal Code" />
              <input
                className={`${inputClass} ${
                  errors.postal_code ? "border-red-500" : ""
                }`}
                placeholder="PIN Code"
                type="number"
                value={formData.postal_code || ""}
                onChange={(e) =>
                  setFormData({ ...formData, postal_code: e.target.value })
                }
              />
              {errors.postal_code && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.postal_code}
                </p>
              )}
            </div>

            <div>
              <Label icon={Globe} text="Country" />
              <input
                className={`${inputClass} ${
                  errors.country ? "border-red-500" : ""
                }`}
                value={formData.country || "India"}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
              />
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">{errors.country}</p>
              )}
            </div>
          </div>

          {/* Default checkbox */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.is_default || false}
              onChange={(e) =>
                setFormData({ ...formData, is_default: e.target.checked })
              }
            />
            Set as default address
          </label>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              {isEdit ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
