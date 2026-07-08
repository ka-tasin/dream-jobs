"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/utils/axiosFetcher";
import { JobCard } from "@/custom-components/Home/TopJobs/JobCard";
import { DreamJobsLoader } from "@/custom-components/common/DataLoading/DataLoading";
import Link from "next/link";

interface Job {
  id: string;
  title: string;
  description: string;
  role: string;
  company: string;
  location: string;
  type: string;
  officeTime: string;
  salary: number;
  postedAt: string;
  deadline: string;
  createdBy: string;
}

export default function AllJobsPage() {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");

  // Fetch jobs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient("/api/v1/jobs");
        setAllJobs(response.data || []);
        setFilteredJobs(response.data?.data || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters
  useEffect(() => {
    let results = allJobs;

    if (searchTerm) {
      results = results.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter) {
      results = results.filter((job) =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (jobTypeFilter !== "all") {
      results = results.filter(
        (job) => job.type === jobTypeFilter.toUpperCase()
      );
    }

    setFilteredJobs(results);
  }, [searchTerm, locationFilter, jobTypeFilter, allJobs]);

  if (loading) return <DreamJobsLoader title={"All Job Opportunities"} />;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="container mx-auto min-h-screen mt-24 py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl text-center font-semibold text-black mb-8">
          All Job Opportunities
        </h2>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 p-6 bg-white rounded-lg border border-gray-300 shadow-xs">
          {/* Search */}
          <Input
            type="text"
            placeholder="Search by job title, company, or role"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 py-2 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />

          {/* Location */}
          <Input
            type="text"
            placeholder="Filter by location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="pl-4 py-2 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Job Type Quick Filters */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <div className="flex w-full justify-between items-center">
            <div>
              {["all", "PART_TIME", "FULL_TIME", "REMOTE", "INTERNSHIP"].map(
                (type) => (
                  <Button
                    key={type}
                    size="sm"
                    variant={jobTypeFilter === type ? "default" : "outline"}
                    className={`px-6 py-3 rounded-full ${
                      jobTypeFilter === type
                        ? "bg-gray-800 text-white"
                        : "border-gray-300"
                    }`}
                    onClick={() => setJobTypeFilter(type)}
                  >
                    {type.replace("_", " ").toUpperCase()}
                  </Button>
                )
              )}
            </div>
            <div>
              <div className="flex justify-end mb-6">
                <Link href="/add-jobs">
                  <Button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2">
                    + Add Job
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Job Count */}
        <div className="text-gray-600 mb-6 font-medium">
          Showing {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"}
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div key={job.id}>
                <JobCard
                  title={job.title}
                  company={job.company}
                  location={job.location}
                  salary={job.salary}
                  type={job.type}
                  id={job.id}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-500">Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </section>
  );
}
