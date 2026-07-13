"use client";
import { useEffect, useState } from "react";
import { Briefcase, Users, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import { toast } from "react-toastify";
import fetchClient from "@/lib/utils/axiosFetcher";
import StatsCard from "./StatsCard";
import StatusBadge from "./StatusBadge";

interface EmployerOverviewProps {
  userId: string;
}

export default function EmployerOverview({ userId }: EmployerOverviewProps) {
  const [stats, setStats] = useState<any>(null);
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, appsRes] = await Promise.all([
          fetchClient<any>("/api/v1/employers/stats").catch(() => ({ data: null })),
          fetchClient<any>("/api/v1/applications?limit=5&sortBy=appliedAt&sortOrder=desc").catch(() => ({ data: [] })),
        ]);
        setStats(statsRes.data);
        setRecentApps(appsRes.data || []);
      } catch (err: any) {
        toast.error(err.message || "Failed to load overview");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-red-655 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Employer Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">Overview of your hiring activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={Briefcase} label="Total Jobs" value={stats?.totalJobs || 0} color="blue" />
        <StatsCard icon={Eye} label="Active Jobs" value={stats?.activeJobs || 0} color="green" />
        <StatsCard icon={Users} label="Total Applications" value={stats?.totalApplications || 0} color="purple" />
        <StatsCard icon={Clock} label="Pending Review" value={stats?.applicationsByStatus?.pending || 0} color="orange" />
      </div>

      {/* Application Status Breakdown */}
      {stats?.applicationsByStatus && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs mb-8">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Application Status Breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 bg-amber-50/50 border border-amber-200 rounded-md p-3">
              <Clock className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-lg font-bold text-amber-800">{stats.applicationsByStatus.pending || 0}</p>
                <p className="text-xs text-slate-500">Pending</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-blue-50/5 border border-blue-200 rounded-md p-3">
              <Eye className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-lg font-bold text-blue-800">{stats.applicationsByStatus.reviewed || 0}</p>
                <p className="text-xs text-slate-500">Reviewed</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-emerald-50/5 border border-emerald-200 rounded-md p-3">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-lg font-bold text-emerald-800">{stats.applicationsByStatus.accepted || 0}</p>
                <p className="text-xs text-slate-500">Accepted</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-rose-50/5 border border-rose-200 rounded-md p-3">
              <XCircle className="w-5 h-5 text-rose-600" />
              <div>
                <p className="text-lg font-bold text-rose-800">{stats.applicationsByStatus.rejected || 0}</p>
                <p className="text-xs text-slate-500">Rejected</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Applications */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-semibold text-slate-800">Recent Applications</h3>
          <span className="text-xs text-slate-550">Last 5</span>
        </div>
        {recentApps.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm">No applications received yet</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentApps.map((app: any) => (
              <div key={app.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/30 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-xs font-bold flex-shrink-0">
                    {app.user?.firstName?.charAt(0) || "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{app.user?.firstName} {app.user?.lastName}</p>
                    <p className="text-xs text-slate-550 truncate mt-0.5">{app.job?.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                  <span className="text-xs text-slate-500 hidden sm:block">{formatDate(app.appliedAt)}</span>
                  <StatusBadge status={app.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
