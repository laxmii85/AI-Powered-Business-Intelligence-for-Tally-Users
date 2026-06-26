import React from "react";
import InsightPanel from "../components/ui/InsightPanel.jsx";
import { useAppStore } from "../store/useAppStore.js";

export default function Insights() {
  const { dashboard } = useAppStore();
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold text-blue-700">Business Insight Panel</p>
        <h1 className="mt-2 text-2xl font-bold">Recommendations, warnings, and growth opportunities</h1>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {dashboard.insights.map((insight) => (
            <article key={insight.text} className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-sm font-bold">{insight.type}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{insight.text}</p>
            </article>
          ))}
        </div>
      </section>
      <InsightPanel />
    </div>
  );
}
