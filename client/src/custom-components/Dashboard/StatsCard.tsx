"use client";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  color: "blue" | "green" | "purple" | "orange" | "red" | "cyan";
  delay?: number;
}

const colorMap = {
  blue: {
    icon: "text-blue-600 bg-blue-50",
  },
  green: {
    icon: "text-emerald-600 bg-emerald-50",
  },
  purple: {
    icon: "text-purple-600 bg-purple-50",
  },
  orange: {
    icon: "text-orange-600 bg-orange-50",
  },
  red: {
    icon: "text-red-600 bg-red-50",
  },
  cyan: {
    icon: "text-cyan-600 bg-cyan-50",
  },
};

export default function StatsCard({ icon: Icon, label, value, color }: StatsCardProps) {
  const colors = colorMap[color];

  return (
    <div className="bg-white border border-slate-100 rounded-lg p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colors.icon}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
