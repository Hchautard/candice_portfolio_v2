import { test, expect } from '@playwright/test';

// Chaque lien du header mène à la bonne page
test('Header links should navigate to correct pages', async ({ page }) => {
    await page.goto('/');

    const links = [
        { text: 'Accueil', url: '/' },
        { text: 'Le salon', url: '/project' },
        { text: 'Tattoo', url: '/tattoo' },
        { text: 'Makeup', url: '/makeup' },
        { text: 'Contact', url: '/contact' },
    ];

    for (const link of links) {
        await page.locator('.header-link', { hasText: link.text }).click();
        await expect(page).toHaveURL(new RegExp(link.url + '$'));
    }
});

// Le header et ses 5 liens sont affichés
test('Header component should render and have functional links', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.Header')).toBeVisible();
    await expect(page.locator('.navbar')).toBeVisible();
    await expect(page.locator('.header-link')).toHaveCount(5);
});
