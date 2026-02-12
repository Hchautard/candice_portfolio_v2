import { test, expect } from '@playwright/test';

// eslint-disable-next-line jest/no-done-callback
test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

// eslint-disable-next-line jest/no-done-callback
test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

// eslint-disable-next-line jest/no-done-callback
test('header links working', async ({ page }) => {

  // HOME
  await page.goto('localhost:3000/contact');

  await expect(page).toHaveTitle(/Contact/);

  // PROJECT
  await page.goto('localhost:3000/project');

  await expect(page).toHaveTitle(/Shop/);

  // MAKEUP
  await page.goto('localhost:3000/makeup');

  await expect(page).toHaveTitle(/Makeup/);

  // TATTOO
  await page.goto('localhost:3000/tattoo');

  await expect(page).toHaveTitle(/Tattoo/);

  // HOME
  await page.goto('localhost:3000/');

  await expect(page).toHaveTitle(/Accueil/);
});
