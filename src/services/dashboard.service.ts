import { conversationRepository } from "../repositories";
import { ConversationSummary } from "../types/conversation";

export interface DashboardSummary {
  conversationCount: number;
  messageCount: number;
  topMistakes: string[];
  recentConversations: ConversationSummary[];
}

export async function getDashboardSummary(userId: string): Promise<DashboardSummary> {
  const conversations = await conversationRepository.listFullByUser(userId);

  const messageCount = conversations.reduce((sum, c) => sum + c.messages.length, 0);

  const mistakeFrequency = new Map<string, number>();
  for (const c of conversations) {
    for (const mistake of c.mistakes) {
      mistakeFrequency.set(mistake, (mistakeFrequency.get(mistake) ?? 0) + 1);
    }
  }
  const topMistakes = Array.from(mistakeFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([mistake]) => mistake);

  const recentConversations = (await conversationRepository.listByUser(userId)).slice(0, 5);

  return {
    conversationCount: conversations.length,
    messageCount,
    topMistakes,
    recentConversations,
  };
}
