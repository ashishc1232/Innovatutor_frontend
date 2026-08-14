export interface SavedVocabularyRecord {
  id: string;
  userId: string;
  word: string;
  meaning: string;
  partOfSpeech: string;
  exampleSentence: string;
  difficulty: "basic" | "intermediate" | "advanced";
  savedAt: Date;
}

export interface SaveVocabularyInput {
  word: string;
  meaning: string;
  partOfSpeech: string;
  exampleSentence: string;
  difficulty: "basic" | "intermediate" | "advanced";
}
