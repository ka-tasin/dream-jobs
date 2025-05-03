"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobCard } from "./JobCard";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function TopJobsSection() {
  const [tabKey, setTabKey] = useState("featured");
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const tabContentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className="container mx-auto py-16 bg-white"
    >
      <div className="container mx-auto px-4">
        <motion.h2
          variants={itemVariants}
          className="text-4xl text-center font-semibold text-black mb-12"
        >
          Top Jobs Available
        </motion.h2>

        <motion.div variants={itemVariants}>
          <Tabs
            defaultValue="featured"
            className="w-full"
            onValueChange={(value) => setTabKey(value)}
          >
            <TabsList className="grid w-[50%] grid-cols-3 mx-auto bg-white border border-gray-200">
              <TabsTrigger
                value="featured"
                className="data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:bg-gray-800 text-black"
              >
                Featured
              </TabsTrigger>
              <TabsTrigger
                value="trending"
                className="data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:bg-gray-800 text-black"
              >
                Trending
              </TabsTrigger>
              <TabsTrigger
                value="recent"
                className="data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:bg-gray-800 text-black"
              >
                Recent
              </TabsTrigger>
            </TabsList>

            <motion.div
              key={tabKey}
              initial="hidden"
              animate="visible"
              variants={tabContentVariants}
            >
              <TabsContent value="featured" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mx-14">
                  <JobCard
                    title="Senior Frontend Developer"
                    company="TechCorp"
                    location="Remote"
                    salary="$120,000 - $150,000"
                    type="Full-time"
                  />
                  <JobCard
                    title="UX Designer"
                    company="DesignHub"
                    location="New York, NY"
                    salary="$90,000 - $110,000"
                    type="Full-time"
                  />
                  <JobCard
                    title="DevOps Engineer"
                    company="CloudSystems"
                    location="San Francisco, CA"
                    salary="$130,000 - $160,000"
                    type="Full-time"
                  />
                </div>
              </TabsContent>

              <TabsContent value="trending" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mx-14">
                  <JobCard
                    title="AI Researcher"
                    company="FutureAI"
                    location="Boston, MA"
                    salary="$140,000 - $180,000"
                    type="Full-time"
                  />
                  <JobCard
                    title="Data Scientist"
                    company="AnalyticsPro"
                    location="Remote"
                    salary="$110,000 - $140,000"
                    type="Full-time"
                  />
                </div>
              </TabsContent>

              <TabsContent value="recent" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6  mx-14">
                  <JobCard
                    title="Product Manager"
                    company="ProductLabs"
                    location="Chicago, IL"
                    salary="$100,000 - $130,000"
                    type="Full-time"
                  />
                  <JobCard
                    title="Backend Engineer"
                    company="ServerTech"
                    location="Austin, TX"
                    salary="$115,000 - $145,000"
                    type="Full-time"
                  />
                  <JobCard
                    title="Marketing Specialist"
                    company="GrowthMarketing"
                    location="Remote"
                    salary="$70,000 - $90,000"
                    type="Full-time"
                  />
                </div>
              </TabsContent>
            </motion.div>
          </Tabs>
        </motion.div>

        <div className="flex justify-center">
          <Button
            variants={itemVariants}
            className="mt-8 hover:scale-110 text-center py-5"
          >
            View All Jobs
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
