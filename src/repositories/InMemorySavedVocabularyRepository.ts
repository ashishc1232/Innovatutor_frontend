import { randomUUID } from "crypto";
import { SavedVocabularyRecord, SaveVocabularyInput } from "../types/savedVocabulary";
import { SavedVocabularyRepository } from "./SavedVocabularyRepository";

export class InMemorySavedVocabularyRepository implements SavedVocabularyRepository {
  private items = new Map<string, SavedVocabularyRecord>();

  async save(userId: string, input: SaveVocabularyInput): Promise<SavedVocabularyRecord> {
    const record: SavedVocabularyRecord = {
      id: randomUUID(),
      userId,
      ...input,
      savedAt: new Date(),
    };
    this.items.set(record.id, record);
    return record;
  }

  async listByUser(userId: string): Promise<SavedVocabularyRecord[]> {
    return Array.from(this.items.values())
      .filter((i) => i.userId === userId)
      .sort((a, b) => b.savedAt.getTime() - a.savedAt.getTime());
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const item = this.items.get(id);
    if (!item || item.userId !== userId) return false;
    this.items.delete(id);
    return true;
  }
}
