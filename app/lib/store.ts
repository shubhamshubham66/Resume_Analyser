import { create } from "zustand";
import type { ParsedResume } from "./pdf-parser";
import type { AnalysisResult } from "./analyzer";

export type AppStatus = "idle" | "parsing" | "analyzing" | "done" | "error";

interface AppState {
  file: File | null;
  parsedResume: ParsedResume | null;
  analysis: AnalysisResult | null;
  status: AppStatus;
  error: string | null;

  setFile: (file: File | null) => void;
  setParsedResume: (parsed: ParsedResume | null) => void;
  setAnalysis: (analysis: AnalysisResult | null) => void;
  setStatus: (status: AppStatus) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  file: null,
  parsedResume: null,
  analysis: null,
  status: "idle",
  error: null,

  setFile: (file) => set({ file }),
  setParsedResume: (parsedResume) => set({ parsedResume }),
  setAnalysis: (analysis) => set({ analysis }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error, status: "error" }),
  reset: () =>
    set({
      file: null,
      parsedResume: null,
      analysis: null,
      status: "idle",
      error: null,
    }),
}));
