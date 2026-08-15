import { motion } from "framer-motion";
import type { MetricScore } from "@/lib/essayAnalyzer";

interface MetricBarProps {
  name: string;
  metric: MetricScore;
  maxScore?: number;
  delay?: number;
}

export function MetricBar({ name, metric, maxScore = 10, delay = 0 }: MetricBarProps) {
  const percentage = (metric.score / maxScore) * 100;

  const getBarColor = () => {
    if (percentage >= 80) return "bg-score-excellent";
    if (percentage >= 60) return "bg-score-good";
    if (percentage >= 40) return "bg-score-average";
    return "bg-score-poor";
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{name}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{metric.label}</span>
          <span className="text-sm font-mono font-medium text-foreground">{metric.score}</span>
        </div>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${getBarColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: delay }}
        />
      </div>
    </div>
  );
}
