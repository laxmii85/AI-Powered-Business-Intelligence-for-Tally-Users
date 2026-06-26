import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import TopNav from "./TopNav.jsx";
import FloatingAssistant from "../ui/FloatingAssistant.jsx";
import { useAppStore } from "../../store/useAppStore.js";

export default function AppLayout() {
  const { darkMode, sidebarCollapsed } = useAppStore();
  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
        <Sidebar />
        <div className={sidebarCollapsed ? "lg:pl-24" : "lg:pl-72"}>
          <TopNav />
          <main className="px-4 py-5 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
        <FloatingAssistant />
      </div>
    </div>
  );
}
