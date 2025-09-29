"use client";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useInView } from "react-intersection-observer";

const offers = [
  {
    title: "Premium Job Listings",
    description: "Access to exclusive high-paying jobs from top companies",
    icon: "💼",
  },
  {
    title: "Career Guidance",
    description: "Personalized career coaching and resume reviews",
    icon: "🧭",
  },
  {
    title: "Skill Assessments",
    description: "Validate your skills with industry-recognized tests",
    icon: "📊",
  },
  {
    title: "Interview Prep",
    description: "Mock interviews with real-time feedback",
    icon: "🎤",
  },
  {
    title: "Salary Insights",
    description: "See how your compensation compares to the market",
    icon: "💰",
  },
  {
    title: "Fast Applications",
    description: "One-click apply to multiple jobs",
    icon: "⚡",
  },
];

export function WhatWeOffer() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Animation variants for container
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  // Different entry directions for each card
  const cardVariants = {
    hidden: (index) => ({
      opacity: 0,
      ...(index % 4 === 0
        ? { y: -50 } // top
        : index % 4 === 1
        ? { y: 50 } // bottom
        : index % 4 === 2
        ? { x: -50 } // left
        : { x: 50 }), // right
    }),
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 0.8,
      },
    },
  };

  return (
    <section ref={ref} className="container mx-auto py-20 px-4 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-semibold text-gray-900 mb-4">
          What We Offer
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Everything you need to land your dream job in one place
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={container}
        className="grid md:grid-cols-3 gap-6"
      >
        {offers.map((offer, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={cardVariants}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Card className="h-full p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <CardHeader className="items-center text-center p-0">
                <div className="text-4xl mb-4">{offer.icon}</div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {offer.title}
                </CardTitle>
                <CardDescription className="mt-2 text-gray-600">
                  {offer.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
