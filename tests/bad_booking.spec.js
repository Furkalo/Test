import { test, expect } from "@playwright/test";

test("book a room with invalid data and check error messages", async ({
  page,
}) => {
  await page.goto("https://automationintesting.online/");

  const buttons = page.locator('a.btn.btn-primary:has-text("Book now")');
  await buttons.nth(1).click();

  const calendar = page.locator(".rbc-calendar");
  await expect(calendar).toBeVisible();

  await page.locator("button.rbc-button-link", { hasText: "19" }).click();
  await page.locator("button.rbc-button-link", { hasText: "20" }).click();

  await page.locator("button#doReservation").click();

  await page.fill("input.room-firstname", "");
  await page.fill("input.room-lastname", "Pe");
  await page.fill("input.room-email", "abc@");
  await page.fill("input.room-phone", "12");

  await page
    .locator('button.btn.btn-primary.w-100.mb-3:has-text("Reserve Now")')
    .click();

  const alert = page.locator("div.alert.alert-danger");
  await expect(alert).toBeVisible();

  const alertText = await alert.textContent();

  console.log("Error messages:\n", alertText.trim());

  expect(alertText).toContain("Firstname should not be blank");
  expect(alertText).toContain("must be a well-formed email address");
  expect(alertText).toContain("size must be between 3 and 18");
  expect(alertText).toContain("size must be between 11 and 21");
});
