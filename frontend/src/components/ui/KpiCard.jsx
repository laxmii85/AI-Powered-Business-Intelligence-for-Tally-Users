import React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function KpiCard({ item }) {
  const positive = item.trend >= 0;
  const value = item.format === "currency" ? currency.format(item.value) : new Intl.NumberFormat("en-IN").format(item.value);
  return (
    <motion.div whileHover={{ y: -3 }} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{item.label}</p>
          <p className="mt-2 text-2xl font-bold tracking-normal">{value}</p>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(item.trend)}%
        </span>
      </div>
      <div className="mt-4 flex h-8 items-end gap-1">
        {[30, 42, 36, 54, 48, 64, 58].map((height, index) => (
          <span key={index} className="flex-1 rounded-t bg-blue-100 dark:bg-blue-900" style={{ height: `${height}%` }} />
        ))}
      </div>
    </motion.div>
  );
}
