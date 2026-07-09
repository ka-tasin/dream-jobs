"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Phone, MapPin, Linkedin, Twitter, Github } from "lucide-react";

export function Footer() {
  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about-us" },
        { name: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Quick Links",
      links: [
        { name: "Find Jobs", href: "/jobs" },
        { name: "My Dashboard", href: "/dashboard" },
      ],
    },
  ];

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5 text-red-650" />,
      text: "support@dreamjobs.com",
      href: "mailto:support@dreamjobs.com",
    },
    {
      icon: <Phone className="w-5 h-5 text-red-650" />,
      text: "+880 1234-567890",
      href: "tel:+8801234567890",
    },
    {
      icon: <MapPin className="w-5 h-5 text-red-650" />,
      text: "Dhaka, Bangladesh",
      href: "/contact",
    },
  ];

  const socialLinks = [
    {
      icon: <Linkedin className="w-5 h-5" />,
      href: "https://linkedin.com",
    },
    {
      icon: <Twitter className="w-5 h-5" />,
      href: "https://twitter.com",
    },
    {
      icon: <Github className="w-5 h-5" />,
      href: "https://github.com",
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              <span className="text-red-600">Dream</span>Jobs
            </h3>
            <p className="mb-6">
              Empowering professionals to find their dream careers through
              innovative tools and personalized guidance.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-colors"
                  whileHover={{ y: -2, backgroundColor: "#1E1E1E" }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer links */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={linkIndex}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link
                      href={link.href}
                      className="hover:text-red-500 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex items-start space-x-3"
                >
                  <span>{item.icon}</span>
                  <Link
                    href={item.href}
                    className="hover:text-red-500 transition-colors"
                  >
                    {item.text}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 my-12"
        />

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} DreamJobs. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
