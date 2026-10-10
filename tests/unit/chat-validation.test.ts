import { describe, expect, it } from "vitest";

import {
  getChatMessageValidationError,
  validateChatMessage,
} from "@/lib/validation/chat";

describe("validateChatMessage", () => {
  it("accepts a valid message", () => {
    expect(
      validateChatMessage("Hello Gemini")
    ).toBe(true);
  });

  it("accepts a message with surrounding whitespace", () => {
    expect(
      validateChatMessage("  Hello Gemini  ")
    ).toBe(true);
  });

  it("rejects an empty message", () => {
    expect(validateChatMessage("")).toBe(false);

    expect(
      getChatMessageValidationError("")
    ).toBe("Message is required.");
  });

  it("rejects a whitespace-only message", () => {
    expect(
      validateChatMessage("     ")
    ).toBe(false);

    expect(
      getChatMessageValidationError("     ")
    ).toBe("Message is required.");
  });

  it("rejects a non-string message", () => {
    expect(validateChatMessage(null)).toBe(false);
    expect(validateChatMessage(undefined)).toBe(false);
    expect(validateChatMessage(123)).toBe(false);
    expect(validateChatMessage({})).toBe(false);

    expect(
      getChatMessageValidationError(null)
    ).toBe("Message must be a string.");
  });

  it("rejects a message longer than 4000 characters", () => {
    const longMessage = "a".repeat(4001);

    expect(
      validateChatMessage(longMessage)
    ).toBe(false);

    expect(
      getChatMessageValidationError(longMessage)
    ).toBe(
      "Message is too long. Please keep messages under 4000 characters."
    );
  });

  it("accepts a message exactly 4000 characters long", () => {
    const maximumMessage = "a".repeat(4000);

    expect(
      validateChatMessage(maximumMessage)
    ).toBe(true);

    expect(
      getChatMessageValidationError(maximumMessage)
    ).toBeNull();
  });
});
