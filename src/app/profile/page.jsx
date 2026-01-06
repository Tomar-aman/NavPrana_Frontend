"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Package,
  LogOut,
  Camera,
  Calendar,
  ShieldAlert,
  KeyRound,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { useProfile } from "@/Context/ProfileContext";
import { useAuth } from "@/Context/AuthContext";
import { changePassword } from "@/services/auth/change-password";

const Page = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { logout } = useAuth();
  const { profile } = useProfile();

  const handleChangePassword = async () => {
    try {
      const data = await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  // 🔹 Mock user data (replace with Context / API)
  const user = {
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+91 98765 43210",
    memberSince: "January 2024",
    address: {
      street: "123 Green Valley Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
    },
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
      <Header />

      <main className="flex-1 py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* ================= PROFILE HEADER ================= */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="h-28 bg-primary/50" />
            <div className="-mt-14 px-6 pb-6 flex flex-col md:flex-row items-center gap-4">
              <div className="relative">
                <div className="h-28 w-28 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold">
                  {profile?.first_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <button className="absolute bottom-1 right-1 bg-primary p-1.5 rounded-full text-white">
                  <Camera size={14} />
                </button>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold">{profile?.first_name}</h1>
                <p className="text-gray-500 flex items-center gap-2 justify-center md:justify-start">
                  <Calendar size={14} />
                  Member since {user.memberSince}
                </p>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="border px-4 py-2 rounded-lg flex items-center bg-white gap-2 hover:bg-gray-100"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* ================= TABS ================= */}
          <div className="bg-white rounded-xl shadow p-2 flex gap-2 max-w-md">
            {["profile", "orders", "settings"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === tab
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
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
                <div className="flex gap-2">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">
                      First Name
                    </label>
                    <input
                      disabled={!isEditing}
                      defaultValue={profile?.first_name}
                      className="w-full border px-3 py-2 rounded-lg disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Last Name
                    </label>
                    <input
                      disabled={!isEditing}
                      defaultValue={profile?.last_name}
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
                      defaultValue={profile?.email}
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
                      defaultValue={user.phone}
                      className="w-full pl-10 border px-3 py-2 rounded-lg disabled:bg-gray-50"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition">
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 border py-2 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="bg-white p-6 rounded-xl shadow space-y-4">
                <h2 className="font-semibold flex items-center gap-2 text-lg">
                  <MapPin size={18} /> Address
                </h2>

                {/* Street */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">
                    Street Address
                  </label>
                  <input
                    disabled={!isEditing}
                    defaultValue={user.address.street}
                    className="w-full border px-3 py-2 rounded-lg disabled:bg-gray-50"
                  />
                </div>

                {/* City & State */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">
                      City
                    </label>
                    <input
                      disabled={!isEditing}
                      defaultValue={user.address.city}
                      className="border px-3 py-2 rounded-lg disabled:bg-gray-50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">
                      State
                    </label>
                    <input
                      disabled={!isEditing}
                      defaultValue={user.address.state}
                      className="border px-3 py-2 rounded-lg disabled:bg-gray-50"
                    />
                  </div>
                </div>

                {/* Pincode */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">
                    Pincode
                  </label>
                  <input
                    disabled={!isEditing}
                    defaultValue={user.address.pincode}
                    className="w-full border px-3 py-2 rounded-lg disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= ORDERS TAB ================= */}
          {activeTab === "orders" && (
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="font-semibold flex items-center gap-2 mb-4">
                <Package size={18} /> Orders
              </h2>

              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex justify-between items-center border-b py-4 last:border-none"
                >
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-500">
                      {order.date} • {order.items} items
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                      {order.status}
                    </span>
                    <span className="font-semibold">{order.total}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================= SETTINGS TAB ================= */}
          {activeTab === "settings" && (
            <div className="bg-white p-6 rounded-xl shadow space-y-6">
              <div>
                <p className="font-semibold">Account Settings</p>
                <p className="text-sm text-gray-500">
                  Manage your account preferences
                </p>
              </div>

              <div className="flex justify-between items-center border p-4 rounded-lg">
                {/* LEFT SIDE */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 text-gray-700">
                    <KeyRound size={20} />
                  </div>

                  <div>
                    <p className="font-medium">Change Password</p>
                    <p className="text-sm text-gray-500">
                      Update your password
                    </p>
                  </div>
                </div>

                {/* RIGHT SIDE BUTTON */}
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="flex items-center gap-2 border px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                  title="Update Password"
                >
                  <span className="hidden sm:inline text-sm">Update</span>
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="bg-white border border-red-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Left Content */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-red-100 text-red-600">
                    <ShieldAlert size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg text-red-600">
                      Account Action
                    </h3>
                    <p className="text-sm text-gray-500">
                      Securely sign out from your account on this device
                    </p>
                  </div>
                </div>

                {/* Logout Button */}

                <button
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-red-300 text-red-600 font-medium hover:bg-red-50 transition"
                  onClick={logout}
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Change Password</h2>
              </div>

              {/* Form */}
              <form className="space-y-4">
                {/* Old Password */}
                <div>
                  <label className="text-sm font-medium">Old Password</label>

                  <div className="relative mt-1">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter old password"
                      className="w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black"
                    />

                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showOldPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="text-sm font-medium">New Password</label>

                  <div className="relative mt-1">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black"
                    />

                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-sm font-medium">
                    Confirm Password
                  </label>

                  <div className="relative mt-1">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 cursor-pointer"
                    onClick={handleChangePassword}
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Page;
