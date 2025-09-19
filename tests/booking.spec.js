import { test, expect } from "@playwright/test";

test("book a room and confirm booking", async ({ page }) => {
  await page.goto("https://automationintesting.online/");

  const buttons = page.locator('a.btn.btn-primary:has-text("Book now")');
  await buttons.nth(1).click();

  const calendar = page.locator(".rbc-calendar");
  await expect(calendar).toBeVisible();

  await page.locator("button.rbc-button-link", { hasText: "19" }).click();
  await page.locator("button.rbc-button-link", { hasText: "20" }).click();

  await page.locator("button#doReservation").click();

  await page.fill("input.room-firstname", "David");
  await page.fill("input.room-lastname", "Petrenko");
  await page.fill("input.room-email", "test@gmail.com");
  await page.fill("input.room-phone", "+380958207433");

  await page
    .locator('button.btn.btn-primary.w-100.mb-3:has-text("Reserve Now")')
    .click();

  const confirmation = page.locator(
    'h2.card-title:has-text("Booking Confirmed")'
  );
  await expect(confirmation).toBeVisible();

  const text = await confirmation.textContent();
  console.log("Confirmation Text:", text);
});
