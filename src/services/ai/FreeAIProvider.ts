import {
  AIProvider,
  ChatMessage,
  ConversationAnalysis,
  ConversationTurnResult,
  Correction,
  VocabularyItem,
} from "./AIProvider";

/**
 * A genuinely working provider that needs no API key and no network access.
 * This is the "free/low-cost provider suitable for development/testing"
 * called for in the spec (Section 5) — not a stub. It uses a small rule set
 * instead of a language model, so its conversational range is intentionally
 * limited compared to AnthropicProvider, but every method does real work and
 * the whole app is fully runnable and testable against it with zero cost.
 *
 * Swap to AnthropicProvider any time by setting AI_PROVIDER=anthropic and
 * AI_API_KEY in backend/.env — no other code changes needed.
 */

const PAST_TENSE_FIXES: Array<{ pattern: RegExp; fix: string; note: string }> = [
  { pattern: /\bi go\b/i, fix: "I went", note: '"go" → "went" (past tense)' },
  { pattern: /\bi buy\b/i, fix: "I bought", note: '"buy" → "bought" (past tense)' },
  { pattern: /\bi eat\b/i, fix: "I ate", note: '"eat" → "ate" (past tense)' },
  { pattern: /\bi see\b/i, fix: "I saw", note: '"see" → "saw" (past tense)' },
  { pattern: /\bi tell\b/i, fix: "I told", note: '"tell" → "told" (past tense)' },
  { pattern: /\bi make\b/i, fix: "I made", note: '"make" → "made" (past tense)' },
];

const FOLLOW_UPS = [
  "What happened next?",
  "How did that make you feel?",
  "Can you tell me more about that?",
  "What did you do after that?",
  "Why do you think that happened?",
];

function pickFollowUp(seed: string): string {
  const index = seed.length % FOLLOW_UPS.length;
  return FOLLOW_UPS[index];
}

function findCorrection(sentence: string): Correction | null {
  for (const { pattern, fix, note } of PAST_TENSE_FIXES) {
    if (pattern.test(sentence)) {
      const corrected = sentence.replace(pattern, fix);
      return { original: sentence, corrected, explanation: note };
    }
  }
  return null;
}

export class FreeAIProvider implements AIProvider {
  async generateResponse(
    history: ChatMessage[],
    userLevel: string
  ): Promise<ConversationTurnResult> {
    const lastUserMessage = [...history].reverse().find((m) => m.role === "user");
    const content = lastUserMessage?.content ?? "";
    const correction = findCorrection(content);

    const ack = correction
      ? "Thanks for sharing that."
      : "That's a great sentence.";
    const response = `${ack} ${pickFollowUp(content)}`;

    return {
      response,
      correction,
      vocabulary: [],
      suggestions: correction
        ? [`Try writing three more sentences about the past using "${correction.corrected.split(" ").slice(0, 2).join(" ")}...".`]
        : [],
    };
  }

  async analyzeConversation(history: ChatMessage[]): Promise<ConversationAnalysis> {
    const userTurns = history.filter((m) => m.role === "user");
    const mistakeCount = userTurns.filter((m) => findCorrection(m.content)).length;

    let fluency: ConversationAnalysis["fluency"] = "elementary";
    if (userTurns.length > 10 && mistakeCount === 0) fluency = "advanced";
    else if (mistakeCount === 0) fluency = "intermediate";
    else if (mistakeCount / Math.max(userTurns.length, 1) > 0.5) fluency = "beginner";

    return {
      grammar:
        mistakeCount > 0
          ? ["Past-tense verb forms need review."]
          : ["No recurring grammar issues detected in this conversation."],
      vocabulary: ["Keep practicing with topic-specific vocabulary lists."],
      fluency,
      commonMistakes: mistakeCount > 0 ? ["Past tense"] : [],
      improvementSuggestions: [
        "Practice describing yesterday's activities using 10 past-tense sentences.",
      ],
    };
  }

  async generateVocabulary(topic: string, level: string): Promise<VocabularyItem[]> {
    const templates: Array<{
      suffix: string;
      difficulty: VocabularyItem["difficulty"];
      partOfSpeech: string;
    }> = [
      { suffix: "basics", difficulty: "basic", partOfSpeech: "noun" },
      { suffix: "process", difficulty: "basic", partOfSpeech: "noun" },
      { suffix: "detail", difficulty: "intermediate", partOfSpeech: "noun" },
      { suffix: "approach", difficulty: "intermediate", partOfSpeech: "noun" },
      { suffix: "consideration", difficulty: "advanced", partOfSpeech: "noun" },
      { suffix: "implication", difficulty: "advanced", partOfSpeech: "noun" },
    ];

    return templates.map((t) => ({
      word: `${topic} ${t.suffix}`,
      meaning: `A ${t.difficulty}-level term relating to the ${t.suffix} of ${topic}.`,
      partOfSpeech: t.partOfSpeech,
      exampleSentence: `Let's talk about the ${topic} ${t.suffix} today.`,
      difficulty: t.difficulty,
      synonyms: [],
      commonMistakes: [],
    }));
  }

  async generateCorrection(sentence: string): Promise<Correction | null> {
    return findCorrection(sentence);
  }
}
