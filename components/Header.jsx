"use client";

import { useEffect, useState, useRef } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import LogoImage from "@/assets/logo-ghee.svg";
import { logout } from "@/redux/features/authSlice";
import { getProfile } from "@/redux/features/profileSlice";
import { getCart } from "@/redux/features/cartSlice";

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  /* UI state */
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  /* Refs */
  const profileRef = useRef(null);

  /* Redux state */
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { data: profile } = useSelector((state) => state.profile);
  const { items = [] } = useSelector((state) => state.cart);

  const cartItemQuantity = items.length;

  /* Fetch profile & cart when logged in */
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getProfile());
      dispatch(getCart());
    }
  }, [isAuthenticated, dispatch]);

  /* Close profile dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  /* Logout */
  const handleLogout = () => {
    dispatch(logout());
    setIsProfileOpen(false);
    router.replace("/auth");
  };

  const capitalize = (text = "") =>
    text.charAt(0).toUpperCase() + text.slice(1);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white border-b border-gray-300 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Image
                src={LogoImage}
                alt="Company Logo"
                width={160}
                height={60}
                className="w-40 h-auto"
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { label: "Home", path: "/" },
              { label: "Our Products", path: "/products" },
              { label: "Health Benefits", path: "/health-benefits" },
              { label: "About", path: "/about" },
              { label: "Contact", path: "/contact" },
            ].map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link href={item.path}>{item.label}</Link>
              </motion.div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <AnimatePresence>
                {cartItemQuantity > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {cartItemQuantity}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Auth Section */}
            {!isAuthenticated ? (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  href="/auth"
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Login
                </Link>
              </motion.div>
            ) : (
              <div className="relative" ref={profileRef}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-100"
                >
                  <User className="h-4 w-4" />
                  {capitalize(profile?.first_name)}
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-md"
                    >
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      >
                        <User size={16} /> My Profile
                      </Link>

                      <Link
                        href="/order"
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
                        className="w-full text-left flex cursor-pointer items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col space-y-3">
              <Link href="/">Home</Link>
              <Link href="/products">Products</Link>
              <Link href="/health-benefits">Health Benefits</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
              {isAuthenticated && <Link href="/profile">Profile</Link>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
