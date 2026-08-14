import { ChatMessage } from "../AIProvider";

export function buildAnalysisPrompt(history: ChatMessage[]): {
  system: string;
  user: string;
} {
  const system = `Analyze this English-practice conversation as a supportive tutor.
Do not present the fluency estimate as a scientific certification — it's a
learning aid only.
Respond ONLY with JSON, no preamble, no markdown fences, matching exactly:
{
  "grammar": string[],
  "vocabulary": string[],
  "fluency": "beginner" | "elementary" | "intermediate" | "upper_intermediate" | "advanced",
  "commonMistakes": string[],
  "improvementSuggestions": string[]
}`;

  const user = JSON.stringify({ conversationHistory: history });
  return { system, user };
}
