import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import type { GradingRecord } from "@/lib/gradingHistory";
import { format } from "date-fns";

interface ScoreTrendChartProps {
  records: GradingRecord[];
}

export function ScoreTrendChart({ records }: ScoreTrendChartProps) {
  // Reverse so oldest is first (left) on chart
  const chartData = [...records]
    .reverse()
    .map((r, i) => ({
      index: i + 1,
      date: format(new Date(r.timestamp), "MMM d"),
      overall: r.overallScore,
      grammar: r.analysis.grammar.score,
      vocabulary: r.analysis.vocabulary.score,
      coherence: r.analysis.coherence.score,
    }));

  const avgScore =
    Math.round(
      (records.reduce((s, r) => s + r.overallScore, 0) / records.length) * 10
    ) / 10;

  return (
    <motion.div
      className="p-5 rounded-xl bg-card border border-border"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-sm font-display font-semibold text-foreground mb-4">
        Score Progression
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            className="fill-muted-foreground"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
            tick={{ fontSize: 11 }}
            className="fill-muted-foreground"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "0.75rem",
              border: "1px solid hsl(var(--border))",
              background: "hsl(var(--card))",
              fontSize: 12,
            }}
            labelStyle={{ fontWeight: 600 }}
          />
          <ReferenceLine
            y={avgScore}
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="4 4"
            strokeOpacity={0.5}
            label={{
              value: `Avg ${avgScore}`,
              position: "right",
              fontSize: 10,
              fill: "hsl(var(--muted-foreground))",
            }}
          />
          <Line
            type="monotone"
            dataKey="overall"
            name="Overall"
            stroke="hsl(var(--primary))"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "hsl(var(--primary))" }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="grammar"
            name="Grammar"
            stroke="hsl(var(--score-excellent))"
            strokeWidth={1.5}
            strokeDasharray="4 2"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="vocabulary"
            name="Vocabulary"
            stroke="hsl(var(--score-good))"
            strokeWidth={1.5}
            strokeDasharray="4 2"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="coherence"
            name="Coherence"
            stroke="hsl(var(--accent))"
            strokeWidth={1.5}
            strokeDasharray="4 2"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 rounded bg-primary inline-block" /> Overall
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 rounded bg-score-excellent inline-block" /> Grammar
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 rounded bg-score-good inline-block" /> Vocabulary
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 rounded bg-accent inline-block" /> Coherence
        </span>
      </div>
    </motion.div>
  );
}
