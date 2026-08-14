import { randomUUID } from "crypto";
import { CreateUserInput, UserRecord } from "../types/user";
import { ProfileUpdateInput, UserRepository } from "./UserRepository";

/**
 * Dev-only fallback so the full auth flow (register/login/me) is runnable
 * and testable with zero external infrastructure. Automatically selected
 * when MONGODB_URI is not set — see repositories/index.ts. Data lives only
 * in process memory and is lost on restart. Never used when MONGODB_URI is
 * configured; MongooseUserRepository is the real, persistent implementation.
 */
export class InMemoryUserRepository implements UserRepository {
  private usersByEmail = new Map<string, UserRecord>();
  private usersById = new Map<string, UserRecord>();

  async create(input: CreateUserInput): Promise<UserRecord> {
    const now = new Date();
    const record: UserRecord = {
      id: randomUUID(),
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash: input.passwordHash,
      level: "beginner",
      preferredLearningMode: "text",
      preferredTopics: [],
      dailyGoal: null,
      createdAt: now,
      updatedAt: now,
    };
    this.usersByEmail.set(record.email, record);
    this.usersById.set(record.id, record);
    return record;
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    return this.usersByEmail.get(email.toLowerCase()) ?? null;
  }

  async findById(id: string): Promise<UserRecord | null> {
    return this.usersById.get(id) ?? null;
  }

  async updateProfile(userId: string, updates: ProfileUpdateInput): Promise<UserRecord | null> {
    const record = this.usersById.get(userId);
    if (!record) return null;

    if (updates.name !== undefined) record.name = updates.name;
    if (updates.level !== undefined) record.level = updates.level;
    if (updates.preferredLearningMode !== undefined) {
      record.preferredLearningMode = updates.preferredLearningMode;
    }
    if (updates.preferredTopics !== undefined) record.preferredTopics = updates.preferredTopics;
    if (updates.dailyGoal !== undefined) record.dailyGoal = updates.dailyGoal;
    record.updatedAt = new Date();

    return record;
  }
}
