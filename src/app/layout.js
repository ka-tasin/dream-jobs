import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/custom-components/common/Navbar/Navbar";
import { Footer } from "@/custom-components/common/Footer/Footer";
import { ToastContainer } from "react-toastify";
import AuthProvider from "@/contexts/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "Dream Jobs",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Navbar />
          {children}
          <ToastContainer />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
