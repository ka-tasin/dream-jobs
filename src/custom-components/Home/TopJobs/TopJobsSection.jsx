"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobCard } from "./JobCard";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/utils/axiosFetcher";
import { ProgressLoader } from "../../common/PageLoading/Loading";
import { DreamJobsLoader } from "../../common/DataLoading/DataLoading";
import Link from "next/link";

export function TopJobsSection() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabKey, setTabKey] = useState("all");
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Group jobs by their type and take first 3 of each
  const groupedJobs = jobs.reduce((acc, job) => {
    const type = job.job_type;
    if (!acc[type]) {
      acc[type] = [];
    }
    if (acc[type].length < 3) {
      acc[type].push(job);
    }
    return acc;
  }, {});

  // Get unique job types
  const jobTypes = [...new Set(jobs.map((job) => job.job_type))];

  // Animation variants (keep your original animations)
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient("/jobs");
        setJobs(response.data || response);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <DreamJobsLoader title={"Top Jobs Available"} />;
  if (error) return <div>Error: {error}</div>;

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className="container mx-auto py-20 bg-white"
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
            defaultValue="all"
            className="w-full"
            onValueChange={(value) => setTabKey(value)}
          >
            <TabsList className="grid w-[50%] grid-cols-3 mx-auto bg-white border border-gray-200">
              <TabsTrigger
                value="all"
                className="data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:bg-gray-800 text-black"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="remote"
                className="data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:bg-gray-800 text-black"
              >
                Remote
              </TabsTrigger>
              <TabsTrigger
                value="on-site"
                className="data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:bg-gray-800 text-black"
              >
                On-site
              </TabsTrigger>
            </TabsList>

            <motion.div
              key={tabKey}
              initial="hidden"
              animate="visible"
              variants={tabContentVariants}
            >
              {/* All Jobs Tab */}
              <TabsContent value="all" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mx-14">
                  {jobs.slice(0, 3).map((job) => (
                    <JobCard
                      key={job._id}
                      title={job.job_title}
                      company={job.company}
                      location={job.location}
                      salary_min={job.salary_min}
                      salary_max={job.salary_max}
                      type={job.job_type}
                    />
                  ))}
                </div>
              </TabsContent>

              {/* Remote Jobs Tab */}
              <TabsContent value="remote" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mx-14">
                  {groupedJobs["Remote"]?.map((job) => (
                    <JobCard
                      key={job.id}
                      title={job.job_title}
                      company={job.company}
                      location={job.location}
                      salary_min={job.salary_min}
                      salary_max={job.salary_max}
                      type={job.job_type}
                    />
                  ))}
                </div>
              </TabsContent>

              {/* On-site Jobs Tab */}
              <TabsContent value="on-site" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mx-14">
                  {groupedJobs["On-site"]?.map((job) => (
                    <JobCard
                      key={job.id}
                      title={job.job_title}
                      company={job.company}
                      location={job.location}
                      salary_min={job.salary_min}
                      salary_max={job.salary_max}
                      type={job.job_type}
                    />
                  ))}
                </div>
              </TabsContent>
            </motion.div>
          </Tabs>
        </motion.div>

        <div className="flex justify-center">
          <Link href={"/jobs"}>
            {" "}
            <Button
              variants={itemVariants}
              className="mt-8 hover:scale-110 text-center py-5"
            >
              View All Jobs
            </Button>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
