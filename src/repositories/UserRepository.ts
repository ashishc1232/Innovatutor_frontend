import { CreateUserInput, LearningLevel, LearningMode, UserRecord } from "../types/user";

export interface ProfileUpdateInput {
  name?: string;
  level?: LearningLevel;
  preferredLearningMode?: LearningMode;
  preferredTopics?: string[];
  dailyGoal?: string | null;
}

/**
 * Every storage backend (Mongoose for production, in-memory for local dev
 * without a MongoDB server) implements this. Services depend only on this
 * interface, never on Mongoose or the in-memory Map directly.
 */
export interface UserRepository {
  create(input: CreateUserInput): Promise<UserRecord>;
  findByEmail(email: string): Promise<UserRecord | null>;
  findById(id: string): Promise<UserRecord | null>;
  updateProfile(userId: string, updates: ProfileUpdateInput): Promise<UserRecord | null>;
}
