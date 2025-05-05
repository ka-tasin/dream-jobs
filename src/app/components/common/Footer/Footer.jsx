"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Phone, MapPin, Linkedin, Twitter, Github } from "lucide-react";

export function Footer() {
  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Press", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Job Search", href: "#" },
        { name: "Resume Builder", href: "#" },
        { name: "Interview Prep", href: "#" },
        { name: "Salary Calculator", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Policy", href: "#" },
      ],
    },
  ];

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5 text-red-600" />,
      text: "contact@careersolutions.com",
      href: "mailto:contact@careersolutions.com",
    },
    {
      icon: <Phone className="w-5 h-5 text-red-600" />,
      text: "+1 (555) 123-4567",
      href: "tel:+15551234567",
    },
    {
      icon: <MapPin className="w-5 h-5 text-red-600" />,
      text: "123 Career St, San Francisco, CA",
      href: "#",
    },
  ];

  const socialLinks = [
    {
      icon: <Linkedin className="w-5 h-5" />,
      href: "#",
    },
    {
      icon: <Twitter className="w-5 h-5" />,
      href: "#",
    },
    {
      icon: <Github className="w-5 h-5" />,
      href: "#",
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
              <span className="text-red-600">Career</span>Solutions
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
          className="text-center md:text-left flex flex-col md:flex-row justify-between items-center"
        >
          <p className="mb-4 md:mb-0">
            © {new Date().getFullYear()} CareerSolutions. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              href="#"
              className="hover:text-red-500 transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="hover:text-red-500 transition-colors text-sm"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="hover:text-red-500 transition-colors text-sm"
            >
              Cookies
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
