"use client";
import { useState } from "react";
import { User, Mail, Shield, Building, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import fetchClient from "@/lib/utils/axiosFetcher";

interface UserProfileProps {
  user: { id: string; email: string; role: string };
  onRoleUpgrade: () => void;
}

export default function UserProfile({ user, onRoleUpgrade }: UserProfileProps) {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    companyLogo: "",
    website: "",
    industry: "",
    size: "1-10",
    description: "",
    location: "",
  });

  const handleBecomeEmployer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName.trim()) {
      toast.error("Company name is required");
      return;
    }
    if (form.description && form.description.length < 10) {
      toast.error("Description must be at least 10 characters");
      return;
    }
    setSubmitting(true);
    try {
      const body: any = { companyName: form.companyName };
      if (form.companyLogo) body.companyLogo = form.companyLogo;
      if (form.website) body.website = form.website;
      if (form.industry) body.industry = form.industry;
      if (form.size) body.size = form.size;
      if (form.description) body.description = form.description;
      if (form.location) body.location = form.location;

      await fetchClient("/api/v1/employers/become-employer", {
        method: "POST",
        body,
      });
      toast.success("Employer profile created! Please log in again to refresh your session.");
      onRoleUpgrade();
    } catch (err: any) {
      toast.error(err.message || "Failed to create employer profile");
    } finally {
      setSubmitting(false);
    }
  };

  const sizeOptions = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-6">My Profile</h2>

      {/* Profile Info Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            {user.email?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-800">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-sm text-slate-505">Role: {user.role}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-md p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4 text-slate-400" />
              <p className="text-xs text-slate-500 uppercase tracking-wider">Email</p>
            </div>
            <p className="text-sm text-slate-700 font-semibold">{user.email}</p>
          </div>
          <div className="bg-slate-50 rounded-md p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-slate-400" />
              <p className="text-xs text-slate-500 uppercase tracking-wider">User ID</p>
            </div>
            <p className="text-sm text-slate-700 font-mono truncate">{user.id}</p>
          </div>
        </div>
      </div>

      {/* Become Employer Section */}
      {user.role === "USER" && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
          {!showForm ? (
            <div className="text-center py-6">
              <Building className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Become an Employer</h3>
              <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                Create your employer profile and start posting jobs to find the best talent for your company.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-all duration-150"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleBecomeEmployer} className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Create Employer Profile</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-550 mb-1.5">Company Name *</label>
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500/50"
                    placeholder="Acme Inc."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-550 mb-1.5">Industry</label>
                  <input
                    type="text"
                    value={form.industry}
                    onChange={(e) => setForm({ ...form, industry: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500/50"
                    placeholder="Technology"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-550 mb-1.5">Website</label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500/50"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-550 mb-1.5">Company Size</label>
                  <select
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-purple-500/50"
                  >
                    {sizeOptions.map((s) => (
                      <option key={s} value={s}>{s} employees</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-550 mb-1.5">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500/50"
                    placeholder="Dhaka, Bangladesh"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-550 mb-1.5">Company Logo URL</label>
                  <input
                    type="url"
                    value={form.companyLogo}
                    onChange={(e) => setForm({ ...form, companyLogo: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500/50"
                    placeholder="https://logo.example.com/logo.png"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-550 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500/50 resize-none"
                  placeholder="Tell us about your company (min 10 characters)..."
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-all duration-150 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? "Creating..." : "Create Profile"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 text-sm text-slate-500 hover:text-slate-850 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
