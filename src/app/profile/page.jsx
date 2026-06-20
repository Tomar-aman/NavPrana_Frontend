"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Settings,
  Plus,
  Home,
  Pencil,
  Trash2,
  LogOut,
  Lock,
  Package,
  ChevronRight,
  Tag,
  Copy,
  Check,
} from "lucide-react";

import { sendAddress } from "@/services/profile/post-profile";
import SettingsTab from "../../../components/SettingsTab";
import AddressModal from "../../../components/AddressModal";
import ChangePasswordModal from "../../../components/ChangePasswordModal";
import EditProfileModal from "../../../components/EditProfileModal";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAddress,
  editAddress,
  fetchAddresses,
} from "@/redux/features/addressSlice";
import { changePassword } from "@/redux/features/passwordSlice";
import { logout } from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";
import PrivateRoute from "../../../components/PrivateRoute";

const Page = () => {
  const { data: profile } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("profile");
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  const fetchMyCoupons = async () => {
    setLoadingCoupons(true);
    try {
      const API = (await import("@/services/api")).default;
      const res = await API.get("api/v1/coupon/my-coupons/");
      setCoupons(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your coupons");
    } finally {
      setLoadingCoupons(false);
    }
  };

  useEffect(() => {
    if (activeTab === "coupons") {
      fetchMyCoupons();
    }
  }, [activeTab]);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [editAddressData, setEditAddressData] = useState(null);
  const { list: address, loading } = useSelector((state) => state.address);

  const [formData, setFormData] = useState({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    is_default: false,
  });

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (editAddressData) {
      setFormData(editAddressData);
    }
  }, [editAddressData]);

  const initials =
    profile?.first_name
      ?.split(" ")
      .map((n) => n[0])
      .join("") || "U";

  const phone = profile?.phone_number || "";

  /* ---------- HANDLERS ---------- */

  const handleChangePassword = async () => {
    try {
      await dispatch(
        changePassword({
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
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

  const handleOnsubmitAddress = async () => {
    try {
      await sendAddress(formData);
      dispatch(fetchAddresses());
      toast.success("Address added successfully");
      setShowAddressModal(false);
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

  const handleDeleteAddress = async (id) => {
    try {
      await dispatch(deleteAddress(id)).unwrap();
      toast.success("Address deleted");
    } catch (err) {
      toast.error(err?.error || err?.message || "Failed to delete address");
    }
  };

  const handleUpdateAddress = async () => {
    try {
      await dispatch(
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
        }),
      ).unwrap();
      toast.success("Address updated");
    } catch (err) {
      toast.error(err?.error || err?.message || "Failed to update address");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/signin");
  };

  /* ---------- RENDER ---------- */

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-50/80 pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">

          {/* ============ HEADER CARD ============ */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Cover */}
            <div className="h-24 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/10" />

            <div className="-mt-12 px-6 pb-6 flex flex-col sm:flex-row items-center gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-2xl font-bold overflow-hidden">
                  {profile?.profile_picture ? (
                    <img
                      src={profile.profile_picture}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-primary/70">{initials}</span>
                  )}
                </div>
              </div>

              {/* Name + info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-xl font-semibold text-foreground">
                  {profile?.first_name} {profile?.last_name}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {profile?.email}
                </p>
              </div>

              {/* Edit button */}
              <button
                onClick={() => setShowEditProfileModal(true)}
                className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition cursor-pointer border border-gray-200 text-foreground hover:bg-gray-50"
              >
                <Edit2 size={15} /> Edit Profile
              </button>
            </div>
          </div>

          <div className="flex gap-1 mt-6 mb-6 bg-white rounded-xl border border-gray-100 p-1 max-w-sm">
            {[
              { key: "profile", label: "Profile", icon: User },
              { key: "coupons", label: "My Coupons", icon: Tag },
              { key: "settings", label: "Settings", icon: Settings },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${activeTab === key
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-gray-50"
                  }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* ============ PROFILE TAB ============ */}
          {activeTab === "profile" && (
            <div className="grid lg:grid-cols-5 gap-6">

              {/* ---- Personal Information (3 cols) ---- */}
              <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User size={16} className="text-primary" />
                  </div>
                  Personal Information
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl px-4 py-3">
                      <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                        First Name
                      </label>
                      <p className="mt-0.5 text-sm text-foreground font-medium">
                        {profile?.first_name || "—"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl px-4 py-3">
                      <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                        Last Name
                      </label>
                      <p className="mt-0.5 text-sm text-foreground font-medium">
                        {profile?.last_name || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail size={15} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Email Address</p>
                      <p className="text-sm text-foreground truncate">{profile?.email || "—"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone size={15} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Phone Number</p>
                      <p className="text-sm text-foreground">{phone || "Not added"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ---- Quick Actions (2 cols) ---- */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
                  <h3 className="text-sm font-semibold text-foreground px-5 pt-5 pb-3">
                    Quick Actions
                  </h3>

                  <button
                    onClick={() => router.push("/order")}
                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <Package size={16} className="text-blue-600" />
                    </div>
                    <span className="flex-1 text-sm font-medium text-foreground text-left">My Orders</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>

                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                      <Lock size={16} className="text-amber-600" />
                    </div>
                    <span className="flex-1 text-sm font-medium text-foreground text-left">Change Password</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-red-50 transition cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                      <LogOut size={16} className="text-red-500" />
                    </div>
                    <span className="flex-1 text-sm font-medium text-red-600 text-left">Log Out</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* ---- Addresses (full width) ---- */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin size={16} className="text-primary" />
                    </div>
                    Shipping Addresses
                  </h2>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition cursor-pointer"
                  >
                    <Plus size={16} />
                    Add New
                  </button>
                </div>

                {address.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <MapPin size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No addresses added yet</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {address.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`relative rounded-xl border p-4 cursor-pointer transition group ${selectedAddressId === addr.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-100 bg-gray-50 hover:border-gray-200"
                          }`}
                      >
                        {/* Actions */}
                        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button
                            className="p-1.5 rounded-lg hover:bg-white text-gray-500 cursor-pointer"
                            title="Edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditAddressData(addr);
                              setShowAddressModal(true);
                            }}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            className="p-1.5 rounded-lg hover:bg-white text-red-500 cursor-pointer"
                            title="Delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAddress(addr.id);
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Home size={15} className="text-primary" />
                          </div>
                          <div className="text-sm min-w-0 pr-12">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-foreground truncate">
                                {addr.address_line1}
                              </p>
                              {addr.is_default && (
                                <span className="text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded shrink-0">
                                  Default
                                </span>
                              )}
                            </div>
                            {addr.address_line2 && (
                              <p className="text-muted-foreground truncate">
                                {addr.address_line2}
                              </p>
                            )}
                            <p className="text-muted-foreground">
                              {addr.city}, {addr.state} – {addr.postal_code}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============ MY COUPONS TAB ============ */}
          {activeTab === "coupons" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Tag size={16} className="text-primary" />
                </div>
                My Winning Coupons
              </h2>

              {loadingCoupons ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : coupons.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Tag size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No coupons won yet. Go spin the lucky wheel!</p>
                  <button 
                    onClick={() => router.push("/spin")}
                    className="mt-4 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 transition shadow-sm cursor-pointer"
                  >
                    Spin the Wheel
                  </button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {coupons.map((coupon) => {
                    const isFree500ml = coupon.coupon_code.startsWith("NAV-FREE500-");
                    return (
                      <div 
                        key={coupon.id} 
                        className={`relative border rounded-2xl p-4 overflow-hidden flex flex-col justify-between transition-all duration-200
                          ${coupon.is_used 
                            ? "border-gray-200 bg-gray-50/50 opacity-70" 
                            : coupon.is_expired
                            ? "border-red-200 bg-red-50/20"
                            : "border-primary/20 bg-gradient-to-br from-white to-primary/5 hover:shadow-md hover:border-primary/40"
                          }`}
                      >
                        {/* Coupon Ticket Jagged Border Effect */}
                        <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-gray-50 rounded-full border-r border-gray-200/50 z-10" />
                        <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 bg-gray-50 rounded-full border-l border-gray-200/50 z-10" />

                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2
                              ${coupon.is_used 
                                ? "bg-gray-100 text-gray-500" 
                                : coupon.is_expired 
                                ? "bg-red-100 text-red-600" 
                                : isFree500ml 
                                ? "bg-amber-100 text-amber-700 animate-pulse" 
                                : "bg-primary/10 text-primary"
                              }`}
                            >
                              {coupon.is_used ? "Used" : coupon.is_expired ? "Expired" : "Active"}
                            </span>
                            <h3 className="font-semibold text-gray-800 text-sm">
                              {isFree500ml 
                                ? "Free Ghee 500ml" 
                                : coupon.discount_type === "percent" 
                                ? `${parseInt(coupon.percent)}% OFF Entire Order` 
                                : coupon.discount_type === "shipping" 
                                ? "Free Shipping" 
                                : `₹${parseInt(coupon.amount)} OFF`}
                            </h3>
                            <p className="text-[11px] text-gray-500 mt-1">
                              {isFree500ml ? "Valid when 500ml ghee is in cart" : "No minimum amount required"}
                            </p>
                          </div>
                          
                          {/* Coupon Code Copy Button */}
                          {!coupon.is_used && !coupon.is_expired && (
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(coupon.coupon_code);
                                toast.success("Coupon code copied!");
                              }}
                              className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-600 hover:text-primary hover:border-primary/20 transition cursor-pointer"
                              title="Copy code"
                            >
                              <Copy size={13} />
                            </button>
                          )}
                        </div>

                        <div className="border-t border-dashed border-gray-200 my-3 pt-3 flex justify-between items-center">
                          <div className="font-mono font-bold text-xs text-primary bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10">
                            {coupon.coupon_code}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            Exp: {new Date(coupon.end_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ============ SETTINGS TAB ============ */}
          {activeTab === "settings" && (
            <SettingsTab
              onChangePassword={() => setShowPasswordModal(true)}
              onLogout={handleLogout}
            />
          )}

          {/* ============ MODALS ============ */}
          <EditProfileModal
            isOpen={showEditProfileModal}
            onClose={() => setShowEditProfileModal(false)}
            profile={profile}
          />

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
        </div>
      </div>
    </PrivateRoute>
  );
};

export default Page;
