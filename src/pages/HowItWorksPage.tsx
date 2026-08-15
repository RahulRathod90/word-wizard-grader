import { motion } from "framer-motion";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { FileText, Cog, BarChart3, Brain, Award, MessageSquare } from "lucide-react";

const details = [
  {
    icon: FileText,
    title: "1. Essay Input",
    desc: "Submit your essay by pasting text, typing directly, or uploading a PDF file. Optionally set a topic for more targeted scoring.",
  },
  {
    icon: Cog,
    title: "2. Preprocessing",
    desc: "The system tokenizes, cleans, and normalizes your text — removing noise and preparing it for analysis.",
  },
  {
    icon: BarChart3,
    title: "3. Feature Extraction",
    desc: "Key metrics like word frequency, sentence variety, transition usage, and vocabulary richness are computed.",
  },
  {
    icon: Brain,
    title: "4. NLP Scoring",
    desc: "Multiple scoring models evaluate grammar, coherence, structure, vocabulary, and topic relevance independently.",
  },
  {
    icon: Award,
    title: "5. Grade Prediction",
    desc: "Individual scores are weighted and combined into a final overall score on a 0–10 scale.",
  },
  {
    icon: MessageSquare,
    title: "6. Feedback Report",
    desc: "Detailed feedback highlights strengths, areas for improvement, and actionable suggestions. AI can provide deeper analysis.",
  },
];

export default function HowItWorksPage() {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-foreground mb-1">How It Works ⚙️</h2>
        <p className="text-muted-foreground">Understand the NLP and Machine Learning pipeline behind essay grading.</p>
      </div>

      <ArchitectureDiagram />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {details.map((step, i) => (
          <motion.div
            key={step.title}
            className="p-5 rounded-xl bg-card border border-border"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
              <step.icon className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-display font-semibold text-foreground mb-1">{step.title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
