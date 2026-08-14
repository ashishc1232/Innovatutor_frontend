import { Schema, model, Document } from "mongoose";
import { LearningLevel, LearningMode } from "../types/user";

export interface UserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  level: LearningLevel;
  preferredLearningMode: LearningMode;
  preferredTopics: string[];
  dailyGoal: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    level: {
      type: String,
      enum: [
        "beginner",
        "elementary",
        "intermediate",
        "upper_intermediate",
        "advanced",
      ],
      default: "beginner",
    },
    preferredLearningMode: {
      type: String,
      enum: ["text", "voice"],
      default: "text",
    },
    preferredTopics: { type: [String], default: [] },
    dailyGoal: { type: String, default: null },
  },
  { timestamps: true }
);

export const UserModel = model<UserDocument>("User", userSchema);
