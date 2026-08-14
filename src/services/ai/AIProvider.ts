export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Correction {
  original: string;
  corrected: string;
  explanation: string;
}

export interface VocabularyItem {
  word: string;
  meaning: string;
  partOfSpeech: string;
  pronunciation?: string;
  exampleSentence: string;
  difficulty: "basic" | "intermediate" | "advanced";
  synonyms?: string[];
  commonMistakes?: string[];
}

export interface ConversationTurnResult {
  response: string;
  correction: Correction | null;
  vocabulary: VocabularyItem[];
  suggestions: string[];
}

export interface ConversationAnalysis {
  grammar: string[];
  vocabulary: string[];
  fluency: "beginner" | "elementary" | "intermediate" | "upper_intermediate" | "advanced";
  commonMistakes: string[];
  improvementSuggestions: string[];
}

/**
 * Every AI backend (Anthropic, OpenAI, a free/dev provider) implements this
 * interface. Controllers and services depend only on AIProvider, never on a
 * concrete implementation, so AI_PROVIDER can change via env var alone.
 */
export interface AIProvider {
  generateResponse(
    history: ChatMessage[],
    userLevel: string
  ): Promise<ConversationTurnResult>;

  analyzeConversation(history: ChatMessage[]): Promise<ConversationAnalysis>;

  generateVocabulary(
    topic: string,
    level: string
  ): Promise<VocabularyItem[]>;

  generateCorrection(sentence: string): Promise<Correction | null>;
}
