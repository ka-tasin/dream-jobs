"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import AuthContext from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function AddJobPage() {
  const [step, setStep] = useState(1);
  const formRef = useRef(null);
  const router = useRouter();
  const { user, loading } = useContext(AuthContext);

  // Date states
  const [deadlineStart, setDeadlineStart] = useState();
  const [deadlineEnd, setDeadlineEnd] = useState();
  const [jobPostingDate, setJobPostingDate] = useState(new Date());

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
    }
  }, [user, router, loading]);

  if (loading) return <p>Loading...</p>;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const formValues = Object.fromEntries(formData.entries());

    const jobType = e.currentTarget.elements.jobType?.value;
    const weekends = e.currentTarget.elements.weekends?.value;

    const finalData = {
      ...formValues,
      deadline_start: deadlineStart ? format(deadlineStart, "yyyy-MM-dd") : "",
      deadline: deadlineEnd ? format(deadlineEnd, "yyyy-MM-dd") : "",
      job_posting_date: format(jobPostingDate, "yyyy-MM-dd"),
      jobType: jobType || "On-site",
      weekends: weekends || "2",
    };

    console.log("Job Posted:", finalData);
    // Add your submission logic here
  };

  const steps = [
    { id: 1, name: "Basic Information" },
    { id: 2, name: "Job Details" },
    { id: 3, name: "Salary & Deadline" },
    { id: 4, name: "Additional Info" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 min-h-screen flex flex-col justify-center mt-20">
      <h1 className="text-3xl font-bold text-center mb-8">Post a New Job</h1>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
        {steps.map((s) => (
          <div key={s.id} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center 
              ${
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
              <h2 className="text-xl font-semibold mb-6">
                Basic Job Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium">Job Title</label>
                  <Input
                    name="job_title"
                    defaultValue=""
                    placeholder="Software Engineer"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Company</label>
                  <Input
                    name="company"
                    defaultValue=""
                    placeholder="DreamJobs Inc."
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Photo URL</label>
                  <Input
                    name="photoUrl"
                    defaultValue=""
                    placeholder="https://example.com/logo.png"
                    type="url"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Number of Vacancies
                  </label>
                  <Input
                    name="vacancy"
                    defaultValue=""
                    placeholder="5"
                    type="number"
                    min="1"
                    required
                  />
                </div>
              </div>
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
              <h2 className="text-xl font-semibold mb-6">Job Details</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium">
                    Employer Name
                  </label>
                  <Input
                    name="employer"
                    readOnly
                    value={user?.displayName}
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Employer Email
                  </label>
                  <Input
                    name="employer_email"
                    readOnly
                    value={user?.email}
                    type="email"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 font-medium">Requirements</label>
                  <Textarea
                    name="requirements"
                    defaultValue=""
                    placeholder="List the job requirements..."
                    rows={4}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 font-medium">
                    Responsibilities
                  </label>
                  <Textarea
                    name="responsibilities"
                    defaultValue=""
                    placeholder="Describe the responsibilities..."
                    rows={4}
                    required
                  />
                </div>
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
              <h2 className="text-xl font-semibold mb-6">Salary & Deadline</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium">
                    Deadline Start
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full pl-3 text-left font-normal"
                      >
                        {deadlineStart ? (
                          format(deadlineStart, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={deadlineStart}
                        onSelect={setDeadlineStart}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <input
                    type="hidden"
                    name="deadline_start"
                    value={
                      deadlineStart ? format(deadlineStart, "yyyy-MM-dd") : ""
                    }
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Deadline End</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full pl-3 text-left font-normal"
                      >
                        {deadlineEnd ? (
                          format(deadlineEnd, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={deadlineEnd}
                        onSelect={setDeadlineEnd}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <input
                    type="hidden"
                    name="deadline"
                    value={deadlineEnd ? format(deadlineEnd, "yyyy-MM-dd") : ""}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">
                    Salary Range Min (৳)
                  </label>
                  <Input
                    name="salary_min"
                    defaultValue=""
                    placeholder="30000"
                    type="number"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Salary Range Max (৳)
                  </label>
                  <Input
                    name="salary_max"
                    defaultValue=""
                    placeholder="50000"
                    type="number"
                    required
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold mb-6">
                Additional Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium">Location</label>
                  <Input
                    name="location"
                    defaultValue=""
                    placeholder="Dhaka, Bangladesh"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Job Type</label>
                  <Select name="job_type" defaultValue="On-site">
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
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Probation Period (Months)
                  </label>
                  <Input
                    name="probation_period"
                    defaultValue=""
                    placeholder="3"
                    type="number"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Bonus/Year</label>
                  <Input
                    name="bonus"
                    defaultValue=""
                    placeholder="2 months salary"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Other Benefits
                  </label>
                  <Input
                    name="other_benefits"
                    defaultValue=""
                    placeholder="Health insurance, lunch, etc."
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Increment/Year
                  </label>
                  <Input name="increment" defaultValue="" placeholder="10%" />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Job Posting Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full pl-3 text-left font-normal"
                      >
                        {format(jobPostingDate, "PPP")}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={jobPostingDate}
                        onSelect={setJobPostingDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <input
                    type="hidden"
                    name="job_posting_date"
                    value={format(jobPostingDate, "yyyy-MM-dd")}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Weekends (Days/Week)
                  </label>
                  <Select name="weekends" defaultValue="2">
                    <SelectTrigger>
                      <SelectValue placeholder="Select weekends" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="1.5">1.5 days</SelectItem>
                      <SelectItem value="2">2 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="px-8 py-3"
            >
              Previous
            </Button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="px-8 py-3 bg-amber-600 hover:bg-amber-700"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              className="px-8 py-3 bg-amber-600 hover:bg-amber-700"
            >
              Post Job
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
