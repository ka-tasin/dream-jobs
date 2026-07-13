"use client";
import { LogOut, LucideIcon } from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface DashboardSidebarProps {
  menuItems: MenuItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  userName: string;
  userRole: string;
}

export default function DashboardSidebar({
  menuItems,
  activeTab,
  onTabChange,
  onLogout,
  userName,
  userRole,
}: DashboardSidebarProps) {
  const roleColors: Record<string, string> = {
    USER: "bg-blue-600",
    EMPLOYER: "bg-purple-600",
    ADMIN: "bg-red-600",
  };

  const roleBg = roleColors[userRole] || roleColors.USER;

  return (
    <div className="flex flex-col h-full bg-white rounded-lg">
      {/* User Info */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${roleBg} flex items-center justify-center text-white font-bold text-sm`}>
            {userName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{userName || "User"}</p>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${roleBg} text-white mt-0.5`}>
              {userRole}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-red-600" : "text-slate-400"}`} />
              <span className="truncate">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-600" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50/50 transition-all duration-150"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
