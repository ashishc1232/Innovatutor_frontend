import { UserDocument, UserModel } from "../models/User.model";
import { CreateUserInput, UserRecord } from "../types/user";
import { ProfileUpdateInput, UserRepository } from "./UserRepository";

function toUserRecord(doc: UserDocument): UserRecord {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    passwordHash: doc.passwordHash,
    level: doc.level,
    preferredLearningMode: doc.preferredLearningMode,
    preferredTopics: doc.preferredTopics,
    dailyGoal: doc.dailyGoal,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export class MongooseUserRepository implements UserRepository {
  async create(input: CreateUserInput): Promise<UserRecord> {
    const doc = await UserModel.create({
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash: input.passwordHash,
    });
    return toUserRecord(doc);
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const doc = await UserModel.findOne({ email: email.toLowerCase() }).select(
      "+passwordHash"
    );
    return doc ? toUserRecord(doc) : null;
  }

  async findById(id: string): Promise<UserRecord | null> {
    const doc = await UserModel.findById(id).select("+passwordHash");
    return doc ? toUserRecord(doc) : null;
  }

  async updateProfile(userId: string, updates: ProfileUpdateInput): Promise<UserRecord | null> {
    const doc = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    ).select("+passwordHash");
    return doc ? toUserRecord(doc) : null;
  }
}
