"use client";
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
      icon: <Mail className="w-4 h-4 text-red-650" />,
      text: "support@dreamjobs.com",
      href: "mailto:support@dreamjobs.com",
    },
    {
      icon: <Phone className="w-4 h-4 text-red-655" />,
      text: "+880 1234-567890",
      href: "tel:+8801234567890",
    },
    {
      icon: <MapPin className="w-4 h-4 text-red-655" />,
      text: "Dhaka, Bangladesh",
      href: "/contact",
    },
  ];

  const socialLinks = [
    {
      icon: <Linkedin className="w-4.5 h-4.5" />,
      href: "https://linkedin.com",
    },
    {
      icon: <Twitter className="w-4.5 h-4.5" />,
      href: "https://twitter.com",
    },
    {
      icon: <Github className="w-4.5 h-4.5" />,
      href: "https://github.com",
    },
  ];

  return (
    <footer className="bg-slate-100 text-slate-600 border-t border-slate-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              <span className="text-red-600">Dream</span>Jobs
            </h3>
            <p className="text-sm leading-relaxed mb-6">
              Empowering professionals to find their dream careers through
              innovative tools and personalized guidance.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border border-slate-200 hover:bg-slate-50 rounded-full p-2 text-slate-500 hover:text-slate-800 transition-colors duration-150"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-red-650 transition-colors duration-150"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact info */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <span className="mt-0.5">{item.icon}</span>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-red-655 transition-colors duration-150"
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 my-8" />

        {/* Copyright */}
        <div className="text-center">
          <p className="text-slate-400 text-xs">
            © {new Date().getFullYear()} DreamJobs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
