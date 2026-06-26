import React from "react";
import { Bell, Plus, Search, Settings, SlidersHorizontal, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore.js";

export default function TopNav() {
  const { dashboard } = useAppStore();
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <select aria-label="Dataset selector" className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <option>{dashboard.summary.file_name}</option>
          </select>
          <div className="relative max-w-xl flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input aria-label="Global search" className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="Search invoices, customers, products" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300" aria-label="Quick actions"><SlidersHorizontal size={18} /></button>
          <button className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300" aria-label="Notifications"><Bell size={18} /></button>
          <button className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300" aria-label="Settings"><Settings size={18} /></button>
          <Link to="/upload" className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
            <Upload size={18} />
            Upload
          </Link>
          <button className="grid h-10 w-10 place-items-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-950" aria-label="Create report"><Plus size={18} /></button>
        </div>
      </div>
    </header>
  );
}
