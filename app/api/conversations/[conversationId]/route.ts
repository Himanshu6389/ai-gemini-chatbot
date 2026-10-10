import { auth } from "@clerk/nextjs/server";

import {
  deleteConversationByIdAndUser,
  getConversationByIdAndUser,
  updateConversationTitle,
} from "@/lib/db/conversations";

import { getConversationMessages } from "@/lib/db/messages";
import { getOrCreateUser } from "@/lib/db/users";

function isValidUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    )
  );
}

const MAX_TITLE_LENGTH = 100;

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      conversationId: string;
    }>;
  }
) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const { conversationId } = await params;

    if (!isValidUuid(conversationId)) {
      return Response.json(
        { error: "Invalid conversation ID." },
        { status: 400 }
      );
    }

    const user = await getOrCreateUser(userId);

    const conversation =
      await getConversationByIdAndUser(
        conversationId,
        user.id
      );

    if (!conversation) {
      return Response.json(
        { error: "Conversation not found." },
        { status: 404 }
      );
    }

    const messages =
      await getConversationMessages(
        conversation.id
      );

    return Response.json(
      {
        conversation,
        messages,
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Conversation GET API error:",
      error
    );

    return Response.json(
      {
        error:
          "Failed to load conversation.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      conversationId: string;
    }>;
  }
) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const { conversationId } = await params;

    if (!isValidUuid(conversationId)) {
      return Response.json(
        { error: "Invalid conversation ID." },
        { status: 400 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return Response.json(
        {
          error:
            "Invalid JSON request body.",
        },
        { status: 400 }
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return Response.json(
        {
          error: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    const { title } = body as {
      title?: unknown;
    };

    if (typeof title !== "string") {
      return Response.json(
        {
          error: "Title must be a string.",
        },
        { status: 400 }
      );
    }

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return Response.json(
        {
          error:
            "Conversation title is required.",
        },
        { status: 400 }
      );
    }

    if (
      trimmedTitle.length >
      MAX_TITLE_LENGTH
    ) {
      return Response.json(
        {
          error: `Conversation title must be ${MAX_TITLE_LENGTH} characters or fewer.`,
        },
        { status: 400 }
      );
    }

    const user = await getOrCreateUser(userId);

    const existingConversation =
      await getConversationByIdAndUser(
        conversationId,
        user.id
      );

    if (!existingConversation) {
      return Response.json(
        {
          error:
            "Conversation not found.",
        },
        { status: 404 }
      );
    }

    const updatedConversation =
      await updateConversationTitle(
        conversationId,
        user.id,
        trimmedTitle
      );

    return Response.json(
      {
        conversation: updatedConversation,
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Conversation PATCH API error:",
      error
    );

    return Response.json(
      {
        error:
          "Failed to rename conversation.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      conversationId: string;
    }>;
  }
) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const { conversationId } = await params;

    if (!isValidUuid(conversationId)) {
      return Response.json(
        { error: "Invalid conversation ID." },
        { status: 400 }
      );
    }

    const user = await getOrCreateUser(userId);

    const existingConversation =
      await getConversationByIdAndUser(
        conversationId,
        user.id
      );

    if (!existingConversation) {
      return Response.json(
        {
          error:
            "Conversation not found.",
        },
        { status: 404 }
      );
    }

    await deleteConversationByIdAndUser(
      conversationId,
      user.id
    );

    return Response.json(
      {
        success: true,
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Conversation DELETE API error:",
      error
    );

    return Response.json(
      {
        error:
          "Failed to delete conversation.",
      },
      { status: 500 }
    );
  }
}