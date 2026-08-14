import { ConversationDocument, ConversationModel } from "../models/Conversation.model";
import { LearningLevel, LearningMode } from "../types/user";
import { ConversationRecord, ConversationSummary, MessageRecord, toSummary } from "../types/conversation";
import { ConversationAnalysis } from "../services/ai/AIProvider";
import { ConversationRepository } from "./ConversationRepository";

function toRecord(doc: ConversationDocument): ConversationRecord {
  return {
    id: doc._id.toString(),
    userId: doc.user.toString(),
    title: doc.title,
    mode: doc.mode,
    languageLevel: doc.languageLevel,
    messages: doc.messages.map((m) => ({
      role: m.role,
      content: m.content,
      inputType: m.inputType,
      correction: m.correction,
      vocabulary: m.vocabulary,
      timestamp: m.timestamp,
    })),
    mistakes: doc.mistakes,
    lastAnalysis: doc.lastAnalysis,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export class MongooseConversationRepository implements ConversationRepository {
  async create(
    userId: string,
    title: string,
    mode: LearningMode,
    languageLevel: LearningLevel
  ): Promise<ConversationRecord> {
    const doc = await ConversationModel.create({
      user: userId,
      title,
      mode,
      languageLevel,
      messages: [],
      mistakes: [],
      lastAnalysis: null,
    });
    return toRecord(doc);
  }

  async findById(id: string, userId: string): Promise<ConversationRecord | null> {
    const doc = await ConversationModel.findOne({ _id: id, user: userId });
    return doc ? toRecord(doc) : null;
  }

  async listByUser(userId: string): Promise<ConversationSummary[]> {
    const docs = await ConversationModel.find({ user: userId }).sort({ updatedAt: -1 });
    return docs.map((d) => toSummary(toRecord(d)));
  }

  async listFullByUser(userId: string): Promise<ConversationRecord[]> {
    const docs = await ConversationModel.find({ user: userId }).sort({ updatedAt: -1 });
    return docs.map(toRecord);
  }

  async appendMessages(
    id: string,
    userId: string,
    userMessage: MessageRecord,
    assistantMessage: MessageRecord,
    opts: { titleIfUntitled?: string; newMistakes: string[] }
  ): Promise<ConversationRecord | null> {
    const doc = await ConversationModel.findOne({ _id: id, user: userId });
    if (!doc) return null;

    if (doc.messages.length === 0 && opts.titleIfUntitled) {
      doc.title = opts.titleIfUntitled;
    }
    doc.messages.push(userMessage, assistantMessage);
    if (opts.newMistakes.length > 0) {
      doc.mistakes.push(...opts.newMistakes);
    }
    await doc.save();
    return toRecord(doc);
  }

  async saveAnalysis(
    id: string,
    userId: string,
    analysis: ConversationAnalysis
  ): Promise<ConversationRecord | null> {
    const doc = await ConversationModel.findOneAndUpdate(
      { _id: id, user: userId },
      { lastAnalysis: analysis },
      { new: true }
    );
    return doc ? toRecord(doc) : null;
  }

  async deleteById(id: string, userId: string): Promise<boolean> {
    const result = await ConversationModel.deleteOne({ _id: id, user: userId });
    return result.deletedCount > 0;
  }
}
