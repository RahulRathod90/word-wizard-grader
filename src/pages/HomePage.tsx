import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PenTool, Target, Rocket, Lightbulb, BarChart3, MessageSquare, TrendingUp, Cpu, BookOpen, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  { icon: "📝", num: 1, title: "Write or Upload", desc: "Type your essay, paste it in, or upload a PDF file." },
  { icon: "🎯", num: 2, title: "Get Scored", desc: "Our NLP system analyzes your writing and gives you a score." },
  { icon: "🚀", num: 3, title: "Improve!", desc: "Read the feedback, follow the tips, and watch your scores go up!" },
];

const tools = [
  { icon: PenTool, title: "Paste & Grade", desc: "Submit any essay and get an instant detailed score." },
  { icon: Cpu, title: "NLP Pipeline", desc: "Uses natural language processing for accurate analysis." },
  { icon: BarChart3, title: "Helpful Feedback", desc: "Get tips on grammar, vocabulary, coherence and more." },
  { icon: Lightbulb, title: "Writing Tips", desc: "Curated advice to sharpen your writing skills." },
  { icon: TrendingUp, title: "Track Progress", desc: "See your score history and improvement over time." },
];

export default function HomePage() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <motion.section
        className="text-center py-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6">
          <GraduationCap className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
          Automatic Essay{" "}
          <span className="text-gradient-primary">Grading System</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-lg">
          Leveraging Natural Language Processing and Machine Learning to provide instant, consistent, and fair essay evaluation with detailed feedback.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button asChild size="lg" className="gap-2">
            <Link to="/grade">
              <PenTool className="w-4 h-4" />
              Grade an Essay
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to="/how-it-works">
              <Lightbulb className="w-4 h-4" />
              Learn More
            </Link>
          </Button>
        </div>
      </motion.section>

      {/* How Does It Work */}
      <motion.section
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground italic mb-2">
          How Does It Work?
        </h3>
        <p className="text-muted-foreground mb-12">
          It's super easy — just 3 simple steps!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
            >
              <span className="text-5xl mb-3">{step.icon}</span>
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mb-3">
                {step.num}
              </div>
              <h4 className="font-display font-bold text-foreground text-lg mb-1">{step.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[250px]">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Everything You Need */}
      <motion.section
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground italic mb-2">
          Everything You Need
        </h3>
        <p className="text-muted-foreground mb-10">
          Tools designed to help you become a better writer
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.title}
              className="p-5 rounded-xl bg-card border border-border text-left"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3">
                <tool.icon className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-display font-semibold text-foreground text-sm mb-1">{tool.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{tool.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
