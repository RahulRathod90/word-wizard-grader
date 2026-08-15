import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
  size?: number;
  label?: string;
}

export function ScoreGauge({ score, maxScore = 10, size = 180, label = "Overall Score" }: ScoreGaugeProps) {
  const percentage = (score / maxScore) * 100;
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference * 0.75; // 270 degree arc
  const center = size / 2;

  const getScoreColor = () => {
    if (percentage >= 80) return "text-score-excellent";
    if (percentage >= 60) return "text-score-good";
    if (percentage >= 40) return "text-score-average";
    return "text-score-poor";
  };

  const getStrokeColor = () => {
    if (percentage >= 80) return "stroke-score-excellent";
    if (percentage >= 60) return "stroke-score-good";
    if (percentage >= 40) return "stroke-score-average";
    return "stroke-score-poor";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-[135deg]">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            className="stroke-muted"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
          />
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            className={getStrokeColor()}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`text-4xl font-display font-bold ${getScoreColor()}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-muted-foreground font-body">/ {maxScore}</span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
}
