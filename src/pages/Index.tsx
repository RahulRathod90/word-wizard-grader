import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Cpu, BookOpen, History } from "lucide-react";
import { EssayInput } from "@/components/EssayInput";
import { GradingResults } from "@/components/GradingResults";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { HistoryPanel } from "@/components/HistoryPanel";
import { WritingTips } from "@/components/WritingTips";
import { analyzeEssay, type EssayAnalysis } from "@/lib/essayAnalyzer";
import { saveGradingRecord, getHistory, type GradingRecord } from "@/lib/gradingHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [analysis, setAnalysis] = useState<EssayAnalysis | null>(null);
  const [currentEssay, setCurrentEssay] = useState("");
  const [currentTopic, setCurrentTopic] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<GradingRecord[]>(() => getHistory());
  const [activeTab, setActiveTab] = useState("grade");

  const refreshHistory = useCallback(() => setHistory(getHistory()), []);

  const handleSubmit = async (essay: string, topic: string) => {
    setIsAnalyzing(true);
    setAnalysis(null);
    setCurrentEssay(essay);
    setCurrentTopic(topic);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const result = analyzeEssay(essay, topic || undefined);
    saveGradingRecord(essay, result);
    refreshHistory();
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-foreground">EssayGrader</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Essay Scoring</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5" />NLP Engine</span>
            <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" />ML Scoring</span>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
        <motion.section className="text-center py-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Automatic Essay <span className="text-gradient-primary">Grading System</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Leveraging Natural Language Processing and Machine Learning to provide instant, consistent, and fair essay evaluation with detailed feedback.
          </p>
        </motion.section>

        <ArchitectureDiagram />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full max-w-xs mx-auto grid grid-cols-2">
            <TabsTrigger value="grade" className="gap-1.5"><BookOpen className="w-3.5 h-3.5" />Grade</TabsTrigger>
            <TabsTrigger value="history" className="gap-1.5">
              <History className="w-3.5 h-3.5" />
              History{history.length > 0 && <span className="ml-1 text-xs opacity-60">({history.length})</span>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grade" className="mt-6 space-y-8">
            <WritingTips />
            <section className="p-6 rounded-xl bg-card border border-border">
              <EssayInput onSubmit={handleSubmit} isAnalyzing={isAnalyzing} />
            </section>
            <AnimatePresence>
              {analysis && (
                <motion.section initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <GradingResults analysis={analysis} essayText={currentEssay} topic={currentTopic} />
                </motion.section>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <HistoryPanel records={history} onUpdate={refreshHistory} />
          </TabsContent>
        </Tabs>

        <motion.section className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          {[
            { title: "Grammar Analysis", desc: "Detects sentence structure, capitalization, and punctuation issues." },
            { title: "Vocabulary Scoring", desc: "Measures word variety, advanced vocabulary usage, and richness." },
            { title: "Coherence Check", desc: "Evaluates transition words, paragraph structure, and logical flow." },
          ].map((feature) => (
            <div key={feature.title} className="p-5 rounded-xl bg-card border border-border">
              <h4 className="font-display font-semibold text-foreground mb-1.5">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </motion.section>
      </main>

      <footer className="border-t border-border py-6 mt-8">
        <div className="container max-w-5xl mx-auto px-4 text-center text-xs text-muted-foreground">
          Automatic Essay Grading System — NLP & Machine Learning Based Scoring
        </div>
      </footer>
    </div>
  );
};

export default Index;
