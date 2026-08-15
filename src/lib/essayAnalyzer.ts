// Client-side NLP-style essay analysis engine

export interface EssayAnalysis {
  overallScore: number; // 0-10
  grammar: MetricScore;
  vocabulary: MetricScore;
  coherence: MetricScore;
  structure: MetricScore;
  relevance: MetricScore;
  wordCount: number;
  sentenceCount: number;
  avgSentenceLength: number;
  uniqueWords: number;
  feedback: FeedbackItem[];
}

export interface MetricScore {
  score: number; // 0-10
  label: string;
}

export interface FeedbackItem {
  type: "strength" | "improvement" | "suggestion";
  message: string;
}

const COMMON_WORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "need", "dare", "ought",
  "used", "to", "of", "in", "for", "on", "with", "at", "by", "from",
  "as", "into", "through", "during", "before", "after", "above", "below",
  "between", "out", "off", "over", "under", "again", "further", "then",
  "once", "here", "there", "when", "where", "why", "how", "all", "each",
  "every", "both", "few", "more", "most", "other", "some", "such", "no",
  "nor", "not", "only", "own", "same", "so", "than", "too", "very",
  "just", "because", "but", "and", "or", "if", "while", "that", "this",
  "it", "its", "i", "me", "my", "we", "our", "you", "your", "he",
  "him", "his", "she", "her", "they", "them", "their", "what", "which",
  "who", "whom", "these", "those",
]);

const TRANSITION_WORDS = [
  "however", "moreover", "furthermore", "additionally", "consequently",
  "therefore", "nevertheless", "although", "meanwhile", "subsequently",
  "conversely", "similarly", "likewise", "nonetheless", "thus",
  "hence", "accordingly", "besides", "indeed", "specifically",
  "in addition", "on the other hand", "in contrast", "as a result",
  "for example", "for instance", "in conclusion", "to summarize",
];

const ADVANCED_VOCAB = [
  "analyze", "synthesize", "evaluate", "comprehensive", "significant",
  "fundamental", "perspective", "demonstrate", "illustrate", "emphasize",
  "substantial", "prevalent", "inherent", "facilitate", "implement",
  "paradigm", "methodology", "implications", "phenomenon", "articulate",
  "nuanced", "multifaceted", "intricate", "profound", "compelling",
  "eloquent", "sophisticated", "innovative", "systematic", "empirical",
];

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^\w\s']/g, " ").split(/\s+/).filter(Boolean);
}

function getSentences(text: string): string[] {
  return text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
}

function analyzeGrammar(text: string, sentences: string[]): MetricScore {
  let score = 10;
  const issues: string[] = [];

  // Check capitalization at sentence starts
  const rawSentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  let capErrors = 0;
  rawSentences.forEach(s => {
    const trimmed = s.trim();
    if (trimmed.length > 0 && trimmed[0] !== trimmed[0].toUpperCase()) capErrors++;
  });
  if (capErrors > 0) score -= Math.min(capErrors * 0.5, 2);

  // Check for double spaces
  if (/  +/.test(text)) score -= 0.5;

  // Check sentence length variety
  const lengths = sentences.map(s => s.split(/\s+/).length);
  const avgLen = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  if (avgLen < 5) score -= 1.5;
  if (avgLen > 35) score -= 1;

  // Check for repeated words
  const words = tokenize(text);
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i] === words[i + 1] && !COMMON_WORDS.has(words[i])) score -= 0.3;
  }

  // Check punctuation
  if (!text.trim().match(/[.!?]$/)) score -= 0.5;

  score = Math.max(0, Math.min(10, score));
  return { score: Math.round(score * 10) / 10, label: getLabel(score) };
}

function analyzeVocabulary(words: string[]): MetricScore {
  const contentWords = words.filter(w => !COMMON_WORDS.has(w) && w.length > 2);
  const uniqueContent = new Set(contentWords);
  
  // Vocabulary richness (type-token ratio)
  const ttr = contentWords.length > 0 ? uniqueContent.size / contentWords.length : 0;
  
  // Advanced word usage
  const advancedCount = words.filter(w => 
    ADVANCED_VOCAB.some(av => w.includes(av))
  ).length;
  
  // Average word length
  const avgWordLen = words.reduce((sum, w) => sum + w.length, 0) / words.length;

  let score = 5;
  score += ttr * 3; // up to ~3 points for variety
  score += Math.min(advancedCount * 0.5, 2); // up to 2 for advanced words
  if (avgWordLen > 5) score += 0.5;
  if (avgWordLen > 6) score += 0.5;

  score = Math.max(0, Math.min(10, score));
  return { score: Math.round(score * 10) / 10, label: getLabel(score) };
}

function analyzeCoherence(text: string, sentences: string[]): MetricScore {
  const lowerText = text.toLowerCase();
  
  // Count transition words
  let transitionCount = 0;
  TRANSITION_WORDS.forEach(tw => {
    const regex = new RegExp(`\\b${tw}\\b`, "gi");
    const matches = lowerText.match(regex);
    if (matches) transitionCount += matches.length;
  });

  const transitionRatio = sentences.length > 0 ? transitionCount / sentences.length : 0;

  let score = 5;
  score += Math.min(transitionRatio * 5, 3);
  
  // Paragraph structure (check for line breaks)
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  if (paragraphs.length > 1) score += 1;
  if (paragraphs.length >= 3) score += 1;

  score = Math.max(0, Math.min(10, score));
  return { score: Math.round(score * 10) / 10, label: getLabel(score) };
}

function analyzeStructure(text: string, sentences: string[], wordCount: number): MetricScore {
  let score = 5;
  
  // Length bonus
  if (wordCount >= 100) score += 1;
  if (wordCount >= 200) score += 1;
  if (wordCount >= 300) score += 0.5;
  
  // Paragraph count
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  if (paragraphs.length >= 2) score += 1;
  if (paragraphs.length >= 4) score += 1;
  
  // Sentence variety
  const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
  if (sentenceLengths.length > 1) {
    const variance = sentenceLengths.reduce((sum, l) => {
      const avg = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
      return sum + Math.pow(l - avg, 2);
    }, 0) / sentenceLengths.length;
    if (variance > 10) score += 0.5;
  }

  score = Math.max(0, Math.min(10, score));
  return { score: Math.round(score * 10) / 10, label: getLabel(score) };
}

function analyzeRelevance(words: string[], text: string, topic?: string): MetricScore {
  const contentWords = words.filter(w => !COMMON_WORDS.has(w) && w.length > 3);
  const contentRatio = contentWords.length / words.length;

  if (topic && topic.trim().length > 0) {
    const topicWords = topic.toLowerCase().replace(/[^\w\s']/g, " ").split(/\s+/).filter(w => !COMMON_WORDS.has(w) && w.length > 2);
    const textLower = text.toLowerCase();
    const matchCount = topicWords.filter(tw => textLower.includes(tw)).length;
    const matchRatio = topicWords.length > 0 ? matchCount / topicWords.length : 0;
    let score = matchRatio * 6 + contentRatio * 4;
    score = Math.max(0, Math.min(10, score));
    return { score: Math.round(score * 10) / 10, label: getLabel(score) };
  }

  let score = 5 + contentRatio * 5;
  score = Math.max(0, Math.min(10, score));
  return { score: Math.round(score * 10) / 10, label: getLabel(score) };
}

function getLabel(score: number): string {
  if (score >= 9) return "Excellent";
  if (score >= 7) return "Good";
  if (score >= 5) return "Average";
  if (score >= 3) return "Below Average";
  return "Needs Improvement";
}

function generateFeedback(analysis: Omit<EssayAnalysis, "feedback">): FeedbackItem[] {
  const feedback: FeedbackItem[] = [];

  // Strengths
  if (analysis.vocabulary.score >= 7) {
    feedback.push({ type: "strength", message: "Strong vocabulary usage with good word variety." });
  }
  if (analysis.coherence.score >= 7) {
    feedback.push({ type: "strength", message: "Excellent use of transition words for smooth flow." });
  }
  if (analysis.grammar.score >= 8) {
    feedback.push({ type: "strength", message: "Clean grammar and proper sentence construction." });
  }
  if (analysis.wordCount >= 200) {
    feedback.push({ type: "strength", message: "Good essay length with sufficient detail." });
  }

  // Improvements
  if (analysis.wordCount < 100) {
    feedback.push({ type: "improvement", message: "Essay is too short. Aim for at least 150-200 words." });
  }
  if (analysis.vocabulary.score < 5) {
    feedback.push({ type: "improvement", message: "Consider using more varied and advanced vocabulary." });
  }
  if (analysis.coherence.score < 5) {
    feedback.push({ type: "improvement", message: "Add transition words (however, moreover, therefore) for better flow." });
  }
  if (analysis.structure.score < 5) {
    feedback.push({ type: "improvement", message: "Organize your essay into clear paragraphs with introduction and conclusion." });
  }
  if (analysis.avgSentenceLength < 8) {
    feedback.push({ type: "improvement", message: "Sentences are too short. Try combining ideas for more complex sentences." });
  }

  // Suggestions
  feedback.push({ type: "suggestion", message: "Consider adding specific examples to support your arguments." });
  if (analysis.uniqueWords < 50) {
    feedback.push({ type: "suggestion", message: "Try to expand your vocabulary by using synonyms." });
  }

  return feedback;
}

export function analyzeEssay(text: string, topic?: string): EssayAnalysis {
  const words = tokenize(text);
  const sentences = getSentences(text);
  const uniqueWords = new Set(words).size;
  const wordCount = words.length;
  const sentenceCount = sentences.length;
  const avgSentenceLength = sentenceCount > 0 ? Math.round(wordCount / sentenceCount) : 0;

  const grammar = analyzeGrammar(text, sentences);
  const vocabulary = analyzeVocabulary(words);
  const coherence = analyzeCoherence(text, sentences);
  const structure = analyzeStructure(text, sentences, wordCount);
  const relevance = analyzeRelevance(words, text, topic);

  const weights = { grammar: 0.25, vocabulary: 0.2, coherence: 0.2, structure: 0.2, relevance: 0.15 };
  const overallScore = Math.round(
    (grammar.score * weights.grammar +
      vocabulary.score * weights.vocabulary +
      coherence.score * weights.coherence +
      structure.score * weights.structure +
      relevance.score * weights.relevance) * 10
  ) / 10;

  const partialAnalysis = {
    overallScore,
    grammar,
    vocabulary,
    coherence,
    structure,
    relevance,
    wordCount,
    sentenceCount,
    avgSentenceLength,
    uniqueWords,
    feedback: [] as FeedbackItem[],
  };

  return {
    ...partialAnalysis,
    feedback: generateFeedback(partialAnalysis),
  };
}
