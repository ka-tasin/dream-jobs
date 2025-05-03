"use client"; 

import Link from "next/link";
import Navdrawer from "../../NavDrawer/Navdrawer";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); 
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }} 
      transition={{
        type: "tween", 
        stiffness: 100, 
        damping: 5, 
      }}
    >
      {" "}
      <header className="sticky top-0 z-50 bg-white shadow-lg">
        {/* Top Story - Only visible at top of page */}
        <div
          className={`transition-all duration-300 ${
            isScrolled ? "h-0 opacity-0 overflow-hidden" : "h-12 opacity-100"
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Welcome message or top navigation
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="#"
                className="text-gray-600 hover:text-blue-600 text-sm"
              >
                Support
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:text-blue-600 text-sm"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navbar - Always visible */}
        <nav
          className={`transition-all duration-300 ${
            isScrolled ? "shadow-md" : ""
          }`}
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-gray-800">
                  YourLogo
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  href="/"
                  className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  About
                </Link>
                <Link
                  href="/services"
                  className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Services
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Contact
                </Link>
              </div>

              {/* Right Side (Profile) */}
              <div className="flex items-center">
                <div className="hidden md:block">
                  <button className="flex items-center text-gray-800 hover:text-blue-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </button>
                </div>

                {/* Mobile menu button */}
                <Navdrawer />
              </div>
            </div>
          </div>
        </nav>
      </header>
    </motion.div>
  );
};

export default Navbar;
