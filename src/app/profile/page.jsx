"use client";

import { useEffect, useRef, useState } from "react";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Package,
  Camera,
  Calendar,
  Settings,
  Plus,
  Home,
  Pencil,
  Trash2,
} from "lucide-react";

import { sendAddress } from "@/services/profile/post-profile";
import OrderTab from "../../../components/OrderTab";
import SettingsTab from "../../../components/SettingsTab";
import AddressModal from "../../../components/AddressModal";
import ChangePasswordModal from "../../../components/ChangePasswordModal";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAddress,
  editAddress,
  fetchAddresses,
} from "@/redux/features/addressSlice";
import { updateProfile } from "@/redux/features/profileSlice";
import { changePassword } from "@/redux/features/passwordSlice";
import { logout } from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";

const Page = () => {
  const {
    data: profile,
    //  loading
  } = useSelector((state) => state.profile);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [phone, setPhone] = useState(profile?.phone_number || "");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [editAddressData, setEditAddressData] = useState(null);
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { list: address, loading } = useSelector((state) => state.address);
  const handleChangePassword = async () => {
    try {
      await dispatch(
        changePassword({
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        })
      ).unwrap();

      toast.success("Password changed successfully");
      setShowPasswordModal(false);

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err);
    }
  };
  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    is_default: false,
  });

  const handleOnsubmitAddress = async () => {
    try {
      await sendAddress(formData);

      // 🔥 IMPORTANT
      dispatch(fetchAddresses());

      toast.success("Address added successfully");
      setShowAddressModal(false);

      // reset form
      setFormData({
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "India",
        is_default: false,
      });
    } catch (err) {
      toast.error("Failed to add address");
    }
  };

  // 🔥 Open file dialog
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setEmail(profile.email || "");
      setPhone(profile.phone_number || "");
    }
  }, [profile]);

  // 📂 Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    console.log("Selected file:", file);
  };

  // 🅰️ Avatar letters
  const initials =
    profile?.first_name
      ?.split(" ")
      .map((n) => n[0])
      .join("") || "U";

  const handleEditProfile = async () => {
    try {
      const formData = new FormData();

      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("phone_number", phone);

      if (selectedFile) {
        formData.append("profile_picture", selectedFile);
      }

      await dispatch(updateProfile(formData)).unwrap();

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed to update profile");
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await dispatch(deleteAddress(id)).unwrap();
      toast.success("Address deleted");
    } catch {
      toast.error("Failed to delete address");
    }
  };

  useEffect(() => {
    if (editAddressData) {
      setFormData(editAddressData); // 🔥 pre-fill modal
    }
  }, [editAddressData]);

  const handleUpdateAddress = async () => {
    try {
      const res = await dispatch(
        editAddress({
          id: editAddressData.id,
          data: {
            address_line1: formData.address_line1,
            address_line2: formData.address_line2,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postal_code,
            country: formData.country,
            is_default: formData.is_default,
          },
        })
      ).unwrap();

      toast.success("Address updated");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update address");
    }
  };

  const handleLogout = () => {
    dispatch(logout()); // 1️⃣ clear redux + token
    router.replace("/auth"); // 2️⃣ redirect to login
  };

  const orders = [
    {
      id: "ORD-001",
      date: "Dec 28, 2024",
      status: "Delivered",
      total: "₹1,299",
      items: 2,
    },
    {
      id: "ORD-002",
      date: "Dec 15, 2024",
      status: "Shipped",
      total: "₹899",
      items: 1,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* ================= PROFILE HEADER ================= */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="h-28 bg-primary/50" />
            <div className="-mt-14 px-6 pb-6 flex flex-col md:flex-row items-center gap-4">
              <div className="relative">
                {/* Avatar */}
                <div className="h-28 w-28 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold overflow-hidden">
                  {selectedFile ? (
                    // 🔹 1. Selected image preview (highest priority)
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Selected Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : profile?.profile_picture ? (
                    // 🔹 2. Existing profile image from API
                    <img
                      src={profile.profile_picture}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    // 🔹 3. Fallback initials
                    <span className="text-gray-700">{initials}</span>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Camera Button */}
                {isEditing && (
                  <button
                    onClick={handleCameraClick}
                    className="absolute bottom-1 right-1 bg-primary p-1.5 rounded-full text-white hover:bg-primary/90"
                  >
                    <Camera size={14} />
                  </button>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold">{profile?.first_name}</h1>
                <p className="text-gray-500 flex items-center gap-2 justify-center md:justify-start">
                  <Calendar size={14} />
                  Member since
                </p>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="border px-4 py-2 rounded-lg flex items-center bg-white gap-2 hover:bg-gray-100 cursor-pointer"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* ================= TABS ================= */}
          <div className="bg-white rounded-xl shadow p-2 flex gap-2 max-w-md">
            {[
              { key: "profile", label: "Profile", icon: User },
              { key: "orders", label: "Orders", icon: Package },
              { key: "settings", label: "Settings", icon: Settings },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition cursor-pointer
        ${
          activeTab === key
            ? "bg-primary text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100"
        }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* ================= PROFILE TAB ================= */}
          {activeTab === "profile" && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="bg-white p-6 rounded-xl shadow space-y-4">
                <h2 className="font-semibold flex items-center gap-2 text-lg">
                  <User size={18} /> Personal Information
                </h2>

                {/* Full Name */}
                <div className="flex flex-col md:flex-row gap-2">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      First Name
                    </label>
                    <input
                      disabled={!isEditing}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full border px-3 py-2 rounded-lg disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Last Name
                    </label>
                    <input
                      disabled={!isEditing}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full border px-3 py-2 rounded-lg disabled:bg-gray-50"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-3 text-gray-400"
                      size={16}
                    />
                    <input
                      disabled={!isEditing}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 border px-3 py-2 rounded-lg disabled:bg-gray-50"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-3 text-gray-400"
                      size={16}
                    />
                    <input
                      disabled={!isEditing}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 border px-3 py-2 rounded-lg disabled:bg-gray-50"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-2">
                    <button
                      className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition cursor-pointer"
                      onClick={handleEditProfile}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 border py-2 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* ================= ADDRESS ================= */}
              <div className="bg-white p-6 rounded-xl shadow space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold flex items-center gap-2 text-lg">
                    <MapPin size={18} /> Shipping Addresses
                  </h2>

                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="flex items-center gap-2 border border-dashed border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary/10 transition cursor-pointer"
                  >
                    <Plus size={16} /> Add Address
                  </button>
                </div>

                {/* Address List */}
                <div className="grid md:grid-cols-2 gap-4">
                  {address.map((addr, index) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`border rounded-xl p-4 cursor-pointer transition relative group
          
          ${index === 0 ? "md:col-span-2 bg-primary/5" : "bg-white"}
          
          ${
            selectedAddressId === addr.id
              ? "border-primary ring-1 ring-primary/30"
              : "hover:border-gray-300"
          }
        `}
                    >
                      {/* Top Actions */}
                      <div className="absolute top-3 right-3 flex items-center gap-1  transition">
                        <button
                          className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 cursor-pointer"
                          title="Edit address"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditAddressData(addr); // 🔥 store selected address
                            setShowAddressModal(true);
                          }}
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          className="p-1.5 rounded-md text-red-600 hover:bg-red-50 cursor-pointer"
                          title="Delete address"
                          onClick={(e) => {
                            e.stopPropagation(); // ✅ prevent card click
                            handleDeleteAddress(addr.id);
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Default Badge */}
                      {addr.is_default && (
                        <span className="absolute top-3 left-3 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}

                      {/* Address Content */}
                      <div className="flex items-start gap-3 mt-6">
                        <span className="text-primary mt-1">
                          <Home size={20} />
                        </span>

                        <div className="space-y-1">
                          <p className="font-medium text-gray-800">
                            {addr.address_line1}
                          </p>

                          {addr.address_line2 && (
                            <p className="text-sm text-gray-500">
                              {addr.address_line2}
                            </p>
                          )}

                          <p className="text-sm text-gray-500">
                            {addr.city}, {addr.state} – {addr.postal_code}
                          </p>

                          <p className="text-sm text-gray-500">
                            {addr.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= ORDERS TAB ================= */}
          {activeTab === "orders" && <OrderTab orders={orders} />}

          {/* ================= SETTINGS TAB ================= */}
          {activeTab === "settings" && (
            <SettingsTab
              onChangePassword={() => setShowPasswordModal(true)}
              onLogout={handleLogout}
            />
          )}
        </div>
        {showPasswordModal && (
          <ChangePasswordModal
            isOpen={showPasswordModal}
            oldPassword={oldPassword}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            setOldPassword={setOldPassword}
            setNewPassword={setNewPassword}
            setConfirmPassword={setConfirmPassword}
            showOldPassword={showOldPassword}
            showNewPassword={showNewPassword}
            showConfirmPassword={showConfirmPassword}
            setShowOldPassword={setShowOldPassword}
            setShowNewPassword={setShowNewPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            onClose={() => setShowPasswordModal(false)}
            onSubmit={handleChangePassword}
          />
        )}
        {showAddressModal && (
          <AddressModal
            isOpen={showAddressModal}
            isEdit={!!editAddressData}
            formData={formData}
            setFormData={setFormData}
            onClose={() => {
              setShowAddressModal(false);
              setEditAddressData(null);
            }}
            onSubmit={
              editAddressData ? handleUpdateAddress : handleOnsubmitAddress
            }
          />
        )}
      </main>
    </div>
  );
};

export default Page;
