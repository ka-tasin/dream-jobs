"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { 
  Briefcase, 
  MapPin, 
  Building, 
  ChevronRight, 
  ArrowLeft, 
  AlertCircle,
  ExternalLink
} from "lucide-react";

import apiClient from "@/lib/utils/axiosFetcher";
import { DetailsLoading } from "@/custom-components/common/DataLoading/DetailsLoading";
import fetchClient from "@/lib/utils/axiosFetcher";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface Job {
  id: string;
  title: string;
  description: string;
  position: string;
  employer?: {
    id: string;
    companyName: string;
    companyLogo?: string;
    website?: string;
  };
  location: string;
  type: string;
  experience?: string | null;
  workMode?: string | null;
  officeTime: string;
  salary?: number | null;
  salaryMax?: number | null;
  currency: string;
  postedAt: string;
  deadline: string;
  skills?: string[];
}

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [job, setJob] = useState<Job | null>(null);
  const [suggestedJobs, setSuggestedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [yearsOfExp, setYearsOfExp] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      toast.error("Please login to view details of this job listing");
      router.push("/login");
      return;
    }
    setToken(t);

    const fetchJobAndSuggestions = async () => {
      try {
        // Fetch current job
        const jobResponse = await apiClient(`/api/v1/jobs/${id}`, {
          headers: { Authorization: `Bearer ${t}` },
        });

        if (!jobResponse?.data) {
          setError("Job not found");
          setLoading(false);
          return;
        }

        const currentJob = jobResponse.data;
        setJob(currentJob);

        // Fetch all jobs for suggestions
        const allJobsResponse = await apiClient("/api/v1/jobs");
        const allJobs = allJobsResponse.data?.data || allJobsResponse.data || allJobsResponse || [];

        // Exclude current job and prioritize same job type
        const recommendations = allJobs
          .filter((j: Job) => j.id !== id)
          .sort((a: Job, b: Job) => {
            const matchA = a.type === currentJob.type ? 1 : 0;
            const matchB = b.type === currentJob.type ? 1 : 0;
            return matchB - matchA;
          })
          .slice(0, 3);

        setSuggestedJobs(recommendations);
      } catch (err: any) {
        setError(err.message || "Failed to fetch job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndSuggestions();
  }, [id, router]);

  const sanitizeUrl = (urlStr: string) => {
    if (!urlStr.trim()) return "";
    const trimmed = urlStr.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return trimmed;
  };

  const handleApply = async () => {
    if (!token) {
      toast.error("Please login first");
      return;
    }
    if (!resumeUrl.trim()) {
      toast.error("Resume URL is required");
      return;
    }

    const sanitizedResume = sanitizeUrl(resumeUrl);
    const sanitizedLinkedin = linkedinUrl.trim() ? sanitizeUrl(linkedinUrl) : null;
    const sanitizedPortfolio = portfolioUrl.trim() ? sanitizeUrl(portfolioUrl) : null;

    setSubmitting(true);
    try {
      await fetchClient("/api/v1/applications/apply", {
        method: "POST",
        body: {
          jobId: job?.id,
          resumeUrl: sanitizedResume,
          coverLetter: coverLetter.trim() || null,
          phoneNumber: phoneNumber.trim() || null,
          linkedinUrl: sanitizedLinkedin,
          portfolioUrl: sanitizedPortfolio,
          yearsOfExp: yearsOfExp.trim() ? Number(yearsOfExp) : null,
        },
      });

      toast.success("Application submitted successfully");
      setIsModalOpen(false);
      setResumeUrl("");
      setCoverLetter("");
      setPhoneNumber("");
      setLinkedinUrl("");
      setPortfolioUrl("");
      setYearsOfExp("");
    } catch (err: any) {
      toast.error(err.message || "Failed to apply");
    } finally {
      setSubmitting(false);
    }
  };

  const formatSalary = (sJob: Job) => {
    if (!sJob.salary && !sJob.salaryMax) return "Negotiable";
    if (sJob.salary && sJob.salaryMax) {
      return `৳${sJob.salary.toLocaleString()} - ৳${sJob.salaryMax.toLocaleString()}`;
    }
    return `৳${(sJob.salary || sJob.salaryMax)?.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <DetailsLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 mt-20">
        <div className="max-w-md w-full text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900">An Error Occurred</h2>
          <p className="text-gray-550">{error}</p>
          <button
            onClick={() => router.push("/jobs")}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold cursor-pointer border-0 transition"
          >
            Back to Job Listings
          </button>
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <main className="min-h-screen bg-slate-50/50 mt-20 pb-20 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-slate-500">
          <Link href="/jobs" className="hover:text-amber-600 transition flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Search
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-medium truncate max-w-[250px]">{job.title}</span>
        </div>

        {/* Main Job details Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Main Title Banner Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                    {job.title}
                  </h1>
                  
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-550 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Building className="w-4.5 h-4.5 text-gray-400" />
                      {job.employer?.companyName || "N/A"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4.5 h-4.5 text-gray-400" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-4.5 h-4.5 text-gray-400" />
                      {job.type.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description details section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 border-b border-slate-100 pb-3">
                  Job Description
                </h3>
                <p className="text-slate-750 text-sm leading-relaxed whitespace-pre-line font-medium">
                  {job.description}
                </p>
              </div>

              {/* Dynamic Skills tags from database */}
              {job.skills && job.skills.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 border-b border-slate-100 pb-3">
                    Skills Required
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span key={index} className="text-xs bg-slate-100 text-slate-700 font-semibold px-3 py-1.5 rounded-lg border border-slate-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Sidebar Specs */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Overview stats Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
                Job Overview
              </h3>

              <div className="divide-y divide-slate-100 text-sm">
                <div className="py-3.5 flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Salary</span>
                  <span className="font-bold text-slate-900 text-sm">{formatSalary(job)} {job.salary || job.salaryMax ? "/ mo" : ""}</span>
                </div>
                <div className="py-3.5 flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</span>
                  <span className="font-bold text-slate-900 text-sm">{job.location}</span>
                </div>
                <div className="py-3.5 flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Type</span>
                  <span className="font-bold text-slate-900 text-sm uppercase tracking-wide text-xs bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">{job.type.replace("_", " ")}</span>
                </div>
                
                {job.workMode && (
                  <div className="py-3.5 flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Work Mode</span>
                    <span className="font-bold text-slate-900 text-sm">{job.workMode.replace("_", " ")}</span>
                  </div>
                )}

                {job.experience && (
                  <div className="py-3.5 flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Experience</span>
                    <span className="font-bold text-slate-900 text-sm">{job.experience.replace("_", " ")}</span>
                  </div>
                )}

                <div className="py-3.5 flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Schedule</span>
                  <span className="font-bold text-slate-900 text-sm">{job.officeTime}</span>
                </div>
                <div className="py-3.5 flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Deadline</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {new Date(job.deadline).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })}
                  </span>
                </div>
              </div>

              {/* Main CTA Apply Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition duration-150 cursor-pointer shadow-sm flex items-center justify-center gap-2 border-0 mt-2"
              >
                Apply for this Position
              </button>
            </div>

          </div>

        </div>

        {/* Suggested Jobs Section */}
        {suggestedJobs.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900 border-b border-slate-200 pb-4">
              Similar Job Opportunities
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {suggestedJobs.map((sJob) => (
                <div key={sJob.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition shadow-xs flex flex-col justify-between h-48">
                  <div>
                    <span className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">{sJob.employer?.companyName || "N/A"}</span>
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1 mb-1">{sJob.title}</h3>
                    
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mt-2.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {sJob.location}
                      </span>
                      <span>•</span>
                      <span>{sJob.type.replace("_", " ")}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                    <span className="text-sm font-bold text-slate-850">
                      {formatSalary(sJob)}
                    </span>
                    <Link href={`/jobs/${sJob.id}`} className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition">
                      View Details <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Application Modal (Shadcn Dialog) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apply to {job.title}</DialogTitle>
            <DialogDescription>
              Submit your resume link and a short cover letter.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Resume Link *</label>
              <input
                type="url"
                placeholder="https://drive.google.com/... or dropbox link"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                <input
                  type="text"
                  placeholder="+880..."
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Years of Experience</label>
                <input
                  type="number"
                  placeholder="2"
                  min="0"
                  value={yearsOfExp}
                  onChange={(e) => setYearsOfExp(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">LinkedIn Profile</label>
                <input
                  type="url"
                  placeholder="linkedin.com/in/..."
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Portfolio Link</label>
                <input
                  type="url"
                  placeholder="myportfolio.com"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Cover Letter</label>
              <textarea
                placeholder="Explain why you are a good fit for this role..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition cursor-pointer bg-white"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold transition cursor-pointer border-0"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
