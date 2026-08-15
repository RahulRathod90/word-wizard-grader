import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { HistoryPanel } from "@/components/HistoryPanel";
import { getHistory, type GradingRecord } from "@/lib/gradingHistory";

export default function ProgressPage() {
  const [history, setHistory] = useState<GradingRecord[]>(() => getHistory());
  const refreshHistory = useCallback(() => setHistory(getHistory()), []);

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold text-foreground mb-1">My Progress 📊</h2>
        <p className="text-muted-foreground">Track your essay grading history and score trends over time.</p>
      </div>
      <HistoryPanel records={history} onUpdate={refreshHistory} />
    </motion.div>
  );
}
