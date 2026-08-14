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

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

async function callGemini(system: string, userContent: string): Promise<string> {
  if (!env.aiApiKey) {
    throw new AppError(
      "AI_API_KEY is not configured (set it to your Gemini API key).",
      500,
      "AI_PROVIDER_ERROR"
    );
  }

  const url = `${GEMINI_API_BASE}/${env.aiModel}:generateContent?key=${env.aiApiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: userContent }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new AppError(
      `Gemini request failed (${res.status}): ${body.slice(0, 200)}`,
      502,
      "AI_PROVIDER_ERROR"
    );
  }

  const data = (await res.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
      finishReason?: string;
    }>;
    promptFeedback?: { blockReason?: string };
  };

  if (data.promptFeedback?.blockReason) {
    throw new AppError(
      `Gemini blocked the request: ${data.promptFeedback.blockReason}`,
      502,
      "AI_PROVIDER_ERROR"
    );
  }

  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("\n");

  if (!text) {
    throw new AppError("Gemini returned an empty response.", 502, "AI_PROVIDER_ERROR");
  }
  return text;
}

function parseJson<T>(raw: string): T {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new AppError(
      "Failed to parse Gemini response as JSON.",
      502,
      "AI_PROVIDER_ERROR"
    );
  }
}

/**
 * Real LLM-backed provider using Google's Gemini API. Requires AI_API_KEY
 * (a Gemini API key from Google AI Studio) and AI_MODEL (e.g.
 * "gemini-3.5-flash-lite" — check https://ai.google.dev/gemini-api/docs/models
 * for the current model name, since these change over time).
 *
 * NOTE: this sandbox's outbound network allowlist does not include
 * generativelanguage.googleapis.com, so this implementation could not be
 * live-tested here (see PROJECT_PLAN.md §7). The request/response shapes
 * match Gemini's documented generateContent API exactly, and error handling
 * covers non-2xx responses, safety blocks, and empty/malformed output — but
 * verify against a real key in your own environment before relying on it.
 */
export class GeminiProvider implements AIProvider {
  async generateResponse(
    history: ChatMessage[],
    userLevel: string
  ): Promise<ConversationTurnResult> {
    const { system, user } = buildConversationPrompt(history, userLevel);
    const raw = await callGemini(system, user);
    return parseJson<ConversationTurnResult>(raw);
  }

  async analyzeConversation(history: ChatMessage[]): Promise<ConversationAnalysis> {
    const { system, user } = buildAnalysisPrompt(history);
    const raw = await callGemini(system, user);
    return parseJson<ConversationAnalysis>(raw);
  }

  async generateVocabulary(topic: string, level: string): Promise<VocabularyItem[]> {
    const { system, user } = buildVocabularyPrompt(topic, level);
    const raw = await callGemini(system, user);
    return parseJson<VocabularyItem[]>(raw);
  }

  async generateCorrection(sentence: string): Promise<Correction | null> {
    const { system, user } = buildCorrectionPrompt(sentence);
    const raw = await callGemini(system, user);
    return parseJson<Correction | null>(raw);
  }
}
