import { env } from "../../config/env";
import { AppError } from "../../utils/AppError";
import {
  AIProvider,
  ChatMessage,
  ConversationAnalysis,
  ConversationTurnResult,
  Correction,
  VocabularyItem,
} from "./AIProvider";
import { buildConversationPrompt } from "./prompts/conversation.prompt";
import { buildAnalysisPrompt } from "./prompts/analysis.prompt";
import { buildVocabularyPrompt } from "./prompts/vocabulary.prompt";
import { buildCorrectionPrompt } from "./prompts/correction.prompt";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

async function callAnthropic(system: string, userContent: string): Promise<string> {
  if (!env.aiApiKey) {
    throw new AppError(
      "AI_API_KEY is not configured.",
      500,
      "AI_PROVIDER_ERROR"
    );
  }

  const res = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.aiApiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: env.aiModel,
      max_tokens: 1024,
      system,
      messages: [{ role: "user", content: userContent }],
    }),
  });

  if (!res.ok) {
    throw new AppError(
      `AI provider request failed (${res.status})`,
      502,
      "AI_PROVIDER_ERROR"
    );
  }

  const data = (await res.json()) as {
    content: Array<{ type: string; text?: string }>;
  };
  const text = data.content
    .filter((block) => block.type === "text" && block.text)
    .map((block) => block.text)
    .join("\n");

  if (!text) {
    throw new AppError("AI provider returned an empty response.", 502, "AI_PROVIDER_ERROR");
  }
  return text;
}

function parseJson<T>(raw: string): T {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new AppError(
      "Failed to parse AI provider response as JSON.",
      502,
      "AI_PROVIDER_ERROR"
    );
  }
}

export class AnthropicProvider implements AIProvider {
  async generateResponse(
    history: ChatMessage[],
    userLevel: string
  ): Promise<ConversationTurnResult> {
    const { system, user } = buildConversationPrompt(history, userLevel);
    const raw = await callAnthropic(system, user);
    return parseJson<ConversationTurnResult>(raw);
  }

  async analyzeConversation(history: ChatMessage[]): Promise<ConversationAnalysis> {
    const { system, user } = buildAnalysisPrompt(history);
    const raw = await callAnthropic(system, user);
    return parseJson<ConversationAnalysis>(raw);
  }

  async generateVocabulary(topic: string, level: string): Promise<VocabularyItem[]> {
    const { system, user } = buildVocabularyPrompt(topic, level);
    const raw = await callAnthropic(system, user);
    return parseJson<VocabularyItem[]>(raw);
  }

  async generateCorrection(sentence: string): Promise<Correction | null> {
    const { system, user } = buildCorrectionPrompt(sentence);
    const raw = await callAnthropic(system, user);
    return parseJson<Correction | null>(raw);
  }
}
