export const MAX_MESSAGE_LENGTH = 4000;

export function validateChatMessage(
  message: unknown
): message is string {
  if (typeof message !== "string") {
    return false;
  }

  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    return false;
  }

  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    return false;
  }

  return true;
}

export function getChatMessageValidationError(
  message: unknown
): string | null {
  if (typeof message !== "string") {
    return "Message must be a string.";
  }

  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    return "Message is required.";
  }

  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    return `Message is too long. Please keep messages under ${MAX_MESSAGE_LENGTH} characters.`;
  }

  return null;
}