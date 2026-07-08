"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Navbar = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false); // ✅ Track client mount

  useEffect(() => {
    setMounted(true); // Only true after client mounts

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mounted) return; // Only run on client
    setLoggedIn(!!localStorage.getItem("token"));
  }, [mounted]);

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    router.push("/login");
  };

  if (!mounted) return null; // Prevent SSR flash

  return (
    <div className="z-[1000]">
      {/* Top Story */}
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
            Welcome to DreamJobs! Find your dream career today.
          </div>
          {!loggedIn && (
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-red-600 text-sm"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-gray-600 hover:text-red-600 text-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </motion.header>

      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          transition: { type: "tween", stiffness: 100, damping: 5 },
        }}
        className={`fixed top-0 w-full z-45 bg-white transition-all duration-300 ${
          isScrolled ? "shadow-md" : ""
        }`}
        style={{ top: isScrolled ? "0" : "3rem" }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">
                <span className="text-red-700">Dream</span>Jobs
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="/about-us"
                className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                About
              </Link>
              <Link
                href="/jobs"
                className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Jobs
              </Link>
              <Link
                href="/contact"
                className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Contact
              </Link>
              {loggedIn && (
                <Link
                  href="/dashboard"
                  className="text-emerald-700 hover:text-emerald-800 font-semibold px-3 py-2 rounded-md text-sm"
                >
                  Dashboard
                </Link>
              )}
            </div>

            {loggedIn && (
              <div className="flex items-center">
                <div className="hidden md:block">
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Bottom Navbar */}
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
              href="/dashboard"
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
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              <span>Dashboard</span>
            </Link>
            {loggedIn ? (
              <button
                onClick={logout}
                className="flex flex-col items-center text-gray-800 hover:text-red-600 text-xs bg-transparent border-0 cursor-pointer outline-none"
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Logout</span>
              </button>
            ) : (
              <Link
                href="/login"
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
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </motion.nav>
    </div>
  );
};

export default Navbar;
