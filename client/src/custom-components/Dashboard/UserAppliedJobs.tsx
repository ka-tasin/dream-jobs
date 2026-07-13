"use client";
import { useEffect, useState } from "react";
import { FileText, ExternalLink, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import fetchClient from "@/lib/utils/axiosFetcher";
import StatusBadge from "./StatusBadge";

export default function UserAppliedJobs() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const limit = 10;

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          sortBy: "appliedAt",
          sortOrder: "desc",
        });
        if (statusFilter) params.set("status", statusFilter);

        const res = await fetchClient<any>(`/api/v1/applications/my?${params.toString()}`);
        setApplications(res.data || []);
      } catch (err: any) {
        toast.error(err.message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [page, statusFilter]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">My Applications</h2>
          <p className="text-sm text-slate-500 mt-1">Track your job application progress</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-red-500/50"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-red-650 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <FileText className="w-12 h-12 mb-3 text-slate-300" />
            <p className="text-lg font-medium text-slate-850">No applications found</p>
            <p className="text-sm mt-1">Start applying for your dream jobs!</p>
            <Link href="/jobs" className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Job</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Company</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Location</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Applied</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app: any) => (
                    <tr
                      key={app.id}
                      className="border-b border-slate-100 hover:bg-slate-50/30 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-800 truncate max-w-[200px]">{app.job?.title || "N/A"}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{app.job?.position || ""}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-600">{app.job?.employer?.companyName || "N/A"}</p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <p className="text-sm text-slate-500">{app.job?.location || "N/A"}</p>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <p className="text-sm text-slate-500">{formatDate(app.appliedAt)}</p>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/jobs/${app.job?.id}`}
                          className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold transition-colors"
                        >
                          View <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-slate-50/30">
              <p className="text-xs text-slate-550">Page {page}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={applications.length < limit}
                  className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
