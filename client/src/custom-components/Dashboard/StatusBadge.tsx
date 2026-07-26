"use client";

interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  REVIEWED: "bg-blue-50 text-blue-700 border-blue-200",
  ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
  FULL_TIME: "bg-blue-50 text-blue-700 border-blue-200",
  PART_TIME: "bg-purple-50 text-purple-700 border-purple-200",
  CONTRACT: "bg-orange-50 text-orange-700 border-orange-200",
  INTERNSHIP: "bg-cyan-50 text-cyan-700 border-cyan-200",
  FREELANCE: "bg-pink-50 text-pink-700 border-pink-200",
  REMOTE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ONSITE: "bg-amber-50 text-amber-700 border-amber-200",
  HYBRID: "bg-teal-50 text-teal-700 border-teal-200",
  USER: "bg-blue-50 text-blue-700 border-blue-200",
  EMPLOYER: "bg-purple-50 text-purple-700 border-purple-200",
  ADMIN: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status] || "bg-slate-50 text-slate-700 border-slate-200";
  const label = status.replace(/_/g, " ");

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
      {label}
    </span>
  );
}
