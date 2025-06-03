"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How do I apply for jobs on DreamJobs?",
      answer:
        "Create an account, upload your resume, and click 'Apply' on any job listing. Our one-click application makes it easy!",
    },
    {
      question: "Is DreamJobs free for job seekers?",
      answer:
        "Yes! DreamJobs is completely free for job seekers. We only charge employers for premium recruitment features.",
    },
    {
      question: "How often are new jobs added?",
      answer:
        "We add new jobs daily from verified employers. Check back regularly or set up job alerts for your preferred positions.",
    },
    {
      question: "Can I apply for remote jobs internationally?",
      answer:
        "Absolutely! We have remote opportunities from companies worldwide. Filter by 'Remote' and check location requirements.",
    },
    {
      question: "How do I get noticed by recruiters?",
      answer:
        "Complete your profile with skills, experience, and a professional photo. Our AI matching system helps highlight top candidates.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="container mx-auto py-16 px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-3xl font-bold text-center mb-12 text-gray-900"
      >
        Frequently Asked Questions
      </motion.h2>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
            }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div
              className={`border border-gray-200 rounded-lg overflow-hidden transition-all ${
                activeIndex === index ? "shadow-md" : "hover:shadow-sm"
              }`}
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center bg-white hover:bg-gray-50"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {faq.question}
                </h3>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: activeIndex === index ? "auto" : 0,
                  opacity: activeIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-4 pt-2 bg-gray-50 text-gray-700">
                  {faq.answer}
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
