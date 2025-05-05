"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import apiClient from "@/lib/utils/axiosFetcher";
import { JobCard } from "../components/Home/TopJobs/JobCard";
import { DreamJobsLoader } from "../components/common/DataLoading/DataLoading";

export default function AllJobsPage() {
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("/jobs");
        setAllJobs(response.data || response);
        setFilteredJobs(response.data || response);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let results = allJobs;

    // Apply search filter
    if (searchTerm) {
      results = results.filter(
        (job) =>
          job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.skills?.some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Apply location filter
    if (locationFilter) {
      results = results.filter((job) =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Apply job type filter
    if (jobTypeFilter !== "all") {
      results = results.filter((job) => job.job_type === jobTypeFilter);
    }

    setFilteredJobs(results);
  }, [searchTerm, locationFilter, jobTypeFilter, allJobs]);

  if (loading) return <DreamJobsLoader title={"All Job Opportunities"} />;
  if (error) return <div>Error: {error}</div>;

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className="container mx-auto min-h-screen mt-24 py-12 bg-white"
    >
      <div className="container mx-auto px-4">
        <motion.h2
          variants={itemVariants}
          className="text-4xl text-center font-semibold text-black mb-8"
        >
          All Job Opportunities
        </motion.h2>

        {/* Search and Filter Bar */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row gap-4 mb-8 p-6 bg-white rounded-lg border border-gray-300 shadow-sm"
        >
          {/* Search Input with Icon */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <Input
              type="text"
              placeholder="Search by job title, company, or skills"
              className="pl-10 py-6 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Location Input with Icon */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <Input
              type="text"
              placeholder="Filter by location"
              className="pl-10 py-6 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>

          {/* Search Button */}
          <Button
            className="py-6 px-8 bg-amber-600 hover:bg-amber-700 text-white font-medium"
            onClick={() => {}} // Add your search handler if needed
          >
            Search Jobs
            <svg
              className="ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </motion.div>

        {/* Job Type Quick Filters */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap gap-2 mb-8 justify-center"
        >
          {["All", "Remote", "On-site", "Hybrid", "Internship"].map((type) => {
            const isSelected =
              (type === "All" && jobTypeFilter === "all") ||
              jobTypeFilter === type;

            return (
              <Button
                key={type}
                variant={isSelected ? "default" : "outline"}
                className={`px-6 py-3 rounded-full ${
                  isSelected ? "bg-gray-800 text-white" : "border-gray-300"
                }`}
                onClick={() => {
                  setJobTypeFilter(type === "All" ? "all" : type);
                }}
              >
                {type}
              </Button>
            );
          })}
        </motion.div>

        {/* Job Count */}
        <motion.div variants={itemVariants} className="text-gray-600 mb-6">
          Showing {filteredJobs.length}{" "}
          {filteredJobs.length === 1 ? "job" : "jobs"}
        </motion.div>

        {/* Jobs Grid */}
        {filteredJobs.length > 0 ? (
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredJobs.map((job) => (
              <motion.div key={job.id} variants={itemVariants}>
                <JobCard
                  title={job.job_title}
                  company={job.company}
                  location={job.location}
                  salary_min={job.salary_min}
                  salary_max={job.salary_max}
                  type={job.job_type}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={itemVariants}
            className="text-center py-12 bg-gray-50 rounded-lg"
          >
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-500">Try adjusting your search filters</p>
          </motion.div>
        )}

        {/* Load More Button (if needed) */}
        {filteredJobs.length > 9 && (
          <motion.div
            variants={itemVariants}
            className="flex justify-center mt-10"
          >
            <Button className="px-8 py-6 bg-gray-800 hover:bg-gray-700 text-white">
              Load More Jobs
            </Button>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
