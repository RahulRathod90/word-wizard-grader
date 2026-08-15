import type { EssayAnalysis } from "./essayAnalyzer";

export interface GradingRecord {
  id: string;
  timestamp: number;
  essayPreview: string;
  wordCount: number;
  overallScore: number;
  analysis: EssayAnalysis;
}

const STORAGE_KEY = "essay-grading-history";

export function saveGradingRecord(essay: string, analysis: EssayAnalysis): GradingRecord {
  const record: GradingRecord = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    essayPreview: essay.slice(0, 120).trim() + (essay.length > 120 ? "…" : ""),
    wordCount: analysis.wordCount,
    overallScore: analysis.overallScore,
    analysis,
  };

  const history = getHistory();
  history.unshift(record);
  // Keep last 50
  if (history.length > 50) history.length = 50;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return record;
}

export function getHistory(): GradingRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function deleteRecord(id: string) {
  const history = getHistory().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}
