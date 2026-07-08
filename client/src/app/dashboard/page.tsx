"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { Loader2, Plus, LogOut, Briefcase, Users, FileText, Globe, Building, ChevronRight, Eye, Trash2, Shield, User, Landmark, Settings } from "lucide-react";
import Link from "next/link";
import fetchClient from "@/lib/utils/axiosFetcher";

interface UserDecoded {
  id: string;
  email: string;
  role: "USER" | "EMPLOYER" | "ADMIN";
}

export default function Dashboard() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserDecoded | null>(null);
  const [loading, setLoading] = useState(true);

  // Sub-navigation tab states
  const [activeTab, setActiveTab] = useState<string>("");

  // User Dashboard State
  const [userApplications, setUserApplications] = useState<any[]>([]);
  const [companyDetails, setCompanyDetails] = useState({
    companyName: "",
    companyLogo: "",
    website: "",
    industry: "",
    size: "1-10",
    description: "",
    location: "",
  });
  const [upgrading, setUpgrading] = useState(false);

  // Employer Dashboard State
  const [employerJobs, setEmployerJobs] = useState<any[]>([]);
  const [receivedApplications, setReceivedApplications] = useState<any[]>([]);
  const [employerStats, setEmployerStats] = useState<any>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editCompanyDetails, setEditCompanyDetails] = useState({
    companyName: "",
    website: "",
    industry: "",
    size: "",
    description: "",
    location: "",
  });

  // Admin Dashboard State
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [allEmployers, setAllEmployers] = useState<any[]>([]);
  const [allApplications, setAllApplications] = useState<any[]>([]);
  const [allUsersList, setAllUsersList] = useState<any[]>([]); // Derived or mocked since no user listing endpoint

  // Fetch initial token and decode
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      toast.error("Please login to access the dashboard");
      router.push("/login");
      return;
    }
    setToken(t);
    try {
      const decoded: UserDecoded = jwtDecode(t);
      setUser(decoded);
      // Set default tabs based on role
      if (decoded.role === "USER") {
        setActiveTab("applied-jobs");
      } else if (decoded.role === "EMPLOYER") {
        setActiveTab("posted-jobs");
      } else if (decoded.role === "ADMIN") {
        setActiveTab("overview");
      }
    } catch {
      toast.error("Invalid session. Please login again");
      router.push("/login");
    }
  }, [router]);

  // Fetch role-specific data
  useEffect(() => {
    if (!user || !token) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        if (user.role === "USER") {
          const res = await fetchClient("/api/v1/applications/my");
          setUserApplications(res.data || []);
        } else if (user.role === "EMPLOYER") {
          // Fetch posted jobs
          const jobsRes = await fetchClient(`/api/v1/jobs/employer/${user.id}`);
          setEmployerJobs(jobsRes.data || []);

          // Fetch applications received
          const appsRes = await fetchClient("/api/v1/applications");
          setReceivedApplications(appsRes.data || []);

          // Fetch employer profile
          try {
            const statsRes = await fetchClient("/api/v1/employers/profile");
            setEmployerStats(statsRes.data);
            if (statsRes.data) {
              setEditCompanyDetails({
                companyName: statsRes.data.companyName || "",
                website: statsRes.data.website || "",
                industry: statsRes.data.industry || "",
                size: statsRes.data.size || "1-10",
                description: statsRes.data.description || "",
                location: statsRes.data.location || "",
              });
            }
          } catch (e) {
            console.error("No employer profile found yet:", e);
          }
        } else if (user.role === "ADMIN") {
          // Fetch all jobs
          const jobsRes = await fetchClient("/api/v1/jobs");
          setAllJobs(jobsRes.data?.data || jobsRes.data || []);

          // Fetch all employers
          const employersRes = await fetchClient("/api/v1/employers");
          setAllEmployers(employersRes.data || []);

          // Fetch all applications
          const appsRes = await fetchClient("/api/v1/applications");
          const appsData = appsRes.data || [];
          setAllApplications(appsData);

          // Build unique users list from applications and employers relations
          const userMap = new Map();
          
          // Add users from applications
          appsData.forEach((app: any) => {
            if (app.user) {
              userMap.set(app.user.id, {
                id: app.user.id,
                firstName: app.user.firstName,
                lastName: app.user.lastName,
                email: app.user.email,
                role: app.user.role || "USER",
                source: "Applicant",
              });
            }
          });

          // Add users from employers
          employersRes.data?.forEach((emp: any) => {
            if (emp.user) {
              userMap.set(emp.user.id, {
                id: emp.user.id,
                firstName: emp.user.firstName,
                lastName: emp.user.lastName,
                email: emp.user.email,
                role: emp.user.role || "EMPLOYER",
                source: `Employer (${emp.companyName})`,
              });
            }
          });

          setAllUsersList(Array.from(userMap.values()));
        }
      } catch (err: any) {
        console.error("Dashboard Fetch Error:", err);
        toast.error(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, token]);

  const handleBecomeEmployer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyDetails.companyName.trim()) {
      toast.error("Company name is required");
      return;
    }

    let websiteUrl = companyDetails.website.trim();
    if (websiteUrl && !/^https?:\/\//i.test(websiteUrl)) {
      websiteUrl = `https://${websiteUrl}`;
    }

    let logoUrl = companyDetails.companyLogo.trim();
    if (logoUrl && !/^https?:\/\//i.test(logoUrl)) {
      logoUrl = `https://${logoUrl}`;
    }

    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    if (websiteUrl && !urlRegex.test(websiteUrl)) {
      toast.error("Please enter a valid website URL");
      return;
    }
    if (logoUrl && !urlRegex.test(logoUrl)) {
      toast.error("Please enter a valid logo URL");
      return;
    }

    if (companyDetails.description.trim() && companyDetails.description.trim().length < 10) {
      toast.error("Description must be at least 10 characters long");
      return;
    }

    setUpgrading(true);
    try {
      const payload = {
        companyName: companyDetails.companyName.trim(),
        companyLogo: logoUrl || null,
        website: websiteUrl || null,
        industry: companyDetails.industry.trim() || null,
        size: companyDetails.size || null,
        description: companyDetails.description.trim() || null,
        location: companyDetails.location.trim() || null,
      };

      await fetchClient("/api/v1/employers/become-employer", {
        method: "POST",
        body: payload,
      });

      toast.success("Employer Profile Created successfully!");
      
      // Force user to log in again to refresh role inside token
      localStorage.removeItem("token");
      toast.info("Please login again to activate your Employer Dashboard");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "Failed to create employer profile");
    } finally {
      setUpgrading(false);
    }
  };

  const handleUpdateEmployerProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetchClient("/api/v1/employers", {
        method: "PUT",
        body: editCompanyDetails,
      });
      setEmployerStats(res.data);
      setIsEditingProfile(false);
      toast.success("Employer profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update employer profile");
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job listing?")) return;
    try {
      await fetchClient(`/api/v1/jobs/${jobId}`, {
        method: "DELETE",
      });
      toast.success("Job listing deleted successfully");
      
      // Remove job from state locally
      if (user?.role === "EMPLOYER") {
        setEmployerJobs((prev) => prev.filter((j) => j.id !== jobId));
      } else if (user?.role === "ADMIN") {
        setAllJobs((prev) => prev.filter((j) => j.id !== jobId));
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete job listing");
    }
  };

  const handleDeleteEmployer = async (employerId: string) => {
    if (!confirm("Are you sure you want to delete this employer profile? This will revert their user role to USER.")) return;
    try {
      await fetchClient(`/api/v1/employers/${employerId}`, {
        method: "DELETE",
      });
      toast.success("Employer profile removed successfully");
      setAllEmployers((prev) => prev.filter((emp) => emp.id !== employerId));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete employer profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 mt-20">
        <Loader2 className="w-10 h-10 animate-spin text-slate-800" />
        <p className="mt-4 text-gray-600 font-medium">Loading your dashboard details...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/50 mt-20 pb-20 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
              {user?.role === "ADMIN" && <Shield className="w-8 h-8 text-red-700" />}
              {user?.role === "EMPLOYER" && <Building className="w-8 h-8 text-emerald-700" />}
              {user?.role === "USER" && <User className="w-8 h-8 text-blue-700" />}
              {user?.role === "ADMIN" ? "Admin Management Portal" : user?.role === "EMPLOYER" ? "Employer Console" : "My Career Hub"}
            </h1>
            <p className="text-gray-500 mt-1">Active User Session: <span className="font-semibold text-slate-800">{user?.email}</span></p>
          </div>
          <div className="flex gap-3">
            {user?.role === "EMPLOYER" && (
              <Link href="/add-jobs">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold px-4 py-2.5 rounded-lg flex items-center text-sm shadow-xs transition duration-150 cursor-pointer">
                  <Plus className="w-4 h-4" /> Post a Job Opportunity
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Dynamic Sidebar + Tab Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Navigation Menu</span>
              
              <div className="flex flex-col gap-1.5">
                {/* User Tabs */}
                {user?.role === "USER" && (
                  <>
                    <button
                      onClick={() => setActiveTab("applied-jobs")}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-semibold transition duration-150 cursor-pointer ${
                        activeTab === "applied-jobs"
                          ? "bg-blue-50 text-blue-800"
                          : "text-gray-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Briefcase className="w-4.5 h-4.5" /> Applied Jobs Page
                    </button>
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-semibold transition duration-150 cursor-pointer ${
                        activeTab === "profile"
                          ? "bg-blue-50 text-blue-800"
                          : "text-gray-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <User className="w-4.5 h-4.5" /> Profile Page
                    </button>
                    <button
                      onClick={() => setActiveTab("become-employer")}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-semibold transition duration-150 cursor-pointer ${
                        activeTab === "become-employer"
                          ? "bg-blue-50 text-blue-800"
                          : "text-gray-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Building className="w-4.5 h-4.5" /> Become an Employer
                    </button>
                  </>
                )}

                {/* Employer Tabs */}
                {user?.role === "EMPLOYER" && (
                  <>
                    <button
                      onClick={() => setActiveTab("posted-jobs")}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-semibold transition duration-150 cursor-pointer ${
                        activeTab === "posted-jobs"
                          ? "bg-emerald-50 text-emerald-800"
                          : "text-gray-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Briefcase className="w-4.5 h-4.5" /> Posted Jobs Page
                    </button>
                    <button
                      onClick={() => setActiveTab("who-applied")}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-semibold transition duration-150 cursor-pointer ${
                        activeTab === "who-applied"
                          ? "bg-emerald-50 text-emerald-800"
                          : "text-gray-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Users className="w-4.5 h-4.5" /> Who Applied
                    </button>
                    <button
                      onClick={() => setActiveTab("employer-profile")}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-semibold transition duration-150 cursor-pointer ${
                        activeTab === "employer-profile"
                          ? "bg-emerald-50 text-emerald-800"
                          : "text-gray-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Building className="w-4.5 h-4.5" /> Employer Profile Page
                    </button>
                  </>
                )}

                {/* Admin Tabs */}
                {user?.role === "ADMIN" && (
                  <>
                    <button
                      onClick={() => setActiveTab("overview")}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-semibold transition duration-150 cursor-pointer ${
                        activeTab === "overview"
                          ? "bg-red-50 text-red-800"
                          : "text-gray-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Landmark className="w-4.5 h-4.5" /> Overview Dashboard
                    </button>
                    <button
                      onClick={() => setActiveTab("manage-employers")}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-semibold transition duration-150 cursor-pointer ${
                        activeTab === "manage-employers"
                          ? "bg-red-50 text-red-800"
                          : "text-gray-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Building className="w-4.5 h-4.5" /> Manage Employers Page
                    </button>
                    <button
                      onClick={() => setActiveTab("manage-users")}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-semibold transition duration-150 cursor-pointer ${
                        activeTab === "manage-users"
                          ? "bg-red-50 text-red-800"
                          : "text-gray-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Users className="w-4.5 h-4.5" /> Manage Users Page
                    </button>
                  </>
                )}
                
                {/* Unified Sidebar Logout Button */}
                <div className="border-t border-slate-100 mt-4 pt-4">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-750 rounded-lg text-left text-sm font-semibold transition duration-150 cursor-pointer border-0 bg-transparent"
                  >
                    <LogOut className="w-4.5 h-4.5" /> Logout Session
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Subpage Content Section */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* ==================== USER: APPLIED JOBS PAGE ==================== */}
            {user?.role === "USER" && activeTab === "applied-jobs" && (
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h2 className="text-lg font-bold text-slate-900">Applied Jobs Page</h2>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {userApplications.length} applied listings
                  </span>
                </div>

                {userApplications.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/30 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                          <th className="px-6 py-4">Job Title & Company</th>
                          <th className="px-6 py-4">Location</th>
                          <th className="px-6 py-4">Applied Date</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                        {userApplications.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50/40 transition">
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-900">{app.job?.title || "Position"}</div>
                              <div className="text-gray-500 text-xs mt-0.5">{app.job?.employer?.companyName || "Company"}</div>
                            </td>
                            <td className="px-6 py-4 text-gray-600 font-medium">{app.job?.location || "Remote"}</td>
                            <td className="px-6 py-4 text-gray-500">
                              {new Date(app.appliedAt).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  app.status === "ACCEPTED"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : app.status === "REJECTED"
                                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                                    : app.status === "REVIEWED"
                                    ? "bg-sky-50 text-sky-700 border border-sky-200"
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                }`}
                              >
                                {app.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Link href={`/jobs/${app.jobId}`}>
                                <button className="text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-end gap-1 w-full text-xs bg-transparent border-0 cursor-pointer">
                                  View listing <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-16 px-4">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-slate-800">No applications yet</h3>
                    <p className="text-gray-500 text-sm mt-1 mb-6">Find and apply to thousands of career postings available today.</p>
                    <Link href="/jobs">
                      <button className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer">Browse Jobs</button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* ==================== USER: PROFILE PAGE ==================== */}
            {user?.role === "USER" && activeTab === "profile" && (
              <div className="space-y-6">
                {/* Details Card */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6">
                  <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">My Profile Page</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Role Authorization</span>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-blue-150 text-blue-700 text-xs font-bold rounded-md uppercase">
                          {user.role}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Email Address</span>
                      <p className="text-slate-800 text-sm mt-1 font-semibold">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Upgrade call-to-action */}
                <div className="bg-gradient-to-br from-emerald-50/50 to-teal-50/50 border border-emerald-250 p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-emerald-950">Looking to Recruit Candidates?</h3>
                    <p className="text-emerald-800 text-sm mt-1">Upgrade your account to an Employer profile. List jobs, review applications, and hire the best team.</p>
                  </div>
                  <button 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-lg cursor-pointer shrink-0 transition border-0" 
                    onClick={() => setActiveTab("become-employer")}
                  >
                    Become an Employer
                  </button>
                </div>
              </div>
            )}

            {/* ==================== USER: BECOME AN EMPLOYER PAGE ==================== */}
            {user?.role === "USER" && activeTab === "become-employer" && (
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-lg font-bold text-slate-900">Become an Employer</h2>
                  <p className="text-gray-500 text-xs mt-1">Submit your company credentials to register as an employer. You will be logged out to refresh authorization scopes.</p>
                </div>

                <div className="p-6">
                  <form onSubmit={handleBecomeEmployer} className="space-y-6 max-w-2xl">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Company Name *</label>
                        <input
                          type="text"
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                          placeholder="e.g. Acme Tech Solutions"
                          value={companyDetails.companyName}
                          onChange={(e) => setCompanyDetails({ ...companyDetails, companyName: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Industry</label>
                        <input
                          type="text"
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                          placeholder="e.g. Information Technology"
                          value={companyDetails.industry}
                          onChange={(e) => setCompanyDetails({ ...companyDetails, industry: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Company Size</label>
                        <select
                          className="w-full h-10 px-3 bg-white rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                          value={companyDetails.size}
                          onChange={(e) => setCompanyDetails({ ...companyDetails, size: e.target.value })}
                        >
                          <option value="1-10">1-10 Employees</option>
                          <option value="11-50">11-50 Employees</option>
                          <option value="51-200">51-200 Employees</option>
                          <option value="201-500">201-500 Employees</option>
                          <option value="501-1000">501-1000 Employees</option>
                          <option value="1000+">1000+ Employees</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location</label>
                        <input
                          type="text"
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                          placeholder="e.g. Dhaka, Bangladesh"
                          value={companyDetails.location}
                          onChange={(e) => setCompanyDetails({ ...companyDetails, location: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Company Logo URL</label>
                        <input
                          type="url"
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                          placeholder="e.g. https://example.com/logo.png"
                          value={companyDetails.companyLogo}
                          onChange={(e) => setCompanyDetails({ ...companyDetails, companyLogo: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Company Website</label>
                        <input
                          type="url"
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                          placeholder="https://example.com"
                          value={companyDetails.website}
                          onChange={(e) => setCompanyDetails({ ...companyDetails, website: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Company Description (Min 10 chars)</label>
                      <textarea
                        className="w-full p-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                        placeholder="Brief summary of company vision, products, or service offerings..."
                        value={companyDetails.description}
                        onChange={(e) => setCompanyDetails({ ...companyDetails, description: e.target.value })}
                        rows={5}
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={upgrading}
                        className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm transition cursor-pointer border-0 flex items-center justify-center gap-2"
                      >
                        {upgrading ? "Upgrading..." : "Register Company Profile"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ==================== EMPLOYER: POSTED TOTAL JOBS PAGE ==================== */}
            {user?.role === "EMPLOYER" && activeTab === "posted-jobs" && (
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h2 className="text-lg font-bold text-slate-900">Posted Total Jobs Page</h2>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                    {employerJobs.length} active listings
                  </span>
                </div>

                {employerJobs.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/30 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                          <th className="px-6 py-4">Job Title / Role</th>
                          <th className="px-6 py-4">Location</th>
                          <th className="px-6 py-4">Job Type / Mode</th>
                          <th className="px-6 py-4">Deadline</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                        {employerJobs.map((job) => (
                          <tr key={job.id} className="hover:bg-slate-50/40 transition">
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-900">{job.title}</div>
                              <div className="text-gray-500 text-xs mt-0.5">{job.position}</div>
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-600">{job.location}</td>
                            <td className="px-6 py-4">
                              <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">
                                {job.type?.replace("_", " ")}
                              </span>
                              {job.workMode && (
                                <span className="inline-block ml-1.5 px-2.5 py-1 bg-slate-100 text-indigo-700 text-xs rounded-full font-medium">
                                  {job.workMode}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                              {job.deadline ? new Date(job.deadline).toLocaleDateString() : "No Deadline"}
                            </td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                              <Link href={`/jobs/${job.id}`}>
                                <button className="p-1.5 hover:bg-slate-100 text-gray-600 hover:text-slate-800 rounded-lg bg-transparent border-0 cursor-pointer">
                                  <Eye className="w-4 h-4" />
                                </button>
                              </Link>
                              <button 
                                className="p-1.5 hover:bg-rose-50 text-red-650 hover:text-red-750 rounded-lg bg-transparent border-0 cursor-pointer" 
                                onClick={() => handleDeleteJob(job.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-16 px-4">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-slate-800">No jobs posted yet</h3>
                    <p className="text-gray-500 text-sm mt-1 mb-6">Start hiring top talent by listing your first job opportunity.</p>
                    <Link href="/add-jobs">
                      <button className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer">+ Post a Job</button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* ==================== EMPLOYER: WHO APPLIED PAGE ==================== */}
            {user?.role === "EMPLOYER" && activeTab === "who-applied" && (
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h2 className="text-lg font-bold text-slate-900">Who Applied on My Jobs</h2>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                    {receivedApplications.length} candidates
                  </span>
                </div>

                {receivedApplications.length > 0 ? (
                  <div className="divide-y divide-slate-150">
                    {receivedApplications.map((app) => (
                      <div key={app.id} className="p-6 hover:bg-slate-50/30 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-2 max-w-2xl">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-base">
                              {app.user?.firstName} {app.user?.lastName}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{app.user?.email}</span>
                            {app.phoneNumber && (
                              <>
                                <span className="text-gray-400">•</span>
                                <span className="text-xs text-gray-500">{app.phoneNumber}</span>
                              </>
                            )}
                          </div>
                          
                          <div>
                            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Job Applied For</span>
                            <span className="font-bold text-slate-800 text-sm">{app.job?.title}</span>
                            <span className="text-xs text-gray-500 block">Position: {app.job?.position || "N/A"}</span>
                          </div>

                          {app.coverLetter && (
                            <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl mt-2">
                              <span className="text-xs font-semibold text-gray-400 block mb-1">Cover Letter Details</span>
                              <p className="text-xs text-slate-700 leading-relaxed italic">&ldquo;{app.coverLetter}&rdquo;</p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 items-stretch md:items-end w-full md:w-auto shrink-0">
                          {app.resumeUrl && (
                            <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                              <button className="w-full sm:w-auto border border-slate-350 bg-white text-slate-700 hover:bg-slate-100 font-semibold px-4 py-2.5 rounded-lg text-sm transition cursor-pointer">
                                View Resume
                              </button>
                            </a>
                          )}
                          <span className="inline-flex items-center justify-center px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">
                            Applied: {new Date(app.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 px-4">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-slate-800">No applications received yet</h3>
                    <p className="text-gray-500 text-sm mt-1">Applications from candidates will display here when submitted.</p>
                  </div>
                )}
              </div>
            )}

            {/* ==================== EMPLOYER: PROFILE PAGE ==================== */}
            {user?.role === "EMPLOYER" && activeTab === "employer-profile" && (
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                  <h2 className="text-lg font-bold text-slate-900">Employer Profile Page</h2>
                  <button 
                    className="border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer bg-white"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                  >
                    <Settings className="w-4 h-4" /> {isEditingProfile ? "Cancel Editing" : "Edit Profile"}
                  </button>
                </div>

                {!isEditingProfile ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Company Name</span>
                        <p className="text-slate-800 text-sm mt-1 font-bold">{employerStats?.companyName || "N/A"}</p>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Industry</span>
                        <p className="text-slate-800 text-sm mt-1 font-semibold">{employerStats?.industry || "N/A"}</p>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Company Size</span>
                        <p className="text-slate-800 text-sm mt-1 font-medium">{employerStats?.size || "N/A"} Employees</p>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Location</span>
                        <p className="text-slate-800 text-sm mt-1 font-semibold">{employerStats?.location || "N/A"}</p>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Website URL</span>
                        {employerStats?.website ? (
                          <a href={employerStats.website} target="_blank" rel="noopener noreferrer" className="text-blue-650 hover:underline text-sm font-semibold flex items-center gap-1 mt-1">
                            <Globe className="w-4 h-4" /> {employerStats.website}
                          </a>
                        ) : (
                          <p className="text-slate-800 text-sm mt-1">N/A</p>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Company Description</span>
                      <p className="text-slate-700 text-sm mt-2 leading-relaxed bg-slate-50 p-4 border border-slate-100 rounded-xl italic">
                        {employerStats?.description || "No description provided."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateEmployerProfile} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Company Name</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
                        value={editCompanyDetails.companyName}
                        onChange={(e) => setEditCompanyDetails({ ...editCompanyDetails, companyName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Industry</label>
                        <input
                          type="text"
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
                          value={editCompanyDetails.industry}
                          onChange={(e) => setEditCompanyDetails({ ...editCompanyDetails, industry: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Location</label>
                        <input
                          type="text"
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
                          value={editCompanyDetails.location}
                          onChange={(e) => setEditCompanyDetails({ ...editCompanyDetails, location: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Company Size</label>
                        <select
                          className="w-full h-10 px-3 bg-white rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
                          value={editCompanyDetails.size}
                          onChange={(e) => setEditCompanyDetails({ ...editCompanyDetails, size: e.target.value })}
                        >
                          <option value="1-10">1-10 Employees</option>
                          <option value="11-50">11-50 Employees</option>
                          <option value="51-200">51-200 Employees</option>
                          <option value="201-500">201-500 Employees</option>
                          <option value="500+">500+ Employees</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Website URL</label>
                        <input
                          type="url"
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
                          value={editCompanyDetails.website}
                          onChange={(e) => setEditCompanyDetails({ ...editCompanyDetails, website: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Company Description</label>
                      <textarea
                        className="w-full p-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
                        value={editCompanyDetails.description}
                        onChange={(e) => setEditCompanyDetails({ ...editCompanyDetails, description: e.target.value })}
                        rows={4}
                      />
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-lg cursor-pointer">
                        Save Profile Changes
                      </button>
                      <button 
                        type="button" 
                        className="border border-slate-350 bg-white hover:bg-slate-100 text-slate-700 font-semibold px-5 py-2.5 rounded-lg cursor-pointer"
                        onClick={() => setIsEditingProfile(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* ==================== ADMIN: OVERVIEW DASHBOARD ==================== */}
            {user?.role === "ADMIN" && activeTab === "overview" && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Total Job Listings</span>
                      <Briefcase className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 mt-2">{allJobs.length}</div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Total Employers</span>
                      <Building className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 mt-2">{allEmployers.length}</div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Total Applications</span>
                      <FileText className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 mt-2">{allApplications.length}</div>
                  </div>
                </div>

                {/* Project Info Section */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6">
                  <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">About Dream Jobs Project</h2>
                  
                  <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                    <p>
                      <strong>Dream Jobs</strong> is a modern career matching and recruiting dashboard application designed to bring jobseekers and hiring managers together under a single clean, high-performance web interface.
                    </p>
                    <p>
                      <strong>Core Functional Philosophy:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Candidate Channel:</strong> Regular users can search listings, view office times, locations, and salary options. Submission handles resume attachments and digital cover letters.</li>
                      <li><strong>Recruitment Channel:</strong> Authorized Employers can publish listings targeting specific types (Contract, Intern, Full-Time) and modes (On-site, Hybrid, Remote), and directly access applicant rosters.</li>
                      <li><strong>Administrative Oversight:</strong> Superusers manage system entities, verify employer profiles, audit total listings, and track platform scaling metrics.</li>
                    </ul>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-6 text-xs text-gray-500">
                      <strong>Deployment Profile:</strong> Powered by Next.js App Router (Frontend) and Express REST API (Backend engine) connecting via Prisma Client to PostgreSQL databases.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== ADMIN: MANAGE EMPLOYERS PAGE ==================== */}
            {user?.role === "ADMIN" && activeTab === "manage-employers" && (
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h2 className="text-lg font-bold text-slate-900">Manage Employer Profiles</h2>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-red-100 text-red-700 rounded-full">
                    {allEmployers.length} companies
                  </span>
                </div>

                {allEmployers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/30 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                          <th className="px-6 py-4">Company Details</th>
                          <th className="px-6 py-4">Industry</th>
                          <th className="px-6 py-4">Location</th>
                          <th className="px-6 py-4">Website</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                        {allEmployers.map((emp) => (
                          <tr key={emp.id} className="hover:bg-slate-50/40 transition">
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-900">{emp.companyName}</div>
                              <div className="text-gray-500 text-xs mt-0.5">Admin: {emp.user?.firstName} ({emp.user?.email})</div>
                            </td>
                            <td className="px-6 py-4 text-gray-600 font-semibold">{emp.industry || "N/A"}</td>
                            <td className="px-6 py-4 text-gray-500">{emp.location || "N/A"}</td>
                            <td className="px-6 py-4">
                              {emp.website ? (
                                <a href={emp.website} target="_blank" rel="noopener noreferrer" className="text-blue-650 hover:underline flex items-center gap-1">
                                  <Globe className="w-3.5 h-3.5" /> Visit website
                                </a>
                              ) : "N/A"}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                className="p-1.5 hover:bg-rose-50 text-red-650 hover:text-red-750 rounded-lg bg-transparent border-0 cursor-pointer" 
                                onClick={() => handleDeleteEmployer(emp.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-500">No registered employer profiles found.</div>
                )}
              </div>
            )}

            {/* ==================== ADMIN: MANAGE USERS PAGE ==================== */}
            {user?.role === "ADMIN" && activeTab === "manage-users" && (
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h2 className="text-lg font-bold text-slate-900">Manage Users Page</h2>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-red-100 text-red-700 rounded-full">
                    {allUsersList.length} unique records
                  </span>
                </div>

                {allUsersList.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/30 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                          <th className="px-6 py-4">User Details</th>
                          <th className="px-6 py-4">System Role</th>
                          <th className="px-6 py-4">System Reference Source</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                        {allUsersList.map((usr) => (
                          <tr key={usr.id} className="hover:bg-slate-50/40 transition">
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-900">{usr.firstName} {usr.lastName}</div>
                              <div className="text-gray-500 text-xs mt-0.5">{usr.email}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-md ${
                                usr.role === "ADMIN"
                                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                                  : usr.role === "EMPLOYER"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-250"
                                  : "bg-blue-50 text-blue-700 border border-blue-200"
                              }`}>
                                {usr.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600 font-semibold">
                              {usr.source}
                            </td>
                            <td className="px-6 py-4 text-right text-gray-400 text-xs font-medium italic">
                              Manage via DB
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-500">No user records detected in dynamic cache.</div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

    </main>
  );
}
