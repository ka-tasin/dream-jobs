"use client";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const EmailSubscription = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-gray-800 container mb-20 mt-10 mx-auto  py-12 px-4 sm:px-6 lg:px-8 rounded-xl shadow-lg"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Get the <span className="text-amber-400">Best Jobs</span> Delivered to
          Your Inbox
        </h2>
        <p className="text-lg text-gray-300 mb-8">
          Subscribe to receive curated job listings, career tips, and hiring
          trends.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Input
            type="email"
            placeholder="Your email address"
            className="max-w-md py-6 px-4 rounded-lg border-0 focus:ring-2 focus:ring-amber-400 bg-white text-gray-700"
          />
          <Button
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-6 px-8 rounded-lg transition-colors shadow-md"
          >
            Subscribe
          </Button>
        </div>

        <p className="mt-4 text-sm text-gray-400">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </motion.section>
  );
};

export default EmailSubscription;
