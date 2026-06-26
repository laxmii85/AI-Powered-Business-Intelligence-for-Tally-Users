import React from "react";
import AIPrompt from "../components/ui/AIPrompt.jsx";
import DataTable from "../components/ui/DataTable.jsx";

export default function DataExplorer() {
  return (
    <div className="space-y-5">
      <AIPrompt />
      <DataTable />
    </div>
  );
}
