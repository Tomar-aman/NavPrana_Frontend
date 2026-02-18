"use client";

import { useEffect, useState, useRef } from "react";
import {
  ShoppingCart,
  Menu,
  X,
  User,
  LogOut,
  Package,
  ChevronDown,
  Home,
  ShoppingBag,
  Info,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import LogoImage from "@/assets/logo-ghee.svg";
import { logout } from "@/redux/features/authSlice";
import { getProfile } from "@/redux/features/profileSlice";
import { getCart } from "@/redux/features/cartSlice";

const NAV_LINKS = [
  { label: "Home", path: "/", icon: Home },
  { label: "Products", path: "/products", icon: ShoppingBag },
  { label: "About", path: "/about", icon: Info },
  { label: "Contact", path: "/contact", icon: MessageSquare },
];

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hideTopBar, setHideTopBar] = useState(false);

  const profileRef = useRef(null);

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { data: profile } = useSelector((state) => state.profile);
  const { items = [] } = useSelector((state) => state.cart);

  const cartItemQuantity = items.length;

  /* Fetch profile & cart */
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getProfile());
      dispatch(getCart());
    }
  }, [isAuthenticated, dispatch]);

  /* Hide top bar on scroll */
  useEffect(() => {
    const handleScroll = () => {
      setHideTopBar(window.scrollY > 80);
      setIsOpen(false);
      setIsProfileOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close profile dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
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

  /* Close menus on route change */
  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileOpen(false);
    router.replace("/auth");
  };

  const capitalize = (text = "") =>
    text.charAt(0).toUpperCase() + text.slice(1);

  const initials =
    profile?.first_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <motion.header className="fixed top-0 w-full z-50">
      {/* TOP BAR */}
      <AnimatePresence>
        {!hideTopBar && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 32, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-primary flex items-center overflow-hidden"
          >
            <div className="animate-marquee whitespace-nowrap text-white text-xs font-medium tracking-wide">
              <span className="mx-8">🥛 Boosts Immunity</span>
              <span className="mx-8">🌿 Improves Digestion</span>
              <span className="mx-8">🔥 Increases Energy</span>
              <span className="mx-8">🧠 Enhances Brain Health</span>
              <span className="mx-8">❤️ Supports Heart Health</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN HEADER */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Image
                src={LogoImage}
                alt="NavPrana Organics"
                width={160}
                height={60}
                className="w-36 md:w-40"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((item) => {
                const isActive = pathname === item.path;

                return (
                  <Link
                    key={item.label}
                    href={item.path}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                        ? "text-primary bg-primary/5"
                        : "text-gray-600 hover:text-foreground hover:bg-gray-50"
                      }`}
                  >
                    {item.label}

                    {/* Active indicator dot */}
                    {isActive && (
                      <motion.span
                        layoutId="activeNav"
                        className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 rounded-xl hover:bg-gray-50 transition"
              >
                <ShoppingCart className="h-5 w-5 text-gray-700" />
                {cartItemQuantity > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold h-[18px] min-w-[18px] px-1 rounded-full flex items-center justify-center">
                    {cartItemQuantity}
                  </span>
                )}
              </Link>

              {/* Auth */}
              {!isAuthenticated ? (
                <Link
                  href="/auth"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition shadow-sm"
                >
                  Sign In
                </Link>
              ) : (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => {
                      setIsProfileOpen(!isProfileOpen);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl transition cursor-pointer ${isProfileOpen
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                      }`}
                  >
                    {/* Avatar circle */}
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      {profile?.profile_picture ? (
                        <img
                          src={profile.profile_picture}
                          alt=""
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-primary">
                          {initials}
                        </span>
                      )}
                    </div>
                    <span className="hidden sm:inline text-sm font-medium text-foreground max-w-[80px] truncate">
                      {capitalize(profile?.first_name)}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`hidden sm:block text-gray-400 transition-transform ${isProfileOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden"
                      >
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {capitalize(profile?.first_name)}{" "}
                            {capitalize(profile?.last_name)}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {profile?.email}
                          </p>
                        </div>

                        {/* Links */}
                        <div className="py-1.5">
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-gray-50 transition"
                          >
                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                              <User size={14} className="text-primary" />
                            </div>
                            My Profile
                          </Link>
                          <Link
                            href="/order"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-gray-50 transition"
                          >
                            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                              <Package size={14} className="text-blue-600" />
                            </div>
                            My Orders
                          </Link>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-gray-100 py-1.5">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
                          >
                            <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                              <LogOut size={14} className="text-red-500" />
                            </div>
                            Log Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Mobile Toggle */}
              <button
                className="md:hidden p-2 rounded-xl hover:bg-gray-50 transition cursor-pointer"
                onClick={() => {
                  setIsOpen(!isOpen);
                  setIsProfileOpen(false);
                }}
              >
                {isOpen ? (
                  <X size={20} className="text-gray-700" />
                ) : (
                  <Menu size={20} className="text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden bg-white/95 backdrop-blur-md border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map((item) => {
                const isActive = pathname === item.path;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition ${isActive
                        ? "text-primary bg-primary/5"
                        : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? "bg-primary/10" : "bg-gray-100"
                        }`}
                    >
                      <Icon
                        size={16}
                        className={isActive ? "text-primary" : "text-gray-500"}
                      />
                    </div>
                    {item.label}
                  </Link>
                );
              })}

              {/* Mobile login button */}
              {!isAuthenticated && (
                <Link
                  href="/auth"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 mt-2 py-3 bg-primary text-white text-sm font-medium rounded-xl"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
