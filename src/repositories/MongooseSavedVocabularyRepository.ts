import { SavedVocabularyDocument, SavedVocabularyModel } from "../models/SavedVocabulary.model";
import { SavedVocabularyRecord, SaveVocabularyInput } from "../types/savedVocabulary";
import { SavedVocabularyRepository } from "./SavedVocabularyRepository";

function toRecord(doc: SavedVocabularyDocument): SavedVocabularyRecord {
  return {
    id: doc._id.toString(),
    userId: doc.user.toString(),
    word: doc.word,
    meaning: doc.meaning,
    partOfSpeech: doc.partOfSpeech,
    exampleSentence: doc.exampleSentence,
    difficulty: doc.difficulty,
    savedAt: doc.createdAt,
  };
}

export class MongooseSavedVocabularyRepository implements SavedVocabularyRepository {
  async save(userId: string, input: SaveVocabularyInput): Promise<SavedVocabularyRecord> {
    const doc = await SavedVocabularyModel.create({ user: userId, ...input });
    return toRecord(doc);
  }

  async listByUser(userId: string): Promise<SavedVocabularyRecord[]> {
    const docs = await SavedVocabularyModel.find({ user: userId }).sort({ createdAt: -1 });
    return docs.map(toRecord);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const result = await SavedVocabularyModel.deleteOne({ _id: id, user: userId });
    return result.deletedCount > 0;
  }
}
