"use client";
import { useEffect, useState } from "react";
import { Briefcase, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import fetchClient from "@/lib/utils/axiosFetcher";
import StatusBadge from "./StatusBadge";

export default function AdminManageJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await fetchClient<any>("/api/v1/jobs");
        setJobs(res.data || []);
      } catch (err: any) {
        toast.error(err.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleDelete = async (jobId: string, jobTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${jobTitle}"? This will remove the job post permanently.`)) return;
    setDeletingId(jobId);
    try {
      await fetchClient(`/api/v1/jobs/${jobId}`, { method: "DELETE" });
      toast.success("Job deleted successfully");
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete job");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Manage Job Posts</h2>
        <p className="text-sm text-slate-500 mt-1">Review and delete active jobs across the entire platform</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-red-650 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-550">
            <Briefcase className="w-12 h-12 mb-3 text-slate-300" />
            <p className="text-lg font-medium text-slate-800">No job postings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Job Info</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Company</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Location</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Type</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Posted At</th>
                  <th className="text-left text-xs font-semibold text-slate-550 uppercase tracking-wider px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job: any) => (
                  <tr
                    key={job.id}
                    className="border-b border-slate-100 hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-800 truncate max-w-[200px]">{job.title}</p>
                      <p className="text-xs text-slate-505 mt-0.5">{job.position}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-600">{job.employer?.companyName || "N/A"}</p>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <p className="text-sm text-slate-500">{job.location}</p>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <StatusBadge status={job.type} />
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <p className="text-sm text-slate-500">{formatDate(job.postedAt)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="p-1.5 rounded-md hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(job.id, job.title)}
                          disabled={deletingId === job.id}
                          className="p-1.5 rounded-md hover:bg-red-50 text-slate-500 hover:text-red-650 transition-colors disabled:opacity-30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
