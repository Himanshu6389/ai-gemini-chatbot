import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/db/users", () => ({
  getOrCreateUser: vi.fn(),
}));

vi.mock("@/lib/db/conversations", () => ({
  createConversation: vi.fn(),
  getConversationByIdAndUser: vi.fn(),
  updateConversationTimestamp: vi.fn(),
}));

vi.mock("@/lib/db/messages", () => ({
  createMessage: vi.fn(),
  getConversationMessages: vi.fn(),
}));

vi.mock("@/lib/ai/gemini", () => ({
  generateGeminiResponseStream: vi.fn(),
}));

import { auth } from "@clerk/nextjs/server";

import { POST } from "@/app/api/chat/route";

const mockedAuth = vi.mocked(auth);

describe("POST /api/chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when the user is not authenticated", async () => {
    mockedAuth.mockResolvedValue({
      userId: null,
    } as never);

    const request = new Request(
      "http://localhost:3000/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Hello",
        }),
      }
    );

    const response = await POST(request);

    expect(response.status).toBe(401);

    await expect(response.json()).resolves.toEqual({
      error: "Unauthorized.",
    });
  });

  it("returns 400 for invalid JSON", async () => {
    mockedAuth.mockResolvedValue({
      userId: "user_test_123",
    } as never);

    const request = new Request(
      "http://localhost:3000/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: "{ invalid json",
      }
    );

    const response = await POST(request);

    expect(response.status).toBe(400);

    await expect(response.json()).resolves.toEqual({
      error: "Invalid JSON request body.",
    });
  });

  it("returns 400 when the request body is invalid", async () => {
    mockedAuth.mockResolvedValue({
      userId: "user_test_123",
    } as never);

    const request = new Request(
      "http://localhost:3000/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(null),
      }
    );

    const response = await POST(request);

    expect(response.status).toBe(400);

    await expect(response.json()).resolves.toEqual({
      error: "Invalid request body.",
    });
  });

  it("returns 400 when the message is missing", async () => {
    mockedAuth.mockResolvedValue({
      userId: "user_test_123",
    } as never);

    const request = new Request(
      "http://localhost:3000/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );

    const response = await POST(request);

    expect(response.status).toBe(400);

    await expect(response.json()).resolves.toEqual({
      error: "Message must be a string.",
    });
  });

  it("returns 400 for an empty message", async () => {
    mockedAuth.mockResolvedValue({
      userId: "user_test_123",
    } as never);

    const request = new Request(
      "http://localhost:3000/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "   ",
        }),
      }
    );

    const response = await POST(request);

    expect(response.status).toBe(400);

    await expect(response.json()).resolves.toEqual({
      error: "Message is required.",
    });
  });

  it("returns 400 when the message is too long", async () => {
    mockedAuth.mockResolvedValue({
      userId: "user_test_123",
    } as never);

    const request = new Request(
      "http://localhost:3000/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "a".repeat(4001),
        }),
      }
    );

    const response = await POST(request);

    expect(response.status).toBe(400);

    await expect(response.json()).resolves.toEqual({
      error:
        "Message is too long. Please keep messages under 4000 characters.",
    });
  });

  it("returns 400 for an invalid conversation ID", async () => {
    mockedAuth.mockResolvedValue({
      userId: "user_test_123",
    } as never);

    const request = new Request(
      "http://localhost:3000/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Hello",
          conversationId: "not-a-valid-uuid",
        }),
      }
    );

    const response = await POST(request);

    expect(response.status).toBe(400);

    await expect(response.json()).resolves.toEqual({
      error: "Invalid conversation ID.",
    });
  });
});
