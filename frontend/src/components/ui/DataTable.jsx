import React, { useMemo, useState } from "react";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Copy, Download, FileSpreadsheet, Search } from "lucide-react";
import { useAppStore } from "../../store/useAppStore.js";

export default function DataTable() {
  const { rows } = useAppStore();
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const columns = useMemo(() => {
    const keys = Object.keys(rows[0] || {});
    return keys.map((key) => ({ accessorKey: key, header: key }));
  }, [rows]);
  const table = useReactTable({
    data: rows,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  const exportCsv = () => {
    const csv = [columns.map((column) => column.header).join(","), ...rows.map((row) => columns.map((column) => JSON.stringify(row[column.accessorKey] ?? "")).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "ledger-export.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm dark:border-slate-700 dark:bg-slate-950" value={globalFilter} onChange={(event) => setGlobalFilter(event.target.value)} placeholder="Search records" />
        </div>
        <div className="flex flex-wrap gap-2">
          {["Today", "Last Week", "Last Month", "Quarter", "Year", "Paid", "Unpaid", "Top Customers", "High Revenue"].map((filter) => (
            <button key={filter} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">{filter}</button>
          ))}
          <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white dark:bg-white dark:text-slate-950">
            <Download size={15} />
            CSV
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
            <FileSpreadsheet size={15} />
            Excel
          </button>
        </div>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <thead className="sticky top-0 bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="whitespace-nowrap border-b border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
                    <button onClick={header.column.getToggleSortingHandler()} className="font-semibold">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === "asc" ? " ↑" : header.column.getIsSorted() === "desc" ? " ↓" : ""}
                    </button>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-blue-50/60 dark:hover:bg-slate-800">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="whitespace-nowrap border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                    <button className="group inline-flex items-center gap-2" onClick={() => navigator.clipboard?.writeText(String(cell.getValue() ?? ""))}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      <Copy className="opacity-0 transition group-hover:opacity-60" size={13} />
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between p-4 text-sm text-slate-600 dark:text-slate-300">
        <span>{table.getFilteredRowModel().rows.length} records</span>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-50 dark:border-slate-700" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</button>
          <span>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}</span>
          <button className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-50 dark:border-slate-700" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</button>
        </div>
      </div>
    </section>
  );
}
