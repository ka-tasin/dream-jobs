"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock } from "react-icons/fi";
import apiClient from "@/lib/utils/axiosFetcher";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPasswordError("");

    if (firstName.trim().length < 2) {
      toast.error("First name must be at least 2 characters long");
      setIsLoading(false);
      return;
    }

    if (lastName.trim().length < 2) {
      toast.error("Last name must be at least 2 characters long");
      setIsLoading(false);
      return;
    }

    // Password validation
    const uppercaseRegex = /^(?=.*[A-Z])/;
    const lowercaseRegex = /^(?=.*[a-z])/;
    const lengthRegex = /^.{8,}$/;

    if (!uppercaseRegex.test(password)) {
      setPasswordError("Password must have at least one uppercase letter.");
      setIsLoading(false);
      return;
    }

    if (!lowercaseRegex.test(password)) {
      setPasswordError("Password must have at least one lowercase letter.");
      setIsLoading(false);
      return;
    }

    if (!lengthRegex.test(password)) {
      setPasswordError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    // Frontend matching check for Password and Confirm Password
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const data = await apiClient("/api/v1/auth/register", {
        method: "POST",
        body: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password,
        },
      });

      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      toast.success("Registered successfully!");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    window.location.href = `${backendUrl}/api/v1/auth/google`;
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-100/40 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-8 sm:p-10 transition-all duration-300">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-2xl font-bold text-slate-800 tracking-tight">
            <span className="text-red-700">Dream</span>Jobs
          </Link>
          <h2 className="mt-3 text-xl font-bold text-slate-900">Create an Account</h2>
          <p className="text-sm text-slate-500 mt-1">
            Join thousands of professionals landing their dream careers
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="firstName"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiUser className="w-3.5 h-3.5" />
                </div>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition duration-200 placeholder:text-slate-400"
                  placeholder="John"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Last Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiUser className="w-3.5 h-3.5" />
                </div>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition duration-200 placeholder:text-slate-400"
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiMail className="w-4 h-4" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition duration-200 placeholder:text-slate-400"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiLock className="w-4 h-4" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition duration-200 placeholder:text-slate-400"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiLock className="w-4 h-4" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition duration-200 placeholder:text-slate-400"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-600 text-xs font-medium mt-1">{passwordError}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 bg-slate-900 hover:bg-red-700 focus:ring-4 focus:ring-red-700/20 text-white text-sm font-semibold rounded-xl shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer border-0"
            >
              {isLoading ? "Creating account..." : "Register"}
            </button>
          </div>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-3 bg-white text-slate-400 font-medium">
                Or register with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-slate-200 rounded-xl shadow-2xs bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/20 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <FcGoogle className="w-4.5 h-4.5 mr-2" />
              <span>Continue with Google</span>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center pt-2">
          <p className="text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-red-700 hover:text-red-800 underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
