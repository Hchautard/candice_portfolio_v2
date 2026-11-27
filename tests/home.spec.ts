import { test, expect, type Page } from '@playwright/test';

// Accueil : les trois métiers de Candice en triptyque (components/Triptych.jsx), chacun mène à sa
// page. Créations mène à la dernière actualité de l'atelier, ou à Instagram s'il n'y en a pas.

const panels = (page: Page) => page.getByRole('region', { name: 'Mes univers' }).getByRole('link');

/** Base Supabase factice (cf. playwright.config.ts) : ces actualités, aucun avis */
async function mockNews(page: Page, news: object[]) {
    await page.route(/\/rest\/v1\/(news|reviews)(\?|$)/, (route) =>
        route.fulfill({ json: /\/rest\/v1\/news/.test(route.request().url()) ? news : [] }));
}

const WORKSHOP_NEWS = [
    { id: 8, title: 'Convention de Montpellier', category: 'Événement', date_event: '2026-10-12', created_at: '2026-09-01T10:00:00Z' },
    { id: 7, title: 'Mon processus de création', category: 'Création', date_event: '2026-06-01', created_at: '2026-05-20T10:00:00Z' },
];

test('the triptych leads to the tattoo, makeup and workshop pages', async ({ page }) => {
    await mockNews(page, WORKSHOP_NEWS);
    await page.goto('/');

    const links = panels(page);
    await expect(links).toHaveCount(3);
    await expect(links.getByRole('heading', { level: 3 })).toHaveText(['Tattoo', 'Makeup', 'Créations']);
    await expect(links.nth(0)).toHaveAttribute('href', '/tattoo');
    await expect(links.nth(1)).toHaveAttribute('href', '/makeup');
    // La dernière actualité de la catégorie Création, pas la plus récente de toutes
    await expect(links.nth(2)).toHaveAttribute('href', '/news/7');

    await links.nth(1).click();
    await expect(page).toHaveURL(/\/makeup$/);
});

test('without a workshop news, Créations opens Instagram in a new tab', async ({ page }) => {
    await mockNews(page, WORKSHOP_NEWS.filter(({ category }) => category !== 'Création'));
    await page.goto('/');

    const creations = panels(page).nth(2);
    await expect(creations).toHaveAttribute('href', 'https://www.instagram.com/l__anomalie/');
    await expect(creations).toHaveAttribute('target', '_blank');
    await expect(creations).toContainText('nouvel onglet');
});

test.describe('home on a phone', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('the panels scroll sideways, with photos instead of the 3D model', async ({ page }) => {
        await page.goto('/');

        await expect(panels(page)).toHaveCount(3);
        await expect(page.locator('.model-container')).toHaveCount(0);
        // Les panneaux défilent dans leur rangée, qui reste dans la largeur de l'écran (la largeur de
        // toute la page n'est pas mesurée : en dev, le menu mobile de l'en-tête la dépasse)
        const row = page.locator('.triptych__panels');
        expect(await row.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
        const box = (await row.boundingBox())!;
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(390);
    });
});
