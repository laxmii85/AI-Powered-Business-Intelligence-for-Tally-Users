import React from "react";
import { FileBarChart, Plus } from "lucide-react";

export default function Reports() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">Saved Reports</p>
          <h1 className="mt-2 text-2xl font-bold">Board-ready accounting summaries</h1>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"><Plus size={18} /> New Report</button>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {["Revenue Review", "GST Snapshot", "Collections Risk"].map((report) => (
          <article key={report} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
            <FileBarChart className="text-blue-600" />
            <h2 className="mt-3 font-bold">{report}</h2>
            <p className="mt-2 text-sm text-slate-500">Auto-generated from the active dataset.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
