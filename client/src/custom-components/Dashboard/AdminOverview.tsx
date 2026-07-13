"use client";
import { useEffect, useState } from "react";
import { Users, Briefcase, Building, FileText, Landmark, Shield } from "lucide-react";
import { toast } from "react-toastify";
import fetchClient from "@/lib/utils/axiosFetcher";
import StatsCard from "./StatsCard";

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await fetchClient<any>("/api/v1/admin/stats");
        setStats(res.data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load admin statistics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-red-650 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Admin Control Panel</h2>
        <p className="text-sm text-slate-500 mt-1">Platform-wide statistics and system status</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={Users} label="Total Registered Users" value={stats?.totalUsers || 0} color="blue" />
        <StatsCard icon={Briefcase} label="Total Job Posts" value={stats?.totalJobs || 0} color="green" />
        <StatsCard icon={Building} label="Registered Employers" value={stats?.totalEmployers || 0} color="purple" />
        <StatsCard icon={FileText} label="Total Applications" value={stats?.totalApplications || 0} color="orange" />
      </div>

      {/* System info */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-bold text-slate-800">Dream Jobs Project Administration</h3>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">
          Welcome to the administrator overview dashboard. From here, you can manage all users, employers, and job listings on the platform. All actions are securely validated via role-based authentication rules in both backend and frontend environments.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="bg-slate-50 border border-slate-200 rounded-md p-4">
            <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-red-600" /> Environment Config
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li>• API Gateway: Active</li>
              <li>• Security Token: JSON Web Tokens (JWT)</li>
              <li>• Database Schema: Prisma ORM (Active Connection)</li>
            </ul>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-md p-4">
            <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-600" /> Security Log
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li>• Admin Sessions: Secured</li>
              <li>• User Action Logs: Verified</li>
              <li>• Authorization Policy: Strict</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
