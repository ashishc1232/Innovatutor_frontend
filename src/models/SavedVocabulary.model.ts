import { Schema, model, Document, Types } from "mongoose";

export interface SavedVocabularyDocument extends Document {
  user: Types.ObjectId;
  word: string;
  meaning: string;
  partOfSpeech: string;
  exampleSentence: string;
  difficulty: "basic" | "intermediate" | "advanced";
  createdAt: Date;
}

const savedVocabularySchema = new Schema<SavedVocabularyDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    word: { type: String, required: true },
    meaning: { type: String, required: true },
    partOfSpeech: { type: String, required: true },
    exampleSentence: { type: String, required: true },
    difficulty: { type: String, enum: ["basic", "intermediate", "advanced"], required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const SavedVocabularyModel = model<SavedVocabularyDocument>(
  "SavedVocabulary",
  savedVocabularySchema
);
