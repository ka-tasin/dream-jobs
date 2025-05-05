"use client";
import { motion } from "framer-motion";

export const ProgressLoader = () => {
  return (
    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="h-full bg-gradient-to-r from-red-700 to-amber-500"
      />
    </div>
  );
};
