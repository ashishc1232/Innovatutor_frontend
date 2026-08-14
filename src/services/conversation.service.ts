import { conversationRepository } from "../repositories";
import { aiProvider } from "./ai";
import { ChatMessage, ConversationAnalysis } from "./ai/AIProvider";
import { AppError } from "../utils/AppError";
import { LearningLevel, LearningMode } from "../types/user";
import { ConversationRecord, ConversationSummary, MessageRecord } from "../types/conversation";

export async function createConversation(
  userId: string,
  mode: LearningMode = "text",
  languageLevel: LearningLevel = "beginner"
): Promise<ConversationRecord> {
  return conversationRepository.create(userId, "New conversation", mode, languageLevel);
}

export async function listConversations(userId: string): Promise<ConversationSummary[]> {
  return conversationRepository.listByUser(userId);
}

export async function getConversation(
  id: string,
  userId: string
): Promise<ConversationRecord> {
  const conversation = await conversationRepository.findById(id, userId);
  if (!conversation) {
    throw new AppError("Conversation not found.", 404, "CONVERSATION_NOT_FOUND");
  }
  return conversation;
}

function deriveTitle(firstMessage: string): string {
  const trimmed = firstMessage.trim();
  return trimmed.length > 50 ? `${trimmed.slice(0, 50)}…` : trimmed;
}

export async function sendMessage(
  conversationId: string,
  userId: string,
  content: string,
  languageLevel: LearningLevel,
  inputType: "text" | "voice" = "text"
): Promise<ConversationRecord> {
  const conversation = await getConversation(conversationId, userId);

  const history: ChatMessage[] = [
    ...conversation.messages.map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content },
  ];

  const result = await aiProvider.generateResponse(history, languageLevel);

  const now = new Date();
  const userMessage: MessageRecord = {
    role: "user",
    content,
    inputType,
    correction: result.correction,
    vocabulary: [],
    timestamp: now,
  };
  const assistantMessage: MessageRecord = {
    role: "assistant",
    content: result.response,
    inputType: "text",
    correction: null,
    vocabulary: result.vocabulary,
    timestamp: new Date(now.getTime() + 1),
  };

  const newMistakes = result.correction ? [result.correction.explanation] : [];

  const updated = await conversationRepository.appendMessages(
    conversationId,
    userId,
    userMessage,
    assistantMessage,
    {
      titleIfUntitled: conversation.messages.length === 0 ? deriveTitle(content) : undefined,
      newMistakes,
    }
  );

  if (!updated) {
    throw new AppError("Conversation not found.", 404, "CONVERSATION_NOT_FOUND");
  }
  return updated;
}

export async function deleteConversation(id: string, userId: string): Promise<void> {
  const deleted = await conversationRepository.deleteById(id, userId);
  if (!deleted) {
    throw new AppError("Conversation not found.", 404, "CONVERSATION_NOT_FOUND");
  }
}

export async function analyzeConversationById(
  id: string,
  userId: string
): Promise<ConversationAnalysis> {
  const conversation = await getConversation(id, userId);
  if (conversation.messages.length === 0) {
    throw new AppError(
      "Send at least one message before requesting analysis.",
      400,
      "NO_MESSAGES_YET"
    );
  }

  const history: ChatMessage[] = conversation.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));
  const analysis = await aiProvider.analyzeConversation(history);

  const updated = await conversationRepository.saveAnalysis(id, userId, analysis);
  if (!updated) {
    throw new AppError("Conversation not found.", 404, "CONVERSATION_NOT_FOUND");
  }
  return analysis;
}
