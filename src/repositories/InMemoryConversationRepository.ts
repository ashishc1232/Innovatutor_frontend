import { randomUUID } from "crypto";
import { LearningLevel, LearningMode } from "../types/user";
import { ConversationRecord, ConversationSummary, MessageRecord, toSummary } from "../types/conversation";
import { ConversationAnalysis } from "../services/ai/AIProvider";
import { ConversationRepository } from "./ConversationRepository";

/**
 * Dev-only fallback, same rationale as InMemoryUserRepository: makes the
 * full conversation flow runnable and testable with zero external
 * infrastructure. Automatically selected when MONGODB_URI is unset.
 */
export class InMemoryConversationRepository implements ConversationRepository {
  private conversations = new Map<string, ConversationRecord>();

  async create(
    userId: string,
    title: string,
    mode: LearningMode,
    languageLevel: LearningLevel
  ): Promise<ConversationRecord> {
    const now = new Date();
    const record: ConversationRecord = {
      id: randomUUID(),
      userId,
      title,
      mode,
      languageLevel,
      messages: [],
      mistakes: [],
      lastAnalysis: null,
      createdAt: now,
      updatedAt: now,
    };
    this.conversations.set(record.id, record);
    return record;
  }

  async findById(id: string, userId: string): Promise<ConversationRecord | null> {
    const record = this.conversations.get(id);
    if (!record || record.userId !== userId) return null;
    return record;
  }

  async listByUser(userId: string): Promise<ConversationSummary[]> {
    return this.getSortedForUser(userId).map(toSummary);
  }

  async listFullByUser(userId: string): Promise<ConversationRecord[]> {
    return this.getSortedForUser(userId);
  }

  private getSortedForUser(userId: string): ConversationRecord[] {
    return Array.from(this.conversations.values())
      .filter((c) => c.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async appendMessages(
    id: string,
    userId: string,
    userMessage: MessageRecord,
    assistantMessage: MessageRecord,
    opts: { titleIfUntitled?: string; newMistakes: string[] }
  ): Promise<ConversationRecord | null> {
    const record = this.conversations.get(id);
    if (!record || record.userId !== userId) return null;

    if (record.messages.length === 0 && opts.titleIfUntitled) {
      record.title = opts.titleIfUntitled;
    }
    record.messages.push(userMessage, assistantMessage);
    if (opts.newMistakes.length > 0) {
      record.mistakes.push(...opts.newMistakes);
    }
    record.updatedAt = new Date();
    return record;
  }

  async saveAnalysis(
    id: string,
    userId: string,
    analysis: ConversationAnalysis
  ): Promise<ConversationRecord | null> {
    const record = this.conversations.get(id);
    if (!record || record.userId !== userId) return null;
    record.lastAnalysis = analysis;
    record.updatedAt = new Date();
    return record;
  }

  async deleteById(id: string, userId: string): Promise<boolean> {
    const record = this.conversations.get(id);
    if (!record || record.userId !== userId) return false;
    this.conversations.delete(id);
    return true;
  }
}
