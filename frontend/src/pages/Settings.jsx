import React from "react";
import { useAppStore } from "../store/useAppStore.js";

export default function Settings() {
  const { darkMode, toggleDark } = useAppStore();
  return (
    <section className="max-w-3xl rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-semibold text-blue-700">Settings</p>
      <h1 className="mt-2 text-2xl font-bold">Workspace preferences</h1>
      <div className="mt-6 flex items-center justify-between rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
        <div>
          <p className="font-semibold">Dark Mode</p>
          <p className="text-sm text-slate-500">Switch the dashboard theme.</p>
        </div>
        <button onClick={toggleDark} className={`h-7 w-12 rounded-full p-1 transition ${darkMode ? "bg-blue-600" : "bg-slate-300"}`} aria-label="Toggle dark mode">
          <span className={`block h-5 w-5 rounded-full bg-white transition ${darkMode ? "translate-x-5" : ""}`} />
        </button>
      </div>
    </section>
  );
}
