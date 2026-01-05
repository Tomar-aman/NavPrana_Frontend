"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import LogoImage from "@/assets/Gemini_Generated_Image_hqebpzhqebpzhqeb-removebg-preview.png";
import { getAuthToken } from "@/utils/authToken";
import { useProfile } from "@/Context/ProfileContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { profile } = useProfile();

  // ✅ helper function (missing earlier)
  const capitalize = (text = "") =>
    text.charAt(0).toUpperCase() + text.slice(1);

  // 🔐 CHECK LOGIN STATUS
  useEffect(() => {
    const token = getAuthToken();
    setIsLoggedIn(!!token);
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
                  0
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
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  <User className="h-4 w-4" />
                  <span className="font-medium">
                    {capitalize(profile?.first_name)}
                  </span>
                </Link>
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
