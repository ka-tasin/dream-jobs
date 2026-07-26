"use client";
import { useEffect, useState } from "react";
import { Building, Globe, MapPin, Users as UsersIcon, Loader2, Save, X, Pencil } from "lucide-react";
import { toast } from "react-toastify";
import fetchClient from "@/lib/utils/axiosFetcher";

interface EmployerProfileProps {
  userId: string;
}

export default function EmployerProfile({ userId }: EmployerProfileProps) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    website: "",
    industry: "",
    size: "",
    description: "",
    location: "",
  });

  const sizeOptions = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetchClient<any>("/api/v1/employers/profile");
        setProfile(res.data);
        setForm({
          companyName: res.data?.companyName || "",
          website: res.data?.website || "",
          industry: res.data?.industry || "",
          size: res.data?.size || "",
          description: res.data?.description || "",
          location: res.data?.location || "",
        });
      } catch (err: any) {
        toast.error(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleSave = async () => {
    if (!form.companyName.trim()) {
      toast.error("Company name is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetchClient<any>("/api/v1/employers", {
        method: "PUT",
        body: form,
      });
      setProfile({ ...profile, ...res.data });
      setEditing(false);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-red-650 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Company Profile</h2>
          <p className="text-sm text-slate-550 mt-1">Manage your employer profile information</p>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-850 text-sm rounded-md transition-colors"
          >
            <Pencil className="w-4 h-4" /> Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-md transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setForm({
                  companyName: profile?.companyName || "",
                  website: profile?.website || "",
                  industry: profile?.industry || "",
                  size: profile?.size || "",
                  description: profile?.description || "",
                  location: profile?.location || "",
                });
              }}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm text-slate-550 hover:text-slate-855 transition-colors"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        {editing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-555 mb-1.5">Company Name *</label>
                <input
                  type="text"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-555 mb-1.5">Industry</label>
                <input
                  type="text"
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-555 mb-1.5">Website</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-555 mb-1.5">Company Size</label>
                <select
                  value={form.size}
                  onChange={(e) => setForm({ ...form, size: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-purple-500/50"
                >
                  <option value="">Select size</option>
                  {sizeOptions.map((s) => (
                    <option key={s} value={s}>{s} employees</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-555 mb-1.5">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-555 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500/50 resize-none"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Company Header */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-purple-600 flex items-center justify-center text-white text-xl font-bold">
                {profile?.companyName?.charAt(0)?.toUpperCase() || "C"}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{profile?.companyName || "N/A"}</h3>
                {profile?.industry && (
                  <p className="text-sm text-slate-500">{profile.industry}</p>
                )}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile?.location && (
                <div className="bg-slate-50 rounded-md p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Location</p>
                  </div>
                  <p className="text-sm text-slate-700 font-medium">{profile.location}</p>
                </div>
              )}
              {profile?.website && (
                <div className="bg-slate-50 rounded-md p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <p className="text-xs text-slate-550 uppercase tracking-wider">Website</p>
                  </div>
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline truncate block font-medium">
                    {profile.website}
                  </a>
                </div>
              )}
              {profile?.size && (
                <div className="bg-slate-50 rounded-md p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <UsersIcon className="w-4 h-4 text-slate-400" />
                    <p className="text-xs text-slate-555 uppercase tracking-wider">Company Size</p>
                  </div>
                  <p className="text-sm text-slate-700 font-medium">{profile.size} employees</p>
                </div>
              )}
            </div>

            {/* Description */}
            {profile?.description && (
              <div className="bg-slate-50 rounded-md p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="w-4 h-4 text-slate-400" />
                  <p className="text-xs text-slate-555 uppercase tracking-wider">About</p>
                </div>
                <p className="text-sm text-slate-750 whitespace-pre-line leading-relaxed">{profile.description}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
