import React from "react";
import { NavLink } from "react-router-dom";
import { BarChart3, Bot, ChevronLeft, Database, FileBarChart, LayoutDashboard, Moon, Settings, Upload, UserCircle, WalletCards } from "lucide-react";
import { useAppStore } from "../../store/useAppStore.js";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Upload Dataset", icon: Upload },
  { to: "/explorer", label: "Data Explorer", icon: Database },
  { to: "/ai", label: "AI Analytics", icon: Bot },
  { to: "/insights", label: "Business Insights", icon: BarChart3 },
  { to: "/reports", label: "Saved Reports", icon: FileBarChart },
  { to: "/settings", label: "Settings", icon: Settings }
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, darkMode, toggleDark } = useAppStore();
  return (
    <aside className={`fixed inset-y-0 left-0 z-30 hidden border-r border-slate-200 bg-white/95 p-4 shadow-soft transition-all dark:border-slate-800 dark:bg-slate-900 lg:block ${sidebarCollapsed ? "w-24" : "w-72"}`}>
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 px-2">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-blue-600 text-white">
            <WalletCards size={22} />
          </div>
          {!sidebarCollapsed && (
            <div>
              <p className="text-sm font-semibold text-slate-500">AI Accounting</p>
              <h1 className="text-lg font-bold">LedgerIQ</h1>
            </div>
          )}
        </div>
        <nav className="mt-8 space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`
              }
            >
              <item.icon size={20} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto space-y-3">
          <button onClick={toggleDark} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
            <Moon size={20} />
            {!sidebarCollapsed && <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>}
          </button>
          <button onClick={toggleSidebar} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
            <ChevronLeft className={sidebarCollapsed ? "rotate-180" : ""} size={20} />
            {!sidebarCollapsed && <span>Collapse Sidebar</span>}
          </button>
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
            <UserCircle className="text-blue-600" size={28} />
            {!sidebarCollapsed && (
              <div>
                <p className="text-sm font-semibold">Finance Admin</p>
                <p className="text-xs text-slate-500">admin@ledgeriq.ai</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
