"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import apiClient from "@/lib/utils/axiosFetcher";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPasswordError("");

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

    // Split name to firstName and lastName to match backend createUserSchema
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || "User";
    const lastName = nameParts.slice(1).join(" ") || "Profile";

    if (firstName.length < 2 || lastName.length < 2) {
      toast.error("Please enter a first and last name of at least 2 characters each");
      setIsLoading(false);
      return;
    }

    try {
      const data = await apiClient("/api/v1/auth/register", {
        method: "POST",
        body: { firstName, lastName, email, password },
      });

      localStorage.setItem("token", data.token);

      toast.success("Registered successfully!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const data = await apiClient("/api/v1/auth/google");
      window.location.href = data.url;
    } catch (error: any) {
      toast.error(error.message || "Google registration failed.");
    }
  };

  const handleGithubLogin = async () => {
    try {
      const data = await apiClient("/api/v1/auth/github");
      window.location.href = data.url;
    } catch (error: any) {
      toast.error(error.message || "GitHub registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-white py-20 pt-36 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-300 overflow-hidden md:max-w-xl">
        <div className="p-8">
          <p className="text-center text-gray-600 mb-8">Create a new account</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#38A169] focus:ring-2 focus:ring-[#38A169]/30 outline-none transition duration-200"
                placeholder="John Doe"
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#38A169] focus:ring-2 focus:ring-[#38A169]/30 outline-none transition duration-200"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#38A169] focus:ring-2 focus:ring-[#38A169]/30 outline-none transition duration-200 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3.5 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-600 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 bg-[#38A169] hover:bg-[#2F855A] focus:ring-[#38A169] focus:ring-offset-2 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or register with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#38A169] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FcGoogle />
                <span className="ml-2">Google</span>
              </button>

              <button
                onClick={handleGithubLogin}
                disabled={isLoading}
                className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#38A169] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaGithub />
                <span className="ml-2">GitHub</span>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
