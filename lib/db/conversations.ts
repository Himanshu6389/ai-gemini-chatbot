import { and, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { conversations } from "@/lib/db/schema";

export async function createConversation(
  userId: string,
  title: string
) {
  const [conversation] = await db
    .insert(conversations)
    .values({
      userId,
      title,
    })
    .returning();

  return conversation;
}

export async function getUserConversations(
  userId: string
) {
  return db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(desc(conversations.updatedAt));
}

export async function getConversationByIdAndUser(
  conversationId: string,
  userId: string
) {
  const [conversation] = await db
    .select()
    .from(conversations)
    .where(
      and(
        eq(conversations.id, conversationId),
        eq(conversations.userId, userId)
      )
    )
    .limit(1);

  return conversation;
}

export async function updateConversationTimestamp(
  conversationId: string
) {
  const [conversation] = await db
    .update(conversations)
    .set({
      updatedAt: new Date(),
    })
    .where(eq(conversations.id, conversationId))
    .returning();

  return conversation;
}

export async function updateConversationTitle(
  conversationId: string,
  userId: string,
  title: string
) {
  const [conversation] = await db
    .update(conversations)
    .set({
      title,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(conversations.id, conversationId),
        eq(conversations.userId, userId)
      )
    )
    .returning();

  return conversation;
}

export async function deleteConversationByIdAndUser(
  conversationId: string,
  userId: string
) {
  const [conversation] = await db
    .delete(conversations)
    .where(
      and(
        eq(conversations.id, conversationId),
        eq(conversations.userId, userId)
      )
    )
    .returning();

  return conversation;
}