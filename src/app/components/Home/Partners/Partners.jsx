"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const partners = [
  "Amazon",
  "Google",
  "Microsoft",
  "Apple",
  "Netflix",
  "Tesla",
  "Adobe",
  "Spotify",
  "Uber",
  "Airbnb",
];

export function PartnersSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section ref={ref} className="py-16">
      <div className="px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center mb-12 text-red-700"
        >
          Our Trusted Partners
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="overflow-hidden"
        >
          <div className="relative">
            {/* First Marquee */}
            <motion.div
              animate={{
                x: ["0%", "-100%"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="flex whitespace-nowrap py-4"
            >
              {[...partners, ...partners].map((partner, i) => (
                <div key={`first-${i}`} className="inline-block mx-8">
                  <span className="text-2xl font-medium text-black">
                    {partner}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Second Marquee (reverse direction) */}
            <motion.div
              animate={{
                x: ["-100%", "0%"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="flex whitespace-nowrap py-4"
            >
              {[...partners, ...partners].map((partner, i) => (
                <div key={`second-${i}`} className="inline-block mx-8">
                  <span className="text-2xl font-medium text-black">
                    {partner}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
