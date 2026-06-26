import React from "react";
import { motion } from "framer-motion";
import AIPrompt from "../components/ui/AIPrompt.jsx";
import ChartCard from "../components/ui/ChartCard.jsx";
import DataTable from "../components/ui/DataTable.jsx";
import InsightPanel from "../components/ui/InsightPanel.jsx";
import KpiCard from "../components/ui/KpiCard.jsx";
import { useAppStore } from "../store/useAppStore.js";

export default function Dashboard() {
  const { dashboard } = useAppStore();
  const summary = dashboard.summary;
  return (
    <div className="space-y-5">
      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">Dataset Summary</p>
            <h1 className="mt-1 text-2xl font-bold tracking-normal">{summary.file_name}</h1>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <Meta label="Rows" value={summary.rows} />
            <Meta label="Columns" value={summary.columns} />
            <Meta label="Type" value={summary.dataset_type} />
            <Meta label="Last Updated" value={new Date(summary.uploaded_at).toLocaleDateString()} />
          </div>
        </div>
      </motion.section>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {dashboard.kpis.map((item) => <KpiCard key={item.label} item={item} />)}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <AIPrompt />
          <div className="grid gap-5 xl:grid-cols-2">
            {dashboard.charts.map((chart) => <ChartCard key={chart.title} chart={chart} />)}
          </div>
          <DataTable />
        </div>
        <InsightPanel />
      </div>
    </div>
  );
}

function Meta({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
