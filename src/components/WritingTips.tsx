import { motion } from "framer-motion";
import { Lightbulb, ChevronDown } from "lucide-react";
import { useState } from "react";

const TIPS = [
  {
    category: "Structure",
    tips: [
      "Start with a clear thesis statement in your introduction.",
      "Use one main idea per paragraph with supporting evidence.",
      "End with a conclusion that restates your argument, not just a summary.",
    ],
  },
  {
    category: "Grammar",
    tips: [
      "Vary sentence length — mix short punchy sentences with longer complex ones.",
      "Avoid passive voice when an active alternative is clearer.",
      "Proofread for subject-verb agreement, especially in long sentences.",
    ],
  },
  {
    category: "Vocabulary",
    tips: [
      "Replace overused words (good, bad, things) with precise alternatives.",
      "Use discipline-specific terminology when appropriate.",
      "Avoid repeating the same word within two consecutive sentences.",
    ],
  },
  {
    category: "Coherence",
    tips: [
      "Use transition words (however, furthermore, consequently) between ideas.",
      "Each paragraph should logically follow the previous one.",
      "Refer back to your thesis to keep the essay focused.",
    ],
  },
];

export function WritingTips() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const toggle = (cat: string) =>
    setOpenCategory((prev) => (prev === cat ? null : cat));

  return (
    <motion.div
      className="p-5 rounded-xl bg-card border border-border"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4.5 h-4.5 text-primary" />
        <h3 className="font-display font-semibold text-foreground">Writing Tips</h3>
      </div>

      <div className="space-y-1">
        {TIPS.map((group) => {
          const isOpen = openCategory === group.category;
          return (
            <div key={group.category}>
              <button
                onClick={() => toggle(group.category)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted/60 transition-colors"
              >
                {group.category}
                <ChevronDown
                  className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <motion.ul
                  className="ml-3 pl-3 border-l border-border space-y-1.5 py-1.5"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.2 }}
                >
                  {group.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-muted-foreground leading-relaxed">
                      {tip}
                    </li>
                  ))}
                </motion.ul>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
