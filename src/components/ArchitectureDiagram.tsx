import { motion } from "framer-motion";
import { FileText, Cog, BarChart3, Brain, Award, MessageSquare } from "lucide-react";

const steps = [
  { icon: FileText, label: "Essay Input", desc: "Student submits essay" },
  { icon: Cog, label: "Preprocessing", desc: "Tokenization & cleaning" },
  { icon: BarChart3, label: "Feature Extraction", desc: "TF-IDF & metrics" },
  { icon: Brain, label: "ML Analysis", desc: "NLP scoring model" },
  { icon: Award, label: "Score", desc: "Grade prediction" },
  { icon: MessageSquare, label: "Feedback", desc: "Detailed report" },
];

export function ArchitectureDiagram() {
  return (
    <div className="py-8">
      <h3 className="text-lg font-display font-semibold text-foreground mb-6 text-center">System Pipeline</h3>
      <div className="flex items-center justify-center gap-1 overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <motion.div
            key={step.label}
            className="flex items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.15 }}
          >
            <div className="flex flex-col items-center gap-2 min-w-[90px]">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <step.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-foreground">{step.label}</p>
                <p className="text-[10px] text-muted-foreground">{step.desc}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <motion.div
                className="w-6 h-px bg-primary/30 mx-1 mt-[-20px]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3, delay: index * 0.15 + 0.2 }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
