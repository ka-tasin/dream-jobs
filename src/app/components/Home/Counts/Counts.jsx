"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export function StatsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  return (
    <section ref={ref} className="py-20">
      <motion.div
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.3 },
          },
        }}
        className="container mx-auto px-4"
      >
        <div className="grid grid-cols-3 gap-4 p-8 bg-gray-100 rounded-xl">
          {/* Jobs Available */}
          <motion.div
            variants={{
              hidden: { y: 100, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  type: "spring",
                  damping: 10,
                  stiffness: 100,
                },
              },
            }}
            className="text-center"
          >
            <div className="h-20 flex items-center justify-center">
              <CountUp
                end={12500}
                suffix="+"
                className="text-5xl font-bold text-black"
              />
            </div>
            <h3 className="mt-2 text-lg font-medium text-black">
              Jobs Available
            </h3>
          </motion.div>

          {/* People Hired */}
          <motion.div
            variants={{
              hidden: { y: 100, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  type: "spring",
                  damping: 10,
                  stiffness: 100,
                  delay: 0.2,
                },
              },
            }}
            className="text-center"
          >
            <div className="h-20 flex items-center justify-center">
              <CountUp
                end={8700}
                suffix="+"
                className="text-5xl font-bold text-black"
              />
            </div>
            <h3 className="mt-2 text-lg font-medium text-black">
              People Hired
            </h3>
          </motion.div>

          {/* Companies */}
          <motion.div
            variants={{
              hidden: { y: 100, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  type: "spring",
                  damping: 10,
                  stiffness: 100,
                  delay: 0.3,
                },
              },
            }}
            className="text-center"
          >
            <div className="h-20 flex items-center justify-center">
              <CountUp
                end={500}
                suffix="+"
                className="text-5xl font-bold text-red-700"
              />
            </div>
            <h3 className="mt-2 text-lg font-medium text-black">
              Partner Companies
            </h3>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function CountUp({ end, duration = 2, suffix = "", className }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;

    let start = 0;
    const increment = end / (duration * 60); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [end, duration, started]);

  // Start counting when component mounts
  useEffect(() => {
    setStarted(true);
  }, []);

  return (
    <span className={className}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
