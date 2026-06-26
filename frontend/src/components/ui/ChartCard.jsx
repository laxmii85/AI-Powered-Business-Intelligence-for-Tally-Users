import React from "react";
import { Download, Expand, Filter, RefreshCw } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function ChartCard({ chart }) {
  const Chart = chart.type === "line" ? LineChart : BarChart;
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold">{chart.title}</h2>
        <div className="flex gap-1">
          {[Download, Expand, Filter, RefreshCw].map((Icon, index) => (
            <button key={index} className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label={Icon.name}>
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <Chart data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            {chart.type === "line" ? <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={false} /> : <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />}
          </Chart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
