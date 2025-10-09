"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="flex h-screen flex-col items-center justify-center bg-background px-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-7xl font-bold text-foreground"
      >
        404
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-4 text-center text-lg text-muted-foreground"
      >
        Oops! The page you are looking for doesn’t exist.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-6"
      >
        <Link href="/">
          <Button variant={"default"} size="lg" className="px-6 py-2">
            Go Home
          </Button>
        </Link>
      </motion.div>
    </main>
  );
}
