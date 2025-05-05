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
    <>
      {/* Top Story - Only visible at top of page */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          transition: { type: "tween", stiffness: 100, damping: 5 },
        }}
        className={`fixed top-0 w-full z-50 bg-white shadow-gray-200 transition-all duration-300 ${
          isScrolled ? "transform -translate-y-full" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 h-12 p3-2 flex items-center justify-between">
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
      </motion.header>

      {/* Main Navbar - Always visible at top */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          transition: { type: "tween", stiffness: 100, damping: 5 },
        }}
        className={`fixed top-0 w-full z-40 bg-white transition-all duration-300 ${
          isScrolled ? "shadow-md" : ""
        }`}
        style={{ top: isScrolled ? "0" : "3rem" }}
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
              <Navdrawer />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Bottom Navbar - Always visible */}
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          transition: { type: "tween", stiffness: 100, damping: 5 },
        }}
        className="fixed md:hidden bottom-0 w-full z-50 bg-white shadow-md border-t border-gray-200"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-around items-center h-16">
            <Link
              href="/"
              className="flex flex-col items-center text-gray-800 hover:text-blue-600 text-xs"
            >
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Home</span>
            </Link>
            <Link
              href="/jobs"
              className="flex flex-col items-center text-gray-800 hover:text-blue-600 text-xs"
            >
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
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>Jobs</span>
            </Link>
            <Link
              href="/saved"
              className="flex flex-col items-center text-gray-800 hover:text-blue-600 text-xs"
            >
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
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <span>Saved</span>
            </Link>
            <Link
              href="/profile"
              className="flex flex-col items-center text-gray-800 hover:text-blue-600 text-xs"
            >
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
              <span>Profile</span>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Spacer to prevent content from being hidden behind fixed navbars */}
      {/* <div className="pt-24 pb-16"></div> */}
    </>
  );
};

export default Navbar;
