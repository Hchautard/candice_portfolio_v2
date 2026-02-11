import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('header links working', async ({ page }) => {

  // HOME
  await page.goto('https://lanomalie.com/contact');

  await expect(page).toHaveTitle(/Contact/);

  // PROJECT
  await page.goto('https://lanomalie.com/project');

  await expect(page).toHaveTitle(/project/);

  // MAKEUP
  await page.goto('https://lanomalie.com/makeup');

  await expect(page).toHaveTitle(/Makeup/);

  // TATTOO
  await page.goto('https://lanomalie.com/tattoo');

  await expect(page).toHaveTitle(/Tattoo/);

  // HOME
  await page.goto('https://lanomalie.com/');

  await expect(page).toHaveTitle(/Home/);
});
