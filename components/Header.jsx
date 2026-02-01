"use client";

import { useEffect, useState, useRef } from "react";
import { ShoppingCart, Menu, X, User, LogOut, Package } from "lucide-react";
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
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close profile dropdown */
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

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileOpen(false);
    router.replace("/auth");
  };

  const capitalize = (text = "") =>
    text.charAt(0).toUpperCase() + text.slice(1);

  return (
    <motion.header
      className="bg-white border-b border-gray-200 fixed top-0 w-full z-50 shadow-sm"
      animate={{ y: hideTopBar ? -0 : 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* 🔝 TOP SLIDING BAR */}
      <AnimatePresence>
        {!hideTopBar && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 32, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-primary overflow-hidden flex items-center"
          >
            <div className="animate-marquee whitespace-nowrap text-white text-sm font-medium tracking-wide">
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
      <div className="container mx-auto px-6 py-4 bg-white">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <Image
              src={LogoImage}
              alt="Logo"
              width={160}
              height={60}
              className="w-40"
            />
          </Link>
          <nav className="hidden md:flex space-x-10">
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
                  className={`relative group font-medium transition-colors
          ${isActive ? "text-primary" : "text-gray-800"}
        `}
                >
                  {item.label}

                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] bg-primary transition-all duration-300
            ${isActive ? "w-full" : "w-0 group-hover:w-full"}
          `}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right */}
          <div className="flex items-center space-x-4">
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
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Login
              </Link>
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
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
                        className="block px-4 py-2 hover:bg-gray-100"
                        href="/profile"
                      >
                        My Profile
                      </Link>
                      <Link
                        className="block px-4 py-2 hover:bg-gray-100"
                        href="/order"
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

            {/* Mobile */}
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}{" "}
      <AnimatePresence>
        {" "}
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t overflow-hidden"
          >
            {" "}
            <div className="px-4 py-3 flex flex-col space-y-3">
              {" "}
              <Link href="/">Home</Link> <Link href="/products">Products</Link>{" "}
              <Link href="/health-benefits">Health Benefits</Link>{" "}
              <Link href="/about">About</Link>{" "}
              <Link href="/contact">Contact</Link>{" "}
              {isAuthenticated && <Link href="/profile">Profile</Link>}{" "}
            </div>{" "}
          </motion.div>
        )}{" "}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
