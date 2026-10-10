import { auth } from "@clerk/nextjs/server";

import { getUserConversations } from "@/lib/db/conversations";
import { getOrCreateUser } from "@/lib/db/users";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const user = await getOrCreateUser(userId);

    const conversations = await getUserConversations(user.id);

    return Response.json(
      { conversations },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );
  } catch (error) {
    console.error("Conversations API error:", error);

    return Response.json(
      { error: "Failed to load conversations." },
      { status: 500 }
    );
  }
}