import jsPDF from "jspdf";
import type { EssayAnalysis } from "./essayAnalyzer";

export function exportGradingPdf(
  analysis: EssayAnalysis,
  essayText?: string,
  aiFeedback?: string
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const checkPageBreak = (needed: number) => {
    if (y + needed > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      y = 20;
    }
  };

  // Title
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Essay Grading Report", margin, y);
  y += 10;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120);
  doc.text(`Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}`, margin, y);
  doc.setTextColor(0);
  y += 10;

  // Divider
  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // Overall Score
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Overall Score: ${analysis.overallScore} / 10`, margin, y);
  y += 10;

  // Stats
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const stats = [
    `Words: ${analysis.wordCount}`,
    `Sentences: ${analysis.sentenceCount}`,
    `Avg Sentence Length: ${analysis.avgSentenceLength}`,
    `Unique Words: ${analysis.uniqueWords}`,
  ];
  doc.text(stats.join("  •  "), margin, y);
  y += 12;

  // Metric Scores
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Scoring Breakdown", margin, y);
  y += 8;

  const metrics = [
    { name: "Grammar & Mechanics", m: analysis.grammar },
    { name: "Vocabulary Richness", m: analysis.vocabulary },
    { name: "Coherence & Flow", m: analysis.coherence },
    { name: "Structure & Organization", m: analysis.structure },
    { name: "Content Relevance", m: analysis.relevance },
  ];

  doc.setFontSize(10);
  metrics.forEach(({ name, m }) => {
    checkPageBreak(8);
    doc.setFont("helvetica", "normal");
    doc.text(`${name}:`, margin, y);
    doc.setFont("helvetica", "bold");
    doc.text(`${m.score}/10 (${m.label})`, margin + 60, y);
    y += 7;
  });
  y += 5;

  // Feedback
  if (analysis.feedback.length > 0) {
    checkPageBreak(15);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Feedback", margin, y);
    y += 8;

    doc.setFontSize(10);
    analysis.feedback.forEach((item) => {
      checkPageBreak(12);
      const icon = item.type === "strength" ? "✓" : item.type === "improvement" ? "✗" : "→";
      const label = item.type.charAt(0).toUpperCase() + item.type.slice(1);
      doc.setFont("helvetica", "bold");
      doc.text(`${icon} [${label}]`, margin, y);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(item.message, contentWidth - 5);
      doc.text(lines, margin + 5, y + 6);
      y += 6 + lines.length * 5 + 3;
    });
  }

  // AI Feedback
  if (aiFeedback) {
    y += 5;
    checkPageBreak(15);
    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("AI-Powered Feedback", margin, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    // Strip markdown formatting for PDF
    const cleanText = aiFeedback
      .replace(/#{1,6}\s+/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/---/g, "");

    const aiLines = doc.splitTextToSize(cleanText, contentWidth);
    aiLines.forEach((line: string) => {
      checkPageBreak(6);
      doc.text(line, margin, y);
      y += 5;
    });
  }

  // Essay text
  if (essayText) {
    y += 5;
    checkPageBreak(15);
    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Original Essay", margin, y);
    y += 8;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60);
    const essayLines = doc.splitTextToSize(essayText, contentWidth);
    essayLines.forEach((line: string) => {
      checkPageBreak(5);
      doc.text(line, margin, y);
      y += 4.5;
    });
    doc.setTextColor(0);
  }

  doc.save("essay-grading-report.pdf");
}
