"use client";
import { useEffect, useState } from "react";
import { Building, Trash2, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import fetchClient from "@/lib/utils/axiosFetcher";

export default function AdminManageEmployers() {
  const [employers, setEmployers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    const fetchEmployers = async () => {
      setLoading(true);
      try {
        const res = await fetchClient<any>(`/api/v1/employers?page=${page}&limit=${limit}`);
        setEmployers(res.data || []);
      } catch (err: any) {
        toast.error(err.message || "Failed to load employers");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployers();
  }, [page]);

  const handleDelete = async (employerId: string, companyName: string) => {
    if (!confirm(`Are you sure you want to delete the employer profile for "${companyName}"? This will also demote their account role to USER.`)) return;
    setDeletingId(employerId);
    try {
      await fetchClient(`/api/v1/employers/${employerId}`, { method: "DELETE" });
      toast.success("Employer deleted successfully");
      setEmployers((prev) => prev.filter((emp) => emp.id !== employerId));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete employer");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Manage Employers</h2>
        <p className="text-sm text-slate-500 mt-1">Monitor registered company profiles and delete profiles if needed</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-red-650 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : employers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Building className="w-12 h-12 mb-3 text-slate-300" />
            <p className="text-lg font-medium text-slate-800">No employers found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Company</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Industry</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Location</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Website</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Administrator</th>
                    <th className="text-left text-xs font-semibold text-slate-550 uppercase tracking-wider px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employers.map((emp: any) => (
                    <tr
                      key={emp.id}
                      className="border-b border-slate-100 hover:bg-slate-50/30 transition-colors"
                    >
                      <td className="px-5 py-4 font-medium text-slate-850 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded bg-purple-50 flex items-center justify-center text-purple-600 font-bold text-xs border border-purple-100">
                          {emp.companyName?.charAt(0)?.toUpperCase()}
                        </div>
                        <span>{emp.companyName}</span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-700">{emp.industry || "—"}</p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <p className="text-sm text-slate-500">{emp.location || "—"}</p>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        {emp.website ? (
                          <a href={emp.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                            <Globe className="w-3.5 h-3.5" /> Visit Site
                          </a>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <p className="text-sm text-slate-700">{emp.user?.firstName} {emp.user?.lastName}</p>
                        <p className="text-xs text-slate-500">{emp.user?.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleDelete(emp.id, emp.companyName)}
                          disabled={deletingId === emp.id}
                          className="p-1.5 rounded-md hover:bg-red-50 text-slate-500 hover:text-red-655 transition-colors disabled:opacity-30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
                  disabled={employers.length < limit}
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
