import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, RotateCcw, BookOpen, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EssayInputProps {
  onSubmit: (essay: string, topic: string) => void;
  isAnalyzing: boolean;
}

const SAMPLE_ESSAYS = [
  {
    title: "Technology & Education",
    text: `Technology has revolutionized the way we approach education in the modern world. However, this transformation brings both significant advantages and notable challenges that educators and students must navigate carefully.

On one hand, digital tools have democratized access to knowledge. Students from remote areas can now access world-class educational resources through online platforms. Furthermore, interactive learning applications have made complex subjects more engaging and accessible. For instance, virtual laboratories allow students to conduct experiments that would otherwise be impossible due to resource constraints.

Nevertheless, the integration of technology in education is not without its drawbacks. The digital divide remains a persistent issue, with students from lower-income families lacking access to devices and reliable internet connections. Moreover, excessive screen time has been linked to attention difficulties and reduced social skills among young learners.

In conclusion, while technology offers tremendous potential to enhance educational outcomes, a balanced approach is essential. Educators must thoughtfully integrate digital tools while preserving the fundamental aspects of human interaction and critical thinking that form the cornerstone of effective learning.`,
  },
  {
    title: "Climate Change",
    text: `Climate change is a big problem. It makes the weather bad. We should do something about it. Trees are important. We need more trees. The ice is melting and animals are dying. People should care more about the environment.`,
  },
];

async function extractTextFromPdf(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item: any) => item.str)
      .join(" ");
    pages.push(text);
  }

  return pages.join("\n\n");
}

export function EssayInput({ onSubmit, isAnalyzing }: EssayInputProps) {
  const [essay, setEssay] = useState("");
  const [topic, setTopic] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (essay.trim().length > 0) {
      onSubmit(essay, topic);
    }
  };

  const loadSample = (text: string) => {
    setEssay(text);
    setUploadedFileName(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 10MB.");
      return;
    }

    setIsParsing(true);
    setUploadedFileName(file.name);

    try {
      const text = await extractTextFromPdf(file);
      if (text.trim().length === 0) {
        toast.error("Could not extract text from the PDF. It may be image-based.");
        setUploadedFileName(null);
      } else {
        setEssay(text.trim());
        toast.success(`Extracted text from "${file.name}"`);
      }
    } catch (err) {
      console.error("PDF parse error:", err);
      toast.error("Failed to parse the PDF. Please try pasting the text instead.");
      setUploadedFileName(null);
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-display font-semibold text-foreground">Submit Your Essay</h2>
        <div className="flex items-center gap-2 flex-wrap">
          {SAMPLE_ESSAYS.map((sample, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              onClick={() => loadSample(sample.text)}
              className="text-xs gap-1.5"
            >
              <BookOpen className="w-3 h-3" />
              {sample.title}
            </Button>
          ))}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isParsing}
            className="text-xs gap-1.5"
          >
            {isParsing ? (
              <>
                <motion.div
                  className="w-3 h-3 border-2 border-foreground/30 border-t-foreground rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Parsing...
              </>
            ) : (
              <>
                <Upload className="w-3 h-3" />
                Upload PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {uploadedFileName && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
          <FileText className="w-3.5 h-3.5 text-primary" />
          <span>Loaded from: <span className="font-medium text-foreground">{uploadedFileName}</span></span>
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">Topic / Prompt <span className="text-muted-foreground font-normal">(optional)</span></label>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. The impact of technology on education"
          className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 placeholder:text-muted-foreground/50 transition-all"
        />
      </div>

      <div className="relative">
        <textarea
          value={essay}
          onChange={(e) => { setEssay(e.target.value); setUploadedFileName(null); }}
          placeholder="Paste or type your essay here, or upload a PDF..."
          className="w-full min-h-[300px] p-4 rounded-lg border border-border bg-card text-foreground font-body text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 placeholder:text-muted-foreground/50 transition-all"
        />
        <div className="absolute bottom-3 right-3 text-xs text-muted-foreground font-mono">
          {essay.split(/\s+/).filter(Boolean).length} words
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={handleSubmit}
          disabled={essay.trim().length === 0 || isAnalyzing}
          className="gap-2"
        >
          {isAnalyzing ? (
            <>
              <motion.div
                className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              Analyzing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Grade Essay
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => { setEssay(""); setUploadedFileName(null); }}
          disabled={essay.length === 0}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Clear
        </Button>
      </div>
    </motion.div>
  );
}
