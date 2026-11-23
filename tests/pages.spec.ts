import { test, expect } from '@playwright/test';

// Chaque page se charge sans erreur JavaScript, avec le bon titre d'onglet et son titre principal
const PAGES = [
    { path: '/', title: "L'Anomalie", heading: "Bienvenue chez l'Anomalie" },
    { path: '/project', title: "Shop — L'Anomalie", heading: 'Bienvenue dans mon univers' },
    { path: '/tattoo', title: "Tattoo — L'Anomalie", heading: "Portfolio Tattoo — L'Anomalie" },
    { path: '/makeup', title: "Makeup — L'Anomalie", heading: "Portfolio Makeup & Maquillage Artistique — L'Anomalie" },
    { path: '/contact', title: "Contact — L'Anomalie", heading: "Nous contacter — L'Anomalie" },
];

for (const { path, title, heading } of PAGES) {
    test(`page ${path} loads`, async ({ page }) => {
        const pageErrors: string[] = [];
        page.on('pageerror', (error) => pageErrors.push(error.message));

        await page.goto(path);

        await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
        await expect(page).toHaveTitle(title);
        expect(pageErrors).toEqual([]);
    });
}
