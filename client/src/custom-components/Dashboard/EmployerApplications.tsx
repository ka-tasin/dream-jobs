"use client";
import { useEffect, useState } from "react";
import { Users, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Filter, CheckCircle, XCircle, Eye, FileText, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import fetchClient from "@/lib/utils/axiosFetcher";
import StatusBadge from "./StatusBadge";

export default function EmployerApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
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

        const res = await fetchClient<any>(`/api/v1/applications?${params.toString()}`);
        setApplications(res.data || []);
      } catch (err: any) {
        toast.error(err.message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [page, statusFilter]);

  const handleStatusUpdate = async (appId: string, status: string) => {
    setUpdatingId(appId);
    try {
      await fetchClient(`/api/v1/applications/${appId}/status`, {
        method: "PATCH",
        body: { status },
      });
      toast.success(`Application ${status.toLowerCase()}`);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status } : a))
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Applications</h2>
          <p className="text-sm text-slate-500 mt-1">Review and manage job applications. Click any row to expand details.</p>
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

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-red-650 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Users className="w-12 h-12 mb-3 text-slate-300" />
            <p className="text-lg font-medium text-slate-800">No applications received</p>
            <p className="text-sm mt-1">Applications will appear here when candidates apply</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-100">
              {applications.map((app: any) => (
                <div
                  key={app.id}
                  className="transition-colors border-b border-slate-100 last:border-0"
                >
                  {/* Application Row */}
                  <div
                    className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50/50 group"
                    onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-xs font-bold flex-shrink-0 border border-slate-200">
                        {app.user?.firstName?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-red-600 transition-colors">
                          {app.user?.firstName || "Unknown"} {app.user?.lastName || ""}
                        </p>
                        <p className="text-xs text-slate-550 truncate mt-0.5">{app.user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                      <div className="hidden sm:block text-right">
                        <p className="text-xs font-medium text-slate-700 truncate max-w-[150px]">{app.job?.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{formatDate(app.appliedAt)}</p>
                      </div>
                      <StatusBadge status={app.status} />
                      <div className="text-slate-400 group-hover:text-slate-600 transition-colors ml-1">
                        {expandedId === app.id ? (
                          <ChevronUp className="w-4.5 h-4.5" />
                        ) : (
                          <ChevronDown className="w-4.5 h-4.5" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {expandedId === app.id && (
                    <div className="px-5 pb-5 pt-2 bg-slate-50/50 border-t border-slate-100">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                        <div className="bg-white rounded-md p-3 border border-slate-200 shadow-xxs">
                          <p className="text-xs text-slate-500 mb-1">Applied For</p>
                          <p className="text-sm font-medium text-slate-700">{app.job?.title || "N/A"}</p>
                        </div>
                        {app.phoneNumber && (
                          <div className="bg-white rounded-md p-3 border border-slate-200 shadow-xxs">
                            <p className="text-xs text-slate-500 mb-1">Phone</p>
                            <p className="text-sm font-medium text-slate-700">{app.phoneNumber}</p>
                          </div>
                        )}
                        {app.yearsOfExp !== undefined && app.yearsOfExp !== null && (
                          <div className="bg-white rounded-md p-3 border border-slate-200 shadow-xxs">
                            <p className="text-xs text-slate-500 mb-1">Experience</p>
                            <p className="text-sm font-medium text-slate-700">{app.yearsOfExp} years</p>
                          </div>
                        )}
                      </div>

                      {/* Links */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {app.resumeUrl && (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold rounded-md hover:bg-blue-100 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" /> Resume
                          </a>
                        )}
                        {app.linkedinUrl && (
                          <a
                            href={app.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold rounded-md hover:bg-blue-100 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> LinkedIn
                          </a>
                        )}
                        {app.portfolioUrl && (
                          <a
                            href={app.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold rounded-md hover:bg-purple-100 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Portfolio
                          </a>
                        )}
                      </div>

                      {/* Cover Letter */}
                      {app.coverLetter && (
                        <div className="bg-white rounded-md p-3 border border-slate-200 shadow-xxs mb-4">
                          <p className="text-xs text-slate-550 mb-1.5">Cover Letter</p>
                          <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{app.coverLetter}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        {app.status !== "ACCEPTED" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStatusUpdate(app.id, "ACCEPTED"); }}
                            disabled={updatingId === app.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-md hover:bg-emerald-100 transition-colors disabled:opacity-30"
                          >
                            {updatingId === app.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                            Accept
                          </button>
                        )}
                        {app.status !== "REJECTED" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStatusUpdate(app.id, "REJECTED"); }}
                            disabled={updatingId === app.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-md hover:bg-rose-100 transition-colors disabled:opacity-30"
                          >
                            {updatingId === app.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                            Reject
                          </button>
                        )}
                        {app.status !== "REVIEWED" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStatusUpdate(app.id, "REVIEWED"); }}
                            disabled={updatingId === app.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-md hover:bg-blue-100 transition-colors disabled:opacity-30"
                          >
                            {updatingId === app.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                            Mark Reviewed
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
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
