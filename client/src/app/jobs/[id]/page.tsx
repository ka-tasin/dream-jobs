"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import apiClient from "@/lib/utils/axiosFetcher";
import { Button } from "@/components/ui/button";
import { DetailsLoading } from "@/custom-components/common/DataLoading/DetailsLoading";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import fetchClient from "@/lib/utils/axiosFetcher";

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

export default function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchJob = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found, please login");
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient(`/api/v1/jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response?.data) {
          setError("Job not found");
        } else {
          setJob(response.data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [token, id]);

  console.log(job, id);

  const handleApply = async () => {
    if (!token) {
      toast.error("Please login first");
      return;
    }
    setSubmitting(true);
    try {
      await fetchClient("/api/v1/applications/apply", {
        method: "POST",
        body: {
          jobId: job?.id,
          resumeUrl,
          coverLetter,
        },
      });

      toast.success("Application submitted successfully");
      setIsModalOpen(false);
      setResumeUrl("");
      setCoverLetter("");
    } catch (err: any) {
      toast.error(err.message || "Failed to apply");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <DetailsLoading />
      </div>
    );
  if (error)
    return (
      <div className="text-center h-screen items-center flex text-red-500 mt-12">
        {error}
      </div>
    );
  if (!job) return null;

  return (
    <main className="container mx-auto mt-24 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Company:</span> {job.company}
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Role:</span> {job.role}
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Location:</span> {job.location}
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Job Type:</span>{" "}
          {job.type.replace("_", " ")}
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Office Time:</span> {job.officeTime}
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Salary:</span> $
          {job.salary.toLocaleString()}
        </p>
        <p className="text-gray-600 mb-4">
          <span className="font-semibold">Deadline:</span>{" "}
          {new Date(job.deadline).toLocaleDateString()}
        </p>
        <h2 className="text-xl font-semibold mb-2">Job Description</h2>
        <p className="text-gray-700 mb-6">{job.description}</p>

        <Button
          variant="default"
          size="lg"
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3"
          onClick={() => setIsModalOpen(true)}
        >
          Apply Now
        </Button>
      </div>

      {/* Application Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="">
          <DialogHeader className="">
            {/* Wrap text inside <span> to satisfy forwardRef typing */}
            <DialogTitle className="">
              <span>Apply to {job.title}</span>
            </DialogTitle>
            <DialogDescription className="">
              <span>Submit your resume link and a short cover letter.</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <Input
              className=""
              type="url"
              placeholder="Resume URL (Google Drive, Dropbox, etc.)"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              required
            />
            <Textarea
              className=""
              placeholder="Cover Letter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter className="">
            <Button
              className="w-full"
              variant="default"
              size="md"
              onClick={handleApply}
              disabled={submitting}
            >
              {submitting ? "Applying..." : "Apply Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
