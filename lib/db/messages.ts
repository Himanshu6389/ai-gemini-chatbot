import { asc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";

export async function createMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string
) {
  const [message] = await db
    .insert(messages)
    .values({
      conversationId,
      role,
      content,
    })
    .returning();

  return message;
}

export async function getConversationMessages(
  conversationId: string
) {
  return db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt));
}