import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, Award, Sparkles } from "lucide-react";
import { EssayInput } from "@/components/EssayInput";
import { MetricBar } from "@/components/MetricBar";
import { FeedbackPanel } from "@/components/FeedbackPanel";
import { AiFeedbackPanel } from "@/components/AiFeedbackPanel";
import { Button } from "@/components/ui/button";
import { analyzeEssay, type EssayAnalysis } from "@/lib/essayAnalyzer";
import { saveGradingRecord, getHistory } from "@/lib/gradingHistory";
import { exportGradingPdf } from "@/lib/exportPdf";
import { Download, FileText, Type, Hash, Clock } from "lucide-react";

function getScoreIcon(score: number) {
  if (score >= 8) return <CheckCircle2 className="w-10 h-10 text-score-excellent" />;
  if (score >= 6) return <AlertTriangle className="w-10 h-10 text-score-average" />;
  return <AlertTriangle className="w-10 h-10 text-score-poor" />;
}

function getScoreColor(score: number) {
  if (score >= 8) return "text-score-excellent";
  if (score >= 6) return "text-score-good";
  if (score >= 4) return "text-score-average";
  return "text-score-poor";
}

function getScoreBg(score: number) {
  if (score >= 8) return "bg-score-excellent/5 border-score-excellent/20";
  if (score >= 6) return "bg-score-good/5 border-score-good/20";
  if (score >= 4) return "bg-score-average/5 border-score-average/20";
  return "bg-score-poor/5 border-score-poor/20";
}

function getEncouragement(score: number) {
  if (score >= 8) return { text: "Excellent work! You're a star! 🌟", icon: "🌟" };
  if (score >= 6) return { text: "Great job! You're on the right track! 💪", icon: "💪" };
  if (score >= 4) return { text: "Good effort! Keep practicing! 📝", icon: "📝" };
  return { text: "Don't give up! Every draft makes you better! 💡", icon: "💡" };
}

function getLengthLabel(words: number) {
  if (words >= 300) return "Good length";
  if (words >= 150) return "Acceptable length";
  if (words >= 50) return "Short";
  return "Very short";
}

export default function GradePage() {
  const [analysis, setAnalysis] = useState<EssayAnalysis | null>(null);
  const [currentEssay, setCurrentEssay] = useState("");
  const [currentTopic, setCurrentTopic] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState("");

  const handleSubmit = async (essay: string, topic: string) => {
    setIsAnalyzing(true);
    setAnalysis(null);
    setAiFeedback("");
    setCurrentEssay(essay);
    setCurrentTopic(topic);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const result = analyzeEssay(essay, topic || undefined);
    saveGradingRecord(essay, result);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleExport = () => {
    if (analysis) exportGradingPdf(analysis, currentEssay, aiFeedback || undefined);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-display font-bold text-foreground mb-1">
          Grade Your Essay ✍️
        </h2>
        <p className="text-muted-foreground">
          Paste your essay, upload a PDF, or type it below. Hit 'Grade' and get instant feedback!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Essay Input */}
        <section className="p-6 rounded-xl bg-card border border-border">
          <EssayInput onSubmit={handleSubmit} isAnalyzing={isAnalyzing} />
        </section>

        {/* Right: Inline Results */}
        <AnimatePresence mode="wait">
          {isAnalyzing && (
            <motion.div
              key="loading"
              className="p-8 rounded-xl bg-card border border-border flex flex-col items-center justify-center min-h-[400px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-sm text-muted-foreground mt-4">Analyzing your essay...</p>
            </motion.div>
          )}

          {!isAnalyzing && analysis && (
            <motion.div
              key="results"
              className="space-y-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Score Card */}
              <div className={`p-6 rounded-xl border ${getScoreBg(analysis.overallScore)} flex flex-col items-center text-center`}>
                {getScoreIcon(analysis.overallScore)}
                <span className={`text-5xl font-display font-bold mt-3 ${getScoreColor(analysis.overallScore)}`}>
                  {analysis.overallScore}
                </span>
                <span className="text-sm text-muted-foreground mt-1">out of 10</span>
                <p className="text-sm text-foreground mt-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-primary" />
                  {getEncouragement(analysis.overallScore).text}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-card border border-border text-center">
                  <Type className="w-4 h-4 text-muted-foreground mx-auto mb-1.5" />
                  <p className="text-xl font-mono font-bold text-foreground">{analysis.wordCount}</p>
                  <p className="text-xs text-muted-foreground">Words</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border text-center">
                  <Hash className="w-4 h-4 text-muted-foreground mx-auto mb-1.5" />
                  <p className="text-xl font-mono font-bold text-foreground">{analysis.sentenceCount}</p>
                  <p className="text-xs text-muted-foreground">Sentences</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border text-center">
                  <Clock className="w-4 h-4 text-muted-foreground mx-auto mb-1.5" />
                  <p className="text-lg font-semibold text-foreground">{getLengthLabel(analysis.wordCount)}</p>
                  <p className="text-xs text-muted-foreground">Length</p>
                </div>
              </div>
            </motion.div>
          )}

          {!isAnalyzing && !analysis && (
            <motion.div
              key="placeholder"
              className="p-8 rounded-xl bg-card border border-border border-dashed flex flex-col items-center justify-center min-h-[400px] text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Award className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">Your grading results will appear here</p>
              <p className="text-muted-foreground/60 text-xs mt-1">Submit an essay to get started</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Below: Detailed breakdown */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Export */}
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
                <Download className="w-3.5 h-3.5" />
                Export PDF
              </Button>
            </div>

            {/* Tips to Improve (feedback) */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <FeedbackPanel items={analysis.feedback} />
            </div>

            {/* Scoring Breakdown */}
            <div className="p-6 rounded-xl bg-card border border-border space-y-4">
              <h3 className="text-lg font-display font-semibold text-foreground">Scoring Breakdown</h3>
              {[
                { name: "Grammar & Mechanics", metric: analysis.grammar },
                { name: "Vocabulary Richness", metric: analysis.vocabulary },
                { name: "Coherence & Flow", metric: analysis.coherence },
                { name: "Structure & Organization", metric: analysis.structure },
                { name: "Content Relevance", metric: analysis.relevance },
              ].map((m, i) => (
                <MetricBar key={m.name} name={m.name} metric={m.metric} delay={i * 0.1 + 0.3} />
              ))}
            </div>

            {/* AI Feedback */}
            <AiFeedbackPanel
              essay={currentEssay}
              analysis={analysis}
              topic={currentTopic}
              onFeedbackChange={setAiFeedback}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
