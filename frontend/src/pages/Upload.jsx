import React, { useRef, useState } from "react";
import { FileSpreadsheet, Loader2, UploadCloud } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore.js";

export default function Upload() {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { uploadFile, loading, error } = useAppStore();
  const [dragging, setDragging] = useState(false);
  const submit = async (file) => {
    if (!file) return;
    await uploadFile(file);
    navigate("/dashboard");
  };
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold text-blue-700">Upload Dataset</p>
        <h1 className="mt-2 text-2xl font-bold">Bring your accounting data into LedgerIQ</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">CSV and Excel files are validated, profiled, indexed, and transformed into dashboards automatically.</p>
      </section>
      <motion.button
        type="button"
        whileHover={{ scale: 1.01 }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          submit(event.dataTransfer.files[0]);
        }}
        className={`flex min-h-96 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white p-8 text-center shadow-sm transition dark:bg-slate-900 ${dragging ? "border-blue-500 bg-blue-50" : "border-slate-300 dark:border-slate-700"}`}
      >
        <div className="grid h-20 w-20 place-items-center rounded-full bg-blue-50 text-blue-600">
          {loading ? <Loader2 className="animate-spin" size={34} /> : <UploadCloud size={34} />}
        </div>
        <h2 className="mt-5 text-xl font-bold">Drag and drop your ledger file</h2>
        <p className="mt-2 text-sm text-slate-500">Supports `.csv`, `.xlsx`, and `.xls` files.</p>
        <span className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
          <FileSpreadsheet size={18} />
          Choose File
        </span>
        <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(event) => submit(event.target.files[0])} />
      </motion.button>
      {loading && <div className="h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full w-2/3 animate-pulse rounded-full bg-blue-600" /></div>}
      {error && <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">{error}</div>}
    </div>
  );
}
