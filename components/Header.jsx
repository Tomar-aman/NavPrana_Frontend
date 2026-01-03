"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import LogoImage from "@/assets/Gemini_Generated_Image_hqebpzhqebpzhqeb-removebg-preview.png";
import { getAuthToken, removeAuthToken } from "@/utils/authToken";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();

  // 🔐 CHECK LOGIN STATUS
  useEffect(() => {
    const token = getAuthToken();
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    removeAuthToken();
    setIsLoggedIn(false);
    setIsProfileOpen(false);

    toast.success("Logged out successfully");
    router.push("/auth");
  };

  return (
    <header className="bg-white border-b border-gray-300 sticky top-0 z-50">
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

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/">Home</Link>
            <Link href="/products">Our Products</Link>
            <Link href="/health-benefits">Health Benefits</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart">
              <button className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </button>
            </Link>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center justify-center w-9 h-9 rounded-full border hover:bg-gray-100"
              >
                <User className="h-5 w-5" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg">
                  {!isLoggedIn && (
                    <>
                      <Link
                        href="/auth"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}

                  {isLoggedIn && (
                    <>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
