import { test, expect } from "@playwright/test";

test.describe("Authentication flow", () => {
  test("redirects unauthenticated users from chat to sign in", async ({
    page,
  }) => {
    await page.goto("/chat");

    await expect(page).toHaveURL(/\/sign-in/);

    await expect(
      page.getByText(/sign in/i).first()
    ).toBeVisible();
  });
});
