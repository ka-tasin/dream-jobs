"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import apiClient from "@/lib/utils/axiosFetcher";
import { useAuth } from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await apiClient("/api/v1/auth/login", {
        method: "POST",
        body: { email, password },
      });

      // Extract user info and optional token from response
      const user = res.data?.user || res.data?.data?.user || res.data;
      const token = res.data?.token || res.data?.data?.token;

      // Fallback decoding if user object is not directly present but token is
      let finalUser = user;
      if (!user && token) {
        try {
          finalUser = jwtDecode<any>(token);
        } catch {}
      }

      if (!finalUser) {
        throw new Error("No user profile returned from server");
      }

      login(finalUser, token);

      toast.success("Logged in successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const data = await apiClient("/api/v1/auth/google");
      window.location.href = data.url;
    } catch (error: any) {
      toast.error(error.message || "Google login failed.");
    }
  };

  const handleGithubLogin = async () => {
    try {
      const data = await apiClient("/api/v1/auth/github");
      window.location.href = data.url;
    } catch (error: any) {
      toast.error(error.message || "GitHub login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-white py-20 pt-36 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-300 overflow-hidden md:max-w-xl">
        <div className="p-8">
          <p className="text-center text-gray-600 mb-8">
            Sign in to access your account
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
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
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#38A169] focus:ring-2 focus:ring-[#38A169]/30 outline-none transition duration-200 pr-10"
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
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#38A169] focus:ring-2 focus:ring-[#38A169]/30 outline-none transition duration-200 pr-10"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 bg-[#38A169] hover:bg-[#2F855A] focus:ring-[#38A169] focus:ring-offset-2 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? "Signing in..." : "Sign in"}
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
                  Or continue with
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
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
