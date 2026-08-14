import { env } from "../../config/env";
import { AIProvider } from "./AIProvider";
import { AnthropicProvider } from "./AnthropicProvider";
import { GeminiProvider } from "./GeminiProvider";
import { FreeAIProvider } from "./FreeAIProvider";

function selectProvider(): AIProvider {
  const needsKey = env.aiProvider === "gemini" || env.aiProvider === "anthropic";
  if (needsKey && !env.aiApiKey) {
    console.warn(
      `[ai] AI_PROVIDER="${env.aiProvider}" but AI_API_KEY is not set — ` +
        `falling back to "free" so the app still runs. Set AI_API_KEY in ` +
        `backend/.env to use ${env.aiProvider} for real.`
    );
    return new FreeAIProvider();
  }

  switch (env.aiProvider) {
    case "gemini":
      return new GeminiProvider();
    case "anthropic":
      return new AnthropicProvider();
    case "free":
      return new FreeAIProvider();
    default:
      console.warn(
        `[ai] Unknown AI_PROVIDER "${env.aiProvider}" — falling back to "free".`
      );
      return new FreeAIProvider();
  }
}

export const aiProvider: AIProvider = selectProvider();
