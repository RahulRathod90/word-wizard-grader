import { WritingTips } from "@/components/WritingTips";
import { motion } from "framer-motion";

export default function WritingTipsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold text-foreground mb-1">Writing Tips 💡</h2>
        <p className="text-muted-foreground">Helpful guidance to improve your essay writing skills.</p>
      </div>
      <WritingTips />
    </motion.div>
  );
}
