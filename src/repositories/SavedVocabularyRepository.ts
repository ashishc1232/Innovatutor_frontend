import { SavedVocabularyRecord, SaveVocabularyInput } from "../types/savedVocabulary";

export interface SavedVocabularyRepository {
  save(userId: string, input: SaveVocabularyInput): Promise<SavedVocabularyRecord>;
  listByUser(userId: string): Promise<SavedVocabularyRecord[]>;
  remove(id: string, userId: string): Promise<boolean>;
}
