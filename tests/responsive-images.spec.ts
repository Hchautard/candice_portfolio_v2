import { test, expect } from '@playwright/test';

// Versions réduites des photos (npm run optimize:media) : le navigateur doit les choisir quand
// l'écran n'a pas besoin de la photo entière, au lieu de télécharger le fichier le plus lourd.

test.describe('responsive images on a phone', () => {
    // Téléphone de densité 2 : une carte flash de ~154 px demande ~308 px, la version 400 px suffit
    test.use({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 2 });

    test('flash cards use the 400 px version', async ({ page }) => {
        await page.goto('/tattoo');
        const flash = page.locator('#card-distribution-container img').first();

        await expect(flash).toHaveAttribute('srcset', /400w/);
        await expect.poll(() => flash.evaluate((img: HTMLImageElement) => img.currentSrc)).toMatch(/\/w400\//);
    });
});

test.describe('responsive images on a standard desktop screen', () => {
    test.use({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });

    test('makeup photos use a reduced version', async ({ page }) => {
        await page.goto('/makeup');
        const photo = page.locator('.bento-cell img').first();

        await expect.poll(() => photo.evaluate((img: HTMLImageElement) => img.currentSrc)).toMatch(/\/w(640|960)\//);
    });
});
