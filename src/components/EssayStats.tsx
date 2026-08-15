import { motion } from "framer-motion";
import { FileText, Type, Hash, Sparkles } from "lucide-react";

interface EssayStatsProps {
  wordCount: number;
  sentenceCount: number;
  avgSentenceLength: number;
  uniqueWords: number;
}

export function EssayStats({ wordCount, sentenceCount, avgSentenceLength, uniqueWords }: EssayStatsProps) {
  const stats = [
    { icon: Type, label: "Words", value: wordCount },
    { icon: FileText, label: "Sentences", value: sentenceCount },
    { icon: Hash, label: "Avg Length", value: avgSentenceLength },
    { icon: Sparkles, label: "Unique Words", value: uniqueWords },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <stat.icon className="w-4 h-4 text-primary" />
          <div>
            <p className="text-lg font-mono font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
