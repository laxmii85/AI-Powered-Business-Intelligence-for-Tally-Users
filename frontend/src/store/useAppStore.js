import { create } from "zustand";
import { api } from "../lib/api";
import { sampleDashboard, sampleRows } from "../lib/sampleData";

export const useAppStore = create((set, get) => ({
  darkMode: false,
  sidebarCollapsed: false,
  activeDataset: null,
  uploads: [],
  dashboard: sampleDashboard,
  rows: sampleRows,
  aiResult: null,
  recentQueries: ["Top Customers", "Outstanding Invoices", "GST Summary"],
  loading: false,
  error: "",
  toggleDark: () => set((state) => ({ darkMode: !state.darkMode })),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  loadUploads: async () => {
    try {
      const { data } = await api.get("/uploads");
      set({ uploads: data, activeDataset: data[0] || get().activeDataset });
    } catch {
      set({ uploads: [] });
    }
  },
  uploadFile: async (file) => {
    set({ loading: true, error: "" });
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await api.post("/uploads", form);
      set({ activeDataset: data });
      await get().refreshDashboard(data.id);
      await get().loadRows(data.id);
      return data;
    } catch (error) {
      set({ error: error.response?.data?.detail || "Upload failed" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  refreshDashboard: async (id = get().activeDataset?.id) => {
    if (!id) return;
    const { data } = await api.get(`/dashboard/${id}`);
    set({ dashboard: data });
  },
  loadRows: async (id = get().activeDataset?.id, params = {}) => {
    if (!id) return;
    const { data } = await api.get(`/data/${id}`, { params });
    set({ rows: data.rows });
  },
  askAI: async (question) => {
    const id = get().activeDataset?.id;
    if (!id) {
      const rows = question.toLowerCase().includes("unpaid") ? sampleRows.filter((row) => row.Status !== "Paid") : sampleRows;
      const result = { question, rows, charts: sampleDashboard.charts, explanation: `Analyzed ${rows.length} sample records for "${question}".` };
      set((state) => ({ aiResult: result, rows, recentQueries: [question, ...state.recentQueries.filter((q) => q !== question)].slice(0, 8) }));
      return result;
    }
    const { data } = await api.post("/ai/query", { upload_id: id, question });
    set((state) => ({ aiResult: data, rows: data.rows, recentQueries: [question, ...state.recentQueries.filter((q) => q !== question)].slice(0, 8) }));
    return data;
  }
}));
