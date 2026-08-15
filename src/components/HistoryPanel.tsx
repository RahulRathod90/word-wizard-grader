import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Trash2, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GradingRecord } from "@/lib/gradingHistory";
import { deleteRecord, clearHistory } from "@/lib/gradingHistory";
import { GradingResults } from "./GradingResults";
import { ScoreTrendChart } from "./ScoreTrendChart";
import { format } from "date-fns";

interface HistoryPanelProps {
  records: GradingRecord[];
  onUpdate: () => void;
}

export function HistoryPanel({ records, onUpdate }: HistoryPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (records.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-card border border-border text-center">
        <History className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No grading history yet. Submit an essay to get started.</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-score-excellent";
    if (score >= 6) return "text-score-good";
    if (score >= 4) return "text-score-average";
    return "text-score-poor";
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return "bg-score-excellent/10 border-score-excellent/20";
    if (score >= 6) return "bg-score-good/10 border-score-good/20";
    if (score >= 4) return "bg-score-average/10 border-score-average/20";
    return "bg-score-poor/10 border-score-poor/20";
  };

  const getTrend = (index: number) => {
    if (index >= records.length - 1) return null;
    const current = records[index].overallScore;
    const previous = records[index + 1].overallScore;
    if (current > previous) return "up";
    if (current < previous) return "down";
    return "same";
  };

  const handleDelete = (id: string) => {
    deleteRecord(id);
    if (expandedId === id) setExpandedId(null);
    onUpdate();
  };

  const handleClear = () => {
    clearHistory();
    setExpandedId(null);
    onUpdate();
  };

  // Compute average score
  const avgScore = Math.round((records.reduce((s, r) => s + r.overallScore, 0) / records.length) * 10) / 10;

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Essays</p>
            <p className="text-xl font-mono font-bold text-foreground">{records.length}</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-xs text-muted-foreground">Avg Score</p>
            <p className={`text-xl font-mono font-bold ${getScoreColor(avgScore)}`}>{avgScore}</p>
          </div>
          {records.length >= 2 && (
            <>
              <div className="w-px h-8 bg-border" />
              <div>
                <p className="text-xs text-muted-foreground">Latest Trend</p>
                <div className="flex items-center gap-1">
                  {getTrend(0) === "up" && <TrendingUp className="w-4 h-4 text-score-excellent" />}
                  {getTrend(0) === "down" && <TrendingDown className="w-4 h-4 text-score-poor" />}
                  {getTrend(0) === "same" && <Minus className="w-4 h-4 text-muted-foreground" />}
                  <span className="text-sm font-medium text-foreground">
                    {getTrend(0) === "up" ? "Improving" : getTrend(0) === "down" ? "Declining" : "Steady"}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleClear} className="text-xs gap-1.5 text-destructive hover:text-destructive">
          <Trash2 className="w-3 h-3" />
          Clear All
        </Button>
      </div>

      {/* Score Trend Chart */}
      {records.length >= 2 && <ScoreTrendChart records={records} />}

      {/* Records list */}
      <div className="space-y-2">
        {records.map((record, index) => {
          const isExpanded = expandedId === record.id;
          const trend = getTrend(index);

          return (
            <motion.div
              key={record.id}
              layout
              className="rounded-xl bg-card border border-border overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : record.id)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${getScoreBg(record.overallScore)}`}>
                  <span className={`text-sm font-mono font-bold ${getScoreColor(record.overallScore)}`}>
                    {record.overallScore}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{record.essayPreview}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(record.timestamp), "MMM d, yyyy · h:mm a")}
                    </span>
                    <span className="text-xs text-muted-foreground">{record.wordCount} words</span>
                    {trend && (
                      <span className="flex items-center gap-0.5 text-xs">
                        {trend === "up" && <TrendingUp className="w-3 h-3 text-score-excellent" />}
                        {trend === "down" && <TrendingDown className="w-3 h-3 text-score-poor" />}
                        {trend === "same" && <Minus className="w-3 h-3 text-muted-foreground" />}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(record.id); }}
                    className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 border-t border-border pt-4">
                      <GradingResults analysis={record.analysis} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
