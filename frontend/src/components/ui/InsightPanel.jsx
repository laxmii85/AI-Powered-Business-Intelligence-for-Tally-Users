import React from "react";
import { AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";
import { useAppStore } from "../../store/useAppStore.js";

const icons = { Warning: AlertTriangle, Opportunity: Lightbulb, Observation: CheckCircle2 };
const tones = { amber: "bg-amber-50 text-amber-700", green: "bg-emerald-50 text-emerald-700", blue: "bg-blue-50 text-blue-700" };

export default function InsightPanel() {
  const { dashboard, aiResult } = useAppStore();
  return (
    <aside className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-semibold">AI Insight Panel</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{aiResult?.explanation || "Ask a question to refresh this panel with focused business analysis."}</p>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-semibold">Business Insights</h2>
        <div className="mt-3 space-y-3">
          {dashboard.insights.map((insight) => {
            const Icon = icons[insight.type] || CheckCircle2;
            return (
              <div key={insight.text} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${tones[insight.tone]}`}>
                  <Icon size={14} />
                  {insight.type}
                </span>
                <p className="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">{insight.text}</p>
              </div>
            );
          })}
        </div>
      </section>
    </aside>
  );
}
