import { env } from "../config/env";
import { InMemoryUserRepository } from "./InMemoryUserRepository";
import { MongooseUserRepository } from "./MongooseUserRepository";
import { UserRepository } from "./UserRepository";
import { InMemoryConversationRepository } from "./InMemoryConversationRepository";
import { MongooseConversationRepository } from "./MongooseConversationRepository";
import { ConversationRepository } from "./ConversationRepository";
import { InMemorySavedVocabularyRepository } from "./InMemorySavedVocabularyRepository";
import { MongooseSavedVocabularyRepository } from "./MongooseSavedVocabularyRepository";
import { SavedVocabularyRepository } from "./SavedVocabularyRepository";

const usingMongo = Boolean(env.mongodbUri);

if (!usingMongo) {
  console.warn(
    "[repositories] MONGODB_URI not set — using in-memory repositories. " +
      "Data will NOT persist across restarts. Set MONGODB_URI in backend/.env " +
      "for real, persistent storage."
  );
}

export const userRepository: UserRepository = usingMongo
  ? new MongooseUserRepository()
  : new InMemoryUserRepository();

export const conversationRepository: ConversationRepository = usingMongo
  ? new MongooseConversationRepository()
  : new InMemoryConversationRepository();

export const savedVocabularyRepository: SavedVocabularyRepository = usingMongo
  ? new MongooseSavedVocabularyRepository()
  : new InMemorySavedVocabularyRepository();
