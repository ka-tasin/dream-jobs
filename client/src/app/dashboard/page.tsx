"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Briefcase, Users, FileText, User, Building, Settings } from "lucide-react";
import DashboardSidebar from "@/custom-components/Dashboard/DashboardSidebar";

// User Components
import UserAppliedJobs from "@/custom-components/Dashboard/UserAppliedJobs";
import UserProfile from "@/custom-components/Dashboard/UserProfile";

// Employer Components
import EmployerOverview from "@/custom-components/Dashboard/EmployerOverview";
import EmployerPostedJobs from "@/custom-components/Dashboard/EmployerPostedJobs";
import EmployerApplications from "@/custom-components/Dashboard/EmployerApplications";
import EmployerProfile from "@/custom-components/Dashboard/EmployerProfile";

// Admin Components
import AdminOverview from "@/custom-components/Dashboard/AdminOverview";
import AdminManageJobs from "@/custom-components/Dashboard/AdminManageJobs";
import AdminManageEmployers from "@/custom-components/Dashboard/AdminManageEmployers";
import AdminManageUsers from "@/custom-components/Dashboard/AdminManageUsers";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("");

  // Set default tabs based on role
  useEffect(() => {
    if (!loading && user) {
      if (user.role === "USER") {
        setActiveTab("applied-jobs");
      } else if (user.role === "EMPLOYER") {
        setActiveTab("overview");
      } else if (user.role === "ADMIN") {
        setActiveTab("overview");
      }
    }
  }, [user, loading]);

  // Protect route
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-900">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
          <p className="text-sm text-slate-500">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // Sidebar Menu Config
  const getSidebarConfig = () => {
    switch (user.role) {
      case "USER":
        return [
          { id: "applied-jobs", label: "Applied Jobs", icon: FileText },
          { id: "profile", label: "My Profile", icon: User },
        ];
      case "EMPLOYER":
        return [
          { id: "overview", label: "Overview", icon: Settings },
          { id: "posted-jobs", label: "Posted Jobs", icon: Briefcase },
          { id: "applications", label: "Who Applied", icon: Users },
          { id: "profile", label: "Employer Profile", icon: Building },
        ];
      case "ADMIN":
        return [
          { id: "overview", label: "Overview", icon: Settings },
          { id: "manage-jobs", label: "Manage Jobs", icon: Briefcase },
          { id: "manage-employers", label: "Manage Employers", icon: Building },
          { id: "manage-users", label: "Manage Users", icon: Users },
        ];
      default:
        return [];
    }
  };

  // Render content area based on active tab & user role
  const renderContent = () => {
    if (user.role === "USER") {
      switch (activeTab) {
        case "applied-jobs":
          return <UserAppliedJobs />;
        case "profile":
          return <UserProfile user={user} onRoleUpgrade={logout} />;
        default:
          return null;
      }
    }

    if (user.role === "EMPLOYER") {
      switch (activeTab) {
        case "overview":
          return <EmployerOverview userId={user.id} />;
        case "posted-jobs":
          return <EmployerPostedJobs userId={user.id} />;
        case "applications":
          return <EmployerApplications />;
        case "profile":
          return <EmployerProfile userId={user.id} />;
        default:
          return null;
      }
    }

    if (user.role === "ADMIN") {
      switch (activeTab) {
        case "overview":
          return <AdminOverview />;
        case "manage-jobs":
          return <AdminManageJobs />;
        case "manage-employers":
          return <AdminManageEmployers />;
        case "manage-users":
          return <AdminManageUsers />;
        default:
          return null;
      }
    }

    return null;
  };

  const menuItems = getSidebarConfig();

  return (
    <div className="min-h-screen bg-slate-50 pt-28">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 rounded-lg border border-slate-200 bg-white shadow-sm">
              <DashboardSidebar
                menuItems={menuItems}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onLogout={logout}
                userName={user.email.split("@")[0]}
                userRole={user.role}
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 min-h-[500px]">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
