import React, { useState } from "react";
import { SendHorizontal, Sparkles } from "lucide-react";
import { useAppStore } from "../../store/useAppStore.js";

export default function AIPrompt() {
  const [question, setQuestion] = useState("");
  const { askAI, dashboard } = useAppStore();
  const submit = async (value = question) => {
    if (!value.trim()) return;
    await askAI(value.trim());
    setQuestion("");
  };
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
        <Sparkles size={18} />
        AI Command Center
      </div>
      <form
        className="mt-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-950"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <input className="h-11 flex-1 bg-transparent px-2 text-sm outline-none" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask anything about your business..." aria-label="Ask AI" />
        <button className="grid h-10 w-10 place-items-center rounded-lg bg-blue-600 text-white hover:bg-blue-700" aria-label="Send question">
          <SendHorizontal size={18} />
        </button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {dashboard.suggestions.map((suggestion) => (
          <button key={suggestion} onClick={() => submit(suggestion)} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-blue-500/10">
            {suggestion}
          </button>
        ))}
      </div>
    </section>
  );
}
