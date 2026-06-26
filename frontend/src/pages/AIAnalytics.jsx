import React from "react";
import AIPrompt from "../components/ui/AIPrompt.jsx";
import ChartCard from "../components/ui/ChartCard.jsx";
import DataTable from "../components/ui/DataTable.jsx";
import InsightPanel from "../components/ui/InsightPanel.jsx";
import { useAppStore } from "../store/useAppStore.js";

export default function AIAnalytics() {
  const { aiResult, dashboard, recentQueries, askAI } = useAppStore();
  const charts = aiResult?.charts?.length ? aiResult.charts : dashboard.charts;
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <AIPrompt />
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-lg font-bold">Recent Queries</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            {recentQueries.map((query) => <button key={query} onClick={() => askAI(query)} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 dark:bg-slate-800 dark:text-slate-300">{query}</button>)}
          </div>
        </section>
        <div className="grid gap-5 xl:grid-cols-2">{charts.map((chart) => <ChartCard key={chart.title} chart={chart} />)}</div>
        <DataTable />
      </div>
      <InsightPanel />
    </div>
  );
}
