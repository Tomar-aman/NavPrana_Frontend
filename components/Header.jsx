"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Package,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import LogoImage from "@/assets/Gemini_Generated_Image_hqebpzhqebpzhqeb-removebg-preview.png";
import { getAuthToken } from "@/utils/authToken";
import { useProfile } from "@/Context/ProfileContext";
import { useAuth } from "@/Context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/features/authSlice";
import { getProfile } from "@/redux/features/profileSlice";
import { useRouter } from "next/navigation";
import { getCart } from "@/redux/features/cartSlice";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const token = getAuthToken();
  // const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { data: profile, loading } = useSelector((state) => state.profile);
  const { items } = useSelector((state) => state.cart);
  console.log(items.length);
  const cartItemQuantity = items.length;
  // ✅ helper function (missing earlier)
  useEffect(() => {
    if (!profile) {
      dispatch(getProfile());
    }
  }, []);

  const handleLogout = () => {
    dispatch(logout()); // 1️⃣ clear redux + token
    router.replace("/auth"); // 2️⃣ redirect to login
  };

  const capitalize = (text = "") =>
    text.charAt(0).toUpperCase() + text.slice(1);

  // 🔐 CHECK LOGIN STATUS
  useEffect(() => {
    setIsLoggedIn(!!token);
    dispatch(getCart());
  }, []);

  return (
    <header className="bg-white backdrop-blur-sm border-b border-gray-300 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={LogoImage}
              alt="Company Logo"
              width={160}
              height={60}
              className="w-40 h-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/">Home</Link>
            <Link href="/products">Our Products</Link>
            <Link href="/health-benefits">Health Benefits</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </nav>

          {/* Cart + Profile + Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart">
              <button className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemQuantity}
                </span>
              </button>
            </Link>

            {/* Auth Button */}
            <div className="relative">
              {!isLoggedIn ? (
                <Link
                  href="/auth"
                  className="flex items-center justify-center h-9 px-4 border rounded-sm hover:bg-gray-100 transition"
                >
                  Login
                </Link>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-100"
                  >
                    <User className="h-4 w-4" />
                    {capitalize(profile?.first_name)}
                  </button>

                  {/* 🔽 DROPDOWN */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-md">
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      >
                        <User size={16} /> My Profile
                      </Link>

                      <Link
                        href="/orders"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      >
                        <Package size={16} /> My Orders
                      </Link>

                      <Link
                        href="/settings"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      >
                        <Settings size={16} /> Settings
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-200 transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-3 flex flex-col space-y-3">
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/health-benefits">Health Benefits</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/profile">Profile</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
