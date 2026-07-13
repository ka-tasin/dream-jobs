"use client";
import { useEffect, useState } from "react";
import { Users, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import fetchClient from "@/lib/utils/axiosFetcher";
import StatusBadge from "./StatusBadge";

export default function AdminManageUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const limit = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        if (search) params.set("search", search);

        const res = await fetchClient<any>(`/api/v1/admin/users?${params.toString()}`);
        setUsers(res.data?.users || res.data || []);
      } catch (err: any) {
        toast.error(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page, search]);

  const handleDelete = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete user account "${email}"? This is permanent.`)) return;
    setDeletingId(userId);
    try {
      await fetchClient(`/api/v1/admin/users/${userId}`, { method: "DELETE" });
      toast.success("User deleted successfully");
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Manage Users</h2>
          <p className="text-sm text-slate-500 mt-1">Review and delete registered user accounts</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-white border border-slate-200 rounded-md pl-9 pr-4 py-2 text-sm text-slate-850 placeholder-slate-400 focus:outline-none focus:border-red-500/50"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-red-650 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Users className="w-12 h-12 mb-3 text-slate-300" />
            <p className="text-lg font-medium text-slate-850">No users found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">User Profile</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Email Address</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Role</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Associated Company</th>
                    <th className="text-left text-xs font-semibold text-slate-550 uppercase tracking-wider px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((userObj: any) => (
                    <tr
                      key={userObj.id}
                      className="border-b border-slate-100 hover:bg-slate-50/30 transition-colors"
                    >
                      <td className="px-5 py-4 font-medium text-slate-850 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded bg-blue-50 flex items-center justify-center text-blue-650 font-bold text-xs border border-blue-100">
                          {userObj.firstName?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <span>{userObj.firstName} {userObj.lastName}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-700">{userObj.email}</span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={userObj.role} />
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-sm text-slate-500">
                          {userObj.employer?.companyName || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleDelete(userObj.id, userObj.email)}
                          disabled={deletingId === userObj.id}
                          className="p-1.5 rounded-md hover:bg-red-50 text-slate-500 hover:text-red-650 transition-colors disabled:opacity-30"
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
                  disabled={users.length < limit}
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
