import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";
import type { FeedbackItem } from "@/lib/essayAnalyzer";

interface FeedbackPanelProps {
  items: FeedbackItem[];
}

const iconMap = {
  strength: CheckCircle,
  improvement: AlertTriangle,
  suggestion: Lightbulb,
};

const styleMap = {
  strength: "border-success/30 bg-success/5",
  improvement: "border-warning/30 bg-warning/5",
  suggestion: "border-info/30 bg-info/5",
};

const iconStyleMap = {
  strength: "text-success",
  improvement: "text-warning",
  suggestion: "text-info",
};

const labelMap = {
  strength: "Strength",
  improvement: "Needs Work",
  suggestion: "Suggestion",
};

export function FeedbackPanel({ items }: FeedbackPanelProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-display font-semibold text-foreground">Detailed Feedback</h3>
      <div className="space-y-2">
        {items.map((item, index) => {
          const Icon = iconMap[item.type];
          return (
            <motion.div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg border ${styleMap[item.type]}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
            >
              <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconStyleMap[item.type]}`} />
              <div>
                <span className={`text-xs font-semibold uppercase tracking-wider ${iconStyleMap[item.type]}`}>
                  {labelMap[item.type]}
                </span>
                <p className="text-sm text-foreground mt-0.5">{item.message}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
