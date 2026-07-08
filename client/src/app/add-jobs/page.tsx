"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { Loader2 } from "lucide-react";
import fetchClient from "@/lib/utils/axiosFetcher";

export default function AddJobPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [step, setStep] = useState(1);

  const [job, setJob] = useState({
    title: "",
    role: "", // mapped to position
    company: "",
    location: "",
    type: "", // JobTypeEnum: FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE
    workMode: "", // WorkModeEnum: REMOTE, ONSITE, HYBRID
    experience: "", // ExperienceLevelEnum: ENTRY, JUNIOR, MID, SENIOR, LEAD
    officeTime: "",
    salary: "",
    deadline: "",
    skills: "", // comma separated -> string[]
    description: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const decoded: any = jwtDecode(token);
      setUser({ id: decoded.id, email: decoded.email });
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!job.type) {
      toast.error("Please select a job type (e.g. Full-time)");
      return;
    }
    if (!job.workMode) {
      toast.error("Please select a work mode (e.g. Remote)");
      return;
    }
    if (!job.experience) {
      toast.error("Please select an experience level");
      return;
    }

    if (job.description.trim().length < 20) {
      toast.error("Description must be at least 20 characters long");
      return;
    }

    const skillsArray = job.skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (skillsArray.length === 0) {
      toast.error("Please enter at least one skill");
      return;
    }

    setPosting(true);

    try {
      // Build request body that matches createJobSchema exactly
      const payload: any = {
        title: job.title,
        description: job.description,
        position: job.role, // map role to position
        location: job.location,
        type: job.type,
        workMode: job.workMode,
        experience: job.experience,
        officeTime: job.officeTime,
        skills: skillsArray,
        currency: "USD",
      };

      if (job.salary) {
        payload.salary = parseFloat(job.salary);
      }

      if (job.deadline) {
        // Zod validation requires ISO datetime string format
        payload.deadline = new Date(job.deadline).toISOString();
      }

      await fetchClient("/api/v1/jobs", {
        method: "POST",
        body: payload,
      });

      toast.success("Job posted successfully!");
      router.push("/jobs");
    } catch (err: any) {
      const message = err?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;

  const steps = [
    { id: 1, name: "Basic Info" },
    { id: 2, name: "Job Details" },
    { id: 3, name: "Description" },
  ];

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 min-h-screen flex flex-col justify-center mt-20">
      <h1 className="text-3xl font-bold text-center mb-8">Post a Job</h1>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
        {steps.map((s) => (
          <div key={s.id} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= s.id
                  ? "bg-amber-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {s.id}
            </div>
            <span
              className={`text-sm mt-2 ${
                step >= s.id ? "text-amber-600 font-medium" : "text-gray-500"
              }`}
            >
              {s.name}
            </span>
          </div>
        ))}
      </div>

      <form ref={formRef} onSubmit={handleSubmit}>
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input
                name="title"
                type="text"
                placeholder="e.g. Lead React Engineer"
                value={job.title}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role / Position</label>
              <input
                name="role"
                type="text"
                placeholder="e.g. Frontend Developer"
                value={job.role}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                name="company"
                type="text"
                placeholder="e.g. Stripe Inc."
                value={job.company}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                name="location"
                type="text"
                placeholder="e.g. San Francisco, CA"
                value={job.location}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>
            <button
              type="button"
              className="w-full mt-4 h-10 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition cursor-pointer border-0"
              onClick={nextStep}
              disabled={
                !job.title || !job.role || !job.company || !job.location
              }
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select 
                  name="type"
                  value={job.type} 
                  onChange={handleChange}
                  className="w-full h-10 px-3 bg-white rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">Select type</option>
                  <option value="FULL_TIME">Full-time</option>
                  <option value="PART_TIME">Part-time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="FREELANCE">Freelance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Mode</label>
                <select 
                  name="workMode"
                  value={job.workMode} 
                  onChange={handleChange}
                  className="w-full h-10 px-3 bg-white rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">Select mode</option>
                  <option value="ONSITE">On-site</option>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                <select 
                  name="experience"
                  value={job.experience} 
                  onChange={handleChange}
                  className="w-full h-10 px-3 bg-white rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">Select level</option>
                  <option value="ENTRY">Entry (0-1 years)</option>
                  <option value="JUNIOR">Junior (1-3 years)</option>
                  <option value="MID">Mid (3-5 years)</option>
                  <option value="SENIOR">Senior (5-8 years)</option>
                  <option value="LEAD">Lead (8+ years)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Office Time</label>
                <input
                  name="officeTime"
                  type="text"
                  placeholder="e.g. 9 AM - 5 PM"
                  value={job.officeTime}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary (BDT)</label>
                <input
                  name="salary"
                  type="number"
                  placeholder="e.g. 50000"
                  value={job.salary}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                <input
                  name="deadline"
                  type="date"
                  value={job.deadline}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (Comma separated)</label>
              <input
                name="skills"
                type="text"
                placeholder="e.g. React, Node.js, TypeScript"
                value={job.skills}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>

            <div className="flex justify-between pt-2">
              <button 
                type="button" 
                onClick={prevStep}
                className="h-10 px-5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold transition cursor-pointer bg-white"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="h-10 px-5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition cursor-pointer border-0"
                disabled={!job.type || !job.workMode || !job.experience || !job.officeTime || !job.skills}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description (Min 20 chars)</label>
              <textarea
                name="description"
                placeholder="Describe roles, responsibilities, benefits, and company values..."
                value={job.description}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                rows={6}
                required
              />
            </div>
            <div className="flex justify-between items-center pt-2">
              <button 
                type="button" 
                onClick={prevStep} 
                disabled={posting}
                className="h-10 px-5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold transition cursor-pointer bg-white"
              >
                Back
              </button>
              <button 
                type="submit" 
                className="h-10 flex-1 ml-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition cursor-pointer border-0 flex items-center justify-center gap-2" 
                disabled={posting}
              >
                {posting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post Job Opportunity"
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
