"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import apiClient from "@/lib/utils/axiosFetcher";
import { Loader2 } from "lucide-react"; // for spinner icon

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function AddJobPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false); // 👈 posting indicator
  const [step, setStep] = useState(1);

  const [job, setJob] = useState({
    title: "",
    role: "",
    company: "",
    location: "",
    type: "",
    officeTime: "",
    salary: "",
    deadline: "",
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSelect = (value: string) => setJob({ ...job, type: value });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!job.type) {
      toast.error("Please select a job type");
      return;
    }

    setPosting(true); // 👈 Start loading

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Please log in again.");
        router.push("/login");
        return;
      }

      await apiClient("/api/v1/jobs", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: { ...job, salary: parseFloat(job.salary), createdBy: user.id },
      });

      toast.success("Job posted successfully!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setPosting(false); // 👈 End loading
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
        <AnimatePresence mode="wait">
          {/* Step 1 */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Input
                name="title"
                placeholder="Job Title"
                value={job.title}
                onChange={handleChange}
                required
              />
              <Input
                name="role"
                placeholder="Role (Frontend Developer)"
                value={job.role}
                onChange={handleChange}
                required
              />
              <Input
                name="company"
                placeholder="Company Name"
                value={job.company}
                onChange={handleChange}
                required
              />
              <Input
                name="location"
                placeholder="Location"
                value={job.location}
                onChange={handleChange}
                required
              />
              <Button
                type="button"
                className="w-full"
                onClick={nextStep}
                disabled={
                  !job.title || !job.role || !job.company || !job.location
                }
              >
                Next
              </Button>
            </motion.div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Select value={job.type} onValueChange={handleSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="On-site">On-site</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
              <Input
                name="officeTime"
                placeholder="Office Time (9 AM - 5 PM)"
                value={job.officeTime}
                onChange={handleChange}
                required
              />
              <Input
                name="salary"
                placeholder="Salary (BDT)"
                type="number"
                value={job.salary}
                onChange={handleChange}
                required
              />
              <Input
                name="deadline"
                type="date"
                value={job.deadline}
                onChange={handleChange}
                required
              />
              <div className="flex justify-between">
                <Button type="button" onClick={prevStep}>
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!job.type || !job.officeTime}
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Textarea
                name="description"
                placeholder="Job Description"
                value={job.description}
                onChange={handleChange}
                required
              />
              <div className="flex justify-between items-center">
                <Button type="button" onClick={prevStep} disabled={posting}>
                  Back
                </Button>
                <Button type="submit" className="w-full" disabled={posting}>
                  {posting ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Posting...
                    </div>
                  ) : (
                    "Post Job"
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
