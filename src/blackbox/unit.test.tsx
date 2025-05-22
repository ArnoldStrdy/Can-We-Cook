// Black Box Unit Test using Playwright 

// Black Box Unit Test using Playwright

import { test, expect, Page } from '@playwright/test';

test('homepage loads and shows main dashboard', async ({ page }: { page: Page }) => {
  // Adjust the URL if your dev server runs on a different port or path
  await page.goto('http://localhost:5173/');

  // Example: Check for a heading or unique text on your CustomerDash page
  await expect(page.locator('text=restaurant review')).toBeVisible();
});

test('footer is visible and contains copyright', async ({ page }: { page: Page }) => {
  await page.goto('http://localhost:5173/');
  await expect(page.locator('footer')).toBeVisible();
  await expect(page.locator('footer')).toContainText('Can we Cook? All rights reserved.');
});

