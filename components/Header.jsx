"use client";

import { useEffect, useState, useRef } from "react";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import LogoImage from "@/assets/logo-ghee.svg";
import { logout } from "@/redux/features/authSlice";
import { getProfile } from "@/redux/features/profileSlice";
import { getCart } from "@/redux/features/cartSlice";

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

  return (
    <motion.header className="fixed top-0 w-full z-50 bg-white border-b shadow-sm">
      {/* 🔝 TOP BAR */}
      <AnimatePresence>
        {!hideTopBar && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 32, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-primary flex items-center overflow-hidden"
          >
            <div className="animate-marquee whitespace-nowrap text-white text-sm font-medium">
              <span className="mx-8">🥛 Boosts Immunity</span>
              <span className="mx-8">🌿 Improves Digestion</span>
              <span className="mx-8">🔥 Increases Energy</span>
              <span className="mx-8">🧠 Enhances Brain Health</span>
              <span className="mx-8">❤️ Supports Heart Health</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔻 MAIN HEADER */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <Image
              src={LogoImage}
              alt="NavPrana Organics"
              width={160}
              height={60}
              className="w-40"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-10">
            {[
              { label: "Home", path: "/" },
              { label: "Products", path: "/products" },
              { label: "About", path: "/about" },
              { label: "Contact", path: "/contact" },
            ].map((item) => {
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.label}
                  href={item.path}
                  className={`relative font-medium transition-colors
                    ${isActive ? "text-primary" : "text-gray-800"}
                    group
                  `}
                >
                  {item.label}

                  {/* Hover / Active Bottom Border */}
                  <span
                    className={`
                      absolute left-0 -bottom-1 h-[2px] bg-primary
                      transition-all duration-300
                      ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                    `}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                  {cartItemQuantity}
                </span>
              )}
            </Link>

            {/* Auth */}
            {!isAuthenticated ? (
              <Link
                href="/auth"
                className="px-4 py-2 border rounded border-primary-border"
              >
                Login
              </Link>
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-100"
                >
                  <User size={16} />
                  <span className="hidden sm:inline">
                    {capitalize(profile?.first_name)}
                  </span>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white border rounded shadow"
                    >
                      <Link
                        href="/profile"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/order"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              className="md:hidden"
              onClick={() => {
                setIsOpen(!isOpen);
                setIsProfileOpen(false);
              }}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* 📱 Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-3">
              <Link href="/" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link href="/products" onClick={() => setIsOpen(false)}>
                Products
              </Link>
              <Link href="/about" onClick={() => setIsOpen(false)}>
                About
              </Link>
              <Link href="/contact" onClick={() => setIsOpen(false)}>
                Contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
