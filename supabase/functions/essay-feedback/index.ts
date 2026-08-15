import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { essay, scores, topic } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const topicInstruction = topic
      ? `The essay was written for this topic/prompt: "${topic}". Evaluate how well the essay addresses this specific topic and provide targeted feedback on relevance.`
      : `No specific topic was provided. Evaluate the essay on its general quality.`;

    const systemPrompt = `You are an expert essay grading assistant and writing coach. You analyze essays and provide detailed, constructive feedback.

${topicInstruction}

You will receive an essay along with automated NLP scoring metrics. Your job is to provide:
1. A brief overall assessment (2-3 sentences)
2. Top 3 strengths of the essay
3. Top 3 areas for improvement with specific, actionable suggestions
4. A rewritten example of the weakest sentence to show improvement

Be encouraging but honest. Use markdown formatting. Keep total response under 400 words.`;

    const userPrompt = `Please analyze this essay and provide detailed feedback.
${topic ? `\n**Topic/Prompt:** ${topic}\n` : ""}
**Automated Scores (out of 10):**
- Grammar: ${scores.grammar}
- Vocabulary: ${scores.vocabulary}
- Coherence: ${scores.coherence}
- Structure: ${scores.structure}
- Relevance: ${scores.relevance}
- Overall: ${scores.overall}

**Essay:**
${essay}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage credits exhausted. Please add credits in your workspace settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("essay-feedback error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
