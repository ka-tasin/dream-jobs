"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobCard } from "./JobCard";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/utils/axiosFetcher";
import { DreamJobsLoader } from "@/custom-components/common/DataLoading/DataLoading";
import Link from "next/link";

export function TopJobsSection() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabKey, setTabKey] = useState("all");

  // Filter jobs based on type
  const remoteJobs = jobs.filter((job) => job.type === "REMOTE").slice(0, 3);
  const onsiteJobs = jobs
    .filter((job) => job.type === "FULL_TIME" || job.type === "PART_TIME")
    .slice(0, 3);
  const internshipJobs = jobs
    .filter((job) => job.type === "INTERNSHIP")
    .slice(0, 3);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient("/api/v1/jobs");
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
    <section className="w-full py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center font-semibold text-black mb-8 sm:mb-10 lg:mb-12">
          Top Jobs Available
        </h2>

        <div>
          <Tabs
            defaultValue="all"
            className="w-full"
            onValueChange={(value) => setTabKey(value)}
          >
            <TabsList className="grid w-full sm:w-[85%] md:w-[70%] lg:w-[60%] grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-0 mx-auto bg-white border border-gray-200 p-1 sm:p-0 h-auto">
              <TabsTrigger
                value="all"
                className="data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:bg-gray-800 text-black text-sm sm:text-base py-2 sm:py-2.5"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="remote"
                className="data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:bg-gray-800 text-black text-sm sm:text-base py-2 sm:py-2.5"
              >
                Remote
              </TabsTrigger>
              <TabsTrigger
                value="on-site"
                className="data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:bg-gray-800 text-black text-sm sm:text-base py-2 sm:py-2.5"
              >
                On-site
              </TabsTrigger>
              <TabsTrigger
                value="internship"
                className="data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:bg-gray-800 text-black text-sm sm:text-base py-2 sm:py-2.5"
              >
                Internship
              </TabsTrigger>
            </TabsList>

            <div key={tabKey}>
              {/* All Jobs Tab */}
              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-0 sm:px-4 md:px-8 lg:px-14">
                  {jobs.slice(0, 3).map((job) => (
                    <JobCard
                      key={job.id}
                      title={job.title}
                      company={job.company}
                      location={job.location}
                      salary={job.salary}
                      type={job.type}
                      id={job.id}
                    />
                  ))}
                </div>
              </TabsContent>

              {/* Remote Jobs Tab */}
              <TabsContent value="remote" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-0 sm:px-4 md:px-8 lg:px-14">
                  {remoteJobs.length > 0 ? (
                    remoteJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        title={job.title}
                        company={job.company}
                        location={job.location}
                        salary={job.salary}
                        type={job.type}
                        id={job.id}
                      />
                    ))
                  ) : (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-8 text-gray-500">
                      No remote jobs available at the moment
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* On-site Jobs Tab */}
              <TabsContent value="on-site" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-0 sm:px-4 md:px-8 lg:px-14">
                  {onsiteJobs.length > 0 ? (
                    onsiteJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        title={job.title}
                        company={job.company}
                        location={job.location}
                        salary={job.salary}
                        type={job.type}
                        id={job.id}
                      />
                    ))
                  ) : (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-8 text-gray-500">
                      No on-site jobs available at the moment
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Internship Jobs Tab */}
              <TabsContent value="internship" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-0 sm:px-4 md:px-8 lg:px-14">
                  {internshipJobs.length > 0 ? (
                    internshipJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        title={job.title}
                        company={job.company}
                        location={job.location}
                        salary={job.salary}
                        id={job.id}
                        type={job.type}
                      />
                    ))
                  ) : (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-8 text-gray-500">
                      No internship positions available at the moment
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="flex justify-center px-4 mt-8">
          <Link href="/jobs" className="w-full sm:w-auto">
            <Button
              className="text-center py-4 sm:py-5 px-6 sm:px-8 text-sm sm:text-base w-full sm:w-auto hover:scale-102 transition duration-200"
            >
              View All Jobs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
