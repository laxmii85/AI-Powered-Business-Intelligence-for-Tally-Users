export const sampleRows = [
  { Invoice: "INV-1001", Date: "2026-01-05", Customer: "Aster Retail", Product: "ERP Support", Amount: 124000, Profit: 32000, GST: 22320, Status: "Paid" },
  { Invoice: "INV-1002", Date: "2026-01-18", Customer: "Nova Foods", Product: "Analytics", Amount: 88000, Profit: 19000, GST: 15840, Status: "Unpaid" },
  { Invoice: "INV-1003", Date: "2026-02-09", Customer: "Kiran Exports", Product: "Consulting", Amount: 156000, Profit: 41000, GST: 28080, Status: "Paid" },
  { Invoice: "INV-1004", Date: "2026-02-22", Customer: "Aster Retail", Product: "Licenses", Amount: 64000, Profit: 14000, GST: 11520, Status: "Due" },
  { Invoice: "INV-1005", Date: "2026-03-02", Customer: "Metro Build", Product: "Implementation", Amount: 210000, Profit: 52000, GST: 37800, Status: "Paid" },
  { Invoice: "INV-1006", Date: "2026-03-14", Customer: "Nova Foods", Product: "ERP Support", Amount: 72000, Profit: 15000, GST: 12960, Status: "Unpaid" },
  { Invoice: "INV-1007", Date: "2026-04-10", Customer: "Suryan Textiles", Product: "Analytics", Amount: 132000, Profit: 31000, GST: 23760, Status: "Paid" },
  { Invoice: "INV-1008", Date: "2026-04-26", Customer: "Metro Build", Product: "Consulting", Amount: 94000, Profit: 23000, GST: 16920, Status: "Paid" }
];

export const sampleDashboard = {
  summary: { file_name: "sample-ledger.xlsx", rows: 8, columns: 8, dataset_type: "Sales Ledger", uploaded_at: new Date().toISOString() },
  suggestions: ["Top Customers", "Monthly Trends", "Outstanding Invoices", "GST Summary", "Revenue Growth", "Profit Analysis", "Business Risks"],
  kpis: [
    { label: "Total Revenue", value: 940000, format: "currency", trend: 12.4 },
    { label: "Total Profit", value: 227000, format: "currency", trend: 8.1 },
    { label: "Outstanding Invoices", value: 224000, format: "currency", trend: -4.2 },
    { label: "GST Payable", value: 169200, format: "currency", trend: 6.9 },
    { label: "Total Customers", value: 5, format: "number", trend: 7.8 },
    { label: "Average Invoice Value", value: 117500, format: "currency", trend: 5.6 }
  ],
  charts: [
    { title: "Monthly Revenue", type: "line", data: [{ name: "Jan", value: 212000 }, { name: "Feb", value: 220000 }, { name: "Mar", value: 282000 }, { name: "Apr", value: 226000 }] },
    { title: "Top Customers", type: "bar", data: [{ name: "Metro Build", value: 304000 }, { name: "Aster Retail", value: 188000 }, { name: "Kiran Exports", value: 156000 }, { name: "Nova Foods", value: 160000 }] }
  ],
  insights: [
    { type: "Observation", tone: "blue", text: "Revenue increased 12% with Metro Build contributing the largest share." },
    { type: "Warning", tone: "amber", text: "Outstanding invoices are concentrated in Nova Foods and Aster Retail." },
    { type: "Opportunity", tone: "green", text: "Analytics services are showing strong margin quality across repeat customers." }
  ]
};
