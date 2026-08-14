import { LearningLevel, LearningMode } from "../types/user";
import { ConversationRecord, ConversationSummary, MessageRecord } from "../types/conversation";
import { ConversationAnalysis } from "../services/ai/AIProvider";

export interface ConversationRepository {
  create(
    userId: string,
    title: string,
    mode: LearningMode,
    languageLevel: LearningLevel
  ): Promise<ConversationRecord>;

  findById(id: string, userId: string): Promise<ConversationRecord | null>;

  listByUser(userId: string): Promise<ConversationSummary[]>;

  /** Full records (not summaries) — used for dashboard aggregation. */
  listFullByUser(userId: string): Promise<ConversationRecord[]>;

  /** Appends both turns atomically and updates title/mistakes/updatedAt. */
  appendMessages(
    id: string,
    userId: string,
    userMessage: MessageRecord,
    assistantMessage: MessageRecord,
    opts: { titleIfUntitled?: string; newMistakes: string[] }
  ): Promise<ConversationRecord | null>;

  saveAnalysis(
    id: string,
    userId: string,
    analysis: ConversationAnalysis
  ): Promise<ConversationRecord | null>;

  deleteById(id: string, userId: string): Promise<boolean>;
}
