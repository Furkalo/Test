import { test, expect } from "@playwright/test";

test("book a room twice and check for application error", async ({ page }) => {
  const firstName = "David";
  const lastName = "Petrenko";
  const email = "test@gmail.com";
  const phone = "+380958207433";

  await page.goto("https://automationintesting.online/");

  const buttons = page.locator('a.btn.btn-primary:has-text("Book now")');
  await buttons.nth(1).click();

  const calendar = page.locator(".rbc-calendar");
  await expect(calendar).toBeVisible();

  await page.locator("button.rbc-button-link", { hasText: "19" }).click();
  await page.waitForTimeout(300);
  await page.locator("button.rbc-button-link", { hasText: "20" }).click();
  await page.waitForTimeout(300);

  await page.locator("button#doReservation").click();

  await page.fill("input.room-firstname", firstName);
  await page.fill("input.room-lastname", lastName);
  await page.fill("input.room-email", email);
  await page.fill("input.room-phone", phone);

  await page
    .locator('button.btn.btn-primary.w-100.mb-3:has-text("Reserve Now")')
    .click();
  const confirmation = page.locator("h2", { hasText: "Booking Confirmed" });
  await expect(confirmation).toBeVisible({ timeout: 10000 });
  console.log("First booking confirmed.");

  await page
    .locator('a.btn.btn-primary.w-100.mb-3.mt-3:has-text("Return home")')
    .click();
  await expect(page).toHaveURL("https://automationintesting.online/");

  const buttons2 = page.locator('a.btn.btn-primary:has-text("Book now")');
  await buttons2.nth(1).click();

  await page.locator("button.rbc-button-link", { hasText: "19" }).click();
  await page.waitForTimeout(300);
  await page.locator("button.rbc-button-link", { hasText: "20" }).click();
  await page.waitForTimeout(300);

  await page.locator("button#doReservation").click();

  await page.fill("input.room-firstname", firstName);
  await page.fill("input.room-lastname", lastName);
  await page.fill("input.room-email", email);
  await page.fill("input.room-phone", phone);

  await page
    .locator('button.btn.btn-primary.w-100.mb-3:has-text("Reserve Now")')
    .click();

  const errorMessage = page.locator("h2", {
    hasText:
      "Application error: a client-side exception has occurred while loading automationintesting.online",
  });
  await expect(errorMessage).toBeVisible({ timeout: 10000 });

  const text = await errorMessage.textContent();
  console.log("Second booking error message:", text.trim());
});
