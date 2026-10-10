
import { auth } from "@clerk/nextjs/server";

import { chatRateLimit } from "@/lib/ratelimit";
import { generateGeminiResponseStream } from "@/lib/ai/gemini";
import {
  createConversation,
  getConversationByIdAndUser,
  updateConversationTimestamp,
} from "@/lib/db/conversations";
import {
  createMessage,
  getConversationMessages,
} from "@/lib/db/messages";
import { getOrCreateUser } from "@/lib/db/users";
import {
  getChatMessageValidationError,
  validateChatMessage,
} from "@/lib/validation/chat";

function isValidUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    )
  );
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const { success, limit, remaining, reset } =
      await chatRateLimit.limit(userId);

    if (!success) {
      const retryAfter = Math.max(
        1,
        Math.ceil((reset - Date.now()) / 1000)
      );

      return Response.json(
        {
          error:
            "Too many chat requests. Please wait a minute and try again.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(remaining),
          },
        }
      );
    }
  } catch (error) {
    console.error("Rate limiting service error:", error);

    return Response.json(
      {
        error:
          "Rate limiting service is temporarily unavailable. Please try again shortly.",
      },
      { status: 503 }
    );
  }

  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return Response.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const { message, conversationId } = body as {
      message?: unknown;
      conversationId?: unknown;
    };

    if (!validateChatMessage(message)) {
      return Response.json(
        {
          error:
            getChatMessageValidationError(message) ??
            "Invalid message.",
        },
        { status: 400 }
      );
    }

    const trimmedMessage = message.trim();

    if (
      conversationId !== undefined &&
      conversationId !== null &&
      !isValidUuid(conversationId)
    ) {
      return Response.json(
        { error: "Invalid conversation ID." },
        { status: 400 }
      );
    }

    const user = await getOrCreateUser(userId);

    let conversation;

    if (conversationId) {
      conversation = await getConversationByIdAndUser(
        conversationId,
        user.id
      );

      if (!conversation) {
        return Response.json(
          { error: "Conversation not found." },
          { status: 404 }
        );
      }
    } else {
      conversation = await createConversation(
        user.id,
        trimmedMessage.slice(0, 50)
      );
    }

    await createMessage(
      conversation.id,
      "user",
      trimmedMessage
    );

    const conversationMessages = await getConversationMessages(
      conversation.id
    );

    const conversationHistory = conversationMessages
      .map(function (item) {
        return item.role + ": " + item.content;
      })
      .join("\n");

    const prompt =
      "You are GeminiChat, a helpful AI assistant.\n\n" +
      "Here is the conversation history:\n\n" +
      conversationHistory +
      "\n\nRespond naturally to the user's latest message while considering the conversation history.";

    const geminiStream =
      await generateGeminiResponseStream(prompt);

    const encoder = new TextEncoder();
    let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of geminiStream) {
            const text = chunk.text ?? "";

            if (!text) {
              continue;
            }

            fullResponse += text;
            controller.enqueue(encoder.encode(text));
          }

          if (fullResponse.trim()) {
            await createMessage(
              conversation.id,
              "assistant",
              fullResponse
            );

            await updateConversationTimestamp(
              conversation.id
            );
          }

          controller.close();
        } catch (error) {
          console.error("Gemini streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Conversation-Id": conversation.id,
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);

    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error
        ? error.status
        : undefined;

    if (status === 429) {
      return Response.json(
        {
          error:
            "Gemini's daily free-tier limit has been reached. Please try again later.",
        },
        { status: 429 }
      );
    }

    if (status === 503) {
      return Response.json(
        {
          error:
            "Gemini is temporarily busy. Please try again in a moment.",
        },
        { status: 503 }
      );
    }

    return Response.json(
      { error: "Failed to generate a response." },
      { status: 500 }
    );
  }
}
