import { test, expect } from "@playwright/test";

test("landing page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Style is personal/i })).toBeVisible();
});

test("quiz flow navigates through questions", async ({ page }) => {
  await page.goto("/quiz");
  await page.getByRole("button", { name: /Tailored & sharp/i }).click();
  await expect(page.getByText(/Colour instinct|Your everyday register/i)).toBeVisible();
});

test("membership page shows tiers", async ({ page }) => {
  await page.goto("/membership");
  await expect(page.getByText("Premium")).toBeVisible();
  await expect(page.getByText("Concierge")).toBeVisible();
});

test("stylist chat page loads", async ({ page }) => {
  await page.goto("/stylist");
  await expect(page.getByText(/Private consult/i)).toBeVisible();
});

test("health endpoint", async ({ request }) => {
  const res = await request.get("http://localhost:3001/api/health");
  expect(res.ok()).toBeTruthy();
});
