import { useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import type { EssayAnalysis } from "@/lib/essayAnalyzer";
import { ScoreGauge } from "./ScoreGauge";
import { MetricBar } from "./MetricBar";
import { EssayStats } from "./EssayStats";
import { FeedbackPanel } from "./FeedbackPanel";
import { AiFeedbackPanel } from "./AiFeedbackPanel";
import { Button } from "@/components/ui/button";
import { exportGradingPdf } from "@/lib/exportPdf";

interface GradingResultsProps {
  analysis: EssayAnalysis;
  essayText?: string;
  topic?: string;
}

export function GradingResults({ analysis, essayText, topic }: GradingResultsProps) {
  const [aiFeedback, setAiFeedback] = useState("");

  const metrics = [
    { name: "Grammar & Mechanics", metric: analysis.grammar },
    { name: "Vocabulary Richness", metric: analysis.vocabulary },
    { name: "Coherence & Flow", metric: analysis.coherence },
    { name: "Structure & Organization", metric: analysis.structure },
    { name: "Content Relevance", metric: analysis.relevance },
  ];

  const handleExport = () => {
    exportGradingPdf(analysis, essayText, aiFeedback || undefined);
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Export Button */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
          <Download className="w-3.5 h-3.5" />
          Export PDF
        </Button>
      </div>

      {/* Score + Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <motion.div
          className="flex justify-center p-6 rounded-xl bg-card border border-border"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ScoreGauge score={analysis.overallScore} />
        </motion.div>

        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="text-lg font-display font-semibold text-foreground mb-4">Essay Statistics</h3>
          <EssayStats
            wordCount={analysis.wordCount}
            sentenceCount={analysis.sentenceCount}
            avgSentenceLength={analysis.avgSentenceLength}
            uniqueWords={analysis.uniqueWords}
          />
        </div>
      </div>

      {/* Metric Bars */}
      <motion.div
        className="p-6 rounded-xl bg-card border border-border space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-lg font-display font-semibold text-foreground">Scoring Breakdown</h3>
        {metrics.map((m, i) => (
          <MetricBar key={m.name} name={m.name} metric={m.metric} delay={i * 0.15 + 0.5} />
        ))}
      </motion.div>

      {/* Feedback */}
      <motion.div
        className="p-6 rounded-xl bg-card border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <FeedbackPanel items={analysis.feedback} />
      </motion.div>

      {/* AI Feedback */}
      {essayText && (
        <AiFeedbackPanel essay={essayText} analysis={analysis} topic={topic} onFeedbackChange={setAiFeedback} />
      )}
    </motion.div>
  );
}
