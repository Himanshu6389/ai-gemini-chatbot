import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("loads the GeminiChat landing page", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByText("AI-Powered Conversations")
    ).toBeVisible();

    await expect(
      page.getByRole("link", {
        name: "Start chatting",
      })
    ).toBeVisible();

    await expect(
      page.getByRole("link", {
        name: /GeminiChat/i,
      })
    ).toBeVisible();
  });
});
