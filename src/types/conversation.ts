import { LearningLevel, LearningMode } from "./user";
import { Correction, VocabularyItem, ConversationAnalysis } from "../services/ai/AIProvider";

export type MessageRole = "user" | "assistant";
export type InputType = "text" | "voice";

export interface MessageRecord {
  role: MessageRole;
  content: string;
  inputType: InputType;
  correction: Correction | null;
  vocabulary: VocabularyItem[];
  timestamp: Date;
}

export interface ConversationRecord {
  id: string;
  userId: string;
  title: string;
  mode: LearningMode;
  languageLevel: LearningLevel;
  messages: MessageRecord[];
  mistakes: string[];
  lastAnalysis: ConversationAnalysis | null;
  createdAt: Date;
  updatedAt: Date;
}

/** Lightweight shape for list views — no message bodies. */
export interface ConversationSummary {
  id: string;
  title: string;
  mode: LearningMode;
  languageLevel: LearningLevel;
  messageCount: number;
  lastMessagePreview: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function toSummary(conversation: ConversationRecord): ConversationSummary {
  const last = conversation.messages[conversation.messages.length - 1];
  return {
    id: conversation.id,
    title: conversation.title,
    mode: conversation.mode,
    languageLevel: conversation.languageLevel,
    messageCount: conversation.messages.length,
    lastMessagePreview: last ? last.content.slice(0, 120) : null,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
  };
}
