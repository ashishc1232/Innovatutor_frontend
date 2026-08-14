import { Schema, model, Document, Types } from "mongoose";
import { LearningLevel, LearningMode } from "../types/user";
import { InputType, MessageRole } from "../types/conversation";
import { Correction, VocabularyItem, ConversationAnalysis } from "../services/ai/AIProvider";

export interface MessageSubdocument {
  role: MessageRole;
  content: string;
  inputType: InputType;
  correction: Correction | null;
  vocabulary: VocabularyItem[];
  timestamp: Date;
}

export interface ConversationDocument extends Document {
  user: Types.ObjectId;
  title: string;
  mode: LearningMode;
  languageLevel: LearningLevel;
  messages: MessageSubdocument[];
  mistakes: string[];
  lastAnalysis: ConversationAnalysis | null;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    inputType: { type: String, enum: ["text", "voice"], default: "text" },
    correction: { type: Schema.Types.Mixed, default: null },
    vocabulary: { type: [Schema.Types.Mixed], default: [] },
    timestamp: { type: Date, default: () => new Date() },
  },
  { _id: false }
);

const conversationSchema = new Schema<ConversationDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, default: "New conversation" },
    mode: { type: String, enum: ["text", "voice"], default: "text" },
    languageLevel: {
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
    messages: { type: [messageSchema], default: [] },
    mistakes: { type: [String], default: [] },
    lastAnalysis: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

export const ConversationModel = model<ConversationDocument>(
  "Conversation",
  conversationSchema
);
