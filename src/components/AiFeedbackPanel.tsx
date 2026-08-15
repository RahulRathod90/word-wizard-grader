import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import type { EssayAnalysis } from "@/lib/essayAnalyzer";
import { toast } from "sonner";

interface AiFeedbackPanelProps {
  essay: string;
  analysis: EssayAnalysis;
  topic?: string;
  onFeedbackChange?: (feedback: string) => void;
}

export function AiFeedbackPanel({ essay, analysis, topic, onFeedbackChange }: AiFeedbackPanelProps) {
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateFeedback = async () => {
    setIsLoading(true);
    setFeedback("");
    setHasGenerated(true);

    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/essay-feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          essay,
          topic: topic || undefined,
          scores: {
            grammar: analysis.grammar.score,
            vocabulary: analysis.vocabulary.score,
            coherence: analysis.coherence.score,
            structure: analysis.structure.score,
            relevance: analysis.relevance.score,
            overall: analysis.overallScore,
          },
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "AI feedback unavailable" }));
        if (resp.status === 429) toast.error("Rate limit reached. Please wait a moment and try again.");
        else if (resp.status === 402) toast.error("AI credits exhausted. Add credits in workspace settings.");
        else toast.error(err.error || "Failed to get AI feedback");
        setIsLoading(false);
        return;
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              accumulated += content;
              setFeedback(accumulated);
              onFeedbackChange?.(accumulated);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // flush remaining
      if (buffer.trim()) {
        for (let raw of buffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              accumulated += content;
              setFeedback(accumulated);
              onFeedbackChange?.(accumulated);
            }
          } catch { /* ignore */ }
        }
      }
    } catch (e) {
      console.error("AI feedback error:", e);
      toast.error("Failed to generate AI feedback. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="p-6 rounded-xl bg-card border border-border space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-display font-semibold text-foreground">AI-Powered Feedback</h3>
        </div>
        <Button
          onClick={generateFeedback}
          disabled={isLoading}
          size="sm"
          className="gap-1.5"
        >
          {isLoading ? (
            <>
              <motion.div
                className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              {hasGenerated ? "Regenerate" : "Get AI Feedback"}
            </>
          )}
        </Button>
      </div>

      {!hasGenerated && !isLoading && (
        <p className="text-sm text-muted-foreground">
          Click the button to get intelligent, nuanced feedback powered by AI that goes beyond automated scoring.
        </p>
      )}

      {(feedback || isLoading) && (
        <motion.div
          className="prose prose-sm max-w-none text-foreground prose-headings:font-display prose-headings:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-p:text-foreground/90 prose-a:text-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <ReactMarkdown>{feedback || "Thinking..."}</ReactMarkdown>
          {isLoading && (
            <motion.span
              className="inline-block w-2 h-4 bg-primary/60 ml-0.5"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
