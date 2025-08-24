"use client";
import { motion } from "framer-motion";

export const DreamJobsLoader = ({ title }) => {
  return (
    <div className="flex my-20 flex-col items-center justify-center gap-6 min-h-[200px]">
      {/* Animated Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2"
      >
        <motion.span
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-4xl font-semibold text-black"
        >
          {title}
        </motion.span>
      </motion.div>

      {/* Loading Bar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="h-1.5 bg-gradient-to-r from-red-700 via-amber-500 to-red-700 rounded-full max-w-md"
      />

      {/* Status Text */}
      <motion.p
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-gray-400 mt-4 text-center"
      >
        Finding your dream opportunities...
      </motion.p>

      {/* Job Card Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
        {[1, 2, 3].map((item) => (
          <motion.div
            key={item}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: item * 0.2,
            }}
            className="border border-gray-200 rounded-lg p-6"
          >
            {/* Title */}
            <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>

            {/* Company */}
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>

            {/* Location & Type */}
            <div className="flex mt-4 gap-2">
              <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
              <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
              <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
            </div>

            {/* Salary & Apply Button */}
            <div className="flex justify-between items-center mt-6">
              <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              <div className="h-8 w-20 bg-gray-300 rounded-md"></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
