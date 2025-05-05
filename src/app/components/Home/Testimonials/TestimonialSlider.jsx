"use client";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "UX Designer at TechCorp",
    quote:
      "Landing my dream job was effortless with this platform. The personalized recommendations matched me with perfect opportunities.",
    avatar: "/avatars/sarah.jpg",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Senior Developer at NexTech",
    quote:
      "The interview preparation resources helped me stand out from other candidates. I received three offers within two weeks!",
    avatar: "/avatars/michael.jpg",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Product Manager at InnoSoft",
    quote:
      "After months of unsuccessful searching elsewhere, I found my ideal position here within days. The salary insights were invaluable.",
    avatar: "/avatars/emma.jpg",
  },
  {
    id: 4,
    name: "David Kim",
    role: "DevOps Engineer at CloudNine",
    quote:
      "The skill assessment tests gave me the confidence to apply for more senior roles than I would have considered otherwise.",
    avatar: "/avatars/david.jpg",
  },
  {
    id: 5,
    name: "David Kim",
    role: "DevOps Engineer at CloudNine",
    quote:
      "The skill assessment tests gave me the confidence to apply for more senior roles than I would have considered otherwise.",
    avatar: "/avatars/david.jpg",
  },
  {
    id: 6,
    name: "David Kim",
    role: "DevOps Engineer at CloudNine",
    quote:
      "The skill assessment tests gave me the confidence to apply for more senior roles than I would have considered otherwise.",
    avatar: "/avatars/david.jpg",
  },
];

export function TestimonialSlider() {
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  // Create pairs of testimonials for desktop view
  const testimonialPairs = [];
  for (let i = 0; i < testimonials.length; i += 2) {
    testimonialPairs.push([testimonials[i], testimonials[i + 1]]);
  }

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const nextTestimonial = () => {
    setCurrentPairIndex((prev) =>
      prev === testimonialPairs.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentPairIndex((prev) =>
      prev === 0 ? testimonialPairs.length - 1 : prev - 1
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 0.6,
      },
    },
  };

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="text-center mb-12"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            Success Stories
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-gray-600">
            Hear from people who found their dream jobs
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="relative"
        >
          {/* Navigation Arrows */}
          <motion.div
            variants={itemVariants}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full bg-white shadow-md hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full bg-white shadow-md hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </motion.div>

          {/* Testimonial Cards */}
          <div className="px-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPairIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Mobile: Show first testimonial of the pair */}
                <motion.div className="md:hidden">
                  <Card className="overflow-hidden h-full">
                    <CardContent className="p-8">
                      <div className="flex flex-col items-center gap-8">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-red-100">
                          <motion.img
                            src={testimonialPairs[currentPairIndex][0].avatar}
                            alt={testimonialPairs[currentPairIndex][0].name}
                            className="w-full h-full object-cover"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          />
                        </div>
                        <div className="text-center">
                          <p className="text-lg italic mb-4">
                            "{testimonialPairs[currentPairIndex][0].quote}"
                          </p>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {testimonialPairs[currentPairIndex][0].name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {testimonialPairs[currentPairIndex][0].role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Desktop: Show both testimonials in the pair */}
                {testimonialPairs[currentPairIndex].map(
                  (testimonial, index) => (
                    <motion.div
                      key={testimonial.id}
                      className="hidden md:block"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden h-full">
                        <CardContent className="p-8">
                          <div className="flex flex-col items-center gap-8">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-red-100">
                              <motion.img
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                className="w-full h-full object-cover"
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                              />
                            </div>
                            <div className="text-center">
                              <p className="text-lg italic mb-4">
                                "{testimonial.quote}"
                              </p>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {testimonial.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {testimonial.role}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Indicators */}
          <motion.div
            variants={containerVariants}
            className="flex justify-center mt-8 space-x-2"
          >
            {testimonialPairs.map((_, index) => (
              <motion.button
                key={index}
                variants={itemVariants}
                onClick={() => setCurrentPairIndex(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  currentPairIndex === index ? "bg-red-600 w-6" : "bg-gray-300"
                }`}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
