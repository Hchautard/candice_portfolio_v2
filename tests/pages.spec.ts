import { test, expect, type Page } from '@playwright/test';

// Chaque page se charge sans erreur JavaScript, avec le bon titre d'onglet, son titre principal
// et sa propre description pour les moteurs de recherche (qui cite Montpellier)
const PAGES = [
    { path: '/', title: "L'Anomalie — Tatoueuse à Montpellier", heading: "Bienvenue chez l'Anomalie" },
    { path: '/project', title: "Le salon — L'Anomalie", heading: 'Bienvenue dans mon univers' },
    { path: '/tattoo', title: "Tattoo — L'Anomalie", heading: 'Mes flashs' },
    { path: '/makeup', title: "Makeup — L'Anomalie", heading: "Portfolio Makeup & Maquillage Artistique — L'Anomalie" },
    { path: '/contact', title: "Contact — L'Anomalie", heading: "Nous contacter — L'Anomalie" },
];

const description = (page: Page) => page.locator('meta[name="description"]');

for (const { path, title, heading } of PAGES) {
    test(`page ${path} loads`, async ({ page }) => {
        const pageErrors: string[] = [];
        page.on('pageerror', (error) => pageErrors.push(error.message));

        await page.goto(path);

        await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
        await expect(page).toHaveTitle(title);
        await expect(description(page)).toHaveAttribute('content', /Montpellier/);
        expect(pageErrors).toEqual([]);
    });
}

test('each page has its own description, restored on the home page', async ({ page }) => {
    await page.goto('/');
    const home = await description(page).getAttribute('content');

    await page.getByRole('navigation', { name: 'Navigation principale' }).getByRole('link', { name: 'Tattoo' }).click();
    await expect(page).toHaveTitle("Tattoo — L'Anomalie");
    await expect(description(page)).not.toHaveAttribute('content', home ?? '');

    await page.getByRole('navigation', { name: 'Navigation principale' }).getByRole('link', { name: 'Accueil' }).click();
    await expect(description(page)).toHaveAttribute('content', home ?? '');
});

test('unknown address: 404 page, not indexed, noindex removed after leaving', async ({ page }) => {
    await page.goto('/cette-page-nexiste-pas');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page introuvable');
    await expect(page).toHaveTitle("Page introuvable — L'Anomalie");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);

    await page.getByRole('link', { name: "Retour à l'accueil" }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText("Bienvenue chez l'Anomalie");
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
});
