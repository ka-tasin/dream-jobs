"use client";
import { useState, useEffect } from "react";
import apiClient from "@/lib/utils/axiosFetcher";
import { JobCard } from "@/custom-components/Home/TopJobs/JobCard";
import { DreamJobsLoader } from "@/custom-components/common/DataLoading/DataLoading";
import Link from "next/link";
import { Search, Briefcase, Filter, X, RefreshCw } from "lucide-react";

interface Job {
  id: string;
  title: string;
  description: string;
  role: string; // mapped to position
  position: string;
  company: string;
  location: string;
  type: string;
  workMode: string;
  experience: string;
  officeTime: string;
  salary: number;
  salaryMax?: number;
  postedAt: string;
  deadline: string;
  createdBy: string;
}

export default function AllJobsPage() {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
  const [selectedWorkModes, setSelectedWorkModes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");

  // Mobile Filter Drawer State
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch jobs on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient("/api/v1/jobs");
        // API response structure could be raw array or wrapped in { data: [...] }
        const jobsArray = response.data?.data || response.data || response || [];
        setAllJobs(jobsArray);
        setFilteredJobs(jobsArray);
      } catch (err: any) {
        setError(err.message || "Failed to fetch jobs listings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters whenever states change
  useEffect(() => {
    let results = allJobs;

    // 1. Keyword search (title, company, position, description)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (job) =>
          job.title?.toLowerCase().includes(term) ||
          job.company?.toLowerCase().includes(term) ||
          job.position?.toLowerCase().includes(term) ||
          job.description?.toLowerCase().includes(term)
      );
    }

    // 2. Experience Level Filter
    if (selectedExperiences.length > 0) {
      results = results.filter((job) =>
        selectedExperiences.includes(job.experience)
      );
    }

    // 3. Work Mode Filter
    if (selectedWorkModes.length > 0) {
      results = results.filter((job) =>
        selectedWorkModes.includes(job.workMode)
      );
    }

    // 4. Job Type Filter
    if (selectedTypes.length > 0) {
      results = results.filter((job) =>
        selectedTypes.includes(job.type)
      );
    }

    // 5. Salary Range Filter
    if (minSalary) {
      const min = parseFloat(minSalary);
      if (!isNaN(min)) {
        results = results.filter((job) => {
          // check if base salary or max salary is greater than/equal to min salary
          const baseSalary = job.salary;
          const maxSalaryVal = job.salaryMax || baseSalary;
          return baseSalary >= min || maxSalaryVal >= min;
        });
      }
    }

    if (maxSalary) {
      const max = parseFloat(maxSalary);
      if (!isNaN(max)) {
        results = results.filter((job) => {
          // check if base salary is less than/equal to max salary
          const baseSalary = job.salary;
          return baseSalary <= max;
        });
      }
    }

    setFilteredJobs(results);
  }, [searchTerm, selectedExperiences, selectedWorkModes, selectedTypes, minSalary, maxSalary, allJobs]);

  // Toggle handlers for array filters
  const handleToggleExperience = (exp: string) => {
    setSelectedExperiences((prev) =>
      prev.includes(exp) ? prev.filter((item) => item !== exp) : [...prev, exp]
    );
  };

  const handleToggleWorkMode = (mode: string) => {
    setSelectedWorkModes((prev) =>
      prev.includes(mode) ? prev.filter((item) => item !== mode) : [...prev, mode]
    );
  };

  const handleToggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    );
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedExperiences([]);
    setSelectedWorkModes([]);
    setSelectedTypes([]);
    setMinSalary("");
    setMaxSalary("");
  };

  if (loading) return <DreamJobsLoader title={"All Job Opportunities"} />;
  if (error) return <div className="text-center py-20 text-red-650 mt-20">{error}</div>;

  // Filter Sidebar Content Component (Reusable for Desktop & Mobile drawer)
  const FilterSidebarContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" /> Filter Criteria
        </h3>
        <button
          onClick={handleResetFilters}
          className="text-xs font-semibold text-slate-500 hover:text-red-650 flex items-center gap-1 bg-transparent border-0 cursor-pointer transition duration-150"
        >
          <RefreshCw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Keyword Search */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Search Keyword</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Title, company, skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Job Type (Full-time, Part-time, etc.) */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Job Type</label>
        <div className="space-y-2">
          {[
            { value: "FULL_TIME", label: "Full-time" },
            { value: "PART_TIME", label: "Part-time" },
            { value: "CONTRACT", label: "Contract" },
            { value: "INTERNSHIP", label: "Internship" },
            { value: "FREELANCE", label: "Freelance" },
          ].map((type) => (
            <label key={type.value} className="flex items-center gap-2.5 text-sm text-slate-650 hover:text-slate-900 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type.value)}
                onChange={() => handleToggleType(type.value)}
                className="w-4.5 h-4.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span>{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Work Mode (Remote, On-site, etc.) */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Work Mode</label>
        <div className="space-y-2">
          {[
            { value: "REMOTE", label: "Remote" },
            { value: "ONSITE", label: "On-site" },
            { value: "HYBRID", label: "Hybrid" },
          ].map((mode) => (
            <label key={mode.value} className="flex items-center gap-2.5 text-sm text-slate-650 hover:text-slate-900 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={selectedWorkModes.includes(mode.value)}
                onChange={() => handleToggleWorkMode(mode.value)}
                className="w-4.5 h-4.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span>{mode.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Experience Level</label>
        <div className="space-y-2">
          {[
            { value: "ENTRY", label: "Entry (0-1 years)" },
            { value: "JUNIOR", label: "Junior (1-3 years)" },
            { value: "MID", label: "Mid (3-5 years)" },
            { value: "SENIOR", label: "Senior (5-8 years)" },
            { value: "LEAD", label: "Lead (8+ years)" },
          ].map((exp) => (
            <label key={exp.value} className="flex items-center gap-2.5 text-sm text-slate-650 hover:text-slate-900 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={selectedExperiences.includes(exp.value)}
                onChange={() => handleToggleExperience(exp.value)}
                className="w-4.5 h-4.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span>{exp.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Salary Range */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Salary Range (BDT)</label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <input
            type="number"
            placeholder="Min BDT"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <input
            type="number"
            placeholder="Max BDT"
            value={maxSalary}
            onChange={(e) => setMaxSalary(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>
    </div>
  );

  return (
    <section className="min-h-screen bg-slate-50/50 mt-20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <FilterSidebarContent />
            </div>
          </aside>

          {/* Job Listings Column */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Header / Top actions panel */}
            <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div>
                <span className="text-gray-500 text-sm font-semibold">Available Job Postings</span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  Showing {filteredJobs.length} {filteredJobs.length === 1 ? "job option" : "job options"}
                </h2>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm transition duration-150 cursor-pointer shadow-xs"
                >
                  <Filter className="w-4 h-4 text-gray-500" /> Filters
                </button>
                <Link href="/add-jobs">
                  <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 text-sm transition duration-150 cursor-pointer shadow-xs border-0">
                    + Add Job Listing
                  </button>
                </Link>
              </div>
            </div>

            {/* Jobs Cards Grid */}
            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
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
            ) : (
              <div className="text-center py-20 bg-white border border-slate-200 rounded-xl shadow-xs">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-800">No jobs match your criteria</h3>
                <p className="text-gray-500 text-sm mt-1">Adjust your sidebar filters or click &quot;Reset&quot; to browse all listings.</p>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Mobile Drawer / Overlay Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden" aria-modal="true" role="dialog">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={() => setShowMobileFilters(false)}></div>
          
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-xl flex flex-col">
              <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Job Filters</h2>
                <button 
                  className="p-1 hover:bg-slate-100 rounded-lg text-gray-500 bg-transparent border-0 cursor-pointer"
                  onClick={() => setShowMobileFilters(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                <FilterSidebarContent />
              </div>

              <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-sm transition cursor-pointer border-0"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
